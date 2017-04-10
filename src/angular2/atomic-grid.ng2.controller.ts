import { Directive, Input, OnInit, Inject, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg2InMemoryDataProvider } from './atomic-grid.ng2.inmemory-data-provider.class';
import { AtomicGridNg2SpringDataProvider } from './atomic-grid.ng2.spring-data-provider.class';
import { AtomicGridDataProvider } from '../core/atomic-grid.types';

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

  constructor(@Inject(Http) private http: Http,
              @Inject(ElementRef) elementRef: ElementRef) {
    super(elementRef.nativeElement);
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
      return;
    }

    this.setDataProvider(
      new AtomicGridNg2InMemoryDataProvider(this.data || [])
    );
  }

  canChangeState() {
    // TODO
    return Promise.resolve()
  }

  canChangeSelection() {
    // TODO
    return Promise.resolve()
  }

}
