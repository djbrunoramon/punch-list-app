import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ContractComponent} from "./contract/contract.component";
import {ResponsiblePersonComponent} from "./responsible-person/responsible-person.component";
import {ContractRegistrationComponent} from "./contract/contract-registration/contract-registration.component";
import {
  ResponsiblePersonRegistrationComponent
} from "./responsible-person/responsible-person-registration/responsible-person-registration.component";
import {PendencyComponent} from "./pendency/pendency.component";
import {PendencyRegistrationComponent} from "./pendency/pendency-registration/pendency-registration.component";

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
  },
  {
    path: 'responsible-person/:id',
    component: ResponsiblePersonRegistrationComponent
  },
  {
    path: 'pendency',
    component: PendencyComponent
  },
  {
    path: 'pendency/:id',
    component: PendencyRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
