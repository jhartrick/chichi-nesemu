import { BaseCart } from "./BaseCart";
export declare class Mapper031Cart extends BaseCart {
    mapsBelow6000: boolean;
    registers: number[];
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
}
