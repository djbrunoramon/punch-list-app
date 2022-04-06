import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PendencyRegistrationComponent} from "./pendency-registration.component";
import {SharedModule} from "../../../shared/shared.module";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [PendencyRegistrationComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, ReactiveFormsModule
  ],
  exports: [PendencyRegistrationComponent]
})
export class PendencyRegistrationModule { }
