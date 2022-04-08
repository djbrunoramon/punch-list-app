import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPendency, Pendency} from "../model/pendency";
import {IPendencyDto} from "../model/pendency-dto";
import {IPendencyByStatus} from "../model/pendency-by-status";

@Injectable({
  providedIn: 'root'
})
export class PendencyService {

  private readonly API: string = environment.backend.baseURL;
  private readonly URL_API: string = this.API + '/api/v1/pendency';

  constructor(private http: HttpClient) { }

  public getAllPendency(idContract: number, page: string): Observable<any> {
    return this.http.get<IPendency[]>(`${this.URL_API}/contract/${idContract}?${page}`);
  }

  public getPendencyById(id: number): Observable<IPendency> {
    return this.http.get<IPendency>(`${this.URL_API}/${id}`);
  }

  public updatePendency(id: number, pendency: IPendencyDto): Observable<any> {
    return this.http.put<any>(`${this.URL_API}/${id}`, pendency);
  }

  public savePendency(pendency: IPendencyDto): Observable<any> {
    return this.http.post<any>(`${this.URL_API}`, pendency);
  }

  public getPendencyByStatus(idContract: number): Observable<IPendencyByStatus[]> {
    return this.http.get<IPendencyByStatus[]>(`${this.URL_API}/contract/${idContract}/chart/pie`);
  }
}
