import { AtomicGridInMemoryDataProvider } from '../core/atomic-grid-inmemory-data-provider.class';
import { AtomicGridState, AtomicGridPage } from '../core/atomic-grid.types';

export class AtomicGridNg2InMemoryDataProvider<T> extends AtomicGridInMemoryDataProvider<T> {

  constructor(data: Array<T>) {
    super(data);
  }

  getPage(state: AtomicGridState, additionalParams?: any): Promise<AtomicGridPage<T>> {
    return Promise.resolve(this.getPageData(state, additionalParams));
  }

}
