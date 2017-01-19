import { Observable } from 'rxjs';

import { AtomicGridDataProvider, AtomicGridState, AtomicGridPage } from './atomic-grid.types';

export abstract class AtomicGridInMemoryDataProvider<T> implements AtomicGridDataProvider<T> {

  constructor(private data: Array<T>) {
  }

  abstract getPage(state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> | Observable<AtomicGridPage<T>>;

  protected getPageData(state: AtomicGridState, additionalParams?: any): AtomicGridPage<T> {

    // TODO: filter?

    let filtered = this.data.concat();

    if (state.sort.length > 0) {
      filtered.sort((a: T, b: T) => {
        var c = state.sort
          .map(sort => {
            // TODO: use reduce
            var fn = sort.sortBy instanceof Function ? sort.sortBy : this.getProperty(sort.sortBy);
            return this.compareProperty(fn(a), fn(b), sort.reverse);
          });

        return c.filter(item => item !== 0)[ 0 ];
      });
    }

    let page = filtered.slice(state.size * state.page, state.size * (state.page + 1));

    return {
      content: page,
      totalElements: filtered.length
    };
  }

  private getProperty(property: string) {
    return (item: T) => {
      // TODO: deep get
      return item[property];
    }
  }

  private compareProperty(a: any, b: any, reverse: boolean) {
    if (a == b) {
      return 0;
    }
    var isInOrder = a < b;

    if (typeof a === 'string' && typeof b === 'string') {
      isInOrder = a.localeCompare(b) < 0;
    }

    return (reverse ? isInOrder : !isInOrder) ? 1 : -1;
  }

}
