import { ChiChiCPPU } from '../chichi/ChiChiCPU';
import { ChiChiPPU } from '../chichi/ChiChiPPU';
import * as FILE from './NESFileDecoder';
import * as crc from 'crc';
import { StateBuffer } from '../chichi/StateBuffer';

export enum NameTableMirroring {

    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3
}

export class BaseCart {
    batterySRAM: boolean = false;
    customPalette: number[];
    ramMask = 0x1fff;
    fileName: string = '';
    setupMapperStateBuffer(buffer: ArrayBuffer, start: number) {
    }


    advanceClock(clock: number){}
    oneScreenOffset = 0
    
    fourScreen: boolean = false;
    mapperName: string = 'base';
    supported: boolean = true;
    submapperId: number = 0;
    mapsBelow6000: boolean = false;
    // compatible with .net array.copy method
    // shared components
    nextEventAt = 0;
    prgRomCount = 0;
    chrRomOffset = 0;
    chrRomCount = 0;
    chrRamStart = 0;
    chrRamLength = 0;
    mapperId = 0;

    chrRam: Uint8Array = new Uint8Array(0x2000);
    
    prgRomBank6: Uint8Array = new Uint8Array(0x2000); 

    // starting locations of PPU 0x0000-0x3FFF in 1k blocks
    ppuBankStarts: Uint32Array = new Uint32Array(16); 

    // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
    prgBankStarts: Uint32Array = new Uint32Array(10); 

    prgRom: Uint8Array;
    chrRom: Uint8Array;

    get current6() : number {
        return this.prgBankStarts[0] / 8192;
    };

    get current8() : number {
        return this.prgBankStarts[2] / 8192;
    };
    get currentA() : number {
        return this.prgBankStarts[4] / 8192;
    };
    get currentC() : number {
        return this.prgBankStarts[6] / 8192;
    };
    get currentE() : number {
        return this.prgBankStarts[8] / 8192;
    };

    SRAMCanWrite = false;
    SRAMEnabled = false;
    private SRAMCanSave = false;

    ROMHashFunction: string = null;
    private mirroring = -1;
    updateIRQ: () => void = () => {
        this.NMIHandler();
    };
   
    irqRaised = false;

    Whizzler: ChiChiPPU;
    CPU: ChiChiCPPU;

    CartName: string;
    NMIHandler: () => void;

    usesSRAM: boolean = false;
    //ChrRamStart: number;

    constructor(public romFile: FILE.NesFile) {
        this.loadFile(romFile);

    }

    setupStateBuffer(sb: StateBuffer) {
        sb.onRestore.subscribe((buffer: StateBuffer) => {
            this.attachStateBuffer(buffer);
        })

        sb  .pushSegment(0x2000, 'prgram')
            .pushSegment(10 * Uint32Array.BYTES_PER_ELEMENT, 'prgbankstarts')
            .pushSegment(16 * Uint32Array.BYTES_PER_ELEMENT, 'ppubankstarts')
            .pushSegment(this.romFile.chrRomCount === 0 ? 0x2000 : 0, 'chrrom')
            .pushSegment( 0x2000, 'chrram');
        return sb;

    }
    
    attachStateBuffer(sb: StateBuffer) {
        let seg = sb.getSegment('prgram');
        
        this.prgRomBank6    = new Uint8Array(seg.buffer, seg.start, seg.size);

        seg = sb.getSegment('prgbankstarts');
        this.prgBankStarts  = new Uint32Array(seg.buffer, seg.start, 10);

        seg = sb.getSegment('chrram');
        this.chrRam         = new Uint8Array(seg.buffer, seg.start, seg.size);

        seg = sb.getSegment('ppubankstarts');
        this.ppuBankStarts  = new Uint32Array(seg.buffer, seg.start, 16);

        seg = sb.getSegment('chrrom');
        if (seg.size > 0) {
            this.chrRom = new Uint8Array(seg.buffer, seg.start, seg.size);
        }
    }

    private loadFile(file: FILE.NesFile) {
            
        this.prgRomCount = file.prgRomCount;
        this.chrRomCount = file.chrRomCount;

        this.prgRom = file.prgRom;
        
        if (file.chrRomCount > 0) {
            // const chrRomBuffer = new ArrayBuffer((file.chrRomLength) * Uint8Array.BYTES_PER_ELEMENT)
            this.chrRom = file.chrRom;
            this.chrRamStart = file.chrRomLength;
            // BaseCart.arrayCopy(file.chrRom, 0, this.chrRom, 0, file.chrRomLength);
        }

        this.chrRamLength = 0x2000;

        this.usesSRAM = file.usesSRAM;
        this.batterySRAM = file.batterySRAM;
        this.ROMHashFunction = file.romCRC;
        this.mirroring = file.mirroring;
        this.fourScreen = file.fourScreen;
    }
  
    installCart(ppu: ChiChiPPU, cpu: ChiChiCPPU) {
        this.Whizzler = ppu;
        this.CPU = cpu;
        // this.NMIHandler = () => { this.CPU._handleIRQ = true; };

        this.prgRomBank6.fill(0);

        for (let i = 0; i < 16; i++) {
            this.ppuBankStarts[i] = i * 0x400;
        }
        for (let i = 0; i < 8; i++) {
            this.prgBankStarts[i] = i * 0x1000;
        }
        this.mirroring = this.romFile.mirroring;
        this.mirror(0, this.mirroring);
        this.initializeCart();
    }

    getByte(clock: number, address: number): number {
        let bank = (address >> 12) - 0x6;
        if (bank < 2) {
            if (this.usesSRAM) {
                return this.prgRomBank6[address & this.ramMask];
            } else {
                return (address >> 8) & 0xff;
            }
        }

        return this.prgRom[this.prgBankStarts[bank] + (address & 0xfff)];
    }

    peekByte(address: number) {
        return this.prgRom[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    }

    setPrgRam(address: number, data: number) {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = data;
        }
    }

    setByte(clock: number, address: number, data: number): void {
        if (this.usesSRAM) {
            this.setPrgRam(address, data);
        }
    }

    getPPUByte(clock: number, address: number): number {
        const bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        if (bank < 8) {
            return this.chrRom[newAddress];
        } else {
            return this.chrRam[newAddress & 0x1fff];
        }
    }

    setPPUByte(clock: number, address: number, data: number): void {
        const bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        if (bank < 8) {
            this.chrRom[newAddress] = data; 
        } else {
            this.chrRam[newAddress & 0x1fff] = data;
        }
    }

    setup6BankStarts(reg6: number, reg8: number, regA: number, regC: number, regE: number): void {
        reg6 = reg6 % (this.prgRomCount * 2);
        this.prgBankStarts[0] = reg6 * 8192;
        this.prgBankStarts[1] = (this.prgBankStarts[0] + 4096);
        this.setupBankStarts(reg8, regA, regC, regE);

    }

    setupBankStarts(reg8: number, regA: number, regC: number, regE: number): void {
        reg8 = reg8 % (this.prgRomCount * 2);
        regA = regA % (this.prgRomCount * 2);
        regC = regC % (this.prgRomCount * 2);
        regE = regE % (this.prgRomCount * 2);
        this.prgBankStarts[2] = reg8 * 8192;
        this.prgBankStarts[3] = (this.prgBankStarts[2] + 4096);
        this.prgBankStarts[4] = regA * 8192;
        this.prgBankStarts[5] = (this.prgBankStarts[4] + 4096);
        this.prgBankStarts[6] = regC * 8192;
        this.prgBankStarts[7] = (this.prgBankStarts[6] + 4096);
        this.prgBankStarts[8] = regE * 8192;
        this.prgBankStarts[9] = (this.prgBankStarts[8] + 4096);

    }

    setupBanks4k(start: number, banks: number[]) {
        banks = banks.map((bank)=> {
            return bank % (this.prgRomCount << 2);
        });
        for (let i = 0; i < banks.length; ++i ) {
            if (i >= this.prgBankStarts.length) {
                break;
            }
            this.prgBankStarts[start + i] = banks[i] * 4096;
        }
    }

    maskBankAddress(bank: number): number {
        return bank % (this.prgRomCount * 2);
    }

    // 0 - onescreen, 1 -v, 2- h, 3 - fourscreen
    mirror(clockNum: number, mirroring: number): void {
        this.mirroring = mirroring;

        switch (mirroring) {
            case 0:
                this.ppuBankStarts[8] = (this.chrRamStart  + this.oneScreenOffset);
                this.ppuBankStarts[9] = (this.chrRamStart  + this.oneScreenOffset);
                this.ppuBankStarts[10] = (this.chrRamStart + this.oneScreenOffset);
                this.ppuBankStarts[11] = (this.chrRamStart  + this.oneScreenOffset);
                break;
            case 1:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024);
                this.ppuBankStarts[10] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) ;
                break;
            case 2:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[10] = (this.chrRamStart + 1024);
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) ;
                break;
            case 3:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) ;
                this.ppuBankStarts[10] = (this.chrRamStart + 2048);
                this.ppuBankStarts[11] = (this.chrRamStart + 3072);
                break;
        }
    }

    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    copyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void {

        if (dest >= this.chrRomCount) {
            dest = dest % this.chrRomCount;
        }
        if (src >= this.chrRomCount) {
            src = src % this.chrRomCount;
        }
        const oneKsrc = src << 3;
        const oneKdest = dest << 3;

        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }

    copyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        const chrCount = this.chrRomCount << 1;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }

        const oneKsrc = src << 2;
        const oneKdest = dest << 2;
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }

    copyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void {

        const chrCount = this.chrRomCount << 2;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        

        var oneKsrc = src << 1;
        var oneKdest = dest << 1;

        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }
    
    copyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        
        const chrCount = this.chrRomCount << 3;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        

        let oneKsrc = src ;
        let oneKdest = dest ;

        for (var i = 0; i < numberOf1kBanks ; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
    }        

    initializeCart(hardReset?: boolean): void {
        //setup mirroring 
        this.mirroring = this.romFile.mirroring;
        this.fourScreen = this.romFile.fourScreen;
        this.mirror(0, this.mirroring);

    }

    updateScanlineCounter(): void {
        //throw new Error('Method not implemented.');
    }

}

export class UnsupportedCart extends BaseCart {
    supported: boolean = false;
    initializeCart(): void {
        this.mapperName = 'unsupported';
        // maybe this will work - give it a go!
        this.setupBankStarts(0, 1,(this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.mirror(0, 0);
     }
}
