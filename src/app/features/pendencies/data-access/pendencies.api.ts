import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { Page, PageRequest, toPageParams } from '../../../shared/models/page';
import { Pendency, PendencyRequest } from './pendencies.models';

@Injectable({ providedIn: 'root' })
export class PendenciesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/api/v1/pendency`;

  listByContract(contractId: number, request: PageRequest): Observable<Page<Pendency>> {
    return this.http.get<Page<Pendency>>(`${this.url}/contract/${contractId}`, {
      params: toPageParams(request),
    });
  }

  get(id: number): Observable<Pendency> {
    return this.http.get<Pendency>(`${this.url}/${id}`);
  }

  create(request: PendencyRequest): Observable<Pendency> {
    return this.http.post<Pendency>(this.url, request);
  }

  update(id: number, request: PendencyRequest): Observable<Pendency> {
    return this.http.put<Pendency>(`${this.url}/${id}`, request);
  }
}
