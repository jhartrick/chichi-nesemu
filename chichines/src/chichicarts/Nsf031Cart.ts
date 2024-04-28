import { BaseCart } from "./BaseCart";

 export class Mapper031Cart extends BaseCart {
     mapsBelow6000 = true;
     registers:number[] = [0,0,0,0,0,0,0,0xff];
     
     initializeCart() {
         this.mapperName = 'NSF Compilation';
         this.setupBanks4k(2, this.registers)
         
      }
 
     setByte(clock: number, address: number, val: number): void {
         if ((address & 0xfff0)=== 0x5ff0) {
            this.registers[address & 0x7] = val;
            this.setupBanks4k(2, this.registers)
         }
     }


 }
  