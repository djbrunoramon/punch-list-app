import { Component, OnInit } from '@angular/core';

export interface IContract {
  id: number;
  contract: string;
  description: string;
  address: string;
}

const ELEMENT_DATA: IContract[] = [
  {id: 1, contract: 'BR-2022-1020', description: "Power Plant BR-1020", address: 'Fortaleza-BR'},
  {id: 2, contract: 'US-2022-1130', description: "Power Plant US-1130", address: 'Texas-USA'},
];

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  displayedColumns: string[] = ['id', 'contract', 'description', 'address'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
