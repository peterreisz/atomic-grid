import { AtomicGridNg1Controller } from './atomic-grid.ng1.controller';
import { AtomicGridSort } from '../core/atomic-grid.types';

export class AtomicGridNg1SortController<T> {

  static $inject = [ '$element', '$attrs' ];

  static template = `
    <span ng-transclude></span>
    <span class="sort-icon"></span>
    <span class="sort-index" ng-if="$atGridSort.sortBy.index">{{ $atGridSort.sortBy.index }}</span>
  `;

  private sort;
  private sortFn;
  private atGrid: AtomicGridNg1Controller<T>;

  constructor(private $element: ng.IAugmentedJQuery, private $attrs: ng.IAttributes) { }

  $onInit() {
    this.sort = this.sortFn({}) || this.sort;
    this.$element.bind('click', $event => this.onClick($event));
    let defaultSort: string = this.$attrs['atGridDefaultSort'];
    if (typeof defaultSort !== 'undefined') {
      this.atGrid.setSort(this.sort, defaultSort === 'true');
    }
  }

  $doCheck() {
    if (this.oldSortBy !== this.sortBy) {
      this.oldSortBy = this.sortBy;

      if (this.oldSortBy === undefined) {
        this.$element.removeClass('sort-asc');
        this.$element.removeClass('sort-desc');
      }

      if (this.oldSortBy.reverse === true) {
        this.$element.addClass('sort-asc');
        this.$element.removeClass('sort-desc');
      }

      if (this.oldSortBy.reverse === false) {
        this.$element.removeClass('sort-asc');
        this.$element.addClass('sort-desc');
      }
    }
  }

  private oldSortBy: AtomicGridSort;
  get sortBy(): AtomicGridSort {
    return this.atGrid.getSortBy(this.sort);
  }

  onClick($event: JQueryMouseEventObject) {
    this.atGrid.sort(this.sort, $event.ctrlKey);
  }
}
