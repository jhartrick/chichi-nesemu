export declare class ChiChiControlPad {
    currentByte: number;
    readNumber: number;
    getPadState: () => number;
    getByte: (clock: number, address: number) => number;
    setByte: (clock: number, address: number, data: number) => void;
}
