import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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

  search = '';

  totalItems = signal(0);
  totalLoss = signal(0);
  currentPage = signal(1);

  pageSize = 10;

  totalPages = signal(1);

  pagedProducts: any[] = [];
  constructor(private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

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

        this.totalItems = this.filteredProducts.reduce(
          (sum, x) => sum + x.quantity,
          0
        );

        this.totalLoss = this.filteredProducts.reduce(
          (sum, x) => sum + x.totalLoss,
          0
        );

        this.totalPages = signal(Math.ceil(this.filteredProducts.length / this.pageSize));

        this.updatePagination();
        this.cdr.detectChanges();
      }

    });


  }

  filter(): void {

    const value = this.search.trim().toLowerCase();

    this.filteredProducts = this.damagedProducts.filter(item =>

      item.productName?.toLowerCase().includes(value) ||

      item.color?.toLowerCase().includes(value) ||

      item.size?.toLowerCase().includes(value) ||

      (item.reason ?? '').toLowerCase().includes(value)

    );

    this.currentPage.set(1);

    this.updatePagination();

    this.updateSummary();
    this.cdr.detectChanges();
  }
  updatePagination(): void {

    this.totalPages = signal(Math.ceil(this.filteredProducts.length / this.pageSize));

    const start = (this.currentPage() - 1) * this.pageSize;

    const end = start + this.pageSize;

    this.pagedProducts = this.filteredProducts.slice(start, end);

  }
  nextPage(): void {

    if (this.currentPage() < this.totalPages()) {

      this.currentPage.set(this.currentPage() + 1);

      this.updatePagination();

    }

  }

  prevPage(): void {

    if (this.currentPage() > 1) {

      this.currentPage.set(this.currentPage() - 1);

      this.updatePagination();

    }

  }

  private updateSummary(): void {

    this.totalItems.set(this.filteredProducts.reduce(
      (sum: number, item: any) => sum + Number(item.quantity),
      0
    ));

    this.totalLoss.set(this.filteredProducts.reduce(
      (sum: number, item: any) => sum + Number(item.totalLoss),
      0
    ));
    console.log('Total Items:', this.totalItems);
    console.log('Total Loss:', this.totalLoss);

  }

}