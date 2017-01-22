import { AtomicGridPage, AtomicGridState, AtomicGridDataProvider, AtomicGridSort } from './atomic-grid.types';

export abstract class AtomicGridController<T> {

  protected pageSizes = [10, 20, 50, 100];

  protected _page: AtomicGridPage<T>;

  protected _state: AtomicGridState = {
    size: 10,
    page: 0,
    sort: []
  };

  protected _requestParameters: Function;

  protected _dataProvider: AtomicGridDataProvider<T>;

  constructor() {
    this.resetState();
  }

  resetState() {
    this._state.page = 0;
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

  abstract search();

  get isPrevEnabled() {
    return this.page > 1;
  }

  get isNextEnabled() {
    if (this._page) {
      return this._state.page < this.totalPages - 1;
    }
    return false;
  }

  get size() {
    return this._state.size;
  }

  set size(newPageSize: number) {
    this._state.page = 0;
    this._state.size = parseInt(<any>newPageSize);
    this.search();
  }

  get page() {
    return this._state.page + 1;
  }

  set page(newPageNumber: number) {
    this._state.page = newPageNumber - 1;
    this.search();
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

  sort(sortBy: string|Function, append?: boolean) {
    let sort = this.getSortBy(sortBy);
    let reverse;
    if (sort === undefined) {
      reverse = false;
    } else if (sort.reverse === false) {
      reverse = true;
    }

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

    this.search();
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
    if (this._selectedItems.length > 1) {
      this._selectedItems = [ this._selectedItems[0] ];
    }
    this._multiSelection = value;
  }

  get multiSelection() {
    return this._multiSelection;
  }

  protected _selectedItems: Array<T> = [];

  get selectedItems(): undefined | T | Array<T> {
    if (this._multiSelection) {
      return this._selectedItems;
    }
    if (this._selectedItems.length > 0) {
      return this._selectedItems[0];
    }
  }

  selectItem(selected: boolean, item?: T) {
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
  }

  toggleItemSelection(item?: T) {
    this.selectItem(!this.isItemSelected(item), item);
  }

  isItemSelected(item?: T) {
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
    return null;
  }

}
