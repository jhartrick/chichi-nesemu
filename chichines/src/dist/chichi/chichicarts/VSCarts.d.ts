import { BaseCart } from "./BaseCart";
export declare class VSCart extends BaseCart {
    coin: number;
    dips1: number;
    dips2: number;
    customPalette: number[];
    reg16: number;
    bankSelect: number;
    initializeCart(): void;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, val: number): void;
    clocks: number;
}
