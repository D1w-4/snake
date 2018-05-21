const resolvePath = require('path').resolve.bind(process.cwd());
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: [ './src/styles/app', './src/app'],
    },
    resolve: {
        modules: ['node_modules', resolvePath('src')],
        extensions: ['.ts', '.js', '.styl']
    },
    output: {
        path: resolvePath('build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {test: /\.ts$/, include: resolvePath('src'), use: ['ts-loader']},
            {test: /\.html$/, include: resolvePath('src'), use: 'raw-loader'},
            { test: /\.styl$/, include: resolvePath('src'), loader: 'style-loader!css-loader!stylus-loader?paths=src/' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: false
        })
    ]
};
