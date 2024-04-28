// 
import { BaseCart } from "./BaseCart";

export class Mapper133Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'Jovial Race (Sachen)';
        this.usesSRAM = false;
        this.mapsBelow6000 = true;
        this.setupBankStarts((this.prgRomCount << 1) - 4, (this.prgRomCount << 1) - 3, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.copyBanks(0,0,0,1);
        this.mirror(0,1)
    }

    setByte(clock:number, address: number, data: number) {
        if (address >= 0x4100 && address <= 0x6000) {
            const chrbank = data & 3;
            this.copyBanks(clock,0, chrbank, 1);
            const prgbank = ((data >> 2) & 1) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
        }
    }
}