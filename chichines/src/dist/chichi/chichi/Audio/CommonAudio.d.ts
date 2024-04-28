import { StateBuffer } from "../StateBuffer";
export declare class WavSharer {
    neswait: boolean;
    synced: boolean;
    controlBuffer: Int32Array;
    sharedAudioBufferPos: number;
    get bufferPosition(): number;
    bufferWasRead: boolean;
    static sample_size: number;
    SharedBuffer: Float32Array;
    SharedBufferLength: number;
    chunkSize: number;
    constructor();
    get audioBytesWritten(): number;
    set audioBytesWritten(value: number);
    wakeSleepers(): void;
    synchronize(): void;
}
export declare class ChiChiWavSharer extends WavSharer {
    constructor(sb: StateBuffer);
    private blipBuffer;
    blip_new(size: number): void;
    blip_set_rates(clock_rate: number, sample_rate: number): void;
    blip_clear(): void;
    blip_end_frame(t: number): void;
    remove_samples(count: number): void;
    readElementsLoop(): number;
    blip_add_delta(time: number, delta: number): void;
}
