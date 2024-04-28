// 
import { BaseCart } from "./BaseCart";

export class Mapper228Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'Cheetahmen II/Action 52';
        this.usesSRAM = false;
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0,0,0, 1);
        this.mirror(0,1)
        this.setByte(0,0x8000,0);
    }

    setByte(clock:number, address: number, data: number) {
        if (address > 0x8000 && address < 0xffff) {
            const size = (address  >> 5) & 1;
            const chr = (data & 0x3) |  (( address & 0xf) << 4);
            const mode = (address >> 5) & 1;
            const chip = (address >> 11) & 0x3;
            const mirror = (address >> 13) & 0x1;

            let page = (address >> 6) & 0x1f;
            
            this.copyBanks(clock, 0, chr, 1);
            if (mode) {
                page = page << 2;
                this.setupBankStarts(page, page + 1, page + 2, page + 3);
                
            } else {
                switch(size ) {
                    case 1:
                        page = page << 1;
                        this.setupBankStarts(page, page + 1, page, page + 1);
                    case 0: 
                        let page0 = (page & 0xfe) << 1;
                        let page1 = (page & 0xff) << 1;
                        this.setupBankStarts(page0, page0 + 1, page1, page1 + 1);
                    break;
                }

            }
            this.mirror(clock, 2 - mirror)
        }
    }
}