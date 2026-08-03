import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-damaged-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './damaged-products.html',
  styleUrl: './damaged-products.css',
})
export class DamagedProducts implements OnInit {

  damagedProducts: any[] = [];
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];

  search = '';

  totalItems = 0;
  totalLoss = 0;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.productService.getDamageProducts().subscribe({

      next: (res: any[]) => {

        this.damagedProducts = [...res].sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );

        this.filteredProducts = [...this.damagedProducts];

        this.currentPage = 1;

        this.updateSummary();
        this.updatePagination();
      },

      error: err => {
        console.error(err);
      }

    });

  }

  filter(): void {

    const value = this.search.trim().toLowerCase();

    if (!value) {

      this.filteredProducts = [...this.damagedProducts];

    } else {

      this.filteredProducts = this.damagedProducts.filter(item =>

        item.productName?.toLowerCase().includes(value) ||

        item.color?.toLowerCase().includes(value) ||

        item.size?.toLowerCase().includes(value) ||

        (item.reason ?? '').toLowerCase().includes(value)

      );

    }

    this.currentPage = 1;

    this.updateSummary();
    this.updatePagination();

  }

  updateSummary(): void {

    this.totalItems = this.filteredProducts.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    this.totalLoss = this.filteredProducts.reduce(
      (sum, item) => sum + Number(item.totalLoss),
      0
    );

  }

  updatePagination(): void {

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredProducts.length / this.pageSize)
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.pagedProducts = this.filteredProducts.slice(
      start,
      start + this.pageSize
    );

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  prevPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

}