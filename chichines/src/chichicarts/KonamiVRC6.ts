import { BaseCart } from "./BaseCart";
import { VRCIrqBase } from "./KonamiVRC2";

export class Konami026Cart extends VRCIrqBase {
    runCounter: boolean = false;
    chrselect: number = 0;
    chrA10Mode: boolean = false;
    nameTableSource: boolean = false;
    mirrorMode: number = 0;
    bankMode: number = 0;
    prgRamEnable: boolean = false;
    swapMode: boolean = false;
    microwireLatch: number = 0;
    
    vrc6Registers = [0,0,0,0,0,0,0,0];

    updateChrBanks(clock: number) {
        // bank0  0 - 0x3ff
        this.copyBanks1k(clock, 0, this.vrc6Registers[0], 1);

        // bank1  0x400 - 0x7ff
        let bank = this.vrc6Registers[1];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[0];
                break;
        }
        this.copyBanks1k(clock, 1, bank, 1);

        // bank2  0x800 - 0xbff
        bank = this.vrc6Registers[2];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[1];
                break;
        }
        this.copyBanks1k(clock, 2, bank, 1);

        // bank3  0xc00 - 0xfff
        bank = this.vrc6Registers[3];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[1];
                break;
        }
        this.copyBanks1k(clock, 3, bank, 1);

        // bank4  0x1000 - 0x13ff
        bank = this.vrc6Registers[4];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[2];
                break;
        }
        this.copyBanks1k(clock, 4, bank, 1);

        // bank5 0x1400 - 0x17ff
        bank = this.vrc6Registers[5];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[2];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[4];
                break;
        }
        this.copyBanks1k(clock, 5, bank, 1);        


        // bank6 0x1800 - 0x1bff
        bank = this.vrc6Registers[6];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[3];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[5];
                break;
        }
        this.copyBanks1k(clock, 6, bank, 1);  

        // bank7 0x1800 - 0x1bff
        bank = this.vrc6Registers[7];
        switch(this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[3];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[5];
                break;
        }
        this.copyBanks1k(clock, 7, bank, 1);  

        // bank8 0x2000 - 0x23ff
        switch(this.chrselect & 7) {
            case 1:
            case 5:
                bank = this.vrc6Registers[4];
                break;
            case 2:
            case 3:
            case 4:
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[6];
                break;
            }
        this.copyBanks1k(clock, 8, bank, 1);  

        // bank9 0x2400 - 0x27ff
        switch(this.chrselect & 7) {
            case 1:
            case 5:
                bank = this.vrc6Registers[5];
                break;
            case 2:
            case 3:
            case 4:
                bank = this.vrc6Registers[7];
                break;
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[6];
                break;
            }
        this.copyBanks1k(clock, 9, bank, 1);  
        

        // bank10 0x2800 - 0x2bff
        switch(this.chrselect & 7) {
            case 1:
            case 5:
            case 2:
            case 3:
            case 4:
                bank = this.vrc6Registers[6];
                break;
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[7];
                break;
            }
        this.copyBanks1k(clock, 10, bank, 1);          

        this.copyBanks1k(clock, 11, this.vrc6Registers[7], 1); 
        
        if ((this.chrselect & 0x20) == 0x20) {
            // switch(this.chrselect & 0xF) {
            //     case 0:
            //     case 7:
            //         this.mirror(clock,1);
            //         break;
            //     case 4: case 3:
            //         this.mirror(clock,2);
            //         break;
            //     case 8: case 0xF:
            //         this.oneScreenOffset = 0;
            //         this.mirror(clock,0);
            //         break;
            //     case 8: case 0xF:
            //         this.oneScreenOffset = 0x400;
            //         this.mirror(clock,0);
            //         break;
            // }
        }


    }

    initializeCart() {
        this.mapperName = 'KonamiVRC6';
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
    }

    setByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {
        case 0x8000:
            if (address <= 0x8003) { 
                // 16kib prg rom at 8000
                let bank8 = (data & 0xF) << 1;
                this.setupBankStarts(bank8, bank8+1, this.currentC, this.currentE);
            }
            break;
        case 0xC000:
            if (address <= 0xC003) { 
            // 8kib prg rom at C000
                let bankC = data & 0xF;
                this.setupBankStarts(this.current8, this.currentA, bankC, this.currentE);
            }
            break;
        case 0xB000: 
            if ((address & 3) == 3) { 
                this.chrselect = data;
                this.prgRamEnable = (data & 0x80) == 0x80;
                this.bankMode = data & 0x3;
                this.mirrorMode = (data >> 2) & 0x3;
                this.nameTableSource = ((data >> 4) & 0x1) == 0x01;
                this.chrA10Mode = ((data >> 5) & 0x1) == 0x01;
                this.updateChrBanks(clock);
            }
            break;
        case 0xD000:
            if (address <= 0xD003) {
                this.vrc6Registers[address & 3] = data;
                this.updateChrBanks(clock);
            }
            break;
        case 0xE000:
            if (address <= 0xE003) {
                this.vrc6Registers[4 + (address & 3)] = data;
                this.updateChrBanks(clock);
            }
            break;
        case 0xF000:
            switch(address & 0x3) {
                case 0:
                    this.irqLatch = data;
                    break;
                case 1: 
                    this.irqControl = data;
                    break;
                case 2: 
                    this.ackIrq();
                    break;
            }
            break;
        }
    }
}
