import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AtomicGridNg2Controller } from './atomic-grid.ng2.controller';
import { AtomicGridNg2SortController } from './atomic-grid.ng2.sort.controller';

@NgModule({
  declarations: [
    AtomicGridNg2Controller,
    AtomicGridNg2SortController
  ],
  imports: [
    CommonModule,
    HttpModule
  ],
  exports: [
    AtomicGridNg2Controller,
    AtomicGridNg2SortController
  ]
})
export class AtomicGridNg2Module {
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: AtomicGridNg2Module,
      providers: configuredProviders
    };
  }
}
