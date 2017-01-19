import { Observable } from 'rxjs';

import { AtomicGridDataProvider, AtomicGridState, AtomicGridPage } from './atomic-grid.types';

export abstract class AtomicGridSpringDataProvider<T> implements AtomicGridDataProvider<T> {

  protected provider: AtomicGridDataProvider<T>;

  constructor() { }

  createParams(state: AtomicGridState, additionalParams?: any): any {
    let params: any = {
      size: state.size,
      page: state.page
    };

    params.sort = state.sort.map(item => item.sortBy + ',' + (item.reverse ? 'desc' : 'asc'));

    if (additionalParams) {
      for (let key of Object.keys(additionalParams)) {
        let value = additionalParams[key];
        if (value) {
          params[key] = value;
        }
      }
    }

    return params;
  }

  getPage(state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> | Observable<AtomicGridPage<T>> {
    if (this.provider) {
      return this.provider.getPage(state, additionalParams);
    }

    return this.downloadPage(state, additionalParams);
  }

  isSpringDataPage(input: any) {
    return !!input['content'];
  }

  abstract downloadPage(state: AtomicGridState, additionalParams?: any);

}
