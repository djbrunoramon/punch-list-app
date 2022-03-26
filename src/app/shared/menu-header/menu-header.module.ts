import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuHeaderComponent} from "./menu-header.component";
import {AppMaterialModule} from "../app-material/app-material.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [MenuHeaderComponent],
  imports: [
    CommonModule, AppMaterialModule, RouterModule
  ],
  exports: [MenuHeaderComponent]
})
export class MenuHeaderModule { }
