import { BaseCart } from "./BaseCart";
export declare class MMC1Cart extends BaseCart {
    chrRomBankMode: number;
    prgRomBankMode: number;
    lastClock: number;
    sequence: number;
    accumulator: number;
    bank_select: number;
    _registers: number[];
    lastwriteAddress: number;
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
    setMMC1ChrBanking(clock: number): void;
    setMMC1PrgBanking(): void;
    setMMC1Mirroring(clock: number): void;
}
