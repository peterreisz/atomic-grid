import { AtomicGridDataProvider, AtomicGridState, AtomicGridPage } from './atomic-grid.types';

export abstract class AtomicGridSpringDataProvider<T> implements AtomicGridDataProvider<T> {

  protected provider: AtomicGridDataProvider<T>;

  constructor() { }

  createParams(state: AtomicGridState, additionalParams?: any): any {
    let params: any = {
      size: state.size,
      page: state.page
    };

    Object.keys(additionalParams).forEach(
      key => {
        let value = additionalParams[key];
        if (value !== undefined && value !== '') {
          params[key] = value;
        }
      }
    );

    params.sort = state.sort.map(item => item.sortBy + ',' + (item.reverse ? 'desc' : 'asc'));

    return params;
  }

  getPage(state: AtomicGridState, additionalParams?: any): Promise<AtomicGridPage<T>> {
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
