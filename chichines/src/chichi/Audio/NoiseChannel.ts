import { Channel } from "./IChannel";

export class NoiseChannel implements Channel {
    playing = true;
    output: number = 0;
    period = 0;
    
    private enabled = false;
    private chan = 0;
    private noisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
    private lengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
    private time = 0;
    private envConstantVolume = false;
    private envVolume = 0;
    private phase = 0;
    private envTimer = 0;
    private envStart = false;

    private length = 0;
    private volume = 0;
    private looping = false;

    constructor(chan: number, public onWriteAudio: (time: number)=> void) {
        this.chan = chan;
        this.phase = 1;
        this.envTimer = 15;

    }

    writeRegister(register: number, data: number, time: number): void {
        // Run(time);

        switch (register) {
            case 0:
                this.envConstantVolume = (data & 16) === 16;
                this.volume = data & 15;
                this.looping = (data & 128) === 128;
                break;
            case 1:
                break;
            case 2:
                this.period = this.noisePeriods[data & 15];
                // _period |= data;
                break;
            case 3:
                // setup length
                if (this.enabled) {
                    this.length = this.lengthCounts[(data >> 3) & 31];
                }
                this.envStart = true;
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

        let volume = this.envConstantVolume ? this.volume : this.envVolume;
        if (this.length === 0) {
            volume = 0;
        }
        if (this.period === 0) {
            this.time = end_time;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }

        if (this.phase === 0) {
            this.phase = 1;
        }

        for (; this.time < end_time; this.time += this.period) {
            let new15= this.looping ? ((this.phase & 1) ^ ((this.phase >> 6) & 1))
                                    : ((this.phase & 1) ^ ((this.phase >> 1) & 1));
            
            this.output = this.phase & 1 * volume;
            this.onWriteAudio(this.time);
            this.phase = ((this.phase >> 1) | (new15 << 14)) & 0xffff;
        }
    }

    endFrame(time: number) {
        this.run(time);
        this.time = 0;
    }

    frameClock(time: number, step: number) {
        this.run(time);

        if (!this.envStart) {
            this.envTimer--;
            if (this.envTimer === 0) {
                this.envTimer = this.volume + 1;
                if (this.envVolume > 0) {
                    this.envVolume--;
                } else {
                    this.envVolume = this.looping ? 15 : 0;
                }

            }
        } else {
            this.envStart = false;
            this.envTimer = this.volume + 1;
            this.envVolume = 15;
        }

        switch (step) {
            case 1:
            case 2:
                if (!this.looping && this.length > 0) {
                    this.length--;
                }
                break;
        }
    }
}
