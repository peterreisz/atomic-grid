import { AtomicGridNg1InMemoryDataProvider } from 'atomic-grid/dist/ng1';

export default class AppComponent {

  static $inject = [ '$q' ];
  
  data = [];
  provider;

  constructor(private $q: ng.IQService) { }

  $onInit() {
    for (var i=0; i<100; i++) {
      this.data.push({
        a: Math.random() * 100,
        b: Math.random() * 100,
        c: Math.random() * 100,
        d: Math.random() * 100
      })
    }
  }

  sortBy(item) {
    return -item.d;
  }

  getPage(state, additionalParams) {
    return new AtomicGridNg1InMemoryDataProvider(this.data, this.$q).getPage(state, additionalParams);
  }

  private sortBy2 = 'd';
}
