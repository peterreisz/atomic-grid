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
       at-grid-data-provider="..."
       at-grid-additional-parameters="..."
       at-grid-multi-selection="...">
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
       [atGridDataProvider]="..."
       [atGridMultiSelection]="..."
       [atGridAdditionalParameters]="...">
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

### Attributes

`at-grid="myGrid"` / `#mygrid="atGrid"`:
Register the grid controller to the context 

`atGridData` / `at-grid-data`:
Array of the data

`atGridUrl` / `at-grid-url`:
Url for requesting data from the server

Format: GET `url?page=X&size=X&sort=X,asc/desc&additionalparam1=value1...`

Fully compatible with spring data controller (Pageable, Page&lt;T&gt;)

`atGridDataProvider` / `at-grid-data-provider`:
Custom data provider

`atGridAdditionalParameters` / `at-grid-additional-parameters`:
Additional parameters for the data provider 

`atGridMultiSelection` / `at-grid-multi-selection`:
Turn on/off the multi selection



## TODO

* Documentation
* Live examples
* Tests


