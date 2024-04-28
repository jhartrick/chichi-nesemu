import { Subject } from 'rxjs/Subject';
export type Bufferable = Uint8Array | Uint8ClampedArray | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare const bufferType = "ArrayBuffer";
export type ChiChiBuffer = ArrayBuffer;
export interface StateBufferConfig {
    buffer: ArrayBuffer;
    segments: Array<BufferSegment>;
}
export interface BufferSegment {
    name: string;
    start: number;
    size: number;
    source?: Bufferable;
}
export declare class StateBuffer {
    data: StateBufferConfig;
    bufferSize: number;
    onRestore: Subject<StateBuffer>;
    onUpdateBuffer: Subject<StateBuffer>;
    pushArray(b: Bufferable, name: string): this;
    pushSegment(size: number, name: string): StateBuffer;
    build(): this;
    updateBuffer(): void;
    getSegment(name: string): any;
    getUint8Array(name: string): Uint8Array;
    getUint16Array(name: string): Uint16Array;
    getUint32Array(name: string): Uint32Array;
    getFloat32Array(name: string): Float32Array;
    syncBuffer(config: StateBufferConfig): void;
    clone(): StateBuffer;
}
