import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Contract} from "../model/contract";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private readonly URL_API: string = 'api/v1/contract';

  constructor(private http: HttpClient) { }

  public getAllContract(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.URL_API);
  }

  public getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.URL_API}/${id}`);
  }

  public updateContract(id: number, contract: Contract): Observable<any> {
    return this.http.put<any>(`${this.URL_API}/${id}`, contract);
  }

  public saveContract(contract: Contract): Observable<any> {
    return this.http.post<any>(`${this.URL_API}`, contract);
  }
}
