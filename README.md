# Atomic grid

Controller and data provider building blocks to create your own very special angular grid without writing any boilerplate code.

## Goal

There are several grid component supporting the angular framework, but most of them use the configuration method instead of the template approach.
So instead of using simple `table`, `tr` and `td` tags, you have to create a big configuration object with cell renderers and some other stuff.

With this approach you lose the simple way to arrange the part of the grid and design it with simple html and css.

Atomic grid try to solve this problem by giving building blocks for creating your own custom grid component in minutes.
Using this component you will get controllers and data providers for your grid without any view restriction.

## Install

```
npm install --save atomic-grid
```

## Basic usage

### Angular 1

#### Import

```ts
import * as angular from 'angular';
import { AtomicGridNg1ModuleFactory } from 'atomic-grid/dist/ng1';

angular.module('app', [ AtomicGridNg1ModuleFactory(angular) ]);
```

#### Template

```html
<table at-grid="myGrid"
       at-grid-data="..."
       at-grid-url="..."
       at-grid-data-provider="...">
  <tr>
    <th at-grid-sort="...">...</th>
    ...
  </tr>
  <tr ng-repeat="item in myGrid.items">
    <td>{{ item.field }}</td>
    ...
  </tr>
</table>
```

### Angular 2

#### Import

```ts
import { AtomicGridNg2Module } from 'atomic-grid/dist/ng2';

@NgModule({
  imports: [
    ...,
    AtomicGridNg2Module
  ]
})
export class AppModule { }
```

#### Template

```html
<table #myGrid="atGrid"
       [atGridData]="..."
       [atGridUrl]="..."
       [atGridDataProvider]="...">
  <tr>
    <th atGridSort="...">...</th>
  </tr>
  <tr *ngFor="let item of myGrid.items">
    <td>{{ item.field }}</td>
    ...
  </tr>
</table>
```

### Example projects

See them under the examples folder

## Api

### Bindings

Angular 1 | Angular 2 | Description
--- | --- | ---
`at-grid="myGrid"` | `#mygrid="atGrid"` | Create a reference for the controller
`at-grid-data="anArray"` | `[atGridData]="anArray"` | Set an array data provider
`at-grid-url="api/resource"` | `atGridUrl="api/resource"` | Set a spring data compatible url data provider
`at-grid-data-provider="..."` | TODO | Custom data provider
`at-grid-additional-parameters="params"` | `[atGridAdditionalParameters]="params"` | Additional parameters for the data provider 
`at-grid-multi-selection="false"` | `[atGridMultiSelection]="false"` | Turn on/off the multi selection

### Basics

Controller method / property | Description
--- | ---
`search(): Promise<AtomicGridPage<T>>` | Do a search with the current state of the grid
`items: Array<T>` | Get the content of the actual page

### Information
Controller method / property | Description
--- | ---
`size: number` | Get the actual page size
`page: number` | Get the actual page number
`totalElements: number` | Get the number of total elements
`totalPages: number` | Get the number of total pages
`pageStart: number` | Get the starting record number of the page
`pageEnd: number` | Get the ending record number of the page
`loading: boolean` | Is grid refreshing in progress

### Paging
Controller method / property | Description
--- | ---
`isPrevEnabled(): boolean` | Is the previous paging enabled?
`isNextEnabled(): boolean` | Is the next paging enabled?
`first(): void` | Jump to the first page
`prev(): void` | Jump to the previous page
`next(): void` | Jump to the next page
`last(): void` | Jump to the last page
`pager: Array<AtomicGridPagerItem>` | Get a pager object to render paging toolbar for the grid

### Sorting
Controller method / property | Description
--- | ---
`setSort(sortBy: string|Function, reverse: boolean, append?: boolean): void` | Change the grid sorting without doing a search.
`sort(sortBy: string|Function, append?: boolean)` | Change the grid sorting and refresh it's content
`getSortBy(sortBy: string|Function): AtomicGridSort` | Is the grid sort by the given field

### Paging
Controller method / property | Description
--- | ---
`setSize(newPageSize: number): void` | Change the grid page size without doing a search
`size: number` | Changing the property will change the page size and refresh the grid's content
`setPage(newPageNumber: number): void` | Change the grid page number without doing a search
`page: number` | Changing the property will change the page number and refresh the grid's content


### Selection
Controller method / property | Description
--- | ---
`multiSelection: boolean` | Getter/setter for is the multiselection enabled for the grid
`selectedItem: undefined | T` | Get the selected item if multiselection is disabled
`selectedItem: undefined| Array<T>` | Get the selected items if multiselection is enabled

### Events
Controller method / property | Description
--- | ---
`onBeforeSearch(listener)` | Trigger before do a search, can be cancelled
`onAfterSearch(listener)` | Trigger after do a search
`onBeforeChangeState(listener)` | Trigger before change state (page, size, sort), can be cancelled
`onBeforeChangeSelection(listener)` | Trigger before change selection (page, size, sort, selection), can be cancelled

## Use cases

### Initialize grid state with custom paging and sorting parameters

```html
<!-- Create a reference to the grid controller and disable autosearch -->
<table at-grid="$ctrl.myGrid" at-grid-auto-search="false">...</table>
```

```ts
myGrid: AtomicGridNg1Controller<T>

$postLink() {
  this.myGrid.setSort('field1', true); // Reverse sort by the field1
  this.myGrid.setSort('field2', false, true); // Sort by the field2 appended as second sorting
  this.myGrid.setSize(20); // Set page size to 20
  this.myGrid.setPage(2); // Go the the 2nd page
  this.myGrid.search(); // Do a search to fetch data
}
```

### Prevent changing the grid state

```ts
myGrid: AtomicGridNg1Controller<T>

$postLink() {
  this.myGrid.onBeforeChangeState((event: CustomEvent) => {
    event.preventDefault();
    confirm('sdfasdf') && event.detail.do();
  });
}
```



## TODO

* Documentation
* Live examples
* Tests


