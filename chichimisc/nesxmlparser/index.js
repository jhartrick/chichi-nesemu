#!/usr/local/bin/env node
"use strict";
var fs = require('fs'), dom = require('xmldom').DOMParser, xpath = require('xpath');
var xml2js = require('xml2js');
var crcs = new Array();
console.log('this is a test');
fs.readFile('./nescarts.xml', 'utf16le', function (err, data) {
    if (err) {
        console.log('error opening nescarts.xml: ' + err);
    }
    else {
        var xmlParser = new xml2js.Parser({ mergeAttr: true, attrkey: 'attributes' });
        var doc = new dom().parseFromString(data.toString(), "text/xml");
        var nodes = xpath.select('//game', doc);
        for (var i = 0; i < nodes.length; ++i) {
            var game = nodes[i];
            console.log(game.getAttribute('name') + ':  game ' + i + ' of ' + nodes.length);
            var cartnodes = xpath.select('cartridge', game);
            var _loop_1 = function (j) {
                var cart = cartnodes[j];
                var crc = cart.getAttribute('crc'); // xpath.select("@crc", cart, true).value;
                if (!crcs.find(function (v) { return v == crc; })) {
                    crcs.push(crc);
                    console.log(crc);
                    // get all game tags matching this crc (for the same rom in multiple regions, etc)
                    var games = xpath.select('//game[cartridge[@crc="' + crc + '"]]', doc);
                    console.log('games length ' + games.length);
                    for (var k = 0; k < games.length; ++k) {
                        var gameNode = games[k];
                        if (gameNode) {
                            //console.log(gameNode.toString())
                            var gameElem = doc.createElement('game');
                            gameElem.setAttribute('name', gameNode.getAttribute('name'));
                            gameElem.setAttribute('altname', gameNode.getAttribute('altname'));
                            gameElem.setAttribute('class', gameNode.getAttribute('class'));
                            gameElem.setAttribute('subclass', gameNode.getAttribute('subclass'));
                            gameElem.setAttribute('catalog', gameNode.getAttribute('catalog'));
                            gameElem.setAttribute('publisher', gameNode.getAttribute('publisher'));
                            gameElem.setAttribute('developer', gameNode.getAttribute('developer'));
                            gameElem.setAttribute('region', gameNode.getAttribute('region'));
                            gameElem.setAttribute('players', gameNode.getAttribute('players'));
                            gameElem.setAttribute('date', gameNode.getAttribute('date'));
                            cart.appendChild(gameElem);
                        }
                    }
                    var json = xmlParser.parseString(cart.toString(), function (err, result) {
                        fs.writeFileSync('./carts/' + crc + '.json', JSON.stringify(result));
                    });
                }
            };
            for (var j = 0; j < cartnodes.length; ++j) {
                _loop_1(j);
            }
        }
    }
});
