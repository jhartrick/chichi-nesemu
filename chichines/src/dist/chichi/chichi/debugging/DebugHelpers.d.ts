import { ChiChiInstruction } from '../ChiChiTypes';
export declare class DebugHelpers {
    static disassemble(inst: ChiChiInstruction): string;
    static getMnemnonic(opcode: number): string;
}
