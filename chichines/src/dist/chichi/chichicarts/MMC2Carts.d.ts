import { BaseCart } from "./BaseCart";
export declare class MMC2Cart extends BaseCart {
    latches: number[];
    banks: number[];
    initializeCart(): void;
    getPPUByte(clock: number, address: number): number;
    setByte(clock: number, address: number, val: number): void;
}
export declare class MMC4Cart extends BaseCart {
    selector: number[];
    banks: number[];
    initializeCart(): void;
    getPPUByte(clock: number, address: number): number;
    setByte(clock: number, address: number, val: number): void;
}
