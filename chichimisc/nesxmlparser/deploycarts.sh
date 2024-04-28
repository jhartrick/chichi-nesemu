#!/bin/sh
tsc
rm carts/*.json
mkdir carts
node index.js
mkdir ../webapp/src/assets/carts
rm ../webapp/src/assets/carts/*.json
cp carts/*.json ../webapp/src/assets/carts
