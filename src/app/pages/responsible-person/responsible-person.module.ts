import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResponsiblePersonComponent} from "./responsible-person.component";



@NgModule({
  declarations: [ResponsiblePersonComponent],
  imports: [
    CommonModule
  ],
  exports: [ResponsiblePersonComponent]
})
export class ResponsiblePersonModule { }
