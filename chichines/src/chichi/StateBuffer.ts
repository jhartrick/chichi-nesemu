import { Subject } from 'rxjs/Subject';

export type Bufferable = Uint8Array | Uint8ClampedArray | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

export const bufferType =  "ArrayBuffer";

export type ChiChiBuffer =ArrayBuffer;

export interface StateBufferConfig {
    buffer: ArrayBuffer,
    segments: Array<BufferSegment>;
}

export interface BufferSegment {
    name: string;
    start: number;
    size: number;
    source?: Bufferable;
}

export class StateBuffer {
    data: StateBufferConfig = {
        buffer: undefined,
        segments: new Array<BufferSegment>()
    };

    bufferSize: number = 0;

    onRestore = new Subject<StateBuffer>();

    // thrown when writing clients should update the buffer
    onUpdateBuffer = new Subject<StateBuffer>();
    
    pushArray(b: Bufferable, name: string) {
        this.pushSegment(b.length * b.BYTES_PER_ELEMENT, name);
        // if (b instanceof Uint8Array) {
        //     const x = <Uint8Array>b;
        // }
        return this;
    }

    // pre-allocates a segment of <size> bytes in the StateBuffer, returns StateBuffer
    pushSegment(size: number, name: string): StateBuffer {
        const seg = this.data.segments.findIndex((v,i) => v.name == name);
        if (seg === -1) {
            const start = this.bufferSize;
            this.data.segments.push({name, start, size});
            this.bufferSize += size;
        }
        return this;
    }

    // builds a new state buffer
    build() {
        this.data.buffer = new ArrayBuffer(this.bufferSize);
        this.onRestore.next(this);
        return this;
    }

    // request buffer updates
    updateBuffer() {
        this.onUpdateBuffer.next(this);
    }

    // helper functions to retrieve data from buffer
    getSegment(name: string): any {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return { buffer: this.data.buffer, start: x.start, size: x.size }
    }


    getUint8Array(name: string): Uint8Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Uint8Array(this.data.buffer, x.start, x.size);
    }

    getUint16Array(name: string): Uint16Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Uint16Array(this.data.buffer, x.start, x.size / Uint16Array.BYTES_PER_ELEMENT );
    }

    getUint32Array(name: string): Uint32Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Uint32Array(this.data.buffer, x.start, x.size / Uint32Array.BYTES_PER_ELEMENT );
    }

    getFloat32Array(name: string): Float32Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Float32Array(this.data.buffer, x.start, x.size / Float32Array.BYTES_PER_ELEMENT );
    }

    syncBuffer(config: StateBufferConfig) {
        this.data = config;

        this.onRestore.next(this);
    }

    clone() {
        const result = new StateBuffer();
        result.syncBuffer({
            segments: Array.from(this.data.segments),
            buffer: this.data.buffer.slice(0)
        });
        result.bufferSize = this.bufferSize;
        return result;
    }

} 