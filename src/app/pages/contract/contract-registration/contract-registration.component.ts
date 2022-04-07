import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContractService} from "../../services/contract.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Contract} from "../../model/contract";
import * as moment from 'moment/moment';
import 'moment/locale/en-in';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LoadingBarService} from "@ngx-loading-bar/core";

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
    {provide: MAT_DATE_LOCALE, useValue: 'en-in'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ContractRegistrationComponent implements OnInit {

  public moment = moment;
  public contract!: Contract;
  public formGroup!: FormGroup;
  private idContract = undefined;
  private loader = this.loadingBarService.useRef();

  constructor(
    private activateRoute: ActivatedRoute,
    private contractService: ContractService,
    private formBuilder: FormBuilder,
    private route: Router,
    private loadingBarService: LoadingBarService
  ) {
  }

  ngOnInit(): void {
    this.idContract = this.activateRoute.snapshot.params['id'];
    if (this.idContract && this.idContract > 0) {
      this.getContractById(this.idContract);
    } else {
      this.builderForm();
    }
  }

  public getContractById(id: number): void {
    this.loader.start();
    this.contractService.getContractById(id).subscribe(data => {
      this.contract = data;
      this.builderForm();

      this.loader.complete();
    }, () => this.loader.stop());
  }

  public builderForm(): void {
    this.formGroup = this.formBuilder.group({
      numberContract: [this.contract?.numberContract, [Validators.required, Validators.pattern(/[\S]/)]],
      description: [this.contract?.description, Validators.required],
      startAt: [this.contract?.startAt],
      scheduledTo: [this.contract?.scheduledTo ? this.contract?.scheduledTo : ''],
      address: [this.contract?.address, Validators.required],
      estimatedAt: [this.contract?.estimatedAt],
    })
  }

  public save(): void {
    if (this.idContract && this.idContract > 0) {
      this.updateContract();
    } else {
      this.saveContract();
    }
  }

  private saveContract(): void {
    this.contractService.saveContract(this.formGroup.value).subscribe(
      data => this.navidateGetAllContracts()
    );
  }

  private updateContract(): void {
    if (this.idContract) {
      this.contractService.updateContract(this.idContract, this.formGroup.value).subscribe(
        data => this.navidateGetAllContracts()
      );
    }
  }

  private navidateGetAllContracts() {
    this.route.navigate([`/contract`]);
  }
}
