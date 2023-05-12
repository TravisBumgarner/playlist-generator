const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: ['./src/index.ts'],
    },
    resolve: {
        extensions: ['.mjs', '.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
        ],
    },
    target: 'node12.18',
    output: {
        filename: 'index.js',
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, './build'),
    },
};