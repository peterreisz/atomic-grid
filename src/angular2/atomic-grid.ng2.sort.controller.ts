import { Component, Input, Host, HostListener, Inject, HostBinding } from '@angular/core';
import { AtomicGridNg2Controller } from './atomic-grid.ng2.controller';
import { AtomicGridSort } from '../core/atomic-grid.types';

@Component({
  selector: '[atGridSort]',
  template: `
    <span>
      <ng-content></ng-content>
      <span class="sort-icon"></span>
      <span class="sort-index" *ngIf="sortBy?.index">{{ sortBy?.index }}</span>
    </span>
    `
})
export class AtomicGridNg2SortController<T> {

  @Input('atGridSort') sort: string|Function;

  constructor(@Host() @Inject(AtomicGridNg2Controller) private atGrid: AtomicGridNg2Controller<T>) { }

  get sortBy(): AtomicGridSort {
    return this.atGrid.getSortBy(this.sort);
  }

  @HostBinding('class.sort-asc')
  get sortAsc() {
    return this.sortBy && this.sortBy.reverse === false;
  }

  @HostBinding('class.sort-desc')
  get sortDesc() {
    return this.sortBy && this.sortBy.reverse === true;
  }

  @HostListener('click', ['$event'])
  private onSort($event: MouseEvent) {
    this.atGrid.sort(this.sort, $event.ctrlKey);
  }
}
