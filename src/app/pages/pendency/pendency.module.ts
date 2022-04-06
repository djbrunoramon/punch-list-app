import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PendencyComponent} from './pendency.component';
import {SharedModule} from "../../shared/shared.module";
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {RouterModule} from "@angular/router";
import {PendencyRegistrationModule} from "./pendency-registration/pendency-registration.module";


@NgModule({
  declarations: [
    PendencyComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, RouterModule, PendencyRegistrationModule
  ],
  exports: [PendencyComponent]
})
export class PendencyModule { }
