export interface NesFile {
    magicNumber: Uint8Array;
    romCountArray: Uint8Array;
    mapperBytes: Uint8Array;
    ramCountArray: Uint8Array;
    prgRom: Uint8Array;
    chrRom: Uint8Array;
    mapperId: number;
    submapperId: number;
    prgRomCount: number;
    prgRomLength: number;
    chrRomCount: number;
    chrRomLength: number;
    prgRamBanks: number;
    prgRamBanksBatteryBacked: number;
    chrRamBanks: number;
    chrRamBanksBatteryBacked: number;
    isPC10: boolean;
    isVS: boolean;
    usesSRAM: boolean;
    batterySRAM: boolean;
    mirroring: number;
    fourScreen: boolean;
    romCRC: string;
}
export declare const decodeFile: (buffer: ArrayBuffer) => NesFile;
