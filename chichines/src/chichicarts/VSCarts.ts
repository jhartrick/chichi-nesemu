import { BaseCart } from "./BaseCart";
import { ChiChiCPPU } from "../chichi/ChiChiCPU";

import { MemoryMap } from "../chichi/chichi";

export class VSCart extends BaseCart {
        coin: number = 0;
        dips1: number = 0x0;
        dips2: number = 0x0;
        
        customPalette = [430,326,44,660,0,755,14,630,555,310,70,3,764,770,4,572,
                        737,200,27,747,0,222,510,740,653,53,447,140,403,0,473,357,
                        503,31,420,6,407,507,333,704,22,666,36,20,111,773,444,707,
                        757,777,320,700,760,276,777,467,0,750,637,567,360,657,77,120];
    
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        reg16 = 0;
        bankSelect = 0;
        initializeCart() {
            // this.usesSRAM = true;
            this.mapperName = 'VS Unisystem';
            this.mapsBelow6000 = true;
            this.setupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            this.copyBanks(0,0,0,1);
            this.mirror(0,3);
            
            
        }

        getByte(clock: number, address: number) {
            if (address == 0x4020) {
                return this.coin;
            }

            if (address >= 0x8000) {
                return this.peekByte(address);
            }
        }

        setByte(clock: number, address: number, val: number): void {
            this.setPrgRam(address, val);

            if (address == 0x4016) {
                this.bankSelect = val;
                const chrbank = (val >> 2) & 0x1;
                if (this.prgRomCount > 2) { 
                    this.setupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                }
                this.copyBanks(clock, 0, chrbank, 1);
            }
            if (address === 0x4020) {
                this.coin = val;
            }
        }
             
        clocks = 0;

    
     }
     