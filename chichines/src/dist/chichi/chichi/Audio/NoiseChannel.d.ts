import { Channel } from "./IChannel";
export declare class NoiseChannel implements Channel {
    onWriteAudio: (time: number) => void;
    playing: boolean;
    output: number;
    period: number;
    private enabled;
    private chan;
    private noisePeriods;
    private lengthCounts;
    private time;
    private envConstantVolume;
    private envVolume;
    private phase;
    private envTimer;
    private envStart;
    private length;
    private volume;
    private looping;
    constructor(chan: number, onWriteAudio: (time: number) => void);
    writeRegister(register: number, data: number, time: number): void;
    run(end_time: number): void;
    endFrame(time: number): void;
    frameClock(time: number, step: number): void;
}
