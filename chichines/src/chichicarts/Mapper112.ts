// 
import { BaseCart } from "./BaseCart";

export class Mapper112Cart extends BaseCart {

    registers = [0,0,0,0,0,0,0,0];
    latch = 0;

    initializeCart() {
        this.mapperName = 'asder';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    updateBanks() {
        this.setupBankStarts(this.registers[0], this.registers[1], this.currentC, this.currentE);

        this.copyBanks2k(0, 0, this.registers[2], 1 );
        this.copyBanks2k(0, 1, this.registers[3], 1 );

        this.copyBanks1k(0, 4, this.registers[4], 1 );
        this.copyBanks1k(0, 5, this.registers[5], 1 );
        this.copyBanks1k(0, 6, this.registers[6], 1 );
        this.copyBanks1k(0, 7, this.registers[7], 1 );

    }

    setByte(clock:number, address: number, data: number) {
        if (address >= 0x8000 && address <= 0xffff) {
            switch(address & 0xe001) {
                case 0x8000:
                    this.latch = data & 7;
                break;
                case 0xa000:
                    this.registers[this.latch] = data;
                    this.updateBanks();
                case 0xe000:
                    this.mirror(clock,(data & 1) == 1 ? 1 : 2 );
                    break;

            }
        }
    }
}