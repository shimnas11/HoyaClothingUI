import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AdditionalexpenseService {
  private apiUrl = environment.apiUrl;
  additionalExpenses = signal<any[]>([]);
  constructor(private http: HttpClient) { }

  addAdditionalExpenses(expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/masters/AdditionalExpenses`, expense, {
      responseType: 'text' as 'json'
    });
  }

  getAdditionalExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/masters/GetAdditionalExpenses`)
  }
}
