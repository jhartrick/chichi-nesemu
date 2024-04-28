import { BaseCart } from "./BaseCart";
export declare class BNROMCart extends BaseCart {
    isNina: boolean;
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
    SetByteNina(clock: number, address: number, val: number): void;
}
