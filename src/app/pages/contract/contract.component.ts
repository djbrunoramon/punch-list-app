import {Component, OnInit, ViewChild} from '@angular/core';
import {ContractService} from "../services/contract.service";
import {IContract} from "../model/contract";
import * as moment from 'moment/moment';
import {LoadingBarCustomComponent} from "../../shared/loading/loading-bar-custom/loading-bar-custom.component";
import {LoadingBarService} from "@ngx-loading-bar/core";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [LoadingBarCustomComponent]
})
export class ContractComponent implements OnInit {

  public formatDate = 'YYYY-MM-DD';
  public moment = moment;
  public contracts: IContract[] = [];
  public displayedColumns: string[] = ['numberContract', 'description', 'startAt', 'address', 'action'];
  public dataSource: IContract[] = [];
  private loader = this.loadingBarService.useRef();

  constructor(
    private contractService: ContractService,
    private loadingBarService: LoadingBarService
  ) { }

  ngOnInit(): void {
    this.getAllContracts();
  }

  private getAllContracts(): void {
    this.loader.start();
    this.contractService.getAllContract().subscribe(data => {
      this.contracts = data;
      this.dataSource = this.contracts;
      this.loader.complete();
    }), () => this.loader.stop();
  }
}
