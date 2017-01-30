import 'ts-helpers';

import { AtomicGridNg1Controller } from './atomic-grid.ng1.controller';
import { AtomicGridNg1SortController } from './atomic-grid.ng1.sort.controller';
import { AtomicGridNg1InMemoryDataProvider } from './atomic-grid.ng1.inmemory-data-provider.class';
import { AtomicGridNg1SpringDataProvider } from './atomic-grid.ng1.spring-data-provider.class';

var sortDirective = {
  transclude: true,
  scope: {},
  bindToController: {
    sort: '@atGridSort',
    sortFn: '&atGridSortFn'
  },
  require: {
    atGrid: '^atGrid'
  },
  controller: AtomicGridNg1SortController,
  controllerAs: '$atGridSort',
  template: AtomicGridNg1SortController.template
};

function AtomicGridNg1ModuleFactory(angular: ng.IAngularStatic) {
  return angular
    .module('atomic-grid', [])
    .directive('atGrid', () => {
      return {
        bindToController: {
          name: '@atGrid',
          data: '<atGridData',
          url: '@atGridUrl',
          dataProvider: '&atGridDataProvider',
          additionalParameters: '&atGridAdditionalParameters',
          multiSelection: '<atGridMultiSelection',
          pagerRange: '<atGridPagerRange',
          autoSearch: '<atGridAutoSearch'
        },
        controller: AtomicGridNg1Controller,
        controllerAs: '$atGrid'
      }
    })
    .directive('atGridSort', () => sortDirective)
    .directive('atGridSortFn', () => sortDirective)
    .name
}

export { AtomicGridNg1ModuleFactory, AtomicGridNg1Controller, AtomicGridNg1SortController, AtomicGridNg1InMemoryDataProvider, AtomicGridNg1SpringDataProvider };
