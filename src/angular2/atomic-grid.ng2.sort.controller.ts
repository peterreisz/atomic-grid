import { Component, Input, Host, HostListener } from '@angular/core';
import { AtomicGridNg2Controller } from './atomic-grid.ng2.controller';
import { AtomicGridSort } from '../core/atomic-grid.types';

@Component({
  selector: '[atGridSort]',
  template: `
    <span>
      <ng-content></ng-content>
      <span class="glyphicon glyphicon-chevron-up" *ngIf="sortBy?.reverse === false"></span>
      <span class="glyphicon glyphicon-chevron-down" *ngIf="sortBy?.reverse === true"></span>
      {{ sortBy?.index }}
    </span>
    `
})
export class AtomicGridNg2SortController<T> {

  @Input('atGridSort') sort: string|Function;

  constructor(@Host() private atGrid: AtomicGridNg2Controller<T>) { }

  get sortBy(): AtomicGridSort {
    return this.atGrid.getSortBy(this.sort);
  }

  @HostListener('click', ['$event'])
  private onSort($event: MouseEvent) {
    this.atGrid.sort(this.sort, $event.ctrlKey);
  }
}
