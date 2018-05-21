const { argv } = require('optimist');
const srcPath = require('path').resolve(process.cwd(), 'src');

const webpackMerge = require('webpack-merge');

const baseConfig = require('./webpack-config.base');

const protocol = argv.https ? 'https' : 'http';
const domain = argv.host || 'localhost';
const port = argv.port || '8080';
const address = `${protocol}://${domain}:${port}/`;

module.exports = webpackMerge(baseConfig, {
    devServer: {
        hot: false,
        publicPath: address,
        contentBase: srcPath,
        watchOptions: {
            aggregateTimeout: 100,
            ignored: /node_modules/
        },
        stats: {
            assets: false,
            cached: false,
            colors: true,
            cachedAssets: false,
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false
        },
        overlay: {
            errors: true,
            warnings: false
        }
    }
});
