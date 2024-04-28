import * as FileDecoder from './NESFileDecoder';
import { expect } from 'chai';
import 'mocha';

// this header describes 0 rom banks, and 0 chr banks.  It should decode without errors.
const header = new Uint8Array([0x4e, 0x45, 0x53, 0x1a, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x4e, 0x49, 0x20 , 0x31 , 0x2e , 0x33]);

describe('decodeFile', () => {

    it('should throw error on no file', () => {
        expect(FileDecoder.decodeFile.bind(null, null)).to.throw("invalid NES file");
    });

    it('should decode a sample header', () => {
        const file =FileDecoder.decodeFile(header.buffer);
        expect(file.mapperId).to.equal(1);
        expect(file.prgRomCount).to.equal(0);
        expect(file.chrRomCount).to.equal(0);
        expect(file.romCRC).to.equal('0');
    });

});
