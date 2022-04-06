import {Component, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {IPendency} from "../model/pendency";
import {PendencyService} from "../services/pendency.service";
import * as moment from "moment";

@Component({
  selector: 'app-pendency',
  templateUrl: './pendency.component.html',
  styleUrls: ['./pendency.component.scss']
})
export class PendencyComponent implements OnInit {

  public formatDate = 'YYYY-MM-DD';
  public moment = moment;

  public displayedColumns: string[] = ['id', 'tag', 'areaIdentification', 'description', 'registeredBy','createdAt', 'status', 'action'];
  public lengthPaginator!: number;
  public pageSizePaginator: number = 10;
  public pageIndexPaginator: number = 0;
  public pageSizeOptions: number[] = [10, 25, 100];
  public pageEvent!: PageEvent;
  public pageFilter?: string;

  public dataSource: IPendency[] = [];
  public pendencyList: IPendency[] = [];

  constructor(
    private pendencyService: PendencyService
  ) { }

  ngOnInit(): void {
    this.getAllPendency(true);
  }

  public getAllPendency(init?: boolean): void {
    if (init) {
      this.pageFilter = `sort=id,asc&size=${this.pageSizePaginator}&page=${this.pageIndexPaginator}`
    } else {
      this.pageSizePaginator = this.pageEvent.pageSize;
      this.pageIndexPaginator = this.pageEvent.pageIndex;
      this.pageFilter = `page=${this.pageIndexPaginator}&size=${this.pageSizePaginator}&sort=id,asc`;
    }

    this.pendencyService.getAllPendency(1, this.pageFilter).subscribe(
      data => {
        this.lengthPaginator = data.totalElements;
        this.pageSizePaginator = data.pageable.pageSize;
        this.pageIndexPaginator = data.pageable.pageNumber;

        this.dataSource = data.content;
        this.pendencyList = data.content;
      }
    )
  }
}
