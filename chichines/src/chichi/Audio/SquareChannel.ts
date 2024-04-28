import { Channel } from "./IChannel";

export class SquareChannel implements Channel {
    output: number = 0;
    playing =  true;
    
    private channelNumber = 0;
    private lengthCounts = new Uint8Array(
        [
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
	        0x20,0x1E
        ]);

    private latchedLength = 0;
    period = 0;
    private rawTimer = 0;
    private volume = 0;
    private time = 0;
    private envelope = 0;
    private looping = false;
    private enabled = false;
    private doodies: number[] = [2, 6, 30, 249];
    private sweepShift = 0;
    private sweepCounter = 0;
    private sweepDivider = 0;
    private sweepNegateFlag = false;
    private sweepEnabled = false;
    private startSweep = false;
    private sweepInvalid = false;
    private phase = 0;
    private envelopeTimer = 0;
    private envelopeStart = false;
    private envelopeConstantVolume = false;
    private envelopeVolume = 0;


    constructor(chan: number, public onWriteAudio: (x: number)=> void) {
        this.channelNumber = chan;

        this.enabled = true;
        this.sweepDivider = 1;
        this.envelopeTimer = 15;
    }

    // properties
    length: number;
    sweepComplement = false;
    dutyCycle = 0;

    // functions
    writeRegister(register: number, data: number, time: number): void {
        switch (register) {
            case 0:
                this.envelopeConstantVolume = (data & 0x10) === 0x10;
                this.volume = data & 15;
                this.dutyCycle = this.doodies[(data >> 6) & 0x3];
                this.looping = (data & 0x20) === 0x20;
                this.sweepInvalid = false;
                break;
            case 1:
                this.sweepShift = data & 7;
                this.sweepNegateFlag = (data & 8) === 8;
                this.sweepDivider = (data >> 4) & 7;
                this.sweepEnabled = (data & 0x80) === 0x80;
                this.startSweep = true;
                this.sweepInvalid = false;
                break;
            case 2:
                this.period &= 0x700;
                this.period |= data;
                this.rawTimer = this.period;
                break;
            case 3:
                this.period &= 0xFF;
                this.period |= (data & 7) << 8;
                this.rawTimer = this.period;
                this.phase = 0;
                // setup length
                if (this.enabled) {
                    this.latchedLength = this.lengthCounts[(data >> 3) & 0x1f];
                }
                this.envelopeStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.latchedLength = 0;
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

        const period = this.sweepEnabled ? ((this.period + 1) & 0x7FF) << 1 : ((this.rawTimer + 1) & 0x7FF) << 1;

        if (period === 0) {
            this.time = end_time;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }

        const volume = this.envelopeConstantVolume ? this.volume : this.envelopeVolume;

        if (this.latchedLength === 0 || volume === 0 || this.sweepInvalid) {
            this.phase += ((end_time - this.time) / period) & 7;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }
        for (; this.time < end_time; this.time += period, this.phase++) {
            this.output = (this.dutyCycle >> (this.phase & 7) & 1) * volume;
            this.onWriteAudio(this.time);
        }
        this.phase &= 7;
    }
    

    endFrame(time: number): void {
        this.run(time);

        this.time = 0;
    }

    frameClock(time: number, step: number): void {
        this.run(time);

        if (!this.envelopeStart) {
            this.envelopeTimer--;
            if (this.envelopeTimer === 0) {
                this.envelopeTimer = this.volume + 1;
                if (this.envelopeVolume > 0) {
                    this.envelopeVolume--;
                } else {
                    this.envelopeVolume = this.looping ? 15 : 0;
                }
            }
        } else {
            this.envelopeStart = false;
            this.envelopeTimer = this.volume + 1;
            this.envelopeVolume = 15;
        }

        switch (step) {
            case 1:
            case 3:
                --this.sweepCounter;
                if (this.sweepCounter === 0) {
                    this.sweepCounter = this.sweepDivider + 1;
                    if (this.sweepEnabled && this.sweepShift > 0) {
                        var sweep = this.period >> this.sweepShift;
                        if (this.sweepComplement) {
                            this.period += this.sweepNegateFlag ? ~sweep : sweep;
                        } else {
                            this.period += this.sweepNegateFlag ? ~sweep + 1 : sweep;
                        }
                        this.sweepInvalid = (this.rawTimer < 8 || (this.period & 2048) === 2048);
                        //if (_sweepInvalid)
                        //{
                        //    _sweepInvalid = true;
                        //}
                    }
                }
                if (this.startSweep) {
                    this.startSweep = false;
                    this.sweepCounter = this.sweepDivider + 1;

                }
                if (!this.looping && this.latchedLength > 0) {
                    this.latchedLength--;
                }
                break;
        }
    }
}