import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResponsiblePersonComponent} from "./responsible-person.component";
import {SharedModule} from "../../shared/shared.module";
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [ResponsiblePersonComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, RouterModule
  ],
  exports: [ResponsiblePersonComponent]
})
export class ResponsiblePersonModule { }
