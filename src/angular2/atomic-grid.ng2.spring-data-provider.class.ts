import 'rxjs/add/operator/toPromise';

import { Http, URLSearchParams } from '@angular/http';
import { AtomicGridDataProvider, AtomicGridState, AtomicGridPage } from '../core/atomic-grid.types';
import { AtomicGridSpringDataProvider } from '../core/atomic-grid-spring-data-provider.class';
import { AtomicGridNg2InMemoryDataProvider } from './atomic-grid.ng2.inmemory-data-provider.class';

export class AtomicGridNg2SpringDataProvider<T> extends AtomicGridSpringDataProvider<T> {

  protected provider: AtomicGridDataProvider<T>;

  constructor(private http: Http, private url: string) {
    super();
  }

  createURLSearchParams(params: any): URLSearchParams {
    let search = new URLSearchParams();

    for (let key of Object.keys(params)) {
      let value = params[key];
      if (value instanceof Array) {
        value.forEach(value => search.append(key, value));
      } else {
        search.set(key, value);
      }
    }

    return search;
  }

  downloadPage(state: AtomicGridState, additionalParams?: any) {
    let params = this.createParams(state, additionalParams);
    let search = this.createURLSearchParams(params);

    return this.http
      .get(this.url, { search })
      .toPromise()
      .then(response => response.json())
      .then((page: AtomicGridPage<T>) => {

        if (this.isSpringDataPage(page)) {
          return page;
        }

        this.provider = new AtomicGridNg2InMemoryDataProvider(<any>page);
        return this.getPage(state, additionalParams);
      });
  }

}
