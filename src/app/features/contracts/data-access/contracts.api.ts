import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { Contract, ContractRequest } from './contracts.models';

@Injectable({ providedIn: 'root' })
export class ContractsApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/api/v1/contract`;

  list(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.url);
  }

  get(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.url}/${id}`);
  }

  create(request: ContractRequest): Observable<Contract> {
    return this.http.post<Contract>(this.url, request);
  }

  update(id: number, request: ContractRequest): Observable<Contract> {
    return this.http.put<Contract>(`${this.url}/${id}`, request);
  }
}
