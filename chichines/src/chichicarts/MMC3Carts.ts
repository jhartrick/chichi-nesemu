import { BaseCart } from "./BaseCart";

export class MMC3Cart extends BaseCart {
    private _registers = new Uint8Array(4);
    private chr2kBank0 = 0;
    private chr2kBank1 = 1;
    private chr1kBank0 = 0;
    private chr1kBank1 = 0;
    private chr1kBank2 = 0;
    private chr1kBank3 = 0;
    private prgSwap = 0;
    private prgSwitch1 = 0;
    private prgSwitch2 = 0;
    private prevBSSrc = new Uint8Array(8);
    private _mmc3Command = 0;
    private _mmc3ChrAddr = 0;
    private _mmc3IrqVal = 0;
    private _mmc3TmpVal = 0;
    private scanlineCounter = 0;
    private _mmc3IrcOn = false;
    private ppuBankSwap = false;
    private PPUBanks = new Uint32Array(8);

    initializeCart() {
        this.usesSRAM =true;
        this.mapperName = 'MMC3';
        this._registers.fill(0);
        this.PPUBanks.fill(0);
        this.prevBSSrc.fill(0);

        this.prgSwap = 1;

        //SetupBanks(0, 1, 0xFE, 0xFF);
        this.prgSwitch1 = 0;
        this.prgSwitch2 = 1;
        this.swapPrgBanks();
        this._mmc3IrqVal = 0;
        this._mmc3IrcOn = false;
        this._mmc3TmpVal = 0;

        this.chr2kBank0 = 0;
        this.chr2kBank1 = 0;

        this.chr1kBank0 = 0;
        this.chr1kBank1 = 0;
        this.chr1kBank2 = 0;
        this.chr1kBank3 = 0;

        if (this.chrRomCount > 0) {
            this.copyBanks1k(0, 0, 0, 8);
        }
    }

    setByte(clock: number, address: number, val: number) {
        if (address >= 24576 && address < 32768) {
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        //Bank select ($8000-$9FFE, even)

        //7  bit  0
        //---- ----
        //CPxx xRRR
        //||    |||
        //||    +++- Specify which bank register to update on next write to Bank Data register
        //_mmc3Command
        //||         0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF);
        //||         1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF);
        //||         2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF);
        //||         3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF);
        //||         4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF);
        //||         5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF);
        //||         6: Select 8 KB PRG bank at $8000-$9FFF (or $C000-$DFFF);
        //||         7: Select 8 KB PRG bank at $A000-$BFFF

        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)
        //+--------- CHR ROM bank configuration (0: two 2 KB banks at $0000-$0FFF, four 1 KB banks at $1000-$1FFF;
        //                                       1: four 1 KB banks at $0000-$0FFF, two 2 KB banks at $1000-$1FFF)
        switch (address & 57345) {
            case 32768:
                this._mmc3Command = val & 7;
                if ((val & 128) === 128) {
                    this.ppuBankSwap = true;
                    this._mmc3ChrAddr = 4096;
                } else {
                    this.ppuBankSwap = false;
                    this._mmc3ChrAddr = 0;
                }
                if ((val & 64) === 64) {
                    this.prgSwap = 1;
                } else {
                    this.prgSwap = 0;
                }
                this.swapPrgBanks();
                break;
            case 32769:
                switch (this._mmc3Command) {
                    case 0:
                        this.chr2kBank0 = val;
                        this.swapChrBanks();
                        // CopyBanks(0, val, 1);
                        // CopyBanks(1, val + 1, 1);
                        break;
                    case 1:
                        this.chr2kBank1 = val;
                        this.swapChrBanks();
                        // CopyBanks(2, val, 1);
                        // CopyBanks(3, val + 1, 1);
                        break;
                    case 2:
                        this.chr1kBank0 = val;
                        this.swapChrBanks();
                        //CopyBanks(4, val, 1);
                        break;
                    case 3:
                        this.chr1kBank1 = val;
                        this.swapChrBanks();
                        //CopyBanks(5, val, 1);
                        break;
                    case 4:
                        this.chr1kBank2 = val;
                        this.swapChrBanks();
                        //CopyBanks(6, val, 1);
                        break;
                    case 5:
                        this.chr1kBank3 = val;
                        this.swapChrBanks();
                        //CopyBanks(7, val, 1);
                        break;
                    case 6:
                        this.prgSwitch1 = val;
                        this.swapPrgBanks();
                        break;
                    case 7:
                        this.prgSwitch2 = val;
                        this.swapPrgBanks();
                        break;
                }
                break;
            case 40960:
                if ((val & 1) === 1) {
                    this.mirror(clock, 2);
                } else {
                    this.mirror(clock, 1);
                }
                break;
            case 40961:
                //PRG RAM protect ($A001-$BFFF, odd)
                //7  bit  0
                //---- ----
                //RWxx xxxx
                //||
                //|+-------- Write protection (0: allow writes; 1: deny writes)
                //+--------- Chip enable (0: disable chip; 1: enable chip)
                this.SRAMCanWrite = ((val & 64) === 0);
                this.SRAMEnabled = ((val & 128) === 128);
                break;
            case 49152:
                this._mmc3IrqVal = val;
                if (val === 0) {
                    // special treatment for one-time irq handling
                    this.scanlineCounter = 0;
                    this.irqRaised = true;
                    
                }
                break;
            case 49153:
                this._mmc3TmpVal = this._mmc3IrqVal;
                break;
            case 57344:
                this._mmc3IrcOn = false;
                this.irqRaised = false;
                
                break;
            case 57345:
                this._mmc3IrcOn = true;
                //this._mmc3IrqVal = this._mmc3TmpVal;
                break;
        }
    }

    swapChrBanks() {
        if (this.ppuBankSwap) {
            this.copyBanks1k(0, 0, this.chr1kBank0, 1);
            this.copyBanks1k(0, 1, this.chr1kBank1, 1);
            this.copyBanks1k(0, 2, this.chr1kBank2, 1);
            this.copyBanks1k(0, 3, this.chr1kBank3, 1);
            this.copyBanks1k(0, 4, this.chr2kBank0, 2);
            this.copyBanks1k(0, 6, this.chr2kBank1, 2);
        } else {
            this.copyBanks1k(0, 4, this.chr1kBank0, 1);
            this.copyBanks1k(0, 5, this.chr1kBank1, 1);
            this.copyBanks1k(0, 6, this.chr1kBank2, 1);
            this.copyBanks1k(0, 7, this.chr1kBank3, 1);
            this.copyBanks1k(0, 0, this.chr2kBank0, 2);
            this.copyBanks1k(0, 2, this.chr2kBank1, 2);
        }
    }

    swapPrgBanks() {
        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)

        if (this.prgSwap === 1) {

            this.setupBankStarts(this.prgRomCount * 2 - 2, this.prgSwitch2, this.prgSwitch1, this.prgRomCount * 2 - 1);
        } else {
            this.setupBankStarts(this.prgSwitch1, this.prgSwitch2, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }

    }

    updateScanlineCounter() {
        //if (scanlineCounter == -1) return;

        if (this.scanlineCounter === 0) {
            this.scanlineCounter = this._mmc3IrqVal;

            if (this._mmc3IrqVal === 0) {
                if (this._mmc3IrcOn) {
                    
                    this.irqRaised = true;
                    //this.updateIRQ();
                }
                this.scanlineCounter = -1;
                return;
            } else {
                this.scanlineCounter = this._mmc3IrqVal;
                
            }
        }

        if (this._mmc3TmpVal !== 0) {
            this.scanlineCounter = this._mmc3TmpVal;
            this._mmc3TmpVal = 0;
        } else {
            this.scanlineCounter = (this.scanlineCounter + 1)  & 255;
        }

    }

}
