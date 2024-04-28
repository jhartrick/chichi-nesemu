import { BaseCart } from "./BaseCart";
export declare class KonamiVRC1Cart extends BaseCart {
    initializeCart(): void;
    chrLatches: number[];
    setByte(clock: number, address: number, data: number): void;
    syncChrBanks(clock: number): void;
}
