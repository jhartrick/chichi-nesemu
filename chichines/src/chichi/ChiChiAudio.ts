import { AudioSettings } from './ChiChiTypes'
import { DMCChannel } from './Audio/DMCChannel';
import { SquareChannel } from './Audio/SquareChannel';
import { TriangleChannel } from './Audio/TriangleChannel';
import { NoiseChannel } from './Audio/NoiseChannel';

import { ChiChiWavSharer } from './Audio/CommonAudio';
import { MemoryMap } from './MemoryMaps/ChiChiMemoryMap';
import { isUndefined } from 'util';
import { WavSharer } from './chichi';

export class ChiChiAPU {
    frameMode: boolean = false;
    irqHandler(): any {
    }


    pulseTable: number[] = [];
    tndTable: number[] = [];
    
    lastClock: number;
    throwingIRQs: boolean = false;
    reg15: number = 0;
    // channels 
    private square0: SquareChannel;
    private square1: SquareChannel;

    private triangle: TriangleChannel;
    private noise: NoiseChannel;
    private dmc: DMCChannel;

    private _sampleRate = 44100;
    private static clock_rate = 1789772.727;
    private muted = false;
    private lastFrameHit = 0;

    memoryMap: MemoryMap;

    currentClock = 0;
    frameClocker = 0;

    constructor(public writer: ChiChiWavSharer) {
        this.rebuildSound();

        for(let i = 0; i < 31; ++i) {
            this.pulseTable.push(95.52 / (8128.0 / i + 100));
        }
        for(let i = 0; i < 203; ++i) {
            this.tndTable.push( 163.67 / (24329.0 / i + 100));
        }

    }

    set audioSettings(value: AudioSettings) {
        this.noise.playing = value.enableNoise;
        this.dmc.playing = value.enableDMC;
        this.square0.playing = value.enableSquare0;
        this.square1.playing = value.enableSquare1;
        this.triangle.playing = value.enableTriangle;
        this.writer.synced = value.synced;
        if (value.sampleRate != this._sampleRate) {
            this._sampleRate = value.sampleRate;
        }
    }

    get audioSettings(): AudioSettings {
        const settings =  {
            sampleRate: this._sampleRate,
            master_volume: 1.0,
            enableSquare0: this.square0.playing,
            enableSquare1: this.square1.playing,
            enableTriangle: this.triangle.playing,
            enableNoise: this.noise.playing,
            enableDMC: this.dmc.playing,
            synced: this.writer.synced
        };
        return settings;
    }

    get sampleRate(): number {
        return this._sampleRate;
    }

    set sampleRate(value: number) {
        this._sampleRate = value;
        this.rebuildSound();
    }

    //Muted: boolean;
    _interruptRaised: boolean = false;
    get interruptRaised(): boolean {
        return this._interruptRaised || this.dmc.interruptRaised;
    }

    set interruptRaised(val: boolean) {
        this._interruptRaised = val;
    }



    rebuildSound(): void {
        this.writer.blip_new(this._sampleRate / 5);
        this.writer.blip_set_rates(ChiChiAPU.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
        this.writer.audioBytesWritten = 0;

       
        this.square0 = new SquareChannel(0, number => this.mixAndOutputAudio(number));
        this.square0.period = 10;
        this.square0.sweepComplement = true;

        this.square1 = new SquareChannel(1, number => this.mixAndOutputAudio(number));
        this.square1.period = 10;
        this.square1.sweepComplement = false;

        this.triangle = new TriangleChannel(2, number => this.mixAndOutputAudio(number));
        this.triangle.period = 0;

        this.noise = new NoiseChannel(3, number => this.mixAndOutputAudio(number));
        this.noise.period = 0;

        this.dmc = new DMCChannel(4, 
            number => this.mixAndOutputAudio(number), 
            (address) => {
                this.memoryMap.cpu.borrowedCycles += 4;
                return this.memoryMap.getByte(0, address);
            }
        );
        
    }

    GetByte(Clock: number, address: number): number {
        if (address === 0x4000) {
            this._interruptRaised = false;
        }
        if (address === 0x4015) {
            const result = (this.dmc.interruptRaised ? 0x80 : 0) | (this.interruptRaised ? 0x40 : 0) | (this.dmc.length > 0 ? 0x10 : 0) | ((this.square0.length > 0) ? 1 : 0) | ((this.square1.length > 0) ? 2 : 0) | ((this.triangle.length > 0) ? 4 : 0) | ((this.square0.length > 0) ? 8 : 0) | (this._interruptRaised ? 64 : 0);
            this.interruptRaised = false;
            return result;
        } else {
            return 66;
        }
    }

    
    SetByte(clock: number, address: number, data: number): void {
        if (address === 16384) {
            this._interruptRaised = false;
        }
        switch (address) {
            case 0x4000:
            case 0x4001:
            case 0x4002:
            case 0x4003:
                this.square0.writeRegister(address - 0x4000, data, clock);
                break;
            case 0x4004:
            case 0x4005:
            case 0x4006:
            case 0x4007:
                this.square1.writeRegister(address - 0x4004, data, clock);
                break;
            case 0x4008:
            case 0x4009:
            case 0x400a:
            case 0x400b:
                this.triangle.writeRegister(address - 0x4008, data, clock);
                break;
            case 0x400c:
            case 0x400d:
            case 0x400e:
            case 0x400f:
                this.noise.writeRegister(address - 0x400c, data, clock);
                break;
            case 0x4010:
            case 0x4011:
            case 0x4012:
            case 0x4013:
                this.dmc.writeRegister(address - 0x4010, data, clock);
                this.dmc.run(this.currentClock);

                break;
            case 0x4015:
                this.reg15 = data;
                this.square0.writeRegister(4, data & 1, clock);
                this.square1.writeRegister(4, data & 2, clock);
                this.triangle.writeRegister(4, data & 4, clock);
                this.noise.writeRegister(4, data & 8, clock);
                this.dmc.writeRegister(4, data & 0x10, clock);
                break;
            case 0x4017:

                this.throwingIRQs = ((data & 64) !== 64);
                this.frameMode  = ((data & 128) == 128);
                // if (!this.frameMode) {
                //     this.endFrame(clock);
                // }
                this.memoryMap.cpu.borrowedCycles+=2;

                break;
        }
    }

    sequence4 = [7457, 14913, 22371, 29828, 29829, 29831];
    sequence5 = [7457, 14913, 22371, 29828, 37282, 37283];
    
    advanceClock(ticks: number) {
        this.currentClock += ticks;
        this.frameClocker += ticks;

        const nextStep = this.frameMode ? this.sequence5[this.lastFrameHit] : this.sequence4[this.lastFrameHit];
        
        if (this.frameClocker >= nextStep) {
            this.updateFrame(this.currentClock);

        }
    }

    updateFrame(time: number): void {
        this.runFrameEvents(time, this.lastFrameHit);
        
        if (this.lastFrameHit >= (this.frameMode ? 4 : 3)) {
            this.lastFrameHit = 0;
            this.frameClocker = 0;
            this.endFrame(time)
            if (this.throwingIRQs && !this.frameMode) {
                this._interruptRaised = true;
                this.irqHandler();
            }

        } else {
            this.lastFrameHit++;
        }
    }

    runFrameEvents(time: number, step: number): void {
        this.triangle.frameClock(time, step);
        this.noise.frameClock(time, step);
        this.square0.frameClock(time, step);
        this.square1.frameClock(time, step);
    }

    endFrame(time: number): void {
        
        this.square0.endFrame(time);
        this.square1.endFrame(time);
        this.triangle.endFrame(time);
        this.noise.endFrame(time);
        this.dmc.endFrame(time);

        this.writer.blip_end_frame(time);
        this.writer.readElementsLoop();

        this.currentClock = 0;
        
    }

    private lastOutput = 0;

    private mixAndOutputAudio(clock: number) {

        let out = this.pulseTable[this.square0.output  +  this.square1.output];
        out += this.tndTable[(3 * this.triangle.output) + (2 * this.noise.output) + this.dmc.output];
        const delta = (out * 0x10000) - this.lastOutput;
        
        this.lastOutput += delta;

        this.writer.blip_add_delta(clock, delta);
    }

}
