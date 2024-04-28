import { Channel } from "./IChannel";

export class TriangleChannel implements Channel {
    playing = true;
    output: number = 0;

    private _chan = 0;
    
    private lengthCounts = [
        0x0A,0xFE,
        0x14,0x02,
        0x28,0x04,
        0x50,0x06,
        0xA0,0x08,
        0x3C,0x0A,
        0x0E,0x0C,
        0x1A,0x0E,
        0x0C,0x10,
        0x18,0x12,
        0x30,0x14,
        0x60,0x16,
        0xC0,0x18,
        0x48,0x1A,
        0x10,0x1C,
        0x20,0x1E];

    length = 0;
    period = 0;
    time = 0;
    envelope = 0;
    looping = false;
    enabled = false;
    
    private linCtr = 0;
    private _phase = 0;
    private _linVal = 0;
    private linStart = false;

    constructor(chan: number, public onWriteAudio: (time: number)=> void) {
        this._chan = chan;

        this.enabled = true;
    }

    writeRegister(register: number, data: number, time: number): void {
        //Run(time);

        switch (register) {
            case 0:
                this.looping = (data & 0x80) === 0x80;
                this._linVal = data & 0x7F;
                break;
            case 1:
                break;
            case 2:
                this.period &= 0x700;
                this.period |= data;
                break;
            case 3:
                this.period &= 0xff;
                this.period |= (data & 7) << 8;
                // setup lengthhave
                if (this.enabled) {
                    this.length = this.lengthCounts[(data >> 3) & 0x1f];
                }
                this.linStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.length = 0;
                }
                break;
        }
    }

    run(end_time: number): void {
        if (!this.playing) {
            this.time = end_time;
            this.output = 0;
            return ;
        }


        var period = this.period + 1;
        if (this.linCtr === 0 || this.length === 0 || this.period < 4) {
            // leave it at it's current phase
            this.time = end_time;
            return;
        }

        for (; this.time < end_time; this.time += period, this._phase = (this._phase + 1) % 32) {
            this.output = this._phase < 16 ? this._phase : 31 - this._phase;
            this.onWriteAudio(this.time);
        }

    }


    endFrame(time: number): void {
        this.run(time);
        this.time = 0;
    }

    frameClock(time: number, step: number): void {
        this.run(time);

        if (this.linStart) {
            this.linCtr = this._linVal;

        } else {
            if (this.linCtr > 0) {
                this.linCtr--;
            }
        }

        if (!this.looping) {
            this.linStart = false;
        }

        switch (step) {
            case 1:
            case 3:
                if (this.length > 0 && !this.looping) {
                    this.length--;
                }
                break;
        }
    }

}

