export class ChiChiControlPad  {

    currentByte: number = 0;
    readNumber: number = 0;
    
    getPadState = () => 0;
    
    getByte = (clock: number, address: number) => {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }

    setByte = (clock: number, address: number, data: number): void => {
        if ((data & 1) == 1) {
            this.currentByte = this.getPadState();
            // if im pushing up, i cant be pushing down
            if ((this.currentByte & 16) == 16) this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right..  the nes will glitch
            if ((this.currentByte & 64) == 64) this.currentByte = this.currentByte & ~128;
            this.readNumber = 0;
        }
    }
}

