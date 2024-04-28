// 
import { BaseCart } from "./BaseCart";

export class Mapper132Cart extends BaseCart {
    registers = [0,0,0,0];
    initializeCart() {
        this.mapperName = 'Mapper 132';
        this.mapsBelow6000 = true;
        this.usesSRAM = false;
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0,0,this.chrRomCount  - 1,1);
        this.mirror(0,1)
    }

    getByte(clock: number, address: number): number {
        let bank = (address >> 12) - 0x6;

        if (address >= 0x4100 && address <= 0x4103) {
            return (this.registers[1] ^ this.registers[2]) | (0x40);
        }
        
        return this.prgRom[this.prgBankStarts[bank] + (address & 0xfff)];
    }

    setByte(clock:number, address: number, data: number) {

        if (address >= 0x4100 && address <= 0x4103) {
            this.registers[address & 0x3] = data;
        } else if (address >= 0x8000 && address <= 0xffff) {
            const prgBank = this.registers[2] << 2;
            this.setupBankStarts(prgBank, prgBank + 1, prgBank + 2, prgBank + 3);
            this.copyBanks(clock, 0, this.registers[2], 1);
        }

    }


}