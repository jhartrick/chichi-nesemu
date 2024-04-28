import { ChiChiCPPU } from '../chichi/ChiChiCPU';
import { ChiChiPPU } from '../chichi/ChiChiPPU';
import * as FILE from './NESFileDecoder';
import { StateBuffer } from '../chichi/StateBuffer';
export declare enum NameTableMirroring {
    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3
}
export declare class BaseCart {
    romFile: FILE.NesFile;
    batterySRAM: boolean;
    customPalette: number[];
    ramMask: number;
    fileName: string;
    setupMapperStateBuffer(buffer: ArrayBuffer, start: number): void;
    advanceClock(clock: number): void;
    oneScreenOffset: number;
    fourScreen: boolean;
    mapperName: string;
    supported: boolean;
    submapperId: number;
    mapsBelow6000: boolean;
    nextEventAt: number;
    prgRomCount: number;
    chrRomOffset: number;
    chrRomCount: number;
    chrRamStart: number;
    chrRamLength: number;
    mapperId: number;
    chrRam: Uint8Array;
    prgRomBank6: Uint8Array;
    ppuBankStarts: Uint32Array;
    prgBankStarts: Uint32Array;
    prgRom: Uint8Array;
    chrRom: Uint8Array;
    get current6(): number;
    get current8(): number;
    get currentA(): number;
    get currentC(): number;
    get currentE(): number;
    SRAMCanWrite: boolean;
    SRAMEnabled: boolean;
    private SRAMCanSave;
    ROMHashFunction: string;
    private mirroring;
    updateIRQ: () => void;
    irqRaised: boolean;
    Whizzler: ChiChiPPU;
    CPU: ChiChiCPPU;
    CartName: string;
    NMIHandler: () => void;
    usesSRAM: boolean;
    constructor(romFile: FILE.NesFile);
    setupStateBuffer(sb: StateBuffer): StateBuffer;
    attachStateBuffer(sb: StateBuffer): void;
    private loadFile;
    installCart(ppu: ChiChiPPU, cpu: ChiChiCPPU): void;
    getByte(clock: number, address: number): number;
    peekByte(address: number): number;
    setPrgRam(address: number, data: number): void;
    setByte(clock: number, address: number, data: number): void;
    getPPUByte(clock: number, address: number): number;
    setPPUByte(clock: number, address: number, data: number): void;
    setup6BankStarts(reg6: number, reg8: number, regA: number, regC: number, regE: number): void;
    setupBankStarts(reg8: number, regA: number, regC: number, regE: number): void;
    setupBanks4k(start: number, banks: number[]): void;
    maskBankAddress(bank: number): number;
    mirror(clockNum: number, mirroring: number): void;
    copyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void;
    copyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void;
    copyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void;
    copyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void;
    initializeCart(hardReset?: boolean): void;
    updateScanlineCounter(): void;
}
export declare class UnsupportedCart extends BaseCart {
    supported: boolean;
    initializeCart(): void;
}
