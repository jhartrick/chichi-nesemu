import { ChiChiCPPU } from "../ChiChiCPU";
import { ChiChiPPU } from "../ChiChiPPU";
import { ChiChiAPU } from "../ChiChiAudio";
import { ChiChiControlPad } from "../ChiChiControl";
import { BaseCart } from "../chichi";
import { MemoryMap } from "./ChiChiMemoryMap";
export declare const getByte: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => (clock: number, address: number) => number;
export declare const setByte: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => (clock: number, address: number, data: number) => void;
export declare const setupVSMemoryMap: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => MemoryMap;
