import { AtomicGridController } from '../core/atomic-grid.controller';
import { AtomicGridNg1InMemoryDataProvider } from './atomic-grid.ng1.inmemory-data-provider.class';
import { AtomicGridNg1SpringDataProvider } from './atomic-grid.ng1.spring-data-provider.class';
import { AtomicGridPage, AtomicGridState } from '../core/atomic-grid.types';

export class AtomicGridNg1Controller<T> extends AtomicGridController<T> {

  static $inject = [ '$q', '$attrs', '$http', '$scope', '$parse' ];

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

    this.setupDataProvider();
    this.setRequestParameterProvider(
      () => this.additionalParameters({})
    );

    if (this.autoSearch) {
      this.search();
    }
  }

  setupDataProvider() {
    let count = 0;
    if (this.data) count++;
    if (this.url) count++;
    if (!!this.$attrs['atGridDataProvider']) count++;

    if (count != 1) {
      throw "Only one of the following attributes must be set: at-grid-data, at-grid-url, at-grid-data-provider";
    }

    if (this.data) {
      this.setDataProvider(
        new AtomicGridNg1InMemoryDataProvider(
          this.data, this.$q
        )
      );
    }

    if (this.url) {
      this.setDataProvider(
        new AtomicGridNg1SpringDataProvider(this.$http, this.$q, this.url)
      )
    }

    if (this.$attrs['atGridDataProvider']) {
      this.setDataProvider({
        getPage: (state: AtomicGridState, additionalParams?: any): ng.IPromise<AtomicGridPage<T>> => this.dataProvider({state, additionalParams})
      });
    }
  }

  search(reset?: boolean) {

    if (reset) {
      this.resetState();
    }

    this._loading = true;

    var promise:any = this._dataProvider
      .getPage(this._state, this._requestParameters());

    promise.finally(() => {
        this._selectedItems = [];
        this._loading = false;
      })
      .then(page => {
        this.setPageData(page);
      }, error => {
        this.setPageData({
          totalElements: 0,
          content: []
        });
      });
  }

}
