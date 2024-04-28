import { BaseCart } from "./BaseCart";

// simple discrete logic multi-carts, various pirate xxxxx-in-1s

 export class Mapper051Cart extends BaseCart {
     bank: number = 0;
     mode: number = 0;
     initializeCart() {
         this.usesSRAM = true;
         this.mapperName = 'Ball Games 11 in 1';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1,  2, 3);
        }
 
        updateBanks(): any {
            let offset = 0;
            
            if (this.mode & 0x1)
            {
                //prg.SwapBank<SIZE_32K,0x0000>( bank );
                let b = this.bank << 2;
                this.setupBankStarts(b, b + 1, b + 2, b + 3);
                offset = 0x23;
            }
            else
            {
                let b = this.bank << 1;
                this.setupBankStarts(b, b + 1, this.currentC, this.currentE);
                offset = 0x2F;
            }

            //wrk.SwapBank<SIZE_8K,0x0000>( offset | (bank << 2) );
             //ppu.SetMirroring( (mode == 0x3) ? Ppu::NMT_H : Ppu::NMT_V );
             if (this.mode == 3) {
                 this.mirror(0,1);
             } else {
                this.mirror(0,2);
                
             }
        }
   
        setByte(clock: number, address: number, val: number): void {
        switch (address & 0xe000) {
            case 0x6000:
                this.mode = ((val >> 3) & 0x2) | ((val >> 1) & 0x1);
                this.updateBanks();
                break;
            case 0x8000:
                this.bank = val & 0xf;
                this.updateBanks();            
                break;
            case 0xc000:
                this.bank = val & 0xf;
                this.mode = ((val >> 3) & 0x2) | (this.mode & 0x1);
                break;
            case 0xe000:
            
        }

     }
     
 }
  
 export class Mapper058Cart extends BaseCart {
     initializeCart() {
         this.mapperName = 'Charlie Multi-Cart';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1,  2, 3);
        }
 
     setByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             let mode = (address >> 6) & 0x01;
 
             if (mode)  {
                 // 16k banks 
                 let newbank81 = (address & 7) << 1;
                 this.setupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
                     
             } else {
                 // 32k banks 
                 let newbank81 = 0;
                 newbank81 = (address & 7) << 2;
                 this.setupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
         
             }
 
             this.mirror(clock, (( address >> 7) & 0x1) + 1 );
             this.copyBanks(clock, 0,(address >> 3) & 7, 1);
         }
     }
     
 }
 
 export class Mapper202Cart extends BaseCart {
     
     initializeCart() {
         this.mapperName = 'Multi-Cart';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, 0, 1);
        }
 
     setByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             //let mode = ((address >> 14) & 0x01)==0x01;
             let bank =(address >> 1) & 7;
          
             if ((address & 1 ) | ((address >> 2) & 2)) {
                 let newbank81 = (bank >> 1) << 2;
                 this.setupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
     
             } else {
                 let newbank81 = (bank >> 1) << 1;
                 this.setupBankStarts(newbank81, newbank81 + 1 ,  newbank81,  newbank81 + 1);
                 
             }
             this.mirror(clock, (( address) & 0x1) + 1 );
             this.copyBanks(clock, 0, bank, 1);
         }
     }
 }
 
 export class Mapper212Cart extends BaseCart {
    
    initializeCart() {
        this.mapperName = 'Multi-Cart212';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.setupBankStarts(0, 1, 3, 4);
    }
 
    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let mode = ((address >> 14) & 0x01)==0x01;
            let bank = address & 7;
            // Write $8000-$FFFF:
            // A~[1o.. .... .... MBBb]
            if (mode)  {
                // When it's 1, BB is 32 KiB PRG bank at CPU $8000.

                let newbank81 = (address & 6) << 2;
                this.setupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
                    
            } else {
                // When Banking style is 0, BBb specifies a 16 KiB PRG bank at both CPU $8000 and $C000. 
                let newbank81 = bank << 1;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }

            this.mirror(clock, (( address >> 3) & 0x1) + 1 );
            this.copyBanks(clock, 0, bank, 1);
        }
    }
}
 