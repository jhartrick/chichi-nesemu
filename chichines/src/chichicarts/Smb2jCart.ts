import { BaseCart } from "./BaseCart";

export class Smb2jCart extends BaseCart {
    initializeCart() {
        this.mapperName = 'Smb2j pirate';
        this.usesSRAM = false;
        this.setup6BankStarts(6, 4, 5, 1, 7);
        this.copyBanks(0,0,0,1);
    }
    irqEnabled = false;
    irqCounter: number= 0;

    advanceClock(value: number) {
        if (this.irqEnabled) {
            this.irqCounter -=value;
            if (this.irqCounter <= 0) {
                this.irqCounter = 0;
                this.irqRaised = true;
                this.irqEnabled = false;
            }
        }
    }

    getByte(clock: number, address: number) {
        return this.prgRom[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    }

    setByte(clock:number, address: number, data: number) {
        switch (address & 0xE000) {
        case 0x8000:
            this.irqRaised = false;
            this.irqEnabled = false;
        break;
        case 0xA000:
            this.irqEnabled = true;
            this.irqCounter = 4096;
            this.nextEventAt = clock + 4096;
        break;
        case 0xE000:
            this.setup6BankStarts(this.current6, this.current8, this.currentA, data, this.currentE);
            break;
        } 
    }
}