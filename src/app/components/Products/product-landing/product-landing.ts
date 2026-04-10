import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateProduct } from '../create-product/create-product';
import { ProductList } from '../product-list/product-list';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-product-landing',
  imports: [CommonModule, FormsModule, CreateProduct, ProductList],
  templateUrl: './product-landing.html',
  styleUrl: './product-landing.css',
})
export class ProductLanding {
  showModal = false;
  /**
   *
   */
  constructor(private productService: ProductService) {


  }


  openModal() {
    this.showModal = true;
  }

  closeModal(event: boolean) {

    this.showModal = false;
    if (event) {
      this.productService.refreshProducts();
    }


  }

  refreshProduct() {
    this.productService.refreshProducts();
  }
}
