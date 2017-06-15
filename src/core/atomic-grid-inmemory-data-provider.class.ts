import { AtomicGridDataProvider, AtomicGridState, AtomicGridPage } from './atomic-grid.types';

export abstract class AtomicGridInMemoryDataProvider<T> implements AtomicGridDataProvider<T> {

  constructor(private data: Array<T>) {
  }

  abstract getPage(state: AtomicGridState, additionalParams?: any): Promise<AtomicGridPage<T>>;

  protected getPageData(state: AtomicGridState, additionalParams?: any): AtomicGridPage<T> {

    // TODO: filter?

    let filtered = this.data.concat();

    if (state.sort.length > 0) {
      filtered.sort((a: T, b: T) => {
        var c = state.sort
          .map(sort => {
            // TODO: use reduce
            var fn = sort.sortBy instanceof Function ? sort.sortBy : this.getProperty(sort.sortBy);
            return this.compareProperty(fn(a), fn(b), sort.reverse);
          });

        return c.filter(item => item !== 0)[ 0 ];
      });
    }

    let page = filtered.slice(state.size * state.page, state.size * (state.page + 1));

    return {
      content: page,
      totalElements: filtered.length
    };
  }

  // https://stackoverflow.com/a/6491621
  private getProperty(property: string) {
    return (item: T) => {
      property = property.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      property = property.replace(/^\./, '');           // strip a leading dot
      var parts = property.split('.');
      for (var i = 0, n = parts.length; i < n; ++i) {
        var part = parts[i];
        if (part in item) {
          item = item[part];
        } else {
          return;
        }
      }
      return item;
    }
  }

  private compareProperty(a: any, b: any, reverse: boolean) {
    if (a == b) {
      return 0;
    }
    var isInOrder = a < b;

    if (typeof a === 'string' && typeof b === 'string') {
      isInOrder = a.localeCompare(b) < 0;
    }

    return (reverse ? isInOrder : !isInOrder) ? 1 : -1;
  }

}
