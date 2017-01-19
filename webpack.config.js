var webpack = require('webpack');
var path = require('path');


module.exports = {
    entry: {
      ng1: './src/angular1/atomic-grid.ng1.module',
      ng2: './src/angular2/atomic-grid.ng2.module'
    },
    output: {
        path: '.',
        filename: '[name].js',
        library: null,
        libraryTarget: 'commonjs'
    },
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    externals: [
      '@angular/common',
      '@angular/core',
      '@angular/http',
      '@angular/platform-browser',
      '@types/angular',
      '@types/core-js',
      'rxjs'
    ],
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'string-replace?search="ngInject";&replace=!string-replace?search=\'ngInject\';&replace=!ng-annotate!ts-loader'
            }, {
                test: /\.html$/,
                loader: 'raw!html-minify'
            }
        ]
    },
    ts: {
      declaration: true
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin()
    ]
};
