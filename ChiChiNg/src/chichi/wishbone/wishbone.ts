import { ChiChiMachine, BaseCart, WavSharer, ChiChiControlPad, PixelBuffer, ChiChiPPU, StateBuffer, ChiChiInstruction, DebugHelpers } from 'chichines';
import { WishboneRuntime } from './runtime';
import { LocalAudioSettings } from '../threejs/audio.localsettings';
import { WishboneState } from './state';
import { Observable, Subject, Subscription } from 'rxjs';

// this interface is used for the emulator to poll/push data to the outside world
export interface WishboneIO {
    // polls current state of controller ports
    padOneState: () => number;
    padTwoState: () => number;

    // when called, should draw the current frame
    drawFrame:  () => void;
    audio: LocalAudioSettings;
}

export class Wishbone {
    wavSharer: WavSharer;
    padOne: ChiChiControlPad;
    padTwo: ChiChiControlPad;

    chichi: ChiChiMachine;
    
    cart?: BaseCart;
    runtime?: WishboneRuntime;

    loadcart = (cart: BaseCart) => {
        if (!!cart) {
            this.chichi.loadCart(cart);
        }
    }

    poweron = () => this.chichi.PowerOn();
    poweroff = () => this.chichi.PowerOff();
    reset = () => this.chichi.Reset();

    runframe = () => this.chichi.RunFrame();
    step = () => this.chichi.Step();

    // TODO: implement this better
    setPixelBuffer = (buffer: any) => this.chichi.ppu.pixelBuffer = buffer;
    getPixelBuffer = (): PixelBuffer => this.chichi.ppu.pixelBuffer;

    state: WishboneState;

    debugging: boolean;
    private instHistory = new Subject<ChiChiInstruction>();
    instructionHistory = this.instHistory.asObservable();

    enableDebug = (debugging: boolean) => {
        this.debugging = debugging;
        if (debugging) {
            this.step = () => {
                this.runtime.pause(true);
                this.chichi.Step();
                const { InstructionHistory, InstructionHistoryPointer } = this.chichi.Cpu;
                this.instHistory.next(InstructionHistory[InstructionHistoryPointer])
            }
            this.runframe = () => {
                this.runtime.pause(true);
                this.chichi.SoundBopper.writer.SharedBuffer.fill(0);
                this.chichi.RunFrame();
                const { InstructionHistory, InstructionHistoryPointer } = this.chichi.Cpu;
                this.instHistory.next(InstructionHistory[InstructionHistoryPointer])
            }
        } else {
            this.step = () => this.chichi.Step();
            this.runframe = () => this.chichi.RunFrame();
        }
    }

    constructor() {
        this.chichi = new ChiChiMachine();
        this.padOne = this.chichi.controllerPortOne;
        this.padTwo = this.chichi.controllerPortTwo;
        this.wavSharer = this.chichi.SoundBopper.writer;

        
      
    }

}


export const createWishbone = (): Wishbone => {
    return new Wishbone();
}

// export const attachDebugCallback = (wb: Wishbone, cb: () => void): Wishbone => {
//     const chichi = wb.chichi;
    
//     wb.runframe = () => {
//         chichi.RunFrame.bind(chichi);
//         cb();
//     }
//     return wb;
// }


// export const removeDebugCallback = (wb: Wishbone): Wishbone => {
//     const chichi = wb.chichi;
    
//     wb.runframe = () => chichi.RunFrame.bind(chichi);
//     return wb;
// }

