import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoutingModule} from "./routing.module";
import {HomeModule} from "./home/home.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutingModule,
    HomeModule
  ]
})
export class PagesModule { }
