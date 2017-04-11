import { AtomicGridPage, AtomicGridState, AtomicGridDataProvider, AtomicGridSort, AtomicGridPagerItem } from './atomic-grid.types';
import { AtomicGridSpringDataProvider } from './atomic-grid-spring-data-provider.class';

export abstract class AtomicGridController<T> {

  protected static BEFORE_SEARCH_EVENT = 'before-search';
  protected static AFTER_SEARCH_EVENT = 'after-search';
  protected static BEFORE_CHANGE_STATE = 'before-change-state';
  protected static BEFORE_CHANGE_SELECTION = 'before-change-selection';
  protected static AFTER_CHANGE_SELECTION = 'after-change-selection';

  public pageSizes = [10, 20, 50, 100];

  protected _page: AtomicGridPage<T>;

  protected _state: AtomicGridState = {
    size: 10,
    page: 0,
    sort: []
  };

  protected _requestParameters: Function;

  protected _dataProvider: AtomicGridDataProvider<T>;

  constructor(private element: HTMLElement) {
    this.resetState();
  }

  protected addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): Function {
    this.element.addEventListener(type, listener, useCapture);
    return () => this.element.removeEventListener(type, listener, useCapture)
  }

  protected dispatchBeforeEvent(doHandler: Function, ...types: string[]) {
    let events = types.map(type => {
      let event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, false, true, {
        do: doHandler
      });
      return event;
    });

    if (events.every(event => this.element.dispatchEvent(event))) {
      return doHandler();
    }
  }

  protected dispatchAfterEvent(type: string) {
    let event = document.createEvent('Event');
    event.initEvent(type, false, false);
    this.element.dispatchEvent(event);
  }

  onBeforeSearch(listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(AtomicGridController.BEFORE_SEARCH_EVENT, listener);
  }

  onAfterSearch(listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(AtomicGridController.AFTER_SEARCH_EVENT, listener);
  }

  onBeforeChangeState(listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(AtomicGridController.BEFORE_CHANGE_STATE, listener);
  }

  onBeforeChangeSelection(listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(AtomicGridController.BEFORE_CHANGE_SELECTION, listener);
  }

  onAfterChangeSelection(listener: EventListenerOrEventListenerObject) {
    return this.addEventListener(AtomicGridController.AFTER_CHANGE_SELECTION, listener);
  }

  resetState() {
    this._state.page = 0;
  }

  getRequestParameters() {
    if (this._dataProvider instanceof AtomicGridSpringDataProvider) {
      return this._dataProvider.createParams(this._state, this._requestParameters());
    }
    throw "Operation not supported";
  }

  setDataProvider(dataProvider: AtomicGridDataProvider<T>) {
    this._dataProvider = dataProvider;
    return this;
  }

  setRequestParameterProvider(fn: Function) {
    this._requestParameters = fn;
    return this;
  }

  protected _loading: boolean;
  get loading() {
    return this._loading;
  }

  setPageData(page: AtomicGridPage<T>) {
    this._page = page;
    this.reCalculatePager();
  }

  abstract setupDataProvider();

  search(reset?: boolean): Promise<AtomicGridPage<T>> {
    return new Promise((resolve, reject) => {
      let result = this.dispatchBeforeEvent(() => {
        if (reset) {
          this.resetState();
        }

        if (reset || !this._dataProvider) {
          this.setupDataProvider();
        }

        this._loading = true;

        this._dataProvider
          .getPage(this._state, this._requestParameters())
          .then(page => {
            this.handleAfterSearch(page);
            resolve(page);
          }, error => {
            this.handleAfterSearch();
            reject();
          });
        return true;
      });
      if (!result) {
        reject();
      }
    });
  }

  private handleAfterSearch(page?: AtomicGridPage<T>): void {
    this._selectedItems = [];
    this._loading = false;
    this.setPageData(page || {
      totalElements: 0,
      content: []
    });
    this.dispatchAfterEvent(AtomicGridController.AFTER_SEARCH_EVENT);
  }

  get isPrevEnabled() {
    return !this.loading && this.page > 1;
  }

  get isNextEnabled() {
    if (!this.loading && this._page) {
      return this._state.page < this.totalPages - 1;
    }
    return false;
  }

  get size() {
    return this._state.size;
  }

  set size(newPageSize: number) {
    this.dispatchBeforeEvent(() => {
      this._state.page = 0;
      this._state.size = parseInt(<any>newPageSize);
      this.search();
    }, AtomicGridController.BEFORE_CHANGE_STATE, AtomicGridController.BEFORE_CHANGE_SELECTION);
  }

  setSize(newPageSize: number) {
    this._state.size = newPageSize;
  }

  get page() {
    return this._state.page + 1;
  }

  set page(newPageNumber: number) {
    this.dispatchBeforeEvent(() => {
      this._state.page = newPageNumber - 1;
      this.search();
    }, AtomicGridController.BEFORE_CHANGE_STATE, AtomicGridController.BEFORE_CHANGE_SELECTION);
  }

  setPage(newPageNumber: number) {
    this._state.page = newPageNumber - 1;
  }

  first() {
    if (this.isPrevEnabled) {
      this.page = 1;
    }
  }

  prev() {
    if (this.isPrevEnabled) {
      this.page -= 1;
    }
  }

  next() {
    if (this.isNextEnabled) {
      this.page += 1;
    }
  }

  last() {
    if (this.isNextEnabled) {
      this.page = this.totalPages;
    }
  }

  protected pagerRange;
  protected _pager: AtomicGridPagerItem[] = [];

  protected reCalculatePager() {
    let pages: AtomicGridPagerItem[] = [];

    let min = Math.max( this._state.page - this.pagerRange + 1, 1 );
    let max = Math.min( this._state.page + this.pagerRange + 1, this.totalPages );

    for (let i = min; i <= max; i++) {
      pages.push({
        first: i == 1,
        last: i == this.totalPages,
        active: this._state.page + 1 == i,
        number: i,
        jump: () => this.page = i
      });
    }

    this._pager = pages;
  }

  get pager() {
    return this._pager;
  }

  get items() {
    return this._page ? this._page.content : [];
  }

  get totalElements() {
    return this._page ? this._page.totalElements : 0;
  }

  get totalPages() {
    return this._page ? Math.ceil(this.totalElements / this.size) : 0
  }

  get pageStart() {
    return this.size * (this.page - 1) + 1;
  }

  get pageEnd() {
    return Math.min(this.pageStart + this.size - 1, this.totalElements);
  }


  // Handle sorting

  setSort(sortBy: string|Function, reverse: boolean, append?: boolean) {
    this._state.page = 0;
    if (reverse === undefined && !append) {
      this._state.sort = [];
    } else if (append) {
      let item = this._state.sort.filter(item => item.sortBy == sortBy)[0];
      if (item) {
        if (reverse === undefined) {
          this._state.sort = this._state.sort.filter(item => item.sortBy != sortBy);
        } else {
          item.reverse = reverse;
        }
      } else {
        this._state.sort.push({
          sortBy, reverse
        })
      }
    } else {
      this._state.sort = [{
        sortBy, reverse
      }];
    }
  }

  sort(sortBy: string|Function, append?: boolean) {
    this.dispatchBeforeEvent(() => {
      let sort = this.getSortBy(sortBy);
      let reverse;
      if (sort === undefined) {
        reverse = false;
      } else if (sort.reverse === false) {
        reverse = true;
      }

      this.setSort(sortBy, reverse, append);
      this.search();
    }, AtomicGridController.BEFORE_CHANGE_STATE, AtomicGridController.BEFORE_CHANGE_SELECTION);
  }

  getSortBy(sortBy: string|Function): AtomicGridSort {
    let item = this._state.sort.filter(item => item.sortBy == sortBy)[0];
    if (item && this._state.sort.length > 1) {
      item = {
        sortBy,
        reverse: item.reverse,
        index: this._state.sort.indexOf(item) + 1
      }
    }
    return item;
  }


  // Handle selection

  protected _multiSelection: boolean = false;

  set multiSelection(value) {
    if (this._selectedItems && this._selectedItems.length > 1) {
      this._selectedItems = [ this._selectedItems[0] ];
    }
    this._multiSelection = value;
  }

  get multiSelection() {
    return this._multiSelection;
  }

  protected _selectedItems: Array<T> = [];

  get selectedItems(): undefined | Array<T> {
    if (this._multiSelection) {
      return this._selectedItems || [];
    }
  }

  get selectedItem(): undefined | T {
    if (!this._multiSelection && this._selectedItems && this._selectedItems.length > 0) {
      return this._selectedItems[0];
    }
  }

  selectItem(selected: boolean, item?: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let result = this.dispatchBeforeEvent(() => {
        if (item) {
          if (selected) {
            if (this._selectedItems.filter(i => i === item).length == 0) {
              if (this._multiSelection) {
                this._selectedItems.push(item);
              } else {
                this._selectedItems = [ item ];
              }
            }
          } else {
            this._selectedItems = this._selectedItems.filter(i => i !== item);
          }
        } else {
          if (selected) {
            if (this._multiSelection) {
              this._selectedItems = this._page.content.concat();
            } else {
              this._selectedItems = [ this._page.content[0] ];
            }
          } else {
            this._selectedItems = [];
          }
        }
        this.dispatchAfterEvent(AtomicGridController.AFTER_CHANGE_SELECTION);
        return true;
      }, AtomicGridController.BEFORE_CHANGE_SELECTION);

      resolve(result);
    });
  }

  toggleItemSelection(item?: T) {
    this.selectItem(!this.isItemSelected(item), item);
  }

  isItemSelected(item?: T): boolean|null {
    var pageSizeLength = this._state.size;
    if (this.items) {
      pageSizeLength = Math.min(this.items.length || pageSizeLength, pageSizeLength);
    }

    if (item) {
      return this._selectedItems.filter(i => i === item).length > 0;
    } else if (this._selectedItems.length == pageSizeLength) {
      return true;
    } else if (this._selectedItems.length == 0) {
      return false;
    }
    return null; // intermediate
  }

}
