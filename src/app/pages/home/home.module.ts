import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {SharedModule} from "../../shared/shared.module";
import {ChartPiePendencyByStatusModule} from "./chart-pie-pendency-by-status/chart-pie-pendency-by-status.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppMaterialModule,
    ChartPiePendencyByStatusModule
  ]
})
export class HomeModule { }
