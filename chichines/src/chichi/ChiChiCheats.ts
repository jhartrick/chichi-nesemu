const ggDigits = ['A','P','Z','L','G','I','T','Y','E','O','X','U','K','S','V','N'];

export interface GameGenieCode {
    code: string;
    description: string;
    active : boolean;
}

export interface MemoryPatch {
    address: number;
    data: number;
    compare: number;
    active: boolean;
}

function gameGenieCodeToPatch(code: string) : MemoryPatch {

        
        let patch: MemoryPatch = null;
        const hexCode = code.split('').map(c =>  {
            return ggDigits.findIndex(p=> p===c);
        });

        // magic spell that makes the gamegenie appear!
        // http://tuxnes.sourceforge.net/gamegenie.html
        const address = 0x8000 +
              ((hexCode[3] & 7) << 12)
            | ((hexCode[5] & 7) << 8) | ((hexCode[4] & 8) << 8)
            | ((hexCode[2] & 7) << 4) | ((hexCode[1] & 8) << 4)
            | (hexCode[4] & 7) | (hexCode[3] & 8);


        let data = 0;
        let compare = 0;
        if (hexCode.length == 6)
        {
            data =
                 ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[5] & 8);

            patch = {
                address, data, compare, active: true
            };
        }
        else if (hexCode.length == 8)
        {
            data =
                 ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[7] & 8);
            compare =
                 ((hexCode[7] & 7) << 4) | ((hexCode[6] & 8) << 4)
                | (hexCode[6] & 7) | (hexCode[5] & 8);

            patch = {
                address, data, compare, active: true
            };
        
            
        }
        return patch;
    }

export const ChiChiCheats = {
    gameGenieCodeToPatch
}