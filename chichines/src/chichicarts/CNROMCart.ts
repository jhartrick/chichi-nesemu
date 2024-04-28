import { BaseCart } from "./BaseCart";

export class CNROMCart extends BaseCart {
    
        initializeCart() {
           this.mapperName = 'CNROM';
           this.usesSRAM = false;
           // this.copyBanks(0, 0, 0, 2);
           
           if (this.prgRomCount == 1) 
           {
               this.setupBankStarts(0, 1, 0, 1);
           } else {
               this.setupBankStarts(0, 1, 2, 3);
           }
   
       }
   
       setByte(clock: number, address: number, val: number): void {
           if (address >= 0x8000 && address <= 0xffff) {
               let x = val & 0xf;// > this.chrRomCount - 1? this.chrRomCount -1 : val;
   
               this.copyBanks(clock, 0, x, 1);
           }
       }
        
    }