import {Component, OnInit} from '@angular/core';
import {ResponsiblePersonService} from "../services/responsible-person.service";
import {IResponsiblePerson} from "../model/responsible-person";
import {PageEvent} from "@angular/material/paginator";
import {LoadingBarService} from "@ngx-loading-bar/core";

@Component({
  selector: 'app-responsible-person',
  templateUrl: './responsible-person.component.html',
  styleUrls: ['./responsible-person.component.scss']
})
export class ResponsiblePersonComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'department', 'occupation', 'active', 'action'];
  public lengthPaginator!: number;
  public pageSizePaginator: number = 10;
  public pageIndexPaginator: number = 0;
  public pageSizeOptions: number[] = [10, 25, 100];
  public pageEvent!: PageEvent;
  public pageFilter?: string;

  public responsiblePersonList: IResponsiblePerson[] = [];
  public dataSource: IResponsiblePerson[] = [];
  private loader = this.loadingBarService.useRef();

  constructor(private responsiblePersonService: ResponsiblePersonService,
              private loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    this.getAllResponsiblePersonPage(true);
  }

  public getAllResponsiblePerson(): void {
    this.responsiblePersonService.getAllResponsiblePerson(1)
      .subscribe(data => {
        this.lengthPaginator = data.totalElements;
        this.pageSizePaginator = data.pageable.pageSize;
        this.pageIndexPaginator = data.pageable.pageNumber;

        this.dataSource = data.content
        this.responsiblePersonList = data.content;
    });
  }

  public getAllResponsiblePersonPage(init?: boolean): void {
    this.loader.start();
    if (init) {
      this.pageFilter = 'sort=name,asc';
    } else {
      this.pageSizePaginator = this.pageEvent.pageSize;
      this.pageIndexPaginator = this.pageEvent.pageIndex;
      this.pageFilter = `page=${this.pageIndexPaginator}&size=${this.pageSizePaginator}&sort=name,asc`;
    }

    this.responsiblePersonService.getAllResponsiblePersonPage(1, this.pageFilter)
      .subscribe(data => {
        this.lengthPaginator = data.totalElements;
        this.pageSizePaginator = data.pageable.pageSize;
        this.pageIndexPaginator = data.pageable.pageNumber;

        this.dataSource = data.content
        this.responsiblePersonList = data.content;
        this.loader.complete();
      }, () => this.loader.stop());
  }
}
