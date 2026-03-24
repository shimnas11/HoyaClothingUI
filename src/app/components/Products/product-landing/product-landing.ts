import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateProduct } from '../create-product/create-product';
import { ProductList } from '../product-list/product-list';

@Component({
  selector: 'app-product-landing',
  imports: [CommonModule, FormsModule, CreateProduct, ProductList],
  templateUrl: './product-landing.html',
  styleUrl: './product-landing.css',
})
export class ProductLanding {
  showModal = false;
  

  openModal() {
    this.showModal = true;
  }

  closeModal(event: boolean) {

    this.showModal = false;
   
  }
}
