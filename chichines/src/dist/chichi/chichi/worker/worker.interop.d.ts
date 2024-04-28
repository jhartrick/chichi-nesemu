export declare class WorkerInterop {
    interopBuffer: Int32Array;
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_FPS = 1;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_AUDIO_AVAILABLE = 3;
    readonly NES_CONTROL_PAD_1 = 4;
    constructor(interopBuffer: Int32Array);
    loop(): void;
    unloop(): void;
    get looping(): boolean;
    get fps(): number;
    set fps(val: number);
    get controlPad0(): number;
    set controlPad0(val: number);
    get controlPad1(): number;
    set controlPad1(val: number);
    get audioAvailable(): number;
    set audioAvailable(val: number);
}
