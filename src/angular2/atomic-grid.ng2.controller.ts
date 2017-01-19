import { Observable } from 'rxjs';

import { Directive, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg2InMemoryDataProvider } from './atomic-grid.ng2.inmemory-data-provider.class';
import { AtomicGridNg2SpringDataProvider } from './atomic-grid.ng2.spring-data-provider.class';
import { AtomicGridPage } from '../core/atomic-grid.types';

@Directive({
  selector: '[atGridData],[atGridUrl]',
  exportAs: 'atGrid'
})
export class AtomicGridNg2Controller<T> extends AtomicGridController<T> implements OnInit {

  @Input('atGridData') data;
  @Input('atGridUrl') url;
  @Input('atGridDataProvider') dataProvider;
  @Input('atGridAdditionalParameters') additionalParameters;

  constructor(private http: Http) {
    super();
  }

  ngOnInit() {
    this.setupDataProvider();
    this.setRequestParameterProvider(() => this.additionalParameters);
    this.search();
  }

  setupDataProvider() {
    let count = 0;
    if (this.data) count++;
    if (this.url) count++;
    if (this.dataProvider) count++;

    if (count != 1) {
      throw "Only one of the following attributes must be set: atGridData, atGridUrl, atGridDataProvider";
    }

    if (this.data) {
      this.setDataProvider(
        new AtomicGridNg2InMemoryDataProvider(this.data)
      );
    }

    if (this.url) {
      this.setDataProvider(
        new AtomicGridNg2SpringDataProvider(this.http, this.url)
      )
    }
  }

  search(reset?: boolean) {
    if (reset) {
      this.resetState();
    }

    this._loading = true;

    var result: Observable<AtomicGridPage<T>> = <any>this._dataProvider
      .getPage(this._state, this._requestParameters());

    result
      .finally(() => {
        this._selectedItems = [];
        this._loading = false;
      })
      .subscribe(page => {
        this._page = page;
      }, error => {
        this._page = {
          totalElements: 0,
          content: []
        };
      });
  }

}
