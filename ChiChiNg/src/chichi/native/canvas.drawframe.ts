import { Wishbone } from "../wishbone/wishbone";

export const drawFrameCanvas = (canvasCtx: CanvasRenderingContext2D) => (wishbone: Wishbone): () => void =>  {
    const dataBuf = new Uint8ClampedArray(wishbone.getPixelBuffer().buffer);
    const data = canvasCtx.createImageData(256, 256);
  
    return  () => {
        requestAnimationFrame(()=>{
            data.data.set(dataBuf);
            canvasCtx.putImageData(data,0,0);
        })
    };
  };
