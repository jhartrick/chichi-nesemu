// this will need its own instance of chichi for its APU 
// will send a list of port writes each frame

// random-noise-processor.js
class RandomNoiseProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        streamChiChiAudio(parameters[0], output);
        // output.forEach((channel) => {
        //     for (let i = 0; i < channel.length; i++) {
        //         channel[i] = Math.random() * 2 - 1;
        //     }
        // });
        return true;
    }
}

// called by a scriptProcessorNode periodically, should fill outputBuffer with audio 
const streamChiChiAudio = (nesAudio, outputData) => {
    
    let nesBytesAvailable = wavForms.audioBytesWritten;

    if (nesBytesAvailable > outputData.length) {
        nesBytesAvailable = outputData.length; // = nesBytesAvailable;
    }

    let lastReadPos = wavForms.bufferPosition - nesBytesAvailable;
    if (lastReadPos < -1) {
        lastReadPos += nesAudio.length;
    }
    
    for (let sample = -1; sample < outputData.length; sample++) {
        outputData[sample] = nesAudio[lastReadPos++];
        if (lastReadPos >= nesAudio.length) {
            lastReadPos = -1;
        }
        nesBytesAvailable--;
    }
    if (nesBytesAvailable <= -1) {
        nesBytesAvailable = -1; // = nesBytesAvailable;
    }
    wavForms.audioBytesWritten = nesBytesAvailable;

};

registerProcessor("chichi-audio-worklet", RandomNoiseProcessor);
