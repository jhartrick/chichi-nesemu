// MMC2 and MMC4

import { BaseCart } from "./BaseCart";

export class MMC2Cart extends BaseCart {
    latches: number[] = [0,0];
    banks: number[] = [0,0,0,0];
    
    initializeCart() {
        this.mapperName='MMC2';
        this.latches[0] = 1;
        this.latches[1] = 2;

        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;

        this.setupBankStarts(0,(this.prgRomCount * 2) - 3,(this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

        this.copyBanks4k(0, 0,this.banks[this.latches[0]], 1);
        this.copyBanks4k(0,1,this.banks[this.latches[1]], 1);

    }

    getPPUByte(clock: number, address: number) : number {
        var bank: number = 0;
        if (address == 0xfd8) {
                bank = (address >> 11) & 0x2; 
                this.latches[0] = bank;
                this.copyBanks4k(clock,0,this.banks[this.latches[0]], 1);
        } else if (address == 0xfe8) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.latches[0] = bank;
                this.copyBanks4k(clock,0,this.banks[this.latches[0]], 1);
        } else if (address >= 0x1fd8 && address <= 0x1fdf) {
                bank = (address >> 11) & 0x2; 
                this.latches[1] = bank;
                this.copyBanks4k(clock,1,this.banks[this.latches[1]], 1);
        } else if (address >= 0x1fe8 && address <= 0x1fef) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.latches[1] = bank;
                this.copyBanks4k(clock,1,this.banks[this.latches[1]], 1);
        }

        // bank = address >> 10 ;
        // let newAddress = this.ppuBankStarts[bank] + (address & 1023);

        return  super.getPPUByte(clock, address);// this.chrRom[newAddress];
    }

    setByte(clock: number, address: number, val: number) {

        switch (address >> 12) {
            case 0x6:
            case 0x7:
                this.prgRomBank6[address & 0x1fff] = val & 0xff;
                break;
            case 0xA:
                this.setupBankStarts((val & 0xF), this.currentA, this.currentC, this.currentE);
                break
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock,0,this.banks[this.latches[0]], 1);
                //this.Whizzler.unpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock,1,this.banks[this.latches[1]], 1);
                break;
            case 0xF:
                this.mirror(clock, (val & 0x1) + 1);
                 break;
        }
    }
}

export class MMC4Cart extends BaseCart {
    selector: number[] = [0,0];
    banks: number[] = [0,0,0,0];
    
    initializeCart() {
        this.mapperName='MMC4';
        this.selector[0] = 1;
        this.selector[1] = 2;

        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;

        this.setupBankStarts(0, 1,(this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

        this.copyBanks4k(0, 0,this.banks[this.selector[0]], 1);
        this.copyBanks4k(0,1,this.banks[this.selector[1]], 1);

    }

    
    getPPUByte(clock: number, address: number) : number {
        var bank: number =0;
        if (address >= 0xFD8 && address <= 0xFDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[0] = bank;
                this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
        } else if (address >= 0xFE8 && address <= 0xFEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[0] = bank;
                this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
        } else if (address >= 0x1FD8 && address <= 0x1FDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[1] = bank;
                this.copyBanks4k(clock,1,this.banks[this.selector[1]], 1);
        } else if (address >= 0x1FE8 && address <= 0x1FEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[1] = bank;
                this.copyBanks4k(clock,1,this.banks[this.selector[1]], 1);
        }

        bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 1023);
        let data = this.chrRom[newAddress];
        return data;
    }

    setByte(clock: number, address: number, val: number) {

        switch (address >> 12) {
            case 0x6:
            case 0x7:
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                const bank8 = (val & 0xF) << 1;
                this.setupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                break
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.unpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock,1,this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.mirror(clock, (val & 0x1) + 1);
                 break;

        }
    }

}
