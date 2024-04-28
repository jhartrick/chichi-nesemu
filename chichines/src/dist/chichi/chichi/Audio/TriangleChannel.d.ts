import { Channel } from "./IChannel";
export declare class TriangleChannel implements Channel {
    onWriteAudio: (time: number) => void;
    playing: boolean;
    output: number;
    private _chan;
    private lengthCounts;
    length: number;
    period: number;
    time: number;
    envelope: number;
    looping: boolean;
    enabled: boolean;
    private linCtr;
    private _phase;
    private _linVal;
    private linStart;
    constructor(chan: number, onWriteAudio: (time: number) => void);
    writeRegister(register: number, data: number, time: number): void;
    run(end_time: number): void;
    endFrame(time: number): void;
    frameClock(time: number, step: number): void;
}
