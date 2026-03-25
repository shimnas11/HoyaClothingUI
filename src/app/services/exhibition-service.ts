import { Injectable, OnDestroy, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExhibitionService {
  private apiUrl = environment.apiUrl;
  exhibitions = signal<any[]>([]);
  constructor(private http: HttpClient) { }


  getExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/getAll`)
  }

  getDetails(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/Details/${id}`)
  }


  addExhibitions(exhibition: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exhibitions`, exhibition, {
      responseType: 'text' as 'json'
    });
  }

  addExpenses(expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exhibitions/expenses`, expense, {
      responseType: 'text' as 'json'
    });
  }
}
