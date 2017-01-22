var argv = require('yargs').argv;

module.exports = {
  entry: 'dist/' + argv.file,
  dest: 'dist/' + argv.file,
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.amazing',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/http': 'ng.http',
    'rxjs': 'rxjs',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable'
  }
};
