import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { Page, PageRequest, toPageParams } from '../../../shared/models/page';
import { ResponsiblePerson, ResponsiblePersonRequest } from './responsible-persons.models';

@Injectable({ providedIn: 'root' })
export class ResponsiblePersonsApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/api/v1/responsible-person`;

  listByContract(contractId: number, request: PageRequest): Observable<Page<ResponsiblePerson>> {
    return this.http.get<Page<ResponsiblePerson>>(`${this.url}/contract/${contractId}`, {
      params: toPageParams(request),
    });
  }

  get(id: number): Observable<ResponsiblePerson> {
    return this.http.get<ResponsiblePerson>(`${this.url}/${id}`);
  }

  create(request: ResponsiblePersonRequest): Observable<ResponsiblePerson> {
    return this.http.post<ResponsiblePerson>(this.url, request);
  }

  update(id: number, request: ResponsiblePersonRequest): Observable<ResponsiblePerson> {
    return this.http.put<ResponsiblePerson>(`${this.url}/${id}`, request);
  }
}
