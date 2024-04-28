// utility classes

export class BufferMaker {
    static MakeUint32Array(count: number) : Uint32Array {
        return new Uint32Array(count);
    }

    static MakeUint8Array(count: number) : Uint8Array {
        return new Uint8Array(count);
    }
}

export enum RunningStatuses {
    Unloaded = 0,
    Off = 1,
    Running = 2,
    Frozen = 3,
    Paused = 4,

}

export enum DebugStepTypes {
    Instruction,
    Frame,
}

export enum ChiChiCPPU_AddressingModes {
    Bullshit,
    Implicit,
    Accumulator,
    Immediate,
    ZeroPage,
    ZeroPageX,
    ZeroPageY,
    Relative,
    Absolute,
    AbsoluteX,
    AbsoluteY,
    Indirect,
    IndexedIndirect,
    IndirectIndexed,
    IndirectZeroPage,
    IndirectAbsoluteX
}

export class CpuStatus {
    PC = 0;
    A = 0;
    X = 0;
    Y = 0;
    SP = 0;
    SR = 0;
}

export class PpuStatus {
    status = 0;
    controlByte0 = 0;
    controlByte1 = 0;
    nameTableStart = 0;
    currentTile = 0;
    lockedVScroll = 0;
    lockedHScroll = 0;
    X = 0;
    Y = 0;
}

export class ChiChiInstruction {
    AddressingMode: number = 0;
    frame: number = 0;
    time: number = 0;
    A: number = 0;
    X: number = 0;
    Y: number = 0;
    SR: number = 0;
    SP: number = 0;
    Address: number = 0;
    OpCode: number = 0;
    Parameters0: number = 0;
    Parameters1: number = 0;
    ExtraTiming: number = 0;
    Length: number = 0;
}

export class ChiChiSprite {
    YPosition: number = 0;
    XPosition: number = 0;
    SpriteNumber: number = 0;
    Foreground: boolean = false;
    IsVisible: boolean = false;
    TileIndex: number = 0;
    AttributeByte: number = 0;
    FlipX: boolean = false;
    FlipY: boolean = false;
    Changed: boolean = false;
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


