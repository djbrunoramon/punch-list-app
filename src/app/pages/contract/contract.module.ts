import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContractComponent} from './contract.component';
import {AppMaterialModule} from "../../shared/app-material/app-material.module";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    ContractComponent
  ],
    imports: [
        CommonModule, SharedModule, AppMaterialModule, RouterModule
    ]
})
export class ContractModule { }
