import { Component, OnInit } from '@angular/core';
import {PendencyService} from "../../services/pendency.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pendency} from "../../model/pendency";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {PendencyStatus} from "../../model/pendency-status";
import {ResponsiblePersonService} from "../../services/responsible-person.service";
import {ResponsiblePerson} from "../../model/responsible-person";
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
  selector: 'app-pendency-registration',
  templateUrl: './pendency-registration.component.html',
  styleUrls: ['./pendency-registration.component.scss'],
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
export class PendencyRegistrationComponent implements OnInit {

  public formGroup!: FormGroup;
  public pendency!: Pendency;
  public idPendency!: number;
  public responsiblePerson: ResponsiblePerson[] = [];
  private loader = this.loadingBarService.useRef();

  constructor(private formBuilder: FormBuilder,
              private pendencyService: PendencyService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private responsiblePersonService: ResponsiblePersonService,
              private loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    this.idPendency = this.activateRoute.snapshot.params['id'];
    this.getAllResponsiblePerson();
    if (this.idPendency && this.idPendency > 0){
      this.getPendencyById(this.idPendency);
    } else {
      this.builderForm();
    }
  }

  public builderForm(): void {
    this.formGroup = this.formBuilder.group({
      idContract: [1],
      areaIdentification: [this.pendency?.areaIdentification, Validators.required],
      tag: [this.pendency?.tag, Validators.required],
      description: [this.pendency?.description, Validators.required],
      priority: [this.pendency?.priority, Validators.required],
      status: [this.pendency?.status, Validators.required],
      discipline: [this.pendency?.discipline, Validators.required],
      registeredBy: [this.pendency?.registeredBy?.id, Validators.required],
      registeredTo: [this.pendency?.registeredTo?.id, Validators.required],

      expectedIn: [this.pendency?.expectedIn],
      finishedBy: [this.pendency?.finishedBy?.id],
      finishedAt: [this.pendency?.finishedAt],
      disapprovedBy: [this.pendency?.disapprovedBy?.id],
      disapprovedAt: [this.pendency?.disapprovedAt],
      canceledBy: [this.pendency?.canceledBy?.id],
      canceledAt: [this.pendency?.canceledAt]
    });
  }

  public save(): void {
    if (this.idPendency && this.idPendency > 0){
      this.updatePendency();
    } else {
      this.savePendency();
    }
  }

  public listStatusEnum(): string[] {
    return Object.keys(PendencyStatus);
  }

  private getPendencyById(id: number) {
    this.loader.start();
    this.pendencyService.getPendencyById(id).subscribe(
      data => {
        this.pendency = data;
        this.builderForm();
        this.loader.complete();
      }, () => this.loader.stop()
    );
  }

  private savePendency(): void {
    this.pendencyService.savePendency(this.formGroup.value).subscribe(
      () => this.navidateGetAllPendencies()
    )
  }

  private updatePendency(): void {
    this.pendencyService.updatePendency(this.idPendency, this.formGroup.value).subscribe(
      () => this.navidateGetAllPendencies()
    )
  }

  private navidateGetAllPendencies() {
    this.router.navigate([`/pendency`]);
  }

  private getAllResponsiblePerson(): void {
    this.responsiblePersonService.getAllResponsiblePerson(1).subscribe(
      data => {
        this.responsiblePerson = data.content
      }
    );
  }
}
