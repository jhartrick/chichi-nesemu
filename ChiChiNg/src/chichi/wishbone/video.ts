import { drawFrameCanvas } from "../native/canvas.drawframe";
import { WishboneIO, Wishbone } from "./wishbone";
import { PixelBuffers } from "chichi";
import { drawFrameWebGL } from '../threejs/threejs.drawframe';
import * as THREE from "three";

export interface VideoHandlingComponent extends THREE.WebGLRendererParameters {
    canvas: HTMLCanvasElement;
}

export const setupVideoThreeJS = (opts: VideoHandlingComponent) => (wishbone: Wishbone) => {
    // higher order function sets up rendering
    const renderer = new THREE.WebGLRenderer(opts);
    renderer.setSize(256,256,false);
  
    // create function to render nes video
    const chichiDrawer = drawFrameWebGL(renderer);
  
    // return a function to attach a renderer to ChiChIO
    return (io: WishboneIO) => {
      wishbone.setPixelBuffer(PixelBuffers.createRawPixelBuffer((new ArrayBuffer(256 * 256 * 4))));            
  
      const result = {...io};
      result.drawFrame = chichiDrawer(wishbone);
      return result;
    }
};

export const setupVideoCanvas = (opts: VideoHandlingComponent) => (wishbone?: Wishbone) => {
    // higher order function sets up rendering
    const ctx = opts.canvas.getContext('2d');
    const chichiDrawer = drawFrameCanvas(ctx);

    // return a function to attach a renderer to ChiChIO
    return (io: WishboneIO) => {
        wishbone.setPixelBuffer(PixelBuffers.createDecodedPixelBuffer()((new ArrayBuffer(256 * 256 * 4))));            
        const result = Object.assign({}, io);
        result.drawFrame = chichiDrawer(wishbone);
        return Object.freeze(result);
    }
};
