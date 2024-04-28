import * as THREE from 'three';
import { Wishbone } from '../wishbone/wishbone';
import { basicEncoder } from './basicEncoder';

const defaultPalette: number[] = [7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const drawFrameWebGL = (renderer: THREE.WebGLRenderer) =>  (wishbone: Wishbone): () => void =>  {
    
    const vbuffer =  new Uint8Array(wishbone.getPixelBuffer().buffer);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const scene = new THREE.Scene();
 

    const nesRenderTarget = new THREE.WebGLRenderTarget(256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
    const bufferScene = new THREE.Scene();
    const encoder = basicEncoder();
    // const encoder = new NTSCEncoder(this.nesService);

    const fullScreenQuad = new THREE.PlaneGeometry(5, 5);

    const nesEncoder = encoder(vbuffer);
    bufferScene.add(new THREE.Mesh(fullScreenQuad, nesEncoder.material));
    var boxMaterial = new THREE.MeshBasicMaterial({map: <any>nesRenderTarget });

    scene.add(new THREE.Mesh(fullScreenQuad, boxMaterial));
    camera.position.z = 5.8;

    return  () => {
        nesEncoder.text.needsUpdate = true;
        // renderer.render(bufferScene, camera, nesRenderTarget);
        renderer.render(bufferScene, camera );
    };
};

