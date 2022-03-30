import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ContractComponent} from "./contract/contract.component";
import {ResponsiblePersonComponent} from "./responsible-person/responsible-person.component";
import {ContractRegistrationComponent} from "./contract/contract-registration/contract-registration.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'contract',
    component: ContractComponent
  },
  {
    path: 'contract/:id',
    component: ContractRegistrationComponent
  },
  {
    path: 'responsible-person',
    component: ResponsiblePersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
