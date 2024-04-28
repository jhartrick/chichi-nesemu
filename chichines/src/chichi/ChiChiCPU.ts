import { ChiChiCPPU_AddressingModes, ChiChiInstruction, CpuStatus } from "./ChiChiTypes";
import { ChiChiPPU } from "./ChiChiPPU";
import { ChiChiAPU } from "./ChiChiAudio";
import { BaseCart } from '../chichicarts/BaseCart'
import { MemoryPatch, GameGenieCode } from "./ChiChiCheats";
import { MemoryMap } from "./MemoryMaps/ChiChiMemoryMap";
import { StateBuffer } from "./StateBuffer";

const PRG_CTR = 0;
const PRG_ADR = 1;

const SRMasks_CarryMask = 0x01;
const SRMasks_ZeroResultMask = 0x02;
const SRMasks_InterruptDisableMask = 0x04;
const SRMasks_DecimalModeMask = 0x08;
const SRMasks_BreakCommandMask = 0x10;
const SRMasks_ExpansionMask = 0x20;
const SRMasks_OverflowMask = 0x40;
const SRMasks_NegativeResultMask = 0x80;

const cpuTiming: number[] = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
const addressModes: number[] = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    
//chichipig
export class ChiChiCPPU {
        
    //timing
    clock = 0;
    
    private advanceClock(value: number) {
        if (value) {
            this.memoryMap.advanceClock(value);
            this.clock += value;
        }
    }

    borrowedCycles = 0;

    // CPU Status
    cpuStatus16: Uint16Array = new Uint16Array(2);

    programCounter = 0;
    addressBus = 0;
    
    handleNMI: boolean = false;
    // CPU Op info
    
    cpuStatus: Uint8Array = new Uint8Array(8);
    
    // system ram
    
    stackPointer = 255;
    statusRegister = 0;
    accumulator = 0;
    indexRegisterX = 0;
    indexRegisterY = 0;
    dataBus = 0;
    _operationCounter = 0;

    // Current Instruction
    _currentInstruction_AddressingMode = ChiChiCPPU_AddressingModes.Bullshit;
    _currentInstruction_Address = 0;
    _currentInstruction_OpCode = 0;
    _currentInstruction_Parameters0 = 0;
    _currentInstruction_Parameters1 = 0;
    _currentInstruction_ExtraTiming = 0;

    systemClock = 0;


    // debug helpers
    private instructionUsage = new Uint32Array(256);//System.Array.init(256, 0, System.Int32);
    private debugging = false;

    // #region Cheats
    cheating = false;
    
    genieCodes: MemoryPatch[] = new Array<MemoryPatch>();

    cheat(address: number, result: number) : number {
        let patch = this.genieCodes.find((v)=>{ return v.address == address; });
        if (!patch) return result;
        if (patch.data > 0xFF) {
            // its a comparison
            const compare = patch.data  >> 8;
            if (compare == result)
            {
                result = patch.data & 0xFF;
            }
        } else {
            result = patch.data;
        }
        
        return result;
    }

// #endregion cheats

    instructionHistoryPointer = 255;
    _instructionHistory = new Array<ChiChiInstruction>(256);//System.Array.init(256, null, ChiChiInstruction);
    
    public get InstructionHistory(): Array<any> {
        return this._instructionHistory;
    }

    public get InstructionHistoryPointer(): number {
        return this.instructionHistoryPointer;
    }

    ppu: ChiChiPPU;
    SoundBopper: ChiChiAPU;

    Cart: BaseCart;

    constructor(bopper: ChiChiAPU, ppu: ChiChiPPU) {
        this.SoundBopper = bopper;

        // init PPU
        this.ppu = ppu;

        for (let i = 0; i < this._instructionHistory.length; ++i) {
            this._instructionHistory[i] = new ChiChiInstruction();
        }

    }

    memoryMap: MemoryMap;

    get Clock(): number {
        return this.clock;
    }

    set Clock(value: number) {
        this.advanceClock(value);
        this.clock = value;
    }

    setFlag(Flag: number, value: boolean): void {
        this.statusRegister = (value ? (this.statusRegister | Flag) : (this.statusRegister & ~Flag));

        this.statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    }

    GetFlag(flag: number): boolean {
        return ((this.statusRegister & flag) === flag);
    }

    interruptRequest(): void {
        if (!this.GetFlag(SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(SRMasks_InterruptDisableMask, true);
            
            const newStatusReg1 = this.statusRegister & ~0x10 | 0x20;

            this.pushStack(this.programCounter >> 8);
            this.pushStack(this.programCounter);
            this.pushStack(this.statusRegister);

            this.programCounter = this.getByte(0xFFFE) + (this.getByte(0xFFFF) << 8);
        }

    }

    nonMaskableInterrupt(): void {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        const newStatusReg = this.statusRegister & ~0x10 | 0x20;

        this.setFlag(SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this.programCounter >> 8);
        this.pushStack(this.programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        const lowByte = this.getByte(0xFFFA);
        const highByte = this.getByte(0xFFFB);
        const jumpTo = lowByte | (highByte << 8);
        this.programCounter = jumpTo;
            //nonOpCodeticks = 7;
    }


    step(): void {

        this._currentInstruction_ExtraTiming = 0;

        if (this.handleNMI) {
            this.advanceClock(7);
            this.handleNMI = false;
            this.nonMaskableInterrupt();
        } else if (this.memoryMap.irqRaised()) {
            this.interruptRequest();
        }

        //FetchNextInstruction();
        this._currentInstruction_Address = this.programCounter;
        this._currentInstruction_OpCode = this.getByte(this.programCounter );
        this.programCounter = (this.programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = addressModes[this._currentInstruction_OpCode];
        
        this.fetchInstructionParameters();
        
        this.execute();

        this.advanceClock(cpuTiming[this._currentInstruction_OpCode]);
        this.advanceClock(this._currentInstruction_ExtraTiming);

        if (this.borrowedCycles) {
            this.advanceClock(this.borrowedCycles);
            this.borrowedCycles = 0;
        }

        // if (this.debugging) {
        //     this.writeInstructionHistory();
        //     this._operationCounter++;
        // }
    }

    fetchInstructionParameters(): any {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.getByte((this.programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.getByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiCPPU_AddressingModes.Relative:
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.getByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new Error("Invalid address mode!!");
                break;
        }
        
    }

    ResetCPU(): void {
        this.statusRegister = 52;
        this._operationCounter = 0;
        this.stackPointer = 253;
        this.programCounter = this.getByte(0xFFFC) | (this.getByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    }

    PowerOn(): void {
        // powers up with this state
        this.statusRegister = 52;
        this.stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);


        this.programCounter =  this.getByte(0xFFFC) | (this.getByte(0xFFFD) << 8);
    }

    decodeAddress(): number {
        this._currentInstruction_ExtraTiming = 0;
        let result = 0;
        let lowByte = 0;
        let highByte = 0;

        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
                // two parameters refer to the memory position
                result = ((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0);
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteX:
                // absolute, x indexed - two paramaters + Index register x
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterX) | 0));
                if ((result & 0xFF) < this.indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterY) | 0));
                if ((result & 0xFF) < this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this.indexRegisterY & 0xFF)) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.Indirect:
                lowByte = this._currentInstruction_Parameters0;
                highByte = this._currentInstruction_Parameters1 << 8;
                let indAddr = (highByte | lowByte) & 65535;
                let indirectAddr = (this.getByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.getByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                lowByte = this.getByte(addr);
                addr = (addr + 1) | 0;
                highByte = this.getByte(addr & 0xFF);
                highByte = highByte << 8;
                result = highByte | lowByte;
                break;
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
                lowByte = this.getByte(this._currentInstruction_Parameters0);
                highByte = this.getByte((((this._currentInstruction_Parameters0 + 1) | 0)) & 0xFF) << 8;
                addr = (lowByte | highByte);
                result = (addr + this.indexRegisterY) | 0;
                if ((result & 0xFF) > this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.Relative:
                result = (((this.programCounter + this._currentInstruction_Parameters0) | 0));
                break;
            default:
                this.handleBadOperation();
                break;
        }
        return result & 65535;
    }

    handleBadOperation(): void {
        
        //throw new Error('Method not implemented.');
    }

    handleBreakpoint(): void {
        
    }

    decodeOperand(): number {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Immediate:
                this.dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiCPPU_AddressingModes.Accumulator:
                return this.accumulator;
            default:
                this.dataBus = this.getByte(this.decodeAddress());
                return this.dataBus;
        }
    }

    execute(): void {
        let data = 0;
        let lowByte = 0;
        let highByte = 0;
        let carryFlag = 0;
        let result = 0;
        let oldbit = 0;

        switch (this._currentInstruction_OpCode) {
            case 128: case 130: case 194: case 226: case 4: case 20: case 52: case 68: case 84: case 100: case 116:
            case 212: case 244: case 12: case 28: case 60: case 92: case 124: case 220: case 252:
                // SKB, SKW, DOP, - undocumented noops
                this.decodeAddress();
                break;
            case 105: case 101: case 117: case 109: case 125: case 121: case 97: case 113:
                //ADC
                data = this.decodeOperand();
                carryFlag = (this.statusRegister & 1);
                result = (this.accumulator + data + carryFlag) | 0;
                // carry flag
                this.setFlag(SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(SRMasks_OverflowMask, ((this.accumulator ^ data) & 128) !== 128 && ((this.accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this.accumulator = result & 0xFF;
                this.setZNFlags(this.accumulator);
                break;
            case 41: case 37: case 53: case 45: case 61: case 57: case 33: case 49:
                //AND
                this.accumulator = (this.accumulator & this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 10: case 6: case 22: case 14: case 30:
                //ASL
                data = this.decodeOperand();
                // set carry flag
                this.setFlag(SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.setByte(this.decodeAddress(), data);
                }
                this.setZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this.statusRegister & 1) !== 1) {
                    this.branch();
                }
                break;
            case 176:
                //BCS();
                if ((this.statusRegister & 1) === 1) {
                    this.branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this.statusRegister & 2) === 2) {
                    this.branch();
                }
                break;
            case 36: case 44:
                //BIT();
                data = this.decodeOperand();
                // overflow is bit 6
                this.setFlag(SRMasks_OverflowMask, (data & 64) === 64);
                // negative is bit 7
                if ((data & 128) === 128) {
                    this.statusRegister = this.statusRegister | 128;
                } else {
                    this.statusRegister = this.statusRegister & 127;
                }
                if ((data & this.accumulator) === 0) {
                    this.statusRegister = this.statusRegister | 2;
                } else {
                    this.statusRegister = this.statusRegister & 253;
                }
                break;
            case 48:
                //BMI();
                if ((this.statusRegister & 128) === 128) {
                    this.branch();
                }
                break;
            case 208:
                //BNE();
                if ((this.statusRegister & 2) !== 2) {
                    this.branch();
                }
                break;
            case 16:
                // BPL();
                if ((this.statusRegister & 128) !== 128) {
                    this.branch();
                }
                break;
            case 0:
                // BRK();

                this.programCounter = this.programCounter + 1;
                this.pushStack(this.programCounter >> 8 & 0xFF);
                this.pushStack(this.programCounter & 0xFF);

                data = this.statusRegister | 16 | 32;
                this.pushStack(data);

                this.statusRegister = this.statusRegister | 20;
                this.addressBus = 65534;

                lowByte = this.getByte(this.addressBus);
                this.addressBus = 65535;

                highByte = this.getByte(this.addressBus);
                this.programCounter = lowByte + highByte * 256;
                break;
            case 80:
                // BVC();
                if ((this.statusRegister & 64) !== 64) {
                    this.branch();
                }
                break;
            case 112:
                // BVS();
                if ((this.statusRegister & 64) === 64) {
                    this.branch();
                }
                break;
            case 24:
                // CLC();
                this.setFlag(SRMasks_CarryMask, false);
                break;
            case 216:
                // CLD();
                this.setFlag(SRMasks_DecimalModeMask, false);
                break;
            case 88:
                // CLI();
                this.setFlag(SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                // CLV();
                this.setFlag(SRMasks_OverflowMask, false);
                break;
            case 201: case 197: case 213: case 205: case 221: case 217: case 193: case 209:
                // CMP();
                data = (this.accumulator + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 224: case 228: case 236:
                // CPX();
                data = (this.indexRegisterX + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 192: case 196: case 204:
                // CPY();
                data = (this.indexRegisterY + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 198: case 214: case 206: case 222:
                // DEC();
                data = this.decodeOperand();
                data = (data - 1) & 0xFF;
                this.setByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 202:
                // DEX();
                this.indexRegisterX = this.indexRegisterX - 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 136:
                //DEY();
                this.indexRegisterY = this.indexRegisterY - 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 73:
            case 69:
            case 85:
            case 77:
            case 93:
            case 89:
            case 65:
            case 81:
                // EOR();
                this.accumulator = (this.accumulator ^ this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                // INC();
                data = this.decodeOperand();
                data = (data + 1) & 0xFF;
                this.setByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 232:
                //INX();
                this.indexRegisterX = this.indexRegisterX + 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 200:
                this.indexRegisterY = this.indexRegisterY + 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this.programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                } else {
                    this.programCounter = this.decodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.pushStack((this.programCounter >> 8) & 0xFF);
                this.pushStack((this.programCounter - 1) & 0xFF);
                this.programCounter = this.decodeAddress();
                break;
            case 169:
            case 165:
            case 181:
            case 173:
            case 189:
            case 185:
            case 161:
            case 177:
                //LDA();
                this.accumulator = this.decodeOperand();
                this.setZNFlags(this.accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this.indexRegisterX = this.decodeOperand();
                this.setZNFlags(this.indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this.indexRegisterY = this.decodeOperand();
                this.setZNFlags(this.indexRegisterY);
                break;
            case 74: case 70: case 86: case 78: case 94:
                //LSR();
                data = this.decodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.setFlag(SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.setByte(this.decodeAddress(), data);
                }
                break;
            case 234: case 26: case 58: case 90: case 122: case 218: case 250: case 137:
                //NOP();
                this.decodeAddress();
                break;
            case 9:
            case 5:
            case 21:
            case 13:
            case 29:
            case 25:
            case 1:
            case 17:
                //ORA();
                this.accumulator = (this.accumulator | this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 72:
                //PHA();
                this.pushStack(this.accumulator);
                break;
            case 8:
                //PHP();
                data = this.statusRegister | 16 | 32;
                this.pushStack(data);
                break;
            case 104:
                //PLA();
                this.accumulator = this.popStack();
                this.setZNFlags(this.accumulator);
                break;
            case 40:
                //PLP();
                this.statusRegister = this.popStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.decodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this.statusRegister & 1) === 1 ? 1 : 0;
                this.setFlag(SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.setByte(this.decodeAddress(), data);
                }
                break;
            case 106:
            case 102:
            case 118:
            case 110:
            case 126:
                //ROR();
                data = this.decodeOperand();
                // old carry bit shifted into bit 7
                oldbit = (this.statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.setByte(this.decodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this.statusRegister = this.popStack(); // | 0x20;
                lowByte = this.popStack();
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.popStack() + 1) & 0xFF;
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
                break;
            case 235:
            case 233:
            case 229:
            case 245:
            case 237:
            case 253:
            case 249:
            case 225:
            case 241:  // undocumented sbc immediate
                //SBC();
                // start the read process
                data = this.decodeOperand() & 4095;
                carryFlag = ((this.statusRegister ^ 1) & 1);
                result = (((this.accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.setFlag(SRMasks_OverflowMask, ((this.accumulator ^ result) & 128) === 128 && ((this.accumulator ^ data) & 128) === 128);
                this.setFlag(SRMasks_CarryMask, (result < 256));
                this.accumulator = (result) & 0xFF;
                this.setZNFlags(this.accumulator);
                break;
            case 56:
                //SEC();
                this.setFlag(SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.setFlag(SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.setFlag(SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.setByte(this.decodeAddress(), this.accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.setByte(this.decodeAddress(), this.indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.setByte(this.decodeAddress(), this.indexRegisterY);
                break;
            case 170:
                //TAX();
                this.indexRegisterX = this.accumulator;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 168:
                //TAY();
                this.indexRegisterY = this.accumulator;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 186:
                //TSX();
                this.indexRegisterX = this.stackPointer;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 138:
                //TXA();
                this.accumulator = this.indexRegisterX;
                this.setZNFlags(this.accumulator);
                break;
            case 154:
                //TXS();
                this.stackPointer = this.indexRegisterX;
                break;
            case 152:
                //TYA();
                this.accumulator = this.indexRegisterY;
                this.setZNFlags(this.accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator & 0xFF;
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 128) === 128);
                this.setZNFlags(this.accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 1) === 1);
                this.accumulator = this.accumulator >> 1;
                this.setZNFlags(this.accumulator);
                break;
            case 107:
                //ARR();
                //AND byte with accumulator, then rotate one bit right in accu - mulator and
                //  check bit 5 and 6:
                //If both bits are 1: set C, clear V. 0x30
                //If both bits are 0: clear C and V.
                //If only bit 5 is 1: set V, clear C.
                //If only bit 6 is 1: set C and V.
                //Status flags: N,V,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                if ((this.statusRegister & 1) === 1) {
                    this.accumulator = (this.accumulator >> 1) | 128;
                } else {
                    this.accumulator = (this.accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 1) === 1);
                switch (this.accumulator & 48) {
                    case 48:
                        this.setFlag(SRMasks_CarryMask, true);
                        this.setFlag(SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.setFlag(SRMasks_CarryMask, false);
                        this.setFlag(SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.setFlag(SRMasks_CarryMask, false);
                        this.setFlag(SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.setFlag(SRMasks_CarryMask, true);
                        this.setFlag(SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this.indexRegisterX = (this.accumulator = this.decodeOperand() & this.accumulator);
                this.setZNFlags(this.indexRegisterX);
                break;
        }
    }

    setZNFlags(data: number): void {
        //zeroResult = (data & 0xFF) == 0;
        //negativeResult = (data & 0x80) == 0x80;

        if ((data & 255) === 0) {
            this.statusRegister |= 2;
        } else {
            this.statusRegister &= -3;
        } // ((int)CPUStatusMasks.ZeroResultMask);

        if ((data & 128) === 128) {
            this.statusRegister |= 128;
        } else {
            this.statusRegister &= -129;
        } // ((int)CPUStatusMasks.NegativeResultMask);
    }

    compare(data: number): void {
        this.setFlag(SRMasks_CarryMask, data > 255);
        this.setZNFlags(data & 255);
    }

    branch(): void {
        const highByte = (this.programCounter >> 8) & 0xff;
        
        this._currentInstruction_ExtraTiming = 1;
        let addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;

        } 

        this.programCounter += addr;
        this.programCounter &= 0xffff;
        const newHighByte = (this.programCounter >> 8) & 0xff;
        if (highByte != newHighByte) {
            this._currentInstruction_ExtraTiming = 2;
        }
    }

    nmiHandler(): void {
        this.handleNMI = true;
    }

    private pushStack(data: number): void {
        this.memoryMap.Rams[this.stackPointer + 256] = data;
        this.stackPointer--;
        if (this.stackPointer < 0) {
            this.stackPointer = 255;
        }
    }

    private popStack(): number {
        this.stackPointer++;
        if (this.stackPointer > 255) {
            this.stackPointer = 0;
        }
        return this.memoryMap.Rams[this.stackPointer + 256];
    }

    getByte(address: number): number {
        if (!this.memoryMap) { return 0; }
        let result = this.memoryMap.getByte(this.clock, address);

        if (this.cheating)
        {
            const patch = this.genieCodes.find((v)=>{ return v.address == address; });
            if (patch && patch.active && patch.address == address) {
                if (patch.compare > -1) {
                    return (patch.compare == result ? patch.data : result) & 0xFF;
                } else {
                    return patch.data;
                }
            } 
        }

        return result & 255;
    }

    setByte(address: number, data: number): void {
        if (!this.memoryMap) { return; }
        this.memoryMap.setByte(this.clock, address, data);
    }

    HandleNextEvent(): void {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    }
    
    ResetInstructionHistory(): void {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    }

    // writeInstructionHistory(): void {
    //     const inst: ChiChiInstruction = new ChiChiInstruction();
    //     inst.time = this.systemClock;
    //     inst.A = this.accumulator;
    //     inst.X = this.indexRegisterX;
    //     inst.Y = this.indexRegisterY;
    //     inst.SR = this.statusRegister;
    //     inst.SP = this.stackPointer;
    //     inst.frame = this.clock;
    //     inst.OpCode = this._currentInstruction_OpCode;
    //     inst.Parameters0 = this._currentInstruction_Parameters0;
    //     inst.Parameters1 = this._currentInstruction_Parameters1;
    //     inst.Address = this._currentInstruction_Address;
    //     inst.AddressingMode = this._currentInstruction_AddressingMode;
    //     inst.ExtraTiming = this._currentInstruction_ExtraTiming;

    //     this._instructionHistory[(this.instructionHistoryPointer--) & 255] = inst;
    //     this.instructionUsage[this._currentInstruction_OpCode]++;
    //     if ((this.instructionHistoryPointer & 255) === 255) {
    //         this.FireDebugEvent("instructionHistoryFull");
    //     }
    // }

    // FireDebugEvent(s: any): void {
    // }

    // GetStatus(): CpuStatus {
    //     return {
    //         PC: this.programCounter,
    //         A: this.accumulator,
    //         X: this.indexRegisterX,
    //         Y: this.indexRegisterY,
    //         SP: this.stackPointer,
    //         SR: this.statusRegister
    //     }
    // }
    setupStateBuffer = (sb: StateBuffer) => setupStateBuffer(this, sb);
}

function setupStateBuffer(cpu: ChiChiCPPU, sb: StateBuffer) {
    sb.onRestore.subscribe((buffer: StateBuffer) => {
        attachStateBuffer(cpu, buffer);
    });

    sb.onUpdateBuffer.subscribe((buffer: StateBuffer) => {
        updateStateBuffer(cpu, buffer);
    })

    sb  .pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
        .pushSegment(8, 'cpu_status')
        ;
    return sb;
}

function attachStateBuffer(cpu: ChiChiCPPU, sb: StateBuffer) {
    cpu.cpuStatus = sb.getUint8Array('cpu_status');
    cpu.cpuStatus16 = sb.getUint16Array('cpu_status_16');
}

function updateStateBuffer(cpu: ChiChiCPPU, sb: StateBuffer) {
    cpu.cpuStatus16[PRG_CTR] = cpu.programCounter
    cpu.cpuStatus16[PRG_ADR] = cpu.addressBus;

    cpu.cpuStatus[0] = cpu.statusRegister;
    cpu.cpuStatus[1] = cpu.accumulator;
    cpu.cpuStatus[2] = cpu.indexRegisterX;
    cpu.cpuStatus[3] = cpu.indexRegisterY;
    cpu.cpuStatus[4] = cpu.dataBus;
    cpu.cpuStatus[5] = cpu.stackPointer;
}

export const stateConfig = (cpu: ChiChiCPPU) => (sb: StateBuffer) => {
    return {
        configure: () =>  {
            sb  .pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
            .pushSegment(8, 'cpu_status');
        },
        push: () => updateStateBuffer(cpu, sb),
        pull: () => attachStateBuffer(cpu, sb)
    }
}
