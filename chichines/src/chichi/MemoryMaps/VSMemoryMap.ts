import { ChiChiCPPU } from "../ChiChiCPU";
import { ChiChiPPU } from "../ChiChiPPU";
import { ChiChiAPU } from "../ChiChiAudio";
import { ChiChiControlPad } from "../ChiChiControl";
import { BaseCart } from "../chichi";
import { MemoryMap } from "./ChiChiMemoryMap";
import { StateBuffer } from "../StateBuffer";

export const getByte = (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => {
    return (clock: number, address: number): number => {
        let result: number = 0;
        // check high byte, find appropriate handler
        switch (address & 0xF000) {
            case 0:
            case 0x1000:
                if (address < 2048) {
                    result = Rams[address];
                } else {
                    result = address >> 8;
                }
                break;
            case 0x2000:
            case 0x3000:
                result = ppu.getByte(clock, address);
                break;
            case 0x4000:
                switch (address) {
                    case 0x4015:
                        result = apu.GetByte(clock, address);
                        break;
                    case 0x4016:
                        result = pad2.getByte(clock, address) & 1;
                        result |= cart.getByte(clock, address) & 0xfe;
                        break;
                    case 0x4017:
                        result = pad1.getByte(clock, address) & 1;
                        result |= cart.getByte(clock, address) & 0xfe;
                        break;
                }
                if (address >= 0x4020 && address <= 0x5fff) {
                    result = cart.getByte(clock, address) & 0xfe;
                }
                break;
            case 0x5000:
                // ??
                result = address >> 8;
                break;
            case 0x6000:
            case 0x7000:
            case 0x8000:
            case 0x9000:
            case 0xa000:
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
            case 0xf000:
                // cart 
                result = cart.getByte(clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }

        return result & 255;
    }
}

export const setByte = (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => (cart: BaseCart) => {

    return (clock: number, address: number, data: number): void => {
        // check high byte, find appropriate handler
        if (address < 2048) {
            Rams[address & 2047] = data;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 4096:
                // nes sram
                Rams[address & 2047] = data;
                break;
            case 20480:
                cart.setByte(clock, address, data);
                break;
            case 24576:
            case 28672:
            case 32768:
            case 36864:
            case 40960:
            case 45056:
            case 49152:
            case 53248:
            case 57344:
            case 61440:
                // cart rom banks
                cart.setByte(clock, address, data);
                break;
            case 8192:
            case 12288:
                ppu.setByte(clock, address, data);
                break;
            case 16384:
                switch (address) {
                    case 16384:
                    case 16385:
                    case 16386:
                    case 16387:
                    case 16388:
                    case 16389:
                    case 16390:
                    case 16391:
                    case 16392:
                    case 16393:
                    case 16394:
                    case 16395:
                    case 16396:
                    case 16397:
                    case 16398:
                    case 16399:
                    case 16405:
                    case 16407:
                        apu.SetByte(clock, address, data);
                        break;
                    case 16404:
                        ppu.copySprites(data * 256);
                        cpu._currentInstruction_ExtraTiming = cpu._currentInstruction_ExtraTiming + 513;
                        if (clock & 1) {
                            cpu._currentInstruction_ExtraTiming++;
                        }
                        break;
                    case 16406:
                        pad1.setByte(clock, address, data & 1);
                        pad2.setByte(clock, address, data & 1);
                        break;
                    default:
                        if (cart.mapsBelow6000)
                            cart.setByte(clock, address, data);
                }
                break;
        }
    }

}


const vsMap = {
    getByte: getByte,
    setByte: setByte
}

export const setupVSMemoryMap =  (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (pad1: ChiChiControlPad) => (pad2: ChiChiControlPad) => {
    let Rams = new Uint8Array(new ArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));

    const clocked: Array<any> = [ppu,apu];

    const setupStateBuffer = (sb: StateBuffer) => {
        sb.onRestore.subscribe((buffer: StateBuffer) => {
            Rams = buffer.getUint8Array('rams');
        })

        sb.pushSegment(8192 * Uint8Array.BYTES_PER_ELEMENT, 'rams');
        return sb;
    }

    return (cart: BaseCart): MemoryMap => {
        clocked.push(cart);
        
        const cpuBus = {
            getByte: getByte(cpu)(ppu)(apu)(Rams)(pad1)(pad2),
            setByte: setByte(cpu)(ppu)(apu)(Rams)(pad1)(pad2)
        };
        
        const result: MemoryMap = {
            ppu: ppu,
            apu: apu,
            pad1: pad1,
            pad2: pad2,
            cpu: cpu,
            Rams: Rams,
            cart: cart,
            setupStateBuffer: setupStateBuffer,
            getByte : cpuBus.getByte(cart),
            setByte : cpuBus.setByte(cart),
            getPPUByte : (clock: number, address: number) => cart.getPPUByte(clock, address),
            setPPUByte : (clock: number, address: number, data: number) => cart.setPPUByte(clock, address, data),
            irqRaised: () => cart.irqRaised || apu.interruptRaised,
            advanceClock: (ticks: number) => clocked.forEach(p => p.advanceClock(ticks)),
            advanceScanline: (ticks: number) =>  {  
                                                        while (ticks-- >= 0) {
                                                        cart.updateScanlineCounter();
                                                    }
                                                },
            
        }
        cpu.memoryMap = apu.memoryMap = ppu.memoryMap = result;
        return result;

    }
}


