import { Component, Inject, OnInit, PLATFORM_ID, computed, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products!: any;
  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.products = this.productService.products;
  }



  // ✅ SIGNAL FROM SERVICE

  // ✅ PAGINATION SIGNALS
  currentPage = signal(1);
  pageSize = 5;

  // ✅ COMPUTED PAGINATION
  paginatedProducts = computed(() => {
    const data = this.products();

    const sorted = [...data].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (this.currentPage() - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.products().length / this.pageSize)
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productService.loadProducts(); // ✅ LOAD API
    }
  }

  // ✅ PAGINATION METHODS
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(v => v + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(v => v - 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  trackByCode(index: number, item: any) {
    return item.code;
  }
}