export default class AppComponent<T> {

  data = [];

  constructor() {
    for (var i=0; i<100; i++) {
      this.data.push({
        a: Math.random() * 100,
        b: Math.random() * 100,
        c: Math.random() * 100,
        d: Math.random() * 100
      });
    }
  }
}
