import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateDamage, Product } from '../models/product.model';
import { DamagedProducts } from '../components/Products/damaged-products/damaged-products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  // ✅ SIGNAL STORE
  products = signal<any[]>([]);

  constructor(private http: HttpClient) { }

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

  // ✅ ADD PRODUCT
  updateProducts(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/Update/${id}`, product, {
      responseType: 'text' as 'json'
    });
  }
  markProductDamaged(model: CreateDamage) {
    return this.http.post<string>(
      `${this.apiUrl}/damage`,
      model, {
      responseType: 'text' as 'json'
    }
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(
      `${this.apiUrl}/products/${id}`
    );
  }

  getDamageProducts() {
    return this.http.get<any[]>(
      `${this.apiUrl}/damage`
    );
  }

}