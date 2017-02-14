import { AtomicGridNg1Controller } from './atomic-grid.ng1.controller';
import { AtomicGridSort } from '../core/atomic-grid.types';

export class AtomicGridNg1SortController<T> {

  static $inject = [ '$element', '$attrs' ];

  static template = `
    <span ng-transclude></span>
    
    <span class="glyphicon glyphicon-chevron-up" ng-show="$atGridSort.sortBy.reverse === false"></span>
    <span class="glyphicon glyphicon-chevron-down" ng-show="$atGridSort.sortBy.reverse === true"></span>
    <span class="badge">{{ $atGridSort.sortBy.index }}</span>
  `;

  private sort;
  private sortFn;
  private atGrid: AtomicGridNg1Controller<T>;

  constructor(private $element: JQueryStatic, private $attrs: ng.IAttributes) { }

  $onInit() {
    this.sort = this.sortFn({}) || this.sort;
    this.$element.bind('click', $event => this.onClick($event));
    let defaultSort: string = this.$attrs['atGridDefaultSort'];
    if (typeof defaultSort !== 'undefined') {
      this.atGrid.setSort(this.sort, defaultSort === 'true');
    }
  }

  get sortBy(): AtomicGridSort {
    return this.atGrid.getSortBy(this.sort);
  }

  onClick($event: MouseEvent) {
    this.atGrid.sort(this.sort, $event.ctrlKey);
  }
}
