import { Observable } from 'rxjs';

export interface AtomicGridState {
  size: number
  page: number
  sort: Array<AtomicGridSort>
}

export interface AtomicGridSort {
  sortBy: string|Function
  reverse: boolean
  index?: number
}

export interface AtomicGridPage<T> {
  content: Array<T>
  totalElements: number
}

export interface AtomicGridDataProvider<T> {
  getPage(state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> | Observable<AtomicGridPage<T>>;
}

export interface AtomicGridPagerItem {
  first: boolean
  last: boolean
  active: boolean
  number: number
  jump: Function
}
