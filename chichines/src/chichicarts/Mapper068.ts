import { BaseCart } from "./BaseCart";

// BNROM (34)
export class Mapper068Cart extends BaseCart {
    cramStart = 0;
    cromStart = 0;
    
    initializeCart(): void {
        this.mapperName = 'Sunsoft-4';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.cramStart = this.chrRamStart;
        //this.mirror(0, 0);
     }

     setByte(clock: number, address: number, val: number): void {
        if (address < 0x5000) return;
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }
        switch (address & 0xF000) {
            case 0xF000:
                let newbank8 = (val * 0xF) <<1;
                this.setupBankStarts(newbank8, newbank8 + 1, this.currentC, this.currentE);
                break;
            case 0x8000:
                //Map a 2 KiB CHR ROM bank into PPU $0000.    
                this.copyBanks2k(clock,0, val , 1);
                break;
            case 0x9000:
                // Map a 2 KiB CHR ROM bank into PPU $0800.  
                this.copyBanks2k(clock, 1, val , 1);
                break;
            case 0xA000:
                // Map a 2 KiB CHR ROM bank into PPU $1000.  
                this.copyBanks2k(clock, 2, val , 1);
                break;
            case 0xB000:
                // Map a 2 KiB CHR ROM bank into PPU $1800.   
                this.copyBanks2k(clock, 3, val , 1);
                break;
            case 0xC000:
                // Map a 1 KiB CHR ROM bank in place of the lower nametable (CIRAM $000-$3FF). Only D6-D0 are used; D7 is ignored and treated as 1, so nametables must be in the last 128 KiB of CHR ROM.   
                this.cromStart = (val | 0x80) * 0x400;
                this.chrRamStart = this.cromStart;
                this.copyBanks1k(clock, 8, val | 0x80, 1);
                break;
            case 0xD000:
                // Map a 1 KiB CHR ROM bank in place of the upper nametable (CIRAM $400-$7FF). Only D6-D0 are used; D7 is ignored and treated as 1.  
                this.copyBanks1k(clock, 9, val | 0x80, 1);
                break;

            case 0xE000:
                let useCRAM = (val & 0x10) == 0x10;
                if (useCRAM) {
                    this.chrRamStart = this.cramStart;
                } else {
                    this.chrRamStart = this.cromStart;
                }
                this.mirror(clock, val & 0x3);
                break;
        }

       // this.Whizzler.DrawTo(clock);

       // whizzler.DrawTo(clock);

    }

}
