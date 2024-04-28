import { BaseCart } from "./BaseCart";
export declare class Mapper112Cart extends BaseCart {
    registers: number[];
    latch: number;
    initializeCart(): void;
    updateBanks(): void;
    setByte(clock: number, address: number, data: number): void;
}
