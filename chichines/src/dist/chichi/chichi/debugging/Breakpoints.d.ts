export declare enum BreakpointTypes {
    onNmi = 0,
    onIrq = 1,
    onPeek = 2,
    onPoke = 3
}
export declare class Breakpoint {
    type: BreakpointTypes;
    address: number;
}
export declare class ChiChiBreakpoints {
    breakPoints: Breakpoint[];
}
