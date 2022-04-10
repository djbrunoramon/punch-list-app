import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {SharedModule} from "../../shared/shared.module";
import {ChartPiePendencyByStatusModule} from "./chart-pie-pendency-by-status/chart-pie-pendency-by-status.module";
import {NgChartsModule} from 'ng2-charts';
import {ChartBarPendencyByPriorityModule} from "./chart-bar-pendency-by-priority/chart-bar-pendency-by-priority.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppMaterialModule,
    ChartPiePendencyByStatusModule,
    NgChartsModule,
    ChartBarPendencyByPriorityModule
  ]
})
export class HomeModule { }
