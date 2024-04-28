import { BaseCart } from "./BaseCart";
export declare class Smb2jCart extends BaseCart {
    initializeCart(): void;
    irqEnabled: boolean;
    irqCounter: number;
    advanceClock(value: number): void;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
}
