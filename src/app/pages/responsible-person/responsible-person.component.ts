import {Component, OnInit} from '@angular/core';
import {ResponsiblePersonService} from "../services/responsible-person.service";
import {IResponsiblePerson} from "../model/responsible-person";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-responsible-person',
  templateUrl: './responsible-person.component.html',
  styleUrls: ['./responsible-person.component.scss']
})
export class ResponsiblePersonComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'department', 'occupation', 'active', 'action'];
  public lengthPaginator!: number;
  public pageSizePaginator!: number;
  public pageIndexPaginator!: number;
  public pageSizeOptions: number[] = [1, 2, 10, 25, 100];
  public pageEvent!: PageEvent;

  public responsiblePersonList: IResponsiblePerson[] = [];
  public dataSource: IResponsiblePerson[] = [];

  constructor(private responsiblePersonService: ResponsiblePersonService) { }

  ngOnInit(): void {
    this.getAllResponsiblePerson();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  public getAllResponsiblePerson(): void {
    this.responsiblePersonService.getAllResponsiblePerson(1)
      .subscribe(data => {
        this.lengthPaginator = data.totalElements;
        this.pageSizePaginator = data.size;
        this.pageIndexPaginator = data.number;

        this.dataSource = data.content
        this.responsiblePersonList = data.content;
    });
  }
}
