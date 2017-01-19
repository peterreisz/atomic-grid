import { AtomicGridInMemoryDataProvider } from '../core/atomic-grid-inmemory-data-provider.class';
import { AtomicGridState, AtomicGridPage } from '../core/atomic-grid.types';

export class AtomicGridNg1InMemoryDataProvider<T> extends AtomicGridInMemoryDataProvider<T> {

  constructor(data: Array<T>, private $q: ng.IQService) {
    super(data);
  }

  getPage(state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> {
    return this.$q.when(this.getPageData(state, additionalParams));
  }

}
