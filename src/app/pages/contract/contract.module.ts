import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContractComponent} from './contract.component';
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ContractRegistrationModule} from "./contract-registration/contract-registration.module";

@NgModule({
  declarations: [
    ContractComponent
  ],
    imports: [
        CommonModule, SharedModule, AppMaterialModule, RouterModule, ContractRegistrationModule
    ]
})
export class ContractModule { }
