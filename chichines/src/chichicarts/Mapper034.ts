import { BaseCart } from "./BaseCart";

// BNROM (34)
export class BNROMCart extends BaseCart {
    isNina = false;
    initializeCart(): void {
        this.mapperName = 'BNROM';
        this.setupBankStarts(0, 1, 2, 3);
        if (this.chrRomCount > 1) {
            this.usesSRAM = true;
            this.mapperName = 'NINA-001';
            this.isNina = true;
            this.setByte = this.SetByteNina;
            this.setupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }

        //this.mirror(0, 0);
     }

     setByte(clock: number, address: number, val: number): void {
       if (address >= 0x8000 && address <= 0xffff) {
            // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        

        this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
       }
       // whizzler.DrawTo(clock);

    }

    SetByteNina(clock: number, address: number, val: number): void {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = val & 255;
            return;
        }
        switch (address) {
            case 0x7FFD:
                // val selects which bank to swap, 32k at a time
                let newbank8 = 0;
                newbank8 = (val & 1) << 2;
                this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.copyBanks4k(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.copyBanks4k(clock, 1, val & 0xf, 1);
                break;
            
        }


    }


}