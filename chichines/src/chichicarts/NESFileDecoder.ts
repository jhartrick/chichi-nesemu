import * as crc from 'crc';

export interface NesFile {
    // rom: Uint8Array;
    magicNumber: Uint8Array;
    romCountArray: Uint8Array;
    mapperBytes: Uint8Array;
    ramCountArray: Uint8Array;
    prgRom: Uint8Array;
    chrRom: Uint8Array;
    // romCRC: string;
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


export const decodeFile = (buffer: ArrayBuffer): NesFile => {
    if (!buffer || buffer.byteLength < 16) {
        throw new Error("invalid NES file");
    }


    const rom = new Uint8Array(buffer, 16);
    const mapperBytes = new Uint8Array(buffer, 6, 3);
    const romCountArray = new Uint8Array(buffer, 4, 2);   
    const ramCountArray = new Uint8Array(buffer, 10, 2);

    const prgRomCount = romCountArray[0];
    const prgRomLength = prgRomCount * 0x4000;
    const chrRomCount = romCountArray[1];
    const chrRomLength = chrRomCount * 0x2000;

    const mirroring = (function () {
            if ((mapperBytes[0] & 8) === 8) {
                return 3;
            }

            if ((mapperBytes[0] & 1) === 1) {
                return 1;
            } else {
                return 2;
            }
    })();

    const mapperId = (function() { 
        const maps = mapperBytes;
        let id = (maps[0] & 240);
        id = id >> 4;
        id = id | (maps[1] & 0xf0);
        id |= (maps[2] & 0xF) << 8;
        return id;
    })();
    
    return {
        magicNumber: new Uint8Array(buffer,0, 3),
        // [78, 69, 83]
        romCountArray,
        mapperBytes,

        ramCountArray,
        prgRom: new Uint8Array(buffer, 16, prgRomLength),
        chrRom: new Uint8Array(buffer, 16 + prgRomLength, chrRomLength),
        
        mapperId,
        submapperId: mapperBytes[2] >> 4,
        prgRomCount,
        prgRomLength,
    
        chrRomCount,
        chrRomLength,
        prgRamBanks: ramCountArray[0] & 0xf,
        prgRamBanksBatteryBacked: (ramCountArray[0] >> 4) & 0xf,
        chrRamBanks: ramCountArray[1] & 0xf,
        
        chrRamBanksBatteryBacked: (ramCountArray[1] >> 4) & 0xf,
        isPC10: (mapperBytes[1] & 0x2) == 0x02,
        isVS: (mapperBytes[1] & 0x1) == 0x01,
        usesSRAM: (mapperBytes[0] & 2) === 2,
        
        batterySRAM: (mapperBytes[0] & 2) === 2,
        mirroring,
        fourScreen: (mapperBytes[0] & 8) === 8,
        romCRC: crc.crc32(new Buffer(rom)).toString(16).toUpperCase()

    }
}