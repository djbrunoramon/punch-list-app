import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PendencyStatus } from '../../pendencies/data-access/pendencies.models';
import { PriorityCount, StatusCount } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/api/v1/pendency/contract`;

  byStatus(contractId: number): Observable<StatusCount[]> {
    return this.http.get<StatusCount[]>(`${this.url}/${contractId}/chart/pie`);
  }

  byPriority(contractId: number, status: PendencyStatus): Observable<PriorityCount[]> {
    return this.http.get<PriorityCount[]>(
      `${this.url}/${contractId}/chart/bar/${encodeURIComponent(status)}`,
    );
  }
}
