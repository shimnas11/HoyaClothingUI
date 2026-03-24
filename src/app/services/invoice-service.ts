import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invoice`);

  }

  addInvoice(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/invoice`, product, {
      responseType: 'text' as 'json'
    });
  }
}
