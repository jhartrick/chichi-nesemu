import { StateBuffer } from "../StateBuffer";
    
const NES_BYTES_WRITTEN = 0;
const WAVSHARER_BLOCKTHREAD = 1;
const WAVSHARER_BUFFERPOS = 2;

const time_unit = 2097152;
const buf_extra = 18;
const phase_count = 32;
const time_bits = 21;
const delta_bits = 15;
//sinc values
const bl_step = [
    [43, -115, 350, -488, 1136, -914, 5861, 21022],
    [44, -118, 348, -473, 1076, -799, 5274, 21001], 
    [45, -121, 344, -454, 1011, -677, 4706, 20936], 
    [46, -122, 336, -431, 942, -549, 4156, 20829], 
    [47, -123, 327, -404, 868, -418, 3629, 20679], 
    [47, -122, 316, -375, 792, -285, 3124, 20488], 
    [47, -120, 303, -344, 714, -151, 2644, 20256], 
    [46, -117, 289, -310, 634, -17, 2188, 19985], 
    [46, -114, 273, -275, 553, 117, 1758, 19675], 
    [ 44, -108, 255, -237, 471, 247, 1356, 19327], 
    [ 43, -103, 237, -199, 390, 373, 981, 18944], 
    [ 42, -98, 218, -160, 310, 495, 633, 18527], 
    [ 40, -91, 198, -121, 231, 611, 314, 18078], 
    [ 38, -84, 178, -81, 153, 722, 22, 17599], 
    [ 36, -76, 157, -43, 80, 824, -241, 17092], 
    [ 34, -68, 135, -3, 8, 919, -476, 16558], 
    [ 32, -61, 115, 34, -60, 1006, -683, 16001], 
    [ 29, -52, 94, 70, -123, 1083, -862, 15422], 
    [ 27, -44, 73, 106, -184, 1152, -1015, 14824], 
    [ 25, -36, 53, 139, -239, 1211, -1142, 14210], 
    [ 22, -27, 34, 170, -290, 1261, -1244, 13582], 
    [ 20, -20, 16, 199, -335, 1301, -1322, 12942], 
    [ 18, -12, -3, 226, -375, 1331, -1376, 12293], 
    [ 15, -4, -19, 250, -410, 1351, -1408, 11638], 
    [ 13, 3, -35, 272, -439, 1361, -1419, 10979], 
    [ 11, 9, -49, 292, -464, 1362, -1410, 10319], 
    [ 9, 16, -63, 309, -483, 1354, -1383, 9660], 
    [ 7, 22, -75, 322, -496, 1337, -1339, 9005], 
    [ 6, 26, -85, 333, -504, 1312, -1280, 8355], 
    [ 4, 31, -94, 341, -507, 1278, -1205, 7713], 
    [ 3, 35, -102, 347, -506, 1238, -1119, 7082], 
    [ 1, 40, -110, 350, -499, 1190, -1021, 6464], 
    [ 0, 43, -115, 350, -488, 1136, -914, 5861], 
];



// shared buffer to get sound out
export class WavSharer  {
    neswait = false;
    synced = true;

    controlBuffer = new Int32Array(<any>new ArrayBuffer(3 * Int32Array.BYTES_PER_ELEMENT));
    sharedAudioBufferPos: number = 0;

    get bufferPosition(): number {
        return this.controlBuffer[WAVSHARER_BUFFERPOS]; 
    }

    bufferWasRead: boolean;
    static sample_size = 1;

    SharedBuffer: Float32Array;
    SharedBufferLength: number = 8192;
    chunkSize: number = 1024;

    constructor() {

        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }

    get audioBytesWritten(): number {
        return this.controlBuffer[NES_BYTES_WRITTEN];
    }
    
    set audioBytesWritten(value:number) {
        this.controlBuffer[NES_BYTES_WRITTEN] = value;
    }

    wakeSleepers() {
        // this.audioBytesWritten = 0;
        this.neswait = false;
        // <any>Atomics.wake(this.controlBuffer, this.NES_BYTES_WRITTEN, 99999);
    }

    synchronize(): void {
        if (this.synced) {
            if (this.audioBytesWritten >= this.chunkSize)
            {

                this.controlBuffer[WAVSHARER_BUFFERPOS] = this.sharedAudioBufferPos;
                this.neswait = true;
                // <any>Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
            }
        } else {
            this.audioBytesWritten = this.chunkSize;
        }
    }
}

export class ChiChiWavSharer extends WavSharer {
// blipper     

    constructor(sb: StateBuffer) {
		
        super()        
        sb.onRestore.subscribe((buffer)=> {
            this.SharedBuffer = buffer.getFloat32Array('abuffer');
		});
        this.blip_new(44100 / 5);
    }


    private blipBuffer: BlipBuffer;

    blip_new(size: number): void {
        this.blipBuffer = new BlipBuffer(size + buf_extra);
        this.blipBuffer.size = size;
        this.blipBuffer.factor = 0;
        this.blip_clear();
    }

    blip_set_rates(clock_rate: number, sample_rate: number): void {
        this.blipBuffer.factor = time_unit / clock_rate * sample_rate + (0.9999847412109375);
    }

    blip_clear(): void {
        this.blipBuffer.offset = 0;
        this.blipBuffer.avail = 0;
        this.blipBuffer.integrator = 0;
        // this.blipBuffer.samples.fill(0);
    }

    // blip_clocks_needed(samples: number): number {
    //     const needed = samples * ChiChiWavSharer.time_unit - this.blipBuffer.offset;
    //     return ((needed + this.blipBuffer.factor - 1) / this.blipBuffer.factor) | 0;
    // }

    blip_end_frame(t: number): void {
        let off = t * this.blipBuffer.factor + this.blipBuffer.offset;
        this.blipBuffer.avail += off >> time_bits;
        this.blipBuffer.offset = off & (time_unit - 1);
    }

    
    remove_samples(count: number): void {
        let remain = this.blipBuffer.avail + buf_extra - count;
        this.blipBuffer.avail -= count;
        this.blipBuffer.samples.copyWithin(0, count, count + remain);
        this.blipBuffer.samples.fill(0, remain, remain + count);
        this.blipBuffer.arrayLength = count;
    }

    // reads 'count' elements into array 'outbuf', beginning at 'start' and looping at array boundary if needed
    // returns number of elements written
    readElementsLoop(): number {
        let outbuf = this.SharedBuffer;
        let start = this.sharedAudioBufferPos;

        let count = this.blipBuffer.avail;
        let inPtr = 0, outPtr = start;
        let end = count;
        let sum = this.blipBuffer.integrator;

        const high = 1.0, low = -1.0;
        let factor = 1.0;
        let offset = low + 1.0 * factor;

        factor *= 1.0 / ( 1 << 15 ); // (1 /(samplerange/2))

        if (count !== 0) {
            do {
                let st = sum >> delta_bits; 
                sum = sum + this.blipBuffer.samples[inPtr];
                inPtr++;

                outPtr++;
                if (outPtr >= outbuf.length) {
                    outPtr=0;
                }

                outbuf[outPtr] = st * factor + offset;

                sum = sum - (st << (7));
            } while (end-- > 0);

            this.blipBuffer.integrator = sum;
            this.remove_samples(count);
        }
        this.sharedAudioBufferPos = outPtr;
        this.audioBytesWritten += count;
        this.synchronize();
        return count;
    }


    blip_add_delta(time: number, delta: number): void {
        if (delta === 0) {
            return;
        }
        const fixedTime = (time * this.blipBuffer.factor + this.blipBuffer.offset) | 0;

        const outPtr = (this.blipBuffer.avail + (fixedTime >> time_bits));

        const phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((ChiChiWavSharer.phase_count - 1))));
        const phase = (fixedTime >> phase_shift & (phase_count - 1)) >>> 0;

        const inStep = phase; // bl_step[phase];
        const rev = phase_count - phase; // bl_step[phase_count - phase];

        const interp_bits = 15;
        const interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        const delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;

        for (let i = 0; i < 8; ++i) {
            this.blipBuffer.samples[outPtr + i] += (bl_step[inStep][i] * delta) + (bl_step[inStep][i] * delta2);
            this.blipBuffer.samples[outPtr + (15 - i)] += (bl_step[rev][i] * delta) + (bl_step[rev - 1][i] * delta2);
        }

    }


}

//apu classes
class BlipBuffer  {
    constructor(public size: number) {
        
        this.samples = new Array<number>(size);
        this.samples.fill(0);
    }
    factor: number = 0;
    samples: Array<number>;
    offset = 0;
    avail = 0;
    integrator = 0;
    time_bits = 0;
    arrayLength = 0;
}

const getElements = (blipBuffer: BlipBuffer, buffer: Float32Array): number[] => {   
    const outbuf: number[] = [];
    const start = 0;

    const count = blipBuffer.avail;
    let inPtr = 0, outPtr = start;
    let end = count;
    let sum = blipBuffer.integrator;

    const high = 1.0, low = -1.0;
    let offset = low + 1.0;

    const factor = 1.0 / ( 1 << 15 ); // (1 /(samplerange/2))

    if (count !== 0) {
        do {
            const st = sum >> delta_bits; 
            sum = sum + blipBuffer.samples[inPtr];
            inPtr++;
            outbuf.push(st * factor + offset);

            sum = sum - (st << (7));
        } while (end-- > 0);

        blipBuffer.integrator = sum;
    }
    return outbuf;
}