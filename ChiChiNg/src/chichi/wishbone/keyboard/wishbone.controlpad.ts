import * as Keys from "./wishbone.keybindings";
import { defaultBindings, KeyBinding } from "./wishbone.keybindings";

export interface WishBoneControlPad {
    bindings: KeyBinding[];
    padOneState: number;
    controllerId: string;
}

export const createControlPad = (bindings: KeyBinding[]) => (controllerId: string): WishBoneControlPad => {
    return {
        bindings: bindings,
        controllerId: controllerId,
        padOneState: 0
    };
}

export const handleKeyUpEvent = (pad: WishBoneControlPad, event: KeyboardEvent) => {
    
    const x = pad.bindings.find(b =>  b.key === event.keyCode)
    if (x) {
        pad.padOneState &= ~x.value & 0xff;
    }
}

export const handleKeyDownEvent = (pad: WishBoneControlPad, event: KeyboardEvent) => {
    const x = pad.bindings.find(b =>  b.key === event.keyCode)
    if (x) {
        pad.padOneState |= x.value & 0xff;
    }

}