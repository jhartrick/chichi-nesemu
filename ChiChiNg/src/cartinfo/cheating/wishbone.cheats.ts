import { Injectable } from '@angular/core';
import { GameGenieCode, ChiChiCheats, BaseCart, ChiChiCPPU } from 'chichines';
import { Wishbone } from '../../chichi/wishbone/wishbone';


const applyCheats = (cpu: ChiChiCPPU) => (cheats: GameGenieCode[]): void => {
    cheats;
    cpu.genieCodes = cheats.filter((v) => v.active).map((v) => ChiChiCheats.gameGenieCodeToPatch(v.code));
    cpu.cheating =  cpu.genieCodes.length > 0;
}

async function fetchCheats (crc: string) {
    
    const parser = new DOMParser();
    const response = await fetch('assets/geniecodes.xml');
    const text = await response.text();

    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const ggCodes = new Array<GameGenieCode>();
    const nodes = xmlDoc.evaluate('/database/game[@crc="' + crc + '"]/gamegenie', xmlDoc, null, XPathResult.ANY_TYPE, null);
    let result = nodes.iterateNext() as Element;
    while (result) {
        const ggCode = {
            code: (<any>result.attributes).code.value,
            description:  (<any>result.attributes).description.value,
            active: false
        };
        ggCodes.push(ggCode);
        result = nodes.iterateNext() as Element;
    }

    return ggCodes;

}

export const WishboneCheats = {
    applyCheats,
    fetchCheats
}
