import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private apiUrl = environment.apiUrl;
  additionalExpenses = signal<any[]>([]);
  constructor(private http: HttpClient) { }



  getMasterList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/masters/GetMasterList`)
  }
}
