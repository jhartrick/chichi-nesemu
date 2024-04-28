import { BaseCart } from "./BaseCart";
export declare class Mapper051Cart extends BaseCart {
    bank: number;
    mode: number;
    initializeCart(): void;
    updateBanks(): any;
    setByte(clock: number, address: number, val: number): void;
}
export declare class Mapper058Cart extends BaseCart {
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
}
export declare class Mapper202Cart extends BaseCart {
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
}
export declare class Mapper212Cart extends BaseCart {
    initializeCart(): void;
    setByte(clock: number, address: number, val: number): void;
}
