import { Observable, Subject } from 'rxjs';

import { Directive, Input, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg2InMemoryDataProvider } from './atomic-grid.ng2.inmemory-data-provider.class';
import { AtomicGridNg2SpringDataProvider } from './atomic-grid.ng2.spring-data-provider.class';
import { AtomicGridPage, AtomicGridDataProvider } from '../core/atomic-grid.types';

@Directive({
  selector: '[atGridData],[atGridUrl]',
  exportAs: 'atGrid'
})
export class AtomicGridNg2Controller<T> extends AtomicGridController<T> implements OnInit {

  @Input('atGridData') data: Array<T>;
  @Input('atGridUrl') url: string;
  @Input('atGridDataProvider') dataProvider: AtomicGridDataProvider<T>;
  @Input('atGridAdditionalParameters') additionalParameters;
  @Input('atGridAutoSearch') autoSearch: boolean = true;

  constructor(@Inject(Http) private http: Http) {
    super();
  }

  ngOnInit() {
    this.setRequestParameterProvider(() => this.additionalParameters);
    if (this.autoSearch) {
      this.search(true);
    }
  }

  setupDataProvider() {
    let count = 0;
    if (this.data) count++;
    if (this.url) count++;
    if (this.dataProvider) count++;

    if (count != 1) {
      throw "Only one of the following attributes must be set: atGridData, atGridUrl, atGridDataProvider";
    }

    if (this.url) {
      this.setDataProvider(
        new AtomicGridNg2SpringDataProvider(this.http, this.url)
      );
      return
    }

    this.setDataProvider(
      new AtomicGridNg2InMemoryDataProvider(this.data || [])
    );
  }

  search(reset?: boolean) {
    if (reset) {
      this.resetState();
      this.setupDataProvider();
    }

    this._loading = true;

    var result: Observable<AtomicGridPage<T>> = <any>this._dataProvider
      .getPage(this._state, this._requestParameters());

    let subject = new Subject();

    result
      .finally(() => {
        this._selectedItems = [];
        this._loading = false;
      })
      .subscribe(page => {
        this._page = page;
        subject.next(page);
        subject.complete();
      }, error => {
        this._page = {
          totalElements: 0,
          content: []
        };
        subject.error(error);
      });

    return subject.asObservable();
  }

}
