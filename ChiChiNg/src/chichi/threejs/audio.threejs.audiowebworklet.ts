import { ChiChiAPU, WavSharer, AudioSettings } from 'chichi';
import * as THREE from 'three';

import { RunningStatuses, StateBuffer } from 'chichi';
import { LocalAudioSettings } from './audio.localsettings';

export interface ThreeJSAudioSettings extends LocalAudioSettings {
    items: any;
    listener: any;

}

const nesAudioLength = 8192;

export const chichiPlayer = async (listener: THREE.AudioListener) => {

    const sound = new THREE.Audio(listener);
    const audioCtx = sound.context;
    const audioSource = audioCtx.createBufferSource();

    sound.setNodeSource(audioSource);

    const sampleRate = audioCtx.sampleRate;
    const bufferSize = nesAudioLength << 1;
    const chunkSize = nesAudioLength >> 1;

    audioSource.buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);

    await audioCtx.audioWorklet.addModule("assets/chichi-audio-worklet.js");

//    workerNode.onaudioprocess = () => {};

    return function (wavForms: WavSharer) {
        const workerNode = new AudioWorkletNode(
            audioCtx,
            "chichi-audio-worklet",
          );
        const gainNode = audioCtx.createGain();
    
        gainNode.gain.value = 0.5;
    
        //audioSource.connect(gainNode);
        audioSource.connect(workerNode);
    
        //workerNode.connect(gainNode);
        //gainNode.connect(audioCtx.destination);
        workerNode.connect(audioCtx.destination);
        audioSource.loop = true;
        audioSource.start();
        const result: LocalAudioSettings = {
            sampleRate: audioCtx.sampleRate,
            mute: audioCtx.suspend.bind(audioCtx) ,
            unmute: audioCtx.resume.bind(audioCtx),
            stop: () => {
                gainNode.gain.value = 0;
                audioSource.loop = false;
                audioSource.stop();
                workerNode.disconnect();
                gainNode.disconnect();
                audioSource.disconnect();
                console.log('audio disconnect')
            }

        };

        return result;
    }
}

