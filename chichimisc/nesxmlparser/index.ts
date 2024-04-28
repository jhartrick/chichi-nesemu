#!/usr/local/bin/env node
let fs = require('fs'), dom = require('xmldom').DOMParser, xpath = require('xpath');
const xml2js = require('xml2js');
let crcs = new Array<string>();
console.log('this is a test')

fs.readFile('./nescarts.xml', 'utf16le', (err: any, data: any) => {
    
    if (err) {
        console.log('error opening nescarts.xml: ' + err)
    } else {
        const xmlParser = new xml2js.Parser({mergeAttr: true, attrkey: 'attributes'})
        const doc = new dom().parseFromString(data.toString(), "text/xml");
        let nodes = xpath.select('//game', doc)

        for (let i = 0; i < nodes.length; ++i) {
            let game = nodes[i];
            console.log(game.getAttribute('name') + ':  game ' + i + ' of ' + nodes.length)
            
            let cartnodes = xpath.select('cartridge', game)

            for(let j =0; j < cartnodes.length; ++j) {
                const cart = cartnodes[j];
                let crc = cart.getAttribute('crc');// xpath.select("@crc", cart, true).value;
                if (!crcs.find((v)=>v==crc)) {
                    crcs.push(crc);
                    console.log(crc)

                    // get all game tags matching this crc (for the same rom in multiple regions, etc)
                    let games = xpath.select('//game[cartridge[@crc="' + crc + '"]]', doc)
                    console.log('games length ' + games.length)
                    for(let k =0; k < games.length; ++k) {
                        let gameNode = games[k];
                        if (gameNode) {
                            //console.log(gameNode.toString())
                            
                            let gameElem = doc.createElement('game');
                            gameElem.setAttribute('name', gameNode.getAttribute('name'))
                            gameElem.setAttribute('altname', gameNode.getAttribute('altname'))
                            gameElem.setAttribute('class', gameNode.getAttribute('class'))
                            gameElem.setAttribute('subclass', gameNode.getAttribute('subclass'))
                            gameElem.setAttribute('catalog', gameNode.getAttribute('catalog'))
                            gameElem.setAttribute('publisher', gameNode.getAttribute('publisher'))
                            gameElem.setAttribute('developer', gameNode.getAttribute('developer'))
                            gameElem.setAttribute('region', gameNode.getAttribute('region'))
                            gameElem.setAttribute('players', gameNode.getAttribute('players'))
                            gameElem.setAttribute('date', gameNode.getAttribute('date'))
                            
                            cart.appendChild(gameElem);
                        }
                    }

                    const json = xmlParser.parseString(cart.toString(),  (err: any, result: any) => {
                        fs.writeFileSync('./carts/' + crc + '.json', JSON.stringify(result));
                    });
                    
                }

            }
        }
    }
})

