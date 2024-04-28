
import { AudioSettings, RunningStatuses, DebugStepTypes } from "../ChiChiTypes";
import { MemoryPatch } from "../ChiChiCheats";

export const CMD_CREATE = 'create'; 
export const CMD_LOADROM = 'loadrom'; 
export const CMD_CHEAT = 'cheats'; 
export const CMD_AUDIOSETTINGS = 'audioSettings'; 
export const CMD_RUNSTATUS = 'runstatus'; 
export const CMD_RESET = 'reset'; 
export const CMD_DEBUGSTEP = 'debugstep'; 

let lastId = 0;

export interface IWorkerMessage {
    command: string;
    messageId: number;
}

export class WorkerMessage implements IWorkerMessage {
    constructor() {
        this.messageId = Date.now();
    }
    command: string = 'null';
    messageId: number;
    execute() {}
}

export class CreateCommand extends WorkerMessage {
    readonly command: string = CMD_CREATE;
    constructor(public vbuffer: Uint8Array, 
        public abuffer: Float32Array, 
        public audioSettings: AudioSettings, 
        public iops: Int32Array ) {
            super();

    }
}

export class LoadRomCommand extends WorkerMessage {
    readonly command: string = CMD_LOADROM;
    constructor(
        public  rom: ArrayBuffer,
        public name: string
    ) {
        super();
    }
}

export class RunStatusCommand extends WorkerMessage {
    readonly command: string = CMD_RUNSTATUS;
    constructor(public status: RunningStatuses) {
        super();
    }
}

export class ResetCommand extends WorkerMessage {
    readonly command: string = CMD_RESET;
    constructor() {
        super();
    }
}

export class DebugCommand extends WorkerMessage {
    readonly command: string = CMD_DEBUGSTEP;
    constructor(public stepType: DebugStepTypes) {
        super();
    }
}

export class CheatCommand extends WorkerMessage {
    readonly command: string = CMD_CHEAT;
    constructor(
        public cheats: Array<MemoryPatch>
   ) {
        super();
    }
}

export class AudioCommand extends WorkerMessage {
    readonly command: string = CMD_AUDIOSETTINGS;
    constructor(public audioSettings: AudioSettings) {
        super();
    }
}

export class WorkerResponse {
    constructor(msg: WorkerMessage, public success: boolean, public error?: string) {
        this.messageId = msg.messageId;
    }
    messageId: number;
    
}