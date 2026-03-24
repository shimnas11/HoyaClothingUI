import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  // ✅ SIGNAL STORE
  products = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  // ✅ LOAD FROM API
  loadProducts() {
    this.http.get<any[]>(`${this.apiUrl}/products`)
      .subscribe({
        next: (res) => {
          this.products.set(res);
        },
        error: (err) => {
          console.error('Error loading products', err);
        }
      });
  }

  // ✅ OPTIONAL REFRESH
  refreshProducts() {
    this.loadProducts();
  }

  // ✅ ADD PRODUCT
  addProducts(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product, {
      responseType: 'text' as 'json'
    });
  }
}