import { BaseCart } from "./BaseCart";

export class Mapper193Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'NTDEC TC-112';
        this.usesSRAM = false;
        this.setupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0,0,this.chrRomCount  - 1,1);
        this.mirror(0,1)
    }

    setByte(clock:number, address: number, data: number) {
        console.log('set: 0x' + address.toString(16) + '( 0x'  + data.toString(16) + ')'  );
        
        if (address >= 0x6000 && address <= 0x7fff) {
            switch(address & 0x3) {
                case 0x0:
                    this.copyBanks4k(clock,0, (data >> 2) & 63, 1);
                break;
                case 0x1:
                    this.copyBanks2k(clock,2, data >> 1, 1);
                break;
                case 0x2:
                    this.copyBanks2k(clock,3, data >> 1, 1);
                break;
                case 0x3:
                    this.setupBankStarts(data, this.currentA, this.currentC, this.currentE);
                break;

            }
        }
    }
}