import * as crc from 'crc';

import { ChiChiCPPU } from '../chichi/ChiChiCPU';
import { ChiChiPPU } from '../chichi/ChiChiPPU';

import { BaseCart, UnsupportedCart, NameTableMirroring } from './BaseCart';
import * as Discrete from './DiscreteCarts'
import { CNROMCart }  from './CNROMCart'
import * as Multi from './MultiCarts'
import * as MMC1 from './MMC1Carts'
import * as MMC2 from './MMC2Carts'
import * as MMC3 from './MMC3Carts'
import * as M068 from './Mapper068'
import * as Nsf from './Nsf031Cart'
import * as Smb2j from './Smb2jCart'
import * as  VS  from './VSCarts';
import * as VRC from './KonamiVRC1';
import * as VRC2 from './KonamiVRC2';
import * as VRC6 from './KonamiVRC6';
import * as Sunsoft from './Sunsoft';
import * as Mapper034 from './Mapper034';
import * as Mapper015 from './Mapper015';
import * as Mapper112 from './Mapper112';
import * as Mapper132 from './Mapper132';
import * as Mapper133 from './Mapper133';
import * as Mapper193 from './Mapper193';
import * as Mapper228 from './Mapper228';
import * as NESFile from './NESFileDecoder';
import { NesFile } from './NESFileDecoder';

const MapperFactory = {
    0:  Discrete.NesCart,
    1:  MMC1.MMC1Cart,
    2:  Discrete.UxROMCart,
    3:  CNROMCart,
    4:  MMC3.MMC3Cart,
    7:  Discrete.AxROMCart,
    9:  MMC2.MMC2Cart,
    10:  MMC2.MMC4Cart,
    11:  Discrete.ColorDreams,
    13:  Discrete.Mapper013Cart,
    15:  Mapper015.Mapper015Cart,
    21:  VRC2.Konami021Cart,
    22:  VRC2.KonamiVRC022Cart,
    23:  VRC2.KonamiVRC2Cart,
    24:  VRC6.Konami026Cart,
    25:  VRC2.Konami025Cart,
    26:  VRC6.Konami026Cart,
    30:  Discrete.Mapper030Cart,
    31:  Nsf.Mapper031Cart,
    34:  Mapper034.BNROMCart,
    38:  Discrete.BitCorp038Cart,
    40:  Smb2j.Smb2jCart,
    51:  Multi.Mapper051Cart,
    58:  Multi.Mapper058Cart,
    66:  Discrete.MHROMCart,
    68:  M068.Mapper068Cart,
    70:  Discrete.Mapper070Cart,
    71:  Discrete.Mapper071Cart,
    75:  VRC.KonamiVRC1Cart,
    77:  Discrete.Mapper077Cart,
    78:  Discrete.Mapper078Cart,
    79:  Discrete.Mapper079Cart,
    81:  Discrete.Mapper081Cart,
    87:  Discrete.Mapper087Cart,
    89:  Sunsoft.Mapper089Cart,
    93:  Sunsoft.Mapper093Cart,
    94:  Discrete.Mapper094Cart,
    97:  Discrete.Irem097Cart,
    99:  VS.VSCart,
    112:  Mapper112.Mapper112Cart,
    132:  Mapper132.Mapper132Cart,
    133:  Mapper133.Mapper133Cart,
    140:  Discrete.JF1xCart,
    145:  Discrete.Mapper145Cart,
    151:  VRC.KonamiVRC1Cart,
    152:  Discrete.Mapper152Cart,
    180:  Discrete.NesCart,
    184:  Sunsoft.Mapper184Cart,
    190:  Discrete.Mapper190Cart,
    193:  Mapper193.Mapper193Cart,
    202:   Multi.Mapper202Cart,
    212:  Multi.Mapper212Cart,
    228:  Mapper228.Mapper228Cart,

}

const createCart = (file: NESFile.NesFile): BaseCart => (MapperFactory[file.mapperId] !== undefined) ? new MapperFactory[file.mapperId](file) : new UnsupportedCart(file);

export const iNESFileHandler = (buffer: ArrayBuffer) =>  createCart(NESFile.decodeFile(buffer));
