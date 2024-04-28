import { BaseCart } from "./BaseCart";
export declare class Mapper132Cart extends BaseCart {
    registers: number[];
    initializeCart(): void;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
}
