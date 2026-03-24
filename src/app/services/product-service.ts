import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  products = signal<any[]>([]);
  constructor(private http: HttpClient) { }

  getProducts(): any[] {
    return this.products();
  }



  loadProducts() {
    this.http.get<any[]>(`${this.apiUrl}/products`).subscribe(res => {
      this.products.set(res);
    });
  }

  refreshProducts() {
    this.loadProducts();
  }
  addProducts(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product, {
      responseType: 'text' as 'json'
    });
  }
}
