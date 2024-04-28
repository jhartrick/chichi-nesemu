import { VRCIrqBase } from "./KonamiVRC2";
export declare class Konami026Cart extends VRCIrqBase {
    runCounter: boolean;
    chrselect: number;
    chrA10Mode: boolean;
    nameTableSource: boolean;
    mirrorMode: number;
    bankMode: number;
    prgRamEnable: boolean;
    swapMode: boolean;
    microwireLatch: number;
    vrc6Registers: number[];
    updateChrBanks(clock: number): void;
    initializeCart(): void;
    setByte(clock: number, address: number, data: number): void;
}
