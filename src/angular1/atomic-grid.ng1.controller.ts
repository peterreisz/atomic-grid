import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg1InMemoryDataProvider } from './atomic-grid.ng1.inmemory-data-provider.class';
import { AtomicGridNg1SpringDataProvider } from './atomic-grid.ng1.spring-data-provider.class';

export class AtomicGridNg1Controller<T> extends AtomicGridController<T> {

  static $inject = [ '$q', '$attrs', '$http', '$scope', '$parse', '$element' ];

  private name: string;

  private data;
  private url;
  private dataProvider;

  private additionalParameters;

  private autoSearch;

  constructor(private $q: ng.IQService,
              private $attrs: ng.IAttributes,
              private $http: ng.IHttpService,
              private $scope: ng.IScope,
              private $parse: ng.IParseService,
              $element: ng.IAugmentedJQuery) {
    super($element[0]);
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
    this.onAfterSearch(() => {
      this.$scope.$applyAsync();
    });

    this.onAfterChangeSelection(() => {
      this.$scope.$applyAsync();
    });

    if (this.autoSearch) {
      this.search(true);
    }
  }

  $onChanges(change) {
    if (this._dataProvider && (
        change.data && change.data.currentValue
        || change.url && change.url.currentValue
      )) {
      if (this.autoSearch) {
        this.search(true);
      } else {
        this.setupDataProvider();
      }
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

}
