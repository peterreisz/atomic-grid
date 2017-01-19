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
  controllerAs: '$ctrl',
  template: AtomicGridNg1SortController.template
};

function AtomicGridNg1Module(angular: ng.IAngularStatic) {
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
          multiSelection: '<atGridMultiSelection'
        },
        controller: AtomicGridNg1Controller
      }
    })
    .directive('atGridSort', () => sortDirective)
    .directive('atGridSortFn', () => sortDirective)
    .name
}

export { AtomicGridNg1Module, AtomicGridNg1Controller, AtomicGridNg1SortController, AtomicGridNg1InMemoryDataProvider, AtomicGridNg1SpringDataProvider };
