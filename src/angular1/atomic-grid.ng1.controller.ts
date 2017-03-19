import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg1InMemoryDataProvider } from './atomic-grid.ng1.inmemory-data-provider.class';
import { AtomicGridNg1SpringDataProvider } from './atomic-grid.ng1.spring-data-provider.class';

export class AtomicGridNg1Controller<T> extends AtomicGridController<T> {

  static $inject = [ '$q', '$attrs', '$http', '$scope', '$parse' ];

  private name: string;

  private data;
  private url;
  private dataProvider;

  private additionalParameters;
  private canChangeStateFn: Function;
  private canChangeSelectionFn: Function;

  private autoSearch;

  constructor(private $q: ng.IQService,
              private $attrs: ng.IAttributes,
              private $http: ng.IHttpService,
              private $scope: ng.IScope,
              private $parse: ng.IParseService) {
    super();
  }

  $onInit() {
    this.pagerRange = this.pagerRange || 2;
    if (this.autoSearch === undefined) {
      this.autoSearch = true;
    }

    if (this.name) {
      this.$parse(this.name).assign(this.$scope, this);
    }

    this.setRequestParameterProvider(
      () => this.additionalParameters({})
    );
  }

  $postLink() {
    if (this.autoSearch) {
      this.search(true);
    }
  }

  $onChanges(change) {
    if (this._dataProvider && change.data && change.data.currentValue) {
      this.search(true);
    }
  }

  setupDataProvider() {
    let count = 0;
    if (!!this.$attrs['atGridData']) count++;
    if (!!this.$attrs['atGridUrl']) count++;
    if (!!this.$attrs['atGridDataProvider']) count++;

    if (count != 1) {
      throw "Only one of the following attributes must be set: at-grid-data, at-grid-url, at-grid-data-provider";
    }

    if (this.url) {
      this.setDataProvider(
        new AtomicGridNg1SpringDataProvider(this.$http, this.url)
      );
      return
    }

    if (this.$attrs['atGridDataProvider']) {
      this.setDataProvider({
        getPage: (state, additionalParams) => this.dataProvider({state, additionalParams})
      });
      return;
    }

    this.setDataProvider(new AtomicGridNg1InMemoryDataProvider(this.data || []));
  }

  canChangeState() {
    return super.canChangeState()
      .then(() => this.canChangeStateFn({}))
      .then(value => {
        if (value !== undefined && value !== true) {
          return Promise.reject(value);
        }
      });
  }

  canChangeSelection() {
    return Promise.resolve(this.canChangeSelectionFn({}))
      .then(value => {
        if (value !== undefined && value !== true) {
          return Promise.reject(value);
        }
      });
  }

  onStateChanged() {
    super.onStateChanged();
    this.$scope.$applyAsync();
  }

}
