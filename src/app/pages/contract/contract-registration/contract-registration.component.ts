import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContractService} from "../../services/contract.service";
import {ActivatedRoute} from "@angular/router";
import {Contract} from "../../model/contract";
import * as moment from 'moment/moment';
import 'moment/locale/pt-br';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-contract-registration',
  templateUrl: './contract-registration.component.html',
  styleUrls: ['./contract-registration.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ContractRegistrationComponent implements OnInit {

  public formatDateTime = "DD/MM/YYYY";
  public moment = moment;
  public contract!: Contract;
  public formGroup!: FormGroup;
  private idContract!: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private contractService: ContractService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idContract = this.activateRoute.snapshot.params['id'];
    this.getContractById(this.idContract);
  }

  public getContractById(id: number): void {
    this.contractService.getContractById(id).subscribe(data => {
      this.contract = data;
      this.builderForm(data);
    });
  }

  public builderForm(contract: Contract): void {
    this.formGroup = this.formBuilder.group({
      numberContract: [this.contract?.numberContract, Validators.required],
      description: [this.contract?.description, Validators.required],
    })
  }

  public saveContract(): void {
    console.log(this.formGroup.value);
  }
}
