import { ChiChiAPU, WavSharer, AudioSettings } from 'chichi';
import * as THREE from 'three';

import { RunningStatuses, StateBuffer } from 'chichi';
import { LocalAudioSettings } from './audio.localsettings';

export interface ThreeJSAudioSettings extends LocalAudioSettings {
    items: any;
    listener: any;

}

const nesAudioLength = 8192;

export const chichiPlayer = (listener: THREE.AudioListener) =>  {

    const sound = new THREE.Audio(listener);
    const audioCtx = sound.context;
    const audioSource = audioCtx.createBufferSource();

    sound.setNodeSource(audioSource);

    const sampleRate = audioCtx.sampleRate;
    const bufferSize = nesAudioLength << 1;
    const chunkSize = nesAudioLength >> 1;

    audioSource.buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const scriptNode = audioCtx.createScriptProcessor(chunkSize, 1, 1);
    const gainNode = audioCtx.createGain();

    gainNode.gain.value = 0.5;

    audioSource.connect(gainNode);
    audioSource.connect(scriptNode);

    scriptNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    audioSource.loop = true;
    audioSource.start();
    scriptNode.onaudioprocess = () => {};

    return function (wavForms: WavSharer) {
        scriptNode.onaudioprocess = (audioProcessingEvent:AudioProcessingEvent) => {
            streamChiChiAudio(wavForms, audioProcessingEvent);
        }

        const result: LocalAudioSettings = {
            sampleRate: audioCtx.sampleRate,
            mute: audioCtx.suspend.bind(audioCtx) ,
            unmute: audioCtx.resume.bind(audioCtx),
            stop: () => {
                gainNode.gain.value = 0;
                scriptNode.onaudioprocess = undefined;
                audioSource.loop = false;
                audioSource.stop();
                scriptNode.disconnect();
                gainNode.disconnect();
                audioSource.disconnect();
                console.log('audio disconnect')
            }

        };

        return result;
    }
}

// called by a scriptProcessorNode periodically, should fill outputBuffer with audio 
const streamChiChiAudio = (wavForms: WavSharer, audioProcessingEvent: AudioProcessingEvent) => {
    const nesAudio = wavForms.SharedBuffer;

    const obuf = audioProcessingEvent.outputBuffer;
    const outputData = obuf.getChannelData(0);
    
    let nesBytesAvailable = wavForms.audioBytesWritten;

    if (nesBytesAvailable > outputData.length) {
        nesBytesAvailable = outputData.length; // = nesBytesAvailable;
    }

    let lastReadPos = wavForms.bufferPosition - nesBytesAvailable;
    if (lastReadPos < 0) {
        lastReadPos += nesAudio.length;
    }
    
    for (let sample = 0; sample < outputData.length; sample++) {
        outputData[sample] = nesAudio[lastReadPos++];
        if (lastReadPos >= nesAudio.length) {
            lastReadPos = 0;
        }
        nesBytesAvailable--;
    }
    if (nesBytesAvailable <= 0) {
        nesBytesAvailable = 0; // = nesBytesAvailable;
    }
    wavForms.audioBytesWritten = nesBytesAvailable;

};
