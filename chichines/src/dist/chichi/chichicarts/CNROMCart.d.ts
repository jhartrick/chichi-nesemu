import { BaseCart } from "./BaseCart";
export declare class CNROMCart extends BaseCart {
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
}
