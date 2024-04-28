import { ChiChiMachine, BaseCart, WavSharer, ChiChiControlPad, PixelBuffer, ChiChiPPU, StateBuffer } from 'chichi';
import { WishBoneControlPad } from './keyboard/wishbone.controlpad';
import { ChiChiCPPU } from 'chichi';
import { WishboneRuntime } from './runtime';
import { LocalAudioSettings } from '../threejs/audio.localsettings';
import { WishboneState } from './state';

// this interface is used for the emulator to poll/push data to the outside world
export interface WishboneIO {
    // polls current state of controller ports
    padOneState: () => number;
    padTwoState: () => number;

    // when called, should draw the current frame
    drawFrame:  () => void;
    audio: LocalAudioSettings;
}

export interface Wishbone {
    wavSharer: WavSharer;
    padOne: ChiChiControlPad;
    padTwo: ChiChiControlPad;

    chichi?: ChiChiMachine;
    cart?: BaseCart;
    runtime?: WishboneRuntime;

    poweron: () => void;
    poweroff: () => void;
    reset: () => void;

    runframe: () => void;

    // TODO: implement this better
    getPixelBuffer: () => PixelBuffer;
    setPixelBuffer: (buffer: any) => void;

    state: WishboneState;

}

const createWishbone = (): Wishbone => {
    const chichi: ChiChiMachine = new ChiChiMachine()
    const setPixelBuffer = (ppu: ChiChiPPU) => (buffer: any) => ppu.pixelBuffer = buffer;
    const getPixelBuffer = (ppu: ChiChiPPU) => (): PixelBuffer => ppu.pixelBuffer;

    return {
        chichi: chichi,
        wavSharer: chichi.SoundBopper.writer,
        getPixelBuffer: getPixelBuffer(chichi.Cpu.ppu),
        setPixelBuffer: setPixelBuffer(chichi.Cpu.ppu),
        padOne:  chichi.controllerPortOne,
        padTwo:  chichi.controllerPortTwo,
        poweron:  chichi.PowerOn.bind(chichi),
        poweroff:  chichi.PowerOff.bind(chichi),
        reset:  chichi.Reset.bind(chichi),
        runframe:  chichi.RunFrame.bind(chichi),
        state: {
            pull: null,
            push: null,
        }
    };
}

export const createWishboneFactory = () => {
    const wishbone = createWishbone();

    return (cart: BaseCart) => {
        if (cart) {
            wishbone.chichi.loadCart(cart);
        }
        return wishbone;
    };

}

