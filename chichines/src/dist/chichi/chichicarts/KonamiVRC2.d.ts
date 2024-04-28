import { BaseCart } from "./BaseCart";
export declare class VRCIrqBase extends BaseCart {
    irqLatch: number;
    prescaler: number;
    irqCounter: number;
    irqMode: boolean;
    irqEnableAfterAck: boolean;
    irqEnable: boolean;
    tickIrq(): void;
    tick(ticks: number): void;
    advanceClock(ticks: number): void;
    ackIrq(): void;
    set irqControl(val: number);
}
export declare class VRC2or4Cart extends VRCIrqBase {
    microwire: boolean;
    vrc2: boolean;
    swapMode: boolean;
    microwireLatch: number;
    latches: number[];
    regNums: number[];
    regMask: number;
    ramMask: number;
    vrc2mirroring: (clock: number, address: number, data: number) => void;
    vrc4mirroring: (clock: number, address: number, data: number) => void;
    vrcmirroring: (clock: number, address: number, data: number) => void;
    useMicrowire(): void;
    getByteMicrowire(clock: number, address: number): number;
    setByteVRC4(clock: number, address: number, data: number): void;
    setByteVRC2(clock: number, address: number, data: number): void;
    setByteVRC2a(clock: number, address: number, data: number): void;
}
export declare class KonamiVRC2Cart extends VRC2or4Cart {
    altRegNums(): void;
    initializeCart(): void;
}
export declare class KonamiVRC022Cart extends VRC2or4Cart {
    initializeCart(): void;
}
export declare class Konami021Cart extends VRC2or4Cart {
    initializeCart(): void;
}
export declare class Konami025Cart extends VRC2or4Cart {
    initializeCart(): void;
}
