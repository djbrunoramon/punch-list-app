import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoutingModule} from "./routing.module";
import {HomeModule} from "./home/home.module";
import {ResponsiblePersonModule} from "./responsible-person/responsible-person.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutingModule,
    HomeModule,
    ResponsiblePersonModule
  ]
})
export class PagesModule { }
