export interface GameGenieCode {
    code: string;
    description: string;
    active: boolean;
}
export interface MemoryPatch {
    address: number;
    data: number;
    compare: number;
    active: boolean;
}
declare function gameGenieCodeToPatch(code: string): MemoryPatch;
export declare const ChiChiCheats: {
    gameGenieCodeToPatch: typeof gameGenieCodeToPatch;
};
export {};
