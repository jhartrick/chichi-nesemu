import { BaseCart } from "./BaseCart";

export class Mapper093Cart extends BaseCart {
    initializeCart(): void {
        this.usesSRAM = true;
        this.mapperName = 'Sunsoft-2';
 
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            
            const prgbank = ((val >> 4) & 0x7) << 1;
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            
        }

    }

}

export class Mapper089Cart extends BaseCart {
    initializeCart(): void {
        
        this.mapperName = 'Sunsoft-2 on 3';
        // if (this.chrRomCount > 0) {
        //     this.copyBanks(0, 0, 0, 1);
        // }
        
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xffff) {
            let lobank = val & 0x7;
            lobank |= ((val >> 4) & 8);

            const prgbank = ((val >> 4) & 0x7) << 1;
            
            this.oneScreenOffset =  (val & 8) ? 1024 : 0;
            this.mirror(clock,0);

            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, lobank, 1);

        }

    }

}

export class Mapper184Cart extends BaseCart {
    initializeCart(): void {
        this.usesSRAM = false;
        this.mapperName = 'Sunsoft-1';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, 3, 1);
        this.copyBanks4k(0, 1, 0, 1);
    }

    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x6000 && address <= 0x7FFF) {
            const lobank = val & 0x3;
            const hibank = ((val >> 4) & 0xf);
            this.copyBanks4k(clock, 0, lobank , 1);
            this.copyBanks4k(clock, 1, hibank, 1);
        }

    }

}
