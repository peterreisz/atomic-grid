import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AtomicGridNg2Module } from 'atomic-grid/dist/ng2';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AtomicGridNg2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
