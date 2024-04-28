export class WorkerInterop {
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_FPS = 1;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_AUDIO_AVAILABLE = 3;
    readonly NES_CONTROL_PAD_1 = 4;

    constructor(public interopBuffer: Int32Array) {
    }

    loop() {
        Atomics.store(this.interopBuffer, this.NES_GAME_LOOP_CONTROL, 1);
    }

    unloop() {
        Atomics.store(this.interopBuffer, this.NES_GAME_LOOP_CONTROL, 0);
    }

    get looping(): boolean {
        return this.interopBuffer[this.NES_GAME_LOOP_CONTROL] > 0;
    }

    get fps(): number {
        return this.interopBuffer[this.NES_FPS] & 0xff;
    }

    set fps(val: number) {
        this.interopBuffer[this.NES_FPS] = val;
    }

    get controlPad0(): number {
        return this.interopBuffer[this.NES_CONTROL_PAD_0] & 0xff;
    }

    set controlPad0(val: number) {
        this.interopBuffer[this.NES_CONTROL_PAD_0] = val;
    }

    get controlPad1(): number {
        return this.interopBuffer[this.NES_CONTROL_PAD_1] & 0xff;
    }

    set controlPad1(val: number) {
        this.interopBuffer[this.NES_CONTROL_PAD_1] = val;
    }

    get audioAvailable(): number {
        return this.interopBuffer[this.NES_AUDIO_AVAILABLE];
    }

    set audioAvailable(val: number) {
        this.interopBuffer[this.NES_AUDIO_AVAILABLE] = val;
    }

}