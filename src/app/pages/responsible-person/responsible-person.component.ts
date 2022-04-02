import {Component, OnInit} from '@angular/core';
import {ResponsiblePersonService} from "../services/responsible-person.service";
import {IResponsiblePerson} from "../model/responsible-person";

@Component({
  selector: 'app-responsible-person',
  templateUrl: './responsible-person.component.html',
  styleUrls: ['./responsible-person.component.scss']
})
export class ResponsiblePersonComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'department', 'occupation', 'active', 'action'];
  public responsiblePersonList: IResponsiblePerson[] = [];
  public dataSource: IResponsiblePerson[] = [];

  constructor(private responsiblePersonService: ResponsiblePersonService) { }

  ngOnInit(): void {
    this.getAllResponsiblePerson();
  }

  public getAllResponsiblePerson(): void {
    this.responsiblePersonService.getAllResponsiblePerson(1)
      .subscribe(data => {
        this.dataSource = data.content
        this.responsiblePersonList = data.content;
    });
  }
}
