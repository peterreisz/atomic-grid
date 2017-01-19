import { Observable } from 'rxjs';
import { AtomicGridInMemoryDataProvider } from '../core/atomic-grid-inmemory-data-provider.class';
import { AtomicGridState, AtomicGridPage } from '../core/atomic-grid.types';

export class AtomicGridNg2InMemoryDataProvider<T> extends AtomicGridInMemoryDataProvider<T> {

  constructor(data: Array<T>) {
    super(data);
  }

  getPage(state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> | Observable<AtomicGridPage<T>> {
    return Observable.of(this.getPageData(state, additionalParams));
  }

}
