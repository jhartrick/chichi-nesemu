import * as THREE from 'three';

const defaultPalette: number[] = [7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const basicEncoder = () => {
    const vertexShader = `
        varying vec2 v_texCoord;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            v_texCoord = uv.st;
        }
    `;

    const fragmentShader = `
        uniform sampler2D myTexture;
        uniform sampler2D myPalette;
        varying vec2 v_texCoord;

        void main()	{
            vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
            vec4 color = texture2D(myTexture, texCoord);
            vec4 finalColor = texture2D(myPalette,vec2(color.r,0.5));

            gl_FragColor = vec4(finalColor.rgb, 1.0);
        }
    `;

    return (vbuffer: Uint8Array) => {
        const text = new THREE.DataTexture(vbuffer, 256, 256, THREE.RGBAFormat);
        const pal =  new Uint8Array(256 * 4);
        for (let i = 0; i < 256; i++) {
            const color = defaultPalette[i & 0x3f];
            pal[i * 4] = color & 0xFF;
            pal[(i * 4) + 1] = (color >> 8) & 0xFF;
            pal[(i * 4) + 2] = (color >> 16) & 0xFF;
            pal[(i * 4) + 3] =  0xFF;
        }
        const paltext = new THREE.DataTexture(pal, 256, 1, THREE.RGBAFormat);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                myTexture: { value: text },
                myPalette: { value: paltext }
            },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
        });

        paltext.needsUpdate = true;

        return { material, text };
    }
}
