import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private data = [];

  constructor() {
    for (var i=0; i<100; i++) {
      this.data.push({
        a: Math.random() * 100,
        b: Math.random() * 100,
        c: Math.random() * 100,
        d: Math.random() * 100
      })
    }
  }
}
