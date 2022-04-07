import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingBarCustomComponent} from "./loading-bar-custom.component";
import {AppMaterialModule} from "../../app-material/app-material.module";
import {LoadingBarModule} from "@ngx-loading-bar/core";

@NgModule({
  declarations: [LoadingBarCustomComponent],
  imports: [
    CommonModule, AppMaterialModule, LoadingBarModule
  ],
  exports: [LoadingBarCustomComponent]
})
export class LoadingBarCustomModule {}
