import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContractRegistrationComponent} from "./contract-registration.component";
import {SharedModule} from "../../../shared/shared.module";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [ContractRegistrationComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule, ReactiveFormsModule
  ],
  exports: [ContractRegistrationComponent]
})
export class ContractRegistrationModule { }
