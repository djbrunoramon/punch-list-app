import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartBarPendencyByPriorityComponent} from "./chart-bar-pendency-by-priority.component";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";
import {SharedModule} from "../../../shared/shared.module";
import {NgChartsModule} from "ng2-charts";



@NgModule({
  declarations: [ChartBarPendencyByPriorityComponent],
  imports: [
    CommonModule, AppMaterialModule, SharedModule, NgChartsModule
  ],
  exports: [ChartBarPendencyByPriorityComponent]
})
export class ChartBarPendencyByPriorityModule { }
