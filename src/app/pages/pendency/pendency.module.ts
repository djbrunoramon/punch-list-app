import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendencyComponent } from './pendency.component';
import {SharedModule} from "../../shared/shared.module";
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    PendencyComponent
  ],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, RouterModule
  ],
  exports: [PendencyComponent]
})
export class PendencyModule { }
