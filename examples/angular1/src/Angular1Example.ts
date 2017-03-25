// Hack, because https://github.com/Microsoft/TypeScript/issues/2920#issuecomment-97300263
declare function require(path: string): string;

import './AppComponent.less';

import * as angular from 'angular';

import { AtomicGridNg1ModuleFactory } from 'atomic-grid/dist/ng1';
import AppComponent from './AppComponent';

angular.module('app', [ AtomicGridNg1ModuleFactory(angular) ])
  .component('app', {
    template: require('./AppComponent.html'),
    controller: AppComponent
  });

