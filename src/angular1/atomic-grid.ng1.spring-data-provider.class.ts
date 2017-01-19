import { AtomicGridState } from '../core/atomic-grid.types';
import { AtomicGridSpringDataProvider } from '../core/atomic-grid-spring-data-provider.class';
import { AtomicGridNg1InMemoryDataProvider } from './atomic-grid.ng1.inmemory-data-provider.class';

export class AtomicGridNg1SpringDataProvider<T> extends AtomicGridSpringDataProvider<T> {

  constructor(private $http: ng.IHttpService,
              private $q: ng.IQService,
              private url: string) {
    super();
  }

  downloadPage(state: AtomicGridState, additionalParams?: any) {
    return this.$http
      .get(this.url, {
        params: this.createParams(state, additionalParams)
      })
      .then(response => {
        var page = response.data;
        if (this.isSpringDataPage(page)) {
          return page;
        }

        this.provider = new AtomicGridNg1InMemoryDataProvider(<any>page, this.$q);
        return this.getPage(state, additionalParams);
      });
  }

}
