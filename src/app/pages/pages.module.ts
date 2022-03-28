import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoutingModule} from "./routing.module";
import {HomeModule} from "./home/home.module";
import {ResponsiblePersonModule} from "./responsible-person/responsible-person.module";
import {ContractModule} from "./contract/contract.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutingModule,
    HomeModule,
    ResponsiblePersonModule,
    ContractModule
  ]
})
export class PagesModule { }
