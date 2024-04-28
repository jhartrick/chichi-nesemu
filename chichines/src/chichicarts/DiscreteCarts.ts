import { BaseCart } from "./BaseCart";

//  Simple discrete logic mappers

export class NesCart extends BaseCart {
    // prevBSSrc = new Uint8Array(8);
 
     initializeCart(): void {
 
         //for (var i = 0; i < 8; i = (i + 1) | 0) {
         //    this.prevBSSrc[i] = -1;
         //}
         //SRAMEnabled = SRAMCanSave;
         switch (this.mapperId) {
         case 0:
             this.mapperName = 'NROM';
             break;
         case 180:
             this.mapperName  = 'UNROM (Crazy Climber?)';
 
             break;
         }
 


        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

     }

 
     setByte(clock: number, address: number, val: number): void {
         if (address >= 24576 && address <= 32767) {
             if (this.SRAMEnabled) {
                 this.prgRomBank6[address & 8191] = val & 255;
             }
 
             return;
         }
 

         if (this.mapperId === 180 && address >= 32768) {
             let newbankC1 = 0;
 
             newbankC1 = val * 2;
             // keep two LOW banks, swap high banks
 
             // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
             this.setupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
         }
 
     }
 }
 
 export class UxROMCart extends BaseCart {
     initializeCart(): void {
         this.mapperName = 'UxROM';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = val << 1;
             this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
         }
 
     }
     
 }
 
 export class Mapper094Cart extends BaseCart {
    initializeCart(): void {
        this.mapperName = 'HVC-UN1ROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000) {
            let newbank81 = ((val >> 2) & 0x7) << 1;
            this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
        }

    }
    
}


 export class Mapper081Cart extends BaseCart {
     initializeCart(): void {
         this.mapperName = 'Super Gun';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = ((val >> 2) & 3) << 1;
             this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
 
             const chrBank = val & 3;
             this.copyBanks(clock,0,chrBank,1);
         }
 
     }
 }
 
 export class Mapper030Cart extends BaseCart {
     initializeCart(): void {
         this.mapperName = 'UNROM-512';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = (val & 0x1F) << 1;
             this.setupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
 
             const chrBank = (val >>5) & 3;
             this.mirror(0, (val >>7 ) & 0x1 )
             this.copyBanks(clock,0,chrBank,1);
         }
 
     }
     
 }
 
 export class Mapper071Cart extends BaseCart {
     initializeCart(): void {
         this.mapperName = 'Camerica UNROM';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = val << 1;
             this.setupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
         }
 
     }
     
 }
 
 export class Mapper013Cart extends BaseCart {
            //SRAMEnabled = SRAMCanSave;
     initializeCart() {
         this.mapperName = 'NES-CPROM';

             this.copyBanks4k(0, 0, 0, 1);
             this.copyBanks4k(0, 1, 1, 1);
         
         // one 32k prg rom
         this.setupBankStarts(0, 1, 2, 3);
         this.mirror(0,2)
     }
 
     setByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             this.copyBanks4k(clock, 1, (val & 3), 1);
         }
     }
     
 }
 

 
 export class Mapper185Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'CNROM + CP';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {
        if (address >= 0x8000) {
            this.copyBanks(clock, 0, val, 1);
        }
    }
    
}


export class Mapper190Cart extends BaseCart {

    initializeCart() {
        this.mapperName = 'MKGGROM';
        this.usesSRAM = true;
        this.copyBanks(0, 0, 0, 2);
        this.setupBankStarts(0, 1, 0, 1);
        this.mirror(0,1);
    }

    setByte(clock: number, address: number, val: number): void {
        this.setPrgRam(address, val);
        // prgBank = A14, D2, D1, D0
        if (address >= 0x8000 && address <= 0x9FFF) {
            let prgBank = (val & 7) <<1;
            this.setupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        
        if (address >= 0xA000 && address <= 0xBFFF) {
            this.copyBanks2k(clock, address & 3, val, 1);
        }
        
        if (address >= 0xC000 && address <= 0xDFFF) {
            let prgBank = ((val & 7) + 8) << 1;
            this.setupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
            
        }

    }
}

export class Mapper087Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'CNROM Clone';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {
        if (address >= 0x6000 && address <= 0x7FFF) {
            const chrbank = ((val & 0x1) << 1) | ((val & 0x2) >> 1)
            this.copyBanks(clock, 0, chrbank, 1);
        }
    }
         
 }
 
export class Mapper145Cart extends BaseCart {
    initializeCart() {
        this.mapperName = 'Sachen Sidewinder';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    }

    setByte(clock: number, address: number, val: number): void {
        if ((address & 0xE100) == 0x4100 ) {
            const chrbank = val;
            this.copyBanks(clock, 0, chrbank, 1);
        }
    }
}
 
 export class ColorDreams extends BaseCart {
     // https://wiki.nesdev.com/w/index.php/Color_Dreams
     initializeCart(): void {
         
         this.mapperName = 'Color Dreams';
        //  if (this.chrRomCount > 0) {
        //      this.copyBanks(0, 0, 0, 1);
        //  }
         this.setupBankStarts(0, 1, 2, 3);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             const prgbank = (val & 0x3) << 2 ;
             const chrbank = ((val >> 4) & 0xf);
 
             // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
             this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             // two high bits set mirroring
             this.copyBanks(clock, 0, chrbank, 1);
         }
         //         %00 = 1ScA
         //         %01 = Horz
         //         %10 = Vert
         //         %11 = 1ScB
         //this.mirror(clock,(val >> 6));
     }
 
 }
 
 export class MHROMCart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = 'GxROM';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, 2, 3);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0x3 ;
             const prgbank = ((val >> 4) & 0x3) << 2;
 
             this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.copyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Mapper070Cart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = '~Family Trainer';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
         this.mirror(0,1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0xF) << 1;
 
             this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
             
             this.copyBanks(clock, 0, chrbank, 1);

             this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
             this.mirror(clock, 0);
         }
 
     }
 
 }
 
 export class Mapper077Cart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = '~Mapper 077';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             const prgbank = (val & 0xF) << 2;
             const chrbank = ((val >> 4) & 0xF);
 
             this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
             
             this.copyBanks2k(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Mapper079Cart extends BaseCart {
    initializeCart(): void {
        this.mapsBelow6000 = true;
        this.usesSRAM = false;
        this.mapperName = 'NINA-003-006';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.setupBankStarts((this.prgRomCount * 2) - 4, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {
        if ((address >> 13) == 2 && (address & 0x100))
        {
            const prgbank = ((val >> 3) & 0x1) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            const chrbank = (val & 0x7);
            this.copyBanks(clock, 0, chrbank, 1);
        }

    }

}


 export class Mapper078Cart extends BaseCart {
    // default to cosmo carrier
    isHolyDiver = false;
    initializeCart(): void {
        
        this.mapperName = 'Holy Diver / Cosmo Carrier';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        if (this.ROMHashFunction == 'BA51AC6F') {
            this.isHolyDiver = true;
            this.mirror(0, 1);
        }else {
            this.mirror(0, 0);
        }
        
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            
            const prgbank = ((val) & 0xF) << 1;
            const chrbank = (val >> 4) & 0xF;
            const mirroring = (val >> 3) & 1;
            
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);

            this.copyBanks(clock, 0, chrbank, 1);
            
            if (this.isHolyDiver) {
                if (mirroring == 0)
                {
                    this.mirror(clock, 2);
                } else {
                    this.mirror(clock, 1);
                }

            } else {
                this.oneScreenOffset = mirroring * 1024;
                this.mirror(clock, 0);
            }
        }

    }

}

export class Mapper152Cart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = '~FT + onescreen mirroring';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
         this.oneScreenOffset =0;
         this.mirror(0,0);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0x31) << 1;
 
             this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
             
             this.copyBanks(clock, 0, chrbank, 1);
             this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
             this.mirror(clock, 0);
         }
 
     }
 
 }
 
 export class JF1xCart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = 'Jaleco JF-11, JF-14';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, 2, 3);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x6000 && address <= 0x7FFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0x3) << 2;
 
             this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.copyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Irem097Cart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = '~Irem TAM-S1 IC';
         this.usesSRAM = false;
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
     }
 
     setByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xffff) {
            let newbankC1 = 0;
    
            newbankC1 = (val & 0xf) << 1;
            // keep two LOW banks, swap high banks
    
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.setupBankStarts(this.current8, this.currentA, newbankC1, newbankC1 + 1);
    
            // two high bits set mirroring
            //         %00 = 1ScA
            //         %01 = Horz
            //         %10 = Vert
            //         %11 = 1ScB
            switch ((val >> 6) & 3) {
                case 0:
                    this.oneScreenOffset = 0;
                    this.mirror(clock,0);
                    break;
                case 1:
                    this.mirror(clock,2);
                    break;
                case 2:
                    this.mirror(clock,1);
                    break;
                case 2:
                    this.oneScreenOffset = 0x400;
                    this.mirror(clock,0);
                    break;
            }
        }
     }
 
     
 }
 
 export class BitCorp038Cart extends BaseCart {
     initializeCart(): void {
         
         this.mapperName = 'Bit Corp Crime Busters';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBankStarts(0, 1, 2, 3);
     }
 
     setByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x7000 && address <= 0x7FFF) {
             let newbank81 = 0;
 
             const prgbank = (val & 0x3) <<2;
             const chrbank = ((val >> 2) & 0x3);
 
             this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.copyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 //  Mapper 7 and derivatives 34

 export class AxROMCart extends BaseCart {
    // prevBSSrc = new Uint8Array(8);

 
     initializeCart(): void {
        this.mapperName = 'AxROM';
        
        this.setupBankStarts(0, 1, 2, 3);
        this.mirror(0, 0);
     }

     setByte(clock: number, address: number, val: number): void {


        if (address >= 0x8000 && address <= 0xffff) {
            let newbank8 = 0;
            newbank8 = (val & 7) << 2;
            
            this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);

            // whizzler.DrawTo(clock);
            if (val & 16) {
                this.oneScreenOffset = 1024;
            } else {
                this.oneScreenOffset = 0;
            }
            this.mirror(clock, 0);
        }
    }
 
 
}



