const path = require('path');
const webpackRxjsExternals = require('webpack-rxjs-externals');

const configChiChi = {
    entry: {
        chichi: './src/chichi/chichi.ts'
    },
    externals : [webpackRxjsExternals(), 'crc'],
    output: {
        path: path.resolve(__dirname, 'package'),
        filename: '[name].js',
        library: 'chichi',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [
    ]
}

module.exports = [configChiChi];
