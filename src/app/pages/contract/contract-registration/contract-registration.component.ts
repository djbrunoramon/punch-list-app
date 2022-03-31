import { Component, OnInit } from '@angular/core';
import {ContractService} from "../../services/contract.service";
import {ActivatedRoute} from "@angular/router";
import {Contract} from "../../model/contract";
import * as moment from 'moment/moment';

@Component({
  selector: 'app-contract-registration',
  templateUrl: './contract-registration.component.html',
  styleUrls: ['./contract-registration.component.scss']
})
export class ContractRegistrationComponent implements OnInit {

  public formatDateTime = "DD/MM/YYYY HH:mm";
  public moment = moment;
  public contract!: Contract;
  private idContract!: number;



  constructor(
    private activateRoute: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.idContract = this.activateRoute.snapshot.params['id'];
    this.getContractById(this.idContract);
    console.log(moment());
  }

  public getContractById(id: number): void {
    this.contractService.getContractById(id).subscribe(data => {
      this.contract = data;
    });
  }
}
