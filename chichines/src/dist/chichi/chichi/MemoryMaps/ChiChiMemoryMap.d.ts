import { ChiChiCPPU } from "../ChiChiCPU";
import { ChiChiPPU } from "../ChiChiPPU";
import { ChiChiAPU } from "../ChiChiAudio";
import { BaseCart } from "../../chichicarts/BaseCart";
import { ChiChiControlPad } from "../ChiChiControl";
import { StateBuffer } from "../StateBuffer";
export interface MemoryMappable {
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
}
export interface MemoryMap {
    ppu: ChiChiPPU;
    apu: ChiChiAPU;
    pad1: ChiChiControlPad;
    pad2: ChiChiControlPad;
    cpu: ChiChiCPPU;
    cart: BaseCart;
    Rams: Uint8Array;
    irqRaised(): boolean;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
    getPPUByte(clock: number, address: number): number;
    setPPUByte(clock: number, address: number, data: number): void;
    advanceClock(value: number): void;
    advanceScanline(value: number): void;
    setupStateBuffer(sb: StateBuffer): void;
}
export declare const setupMemoryMap: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => MemoryMap;
