import { LocalAudioSettings } from "../threejs/audio.localsettings";
import { chichiPlayer } from "../threejs/audio.threejs";
import { WishboneIO, Wishbone } from "./wishbone";
import * as THREE from "three";
const listener = new THREE.AudioListener();
// create function to play nes audio

export class WishboneAudioFactory {
    player: (wavForms) => LocalAudioSettings;
    constructor() {

    }
    async init() {
        this.player = await chichiPlayer(listener);
    }

    setupAudioThreeJS = () => (wishbone?: Wishbone) => {

        // return a function to attach a renderer to ChiChIO
        return (io: WishboneIO) => {
            if (io.audio !== undefined) {
                io.audio.stop();
            };
            const result = Object.assign({}, io);
            result.audio = this.player(wishbone.wavSharer);
            return Object.freeze(result);
        }
    };

}

