import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, computed, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CreateProduct } from '../create-product/create-product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateProduct],
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

  // ✅ PAGINATION
  currentPage = signal(1);
  pageSize = 9;

  // ✅ FILTERED + SORTED DATA
  filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();
    if (search.length === 0) {
      return this.products()
        .sort((a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

    }

    return this.products()
      .filter((p: any) =>
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.code.toLowerCase().includes(search) ||
        p.color.toLowerCase().includes(search)
      )
      .sort((a: Product, b: Product) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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