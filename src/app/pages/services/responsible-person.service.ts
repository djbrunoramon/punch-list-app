import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResponsiblePerson} from "../model/responsible-person";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ResponsiblePersonService {

  private readonly API: string = environment.backend.baseURL;
  private readonly URL_API: string = this.API + '/api/v1/responsible-person';

  constructor(private http: HttpClient) { }

  public getAllResponsiblePerson(idContract: number): Observable<any> {
    return this.http.get<ResponsiblePerson[]>(`${this.URL_API}/contract/${idContract}`);
  }

  public getAllResponsiblePersonPage(idContract: number, page: string): Observable<any> {
    return this.http.get<ResponsiblePerson[]>(`${this.URL_API}/contract/${idContract}?${page}`);
  }

  public getResponsiblePersonById(id: number): Observable<ResponsiblePerson> {
    return this.http.get<ResponsiblePerson>(`${this.URL_API}/${id}`);
  }

  public updateResponsiblePerson(id: number, responsiblePerson: ResponsiblePerson): Observable<ResponsiblePerson> {
    return this.http.put<any>(`${this.URL_API}/${id}`, responsiblePerson);
  }

  public saveResponsiblePerson(responsiblePerson: ResponsiblePerson): Observable<ResponsiblePerson> {
    return this.http.post<any>(`${this.URL_API}`, responsiblePerson);
  }
}
