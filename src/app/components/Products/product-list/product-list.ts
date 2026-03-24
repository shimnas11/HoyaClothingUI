import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: any[] = [];
  // filteredProducts: any[] = [];
  searchText = '';
  loading = true;
  constructor(private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef,
  ) { }



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts() {

    this.products = this.productService.getProducts()
  }

  filterProducts() {

    // const search = this.searchText.toLowerCase();

    // this.filteredProducts = this.products.filter(p =>
    //   p.name.toLowerCase().includes(search) ||
    //   p.code.toLowerCase().includes(search) ||
    //   p.color.toLowerCase().includes(search)
    // );
  }

  trackByCode(index: number, item: any) {
    return item.code;
  }

}