import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartPiePendencyByStatusComponent} from "./chart-pie-pendency-by-status.component";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";
import {SharedModule} from "../../../shared/shared.module";
import {NgChartsModule} from "ng2-charts";


@NgModule({
  declarations: [ChartPiePendencyByStatusComponent],
  imports: [
    CommonModule, AppMaterialModule, SharedModule, NgChartsModule
  ],
  exports: [ChartPiePendencyByStatusComponent]
})
export class ChartPiePendencyByStatusModule { }
