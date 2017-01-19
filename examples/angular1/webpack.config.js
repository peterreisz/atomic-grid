var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var argv = require('yargs').argv;
var path = require('path');

var productionPlugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
];

var config = require('./package.json');

var entry = {};
entry[config.name] = __dirname + '/' + config.main;

module.exports = {
    entry: entry,
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'string-replace?search="ngInject";&replace=!string-replace?search=\'ngInject\';&replace=!ng-annotate!ts-loader'
            }, {
                test: /\.js$/,
                loader: 'string-replace?search="ngInject";&replace=!string-replace?search=\'ngInject\';&replace=!ng-annotate'
            }, {
                test:   /\.css/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
            }, {
                test:   /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!less')
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            }, {
                test: /\.html$/,
                loader: 'raw!html-minify'
            }
        ]
    },
    plugins:[
        new ExtractTextPlugin('[name].css'),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'
        })
    ].concat(argv.prod ? productionPlugins : []),
    postcss: [
        autoprefixer({
            browsers: ['last 3 version']
        })
    ],
    devtool: 'eval',
    devServer: {
        proxy: {
            '/api/*': 'http://localhost:8080'
        },
        host: '0.0.0.0',
        port: 9080
    }
};
