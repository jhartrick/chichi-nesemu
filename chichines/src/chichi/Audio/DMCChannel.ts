import { ChiChiCPPU } from "../ChiChiCPU";
import { Channel } from "./IChannel";

export class DMCChannel implements Channel {
    playing = true;
    output: number = 0;

    interruptRaised = false;
    
    private time: number = 0;
    private internalClock: number = 0;
    private isFetching: boolean = false;
    private buffer: number = 0;
    private bufferIsEmpty: boolean = false;
    private outbits: number = 0;
    private freqTable = [
        0x1AC,0x17C,0x154,0x140,0x11E,0x0FE,0x0E2,0x0D6,
        0x0BE,0x0A0,0x08E,0x080,0x06A,0x054,0x048,0x036,
    ];

    private shiftreg: number= 0;
    private silenced: boolean = false;
    private cycles: number = 0;
    private nextRead: number = 0;
    private lengthCounter: number = 0;
    length: number = 0;
    private address: number = 0;
    private interruptEnabled: number = 0;
    private frequency: number= 0;
    private loopFlag: number= 0;
    private _chan: number= 0;

    constructor(chan: number, public onWriteAudio: (time: number)=> void, private handleDma: (address: number) => number) {
        this._chan = chan;
    }

    writeRegister(register: number, data: number, time: number): void {
        switch (register)
        {
        case 0:	
            this.frequency = data & 0xf;
            this.loopFlag = (data >> 6) & 0x1;
            this.interruptEnabled = (data >> 7) & 1;
            if (this.interruptEnabled === 0) {
                this.interruptRaised = false;
            }
            break;
        case 1:	
            this.output = data & 0x7f;
            this.onWriteAudio(this.time);
            
            break;
        case 2:	
            this.address = data;
            break;
        case 3:	
            this.length = data;

            break;
        case 4:
            this.interruptRaised = false;
        	if (data)
            {
                if (!this.lengthCounter)
                {
                    this.nextRead = 0xC000 | ((this.address << 6) & 0xffff);
                    this.lengthCounter = (this.length << 4) + 1;
                }
            }
            else	
            { 
                this.lengthCounter = 0;
                
            }

            break;
        }
    }


    run(endTime: number): void {
        if (!this.playing) {
            this.time = endTime;
            this.output = 0;
            return ;
        }

        for (; this.time < endTime; this.time ++) {
                
            if (--this.cycles <= 0)
            {

                this.cycles = this.freqTable[this.frequency];
                if (!this.silenced)
                {
                    if (this.shiftreg & 1)
                    {
                        if (this.output <= 0x7D) {
                            this.output += 2;
                            this.onWriteAudio(this.time);
                        }
                    }
                    else
                    {
                        if (this.output >= 0x02) {
                            this.output -= 2;
                            this.onWriteAudio(this.time);
                        }
                    }
                    this.shiftreg >>= 1;
                }
                if (--this.outbits <= 0)
                {
                    this.outbits = 8;
                    if (!this.bufferIsEmpty)
                    {
                        this.shiftreg = this.buffer;
                        this.bufferIsEmpty = true;
                        this.silenced = false;
                    }
                    else 
                    {
                        this.silenced = true;
                    }
                }
            }
            if (this.bufferIsEmpty && !this.isFetching && this.lengthCounter )
            {
                this.isFetching = true;
                this.fetch();
                this.lengthCounter--;
                
            }
        }

    }


    fetch () : void {
        this.buffer = this.handleDma(this.nextRead);
        this.bufferIsEmpty = false;
        this.isFetching = false;
        if (++this.nextRead == 0x10000)
            this.nextRead = 0x8000;

        if (!this.lengthCounter)
        {
            if (this.loopFlag)
            {
                this.nextRead = 0xC000 | ((this.address << 6) & 0xffff);
                this.lengthCounter = (this.length << 4) + 1;
            }
            else if (this.interruptEnabled) {
                this.interruptRaised = true;
            }
        }
    }

    endFrame(time: number): void {
        this.run(time);
        this.time = 0;
    }


}