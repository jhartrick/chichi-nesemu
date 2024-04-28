export declare class BufferMaker {
    static MakeUint32Array(count: number): Uint32Array;
    static MakeUint8Array(count: number): Uint8Array;
}
export declare enum RunningStatuses {
    Unloaded = 0,
    Off = 1,
    Running = 2,
    Frozen = 3,
    Paused = 4
}
export declare enum DebugStepTypes {
    Instruction = 0,
    Frame = 1
}
export declare enum ChiChiCPPU_AddressingModes {
    Bullshit = 0,
    Implicit = 1,
    Accumulator = 2,
    Immediate = 3,
    ZeroPage = 4,
    ZeroPageX = 5,
    ZeroPageY = 6,
    Relative = 7,
    Absolute = 8,
    AbsoluteX = 9,
    AbsoluteY = 10,
    Indirect = 11,
    IndexedIndirect = 12,
    IndirectIndexed = 13,
    IndirectZeroPage = 14,
    IndirectAbsoluteX = 15
}
export declare class CpuStatus {
    PC: number;
    A: number;
    X: number;
    Y: number;
    SP: number;
    SR: number;
}
export declare class PpuStatus {
    status: number;
    controlByte0: number;
    controlByte1: number;
    nameTableStart: number;
    currentTile: number;
    lockedVScroll: number;
    lockedHScroll: number;
    X: number;
    Y: number;
}
export declare class ChiChiInstruction {
    AddressingMode: number;
    frame: number;
    time: number;
    A: number;
    X: number;
    Y: number;
    SR: number;
    SP: number;
    Address: number;
    OpCode: number;
    Parameters0: number;
    Parameters1: number;
    ExtraTiming: number;
    Length: number;
}
export declare class ChiChiSprite {
    YPosition: number;
    XPosition: number;
    SpriteNumber: number;
    Foreground: boolean;
    IsVisible: boolean;
    TileIndex: number;
    AttributeByte: number;
    FlipX: boolean;
    FlipY: boolean;
    Changed: boolean;
}
export interface AudioSettings {
    sampleRate: number;
    master_volume: number;
    enableSquare0: boolean;
    enableSquare1: boolean;
    enableTriangle: boolean;
    enableNoise: boolean;
    enableDMC: boolean;
    synced: boolean;
}
