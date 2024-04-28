export enum BreakpointTypes {
    onNmi = 0,
    onIrq = 1,
    onPeek = 2,
    onPoke = 3
}

export class Breakpoint {
    type: BreakpointTypes = BreakpointTypes.onPeek;
    address: number = 0;
}

export class ChiChiBreakpoints {
    breakPoints: Breakpoint[] = new Array<Breakpoint>();
}