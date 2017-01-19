// Hack, because https://github.com/Microsoft/TypeScript/issues/2920#issuecomment-97300263
declare function require(path: string): string;

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import * as angular from 'angular';

import { AtomicGridNg1Module } from 'atomic-grid/ng1';
import AppComponent from './AppComponent';

angular.module('app', [ AtomicGridNg1Module(angular) ])
  .component('app', {
    template: require('./AppComponent.html'),
    controller: AppComponent
  });

