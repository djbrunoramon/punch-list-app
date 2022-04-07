import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResponsiblePerson} from "../../model/responsible-person";
import {ActivatedRoute, Router} from "@angular/router";
import {ResponsiblePersonService} from "../../services/responsible-person.service";
import {LoadingBarService} from "@ngx-loading-bar/core";

@Component({
  selector: 'app-responsible-person-registration',
  templateUrl: './responsible-person-registration.component.html',
  styleUrls: ['./responsible-person-registration.component.scss']
})
export class ResponsiblePersonRegistrationComponent implements OnInit {

  public formGroup!: FormGroup;
  public responsiblePerson!: ResponsiblePerson;
  public idResponsiblePerson!: number;
  private loader = this.loadingBarService.useRef();

  constructor(
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private responsiblePersonService: ResponsiblePersonService,
    private router: Router,
    private loadingBarService: LoadingBarService
  ) {
  }

  ngOnInit(): void {
    this.idResponsiblePerson = this.activateRoute.snapshot.params['id'];
    if (this.idResponsiblePerson && this.idResponsiblePerson > 0){
      this.getResponsiblePersonById(this.idResponsiblePerson);
    } else {
      this.builderForm();
    }
  }

  public builderForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.responsiblePerson?.name, [Validators.required]],
      occupation: [this.responsiblePerson?.occupation, [Validators.required]],
      department: [this.responsiblePerson?.department, [Validators.required]],
      idContract: [1]
    });
  }

  public save(): void {
    if (this.idResponsiblePerson && this.idResponsiblePerson > 0){
      this.updateResponsiblePerson();
    } else {
      this.saveResponsiblePerson();
    }
  }

  private getResponsiblePersonById(id: number) {
    this.loader.start();
    this.responsiblePersonService.getResponsiblePersonById(id).subscribe(
      data => {
        this.responsiblePerson = data;
        this.builderForm();
        this.loader.complete();
      }, () => this.loader.stop()
    );
  }

  private saveResponsiblePerson(): void {
    this.responsiblePersonService.saveResponsiblePerson(this.formGroup.value).subscribe(
      () => this.navidateGetAllResponsiblePerson()
    )
  }

  private updateResponsiblePerson(): void {
    this.responsiblePersonService.updateResponsiblePerson(this.idResponsiblePerson, this.formGroup.value).subscribe(
      () => this.navidateGetAllResponsiblePerson()
    )
  }

  private navidateGetAllResponsiblePerson() {
    this.router.navigate([`/responsible-person`]);
  }
}
