import { Component, OnInit } from '@angular/core';
import {ContractService} from "../services/contract.service";
import {IContract} from "../model/contract";
import * as moment from 'moment/moment';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  public formatDate = 'YYYY-MM-DD';
  public moment = moment;
  public contracts: IContract[] = [];
  public displayedColumns: string[] = ['numberContract', 'description', 'startAt', 'address', 'action'];
  public dataSource: IContract[] = [];

  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.getAllContracts();
  }

  private getAllContracts(): void {
    this.contractService.getAllContract().subscribe(data => {
      this.contracts = data;
      this.dataSource = this.contracts;
    });
  }
}
