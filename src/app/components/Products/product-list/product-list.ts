import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, computed, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CreateProduct } from '../create-product/create-product';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateProduct],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products!: any;
  product: any = null;
  showModal = false;
  @Output() productEdited = new EventEmitter<boolean>();
  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.products = this.productService.products;
  }

  // ✅ SEARCH SIGNAL
  searchText = signal('');
  selectedSize = signal('');
  // ✅ PAGINATION
  currentPage = signal(1);
  pageSize = 9;

  // ✅ FILTERED + SORTED DATA
  filteredProducts = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    const selectedSize = this.selectedSize().trim().toLowerCase();

    return this.products()
      .filter((p: Product) => {
        // Product must be in stock
        if (p.totalQuantity <= 0) return false;

        // Search condition
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search) ||
          p.code.toLowerCase().includes(search) ||
          p.color.toLowerCase().includes(search);

        // Size condition
        const matchesSize =
          !selectedSize ||
          p.sizes?.some(
            (s: any) =>
              s.quantity > 0 &&
              s.size.toLowerCase() === selectedSize
          );

        return matchesSearch && matchesSize;
      })
      .sort(
        (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  });
  // ✅ PAGINATED DATA
  paginatedProducts = computed(() => {
    const data = this.filteredProducts();

    const start = (this.currentPage() - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  });

  // ✅ TOTAL PAGES (BASED ON FILTERED DATA)
  totalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.pageSize)
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productService.loadProducts();
    }
  }

  // ✅ SEARCH HANDLER
  onSearch(value: string) {
    this.searchText.set(value);
    this.currentPage.set(1); // reset page
  }

  onFilterChange(value: string) {
    this.selectedSize.set(value);
    this.currentPage.set(1);
  }

  // ✅ PAGINATION
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

  editProduct(product: any) {
    this.product = product;
    this.showModal = true;
  }

  closeModal(event: boolean) {
    this.showModal = false;
    this.product = null;
    this.productEdited.emit(event);
  }
}

export interface Product {
  id: string;
  name: string;
  code: string;
  color: string;
  sellingPrice: number;
  totalQuantity: number;
  createdAt: string;
  sizes: {
    size: string;
    quantity: number;
  }[];


}