import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Contract} from "../model/contract";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private readonly URL_API: string = 'v1/contract';

  constructor(private http: HttpClient) { }

  public getAllContract(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.URL_API);
  }

  public getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.URL_API}/${id}`);
  }
}
