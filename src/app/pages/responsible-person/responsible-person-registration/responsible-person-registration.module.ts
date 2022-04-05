import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResponsiblePersonRegistrationComponent} from "./responsible-person-registration.component";
import {SharedModule} from "../../../shared/shared.module";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ResponsiblePersonRegistrationComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, ReactiveFormsModule
  ],
  exports: [ResponsiblePersonRegistrationComponent]
})
export class ResponsiblePersonRegistrationModule { }
