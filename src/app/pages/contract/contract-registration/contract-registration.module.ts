import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContractRegistrationComponent} from "./contract-registration.component";
import {SharedModule} from "../../../shared/shared.module";
import {AppMaterialModule} from "../../../shared/app-material/app-material.module";

@NgModule({
  declarations: [ContractRegistrationComponent],
  imports: [
    CommonModule, SharedModule, AppMaterialModule
  ],
  exports: [ContractRegistrationComponent]
})
export class ContractRegistrationModule { }
