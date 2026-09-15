import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { ProductShopService } from '../../../services/shops/product-shop-service';

type ProductSheet = 'filter' | 'sort' | null;

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  activeSheet: ProductSheet = null;
  readonly productService = inject(ProductShopService);
  readonly products = this.productService.products;

  openSheet(sheet: ProductSheet): void {
    this.activeSheet = sheet;
  }

  closeSheet(): void {
    this.activeSheet = null;
  }

  onFavoriteToggle(productId: string): void {
    const product = this.products().find((p: any) => p.id === productId);
    if (product) {
      product.isFavorite = !product.isFavorite;
    }
  }
}
