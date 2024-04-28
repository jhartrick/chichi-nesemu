import { chichiPlayer } from "../threejs/audio.threejs";
import { WishboneIO, Wishbone } from "./wishbone";
import * as THREE from "three";
const listener = new THREE.AudioListener();

const setupAudioThreeJS = () => (wishbone?: Wishbone) => {
    // create function to play nes audio
    const player  = chichiPlayer(listener);
    
    // return a function to attach a renderer to ChiChIO
    return (io: WishboneIO) => {
        if (io.audio !== undefined) {
            io.audio.stop();
        };
        const result = Object.assign({}, io);
        result.audio = player(wishbone.wavSharer);
        return Object.freeze(result);
    }
};

export const WishboneAudio = {
    setupAudioThreeJS
}