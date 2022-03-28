import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppMaterialModule} from "./app-material/app-material.module";
import {MenuHeaderModule} from "./menu-header/menu-header.module";

@NgModule({
  imports: [
    CommonModule,
    MenuHeaderModule,
    AppMaterialModule
  ]
})
export class SharedModule { }
