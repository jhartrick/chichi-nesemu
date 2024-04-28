import { AudioSettings, RunningStatuses, DebugStepTypes } from "../ChiChiTypes";
import { MemoryPatch } from "../ChiChiCheats";
export declare const CMD_CREATE = "create";
export declare const CMD_LOADROM = "loadrom";
export declare const CMD_CHEAT = "cheats";
export declare const CMD_AUDIOSETTINGS = "audioSettings";
export declare const CMD_RUNSTATUS = "runstatus";
export declare const CMD_RESET = "reset";
export declare const CMD_DEBUGSTEP = "debugstep";
export interface IWorkerMessage {
    command: string;
    messageId: number;
}
export declare class WorkerMessage implements IWorkerMessage {
    constructor();
    command: string;
    messageId: number;
    execute(): void;
}
export declare class CreateCommand extends WorkerMessage {
    vbuffer: Uint8Array;
    abuffer: Float32Array;
    audioSettings: AudioSettings;
    iops: Int32Array;
    readonly command: string;
    constructor(vbuffer: Uint8Array, abuffer: Float32Array, audioSettings: AudioSettings, iops: Int32Array);
}
export declare class LoadRomCommand extends WorkerMessage {
    rom: ArrayBuffer;
    name: string;
    readonly command: string;
    constructor(rom: ArrayBuffer, name: string);
}
export declare class RunStatusCommand extends WorkerMessage {
    status: RunningStatuses;
    readonly command: string;
    constructor(status: RunningStatuses);
}
export declare class ResetCommand extends WorkerMessage {
    readonly command: string;
    constructor();
}
export declare class DebugCommand extends WorkerMessage {
    stepType: DebugStepTypes;
    readonly command: string;
    constructor(stepType: DebugStepTypes);
}
export declare class CheatCommand extends WorkerMessage {
    cheats: Array<MemoryPatch>;
    readonly command: string;
    constructor(cheats: Array<MemoryPatch>);
}
export declare class AudioCommand extends WorkerMessage {
    audioSettings: AudioSettings;
    readonly command: string;
    constructor(audioSettings: AudioSettings);
}
export declare class WorkerResponse {
    success: boolean;
    error?: string;
    constructor(msg: WorkerMessage, success: boolean, error?: string);
    messageId: number;
}
