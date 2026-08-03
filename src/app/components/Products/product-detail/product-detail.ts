import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../product-list/product-list';
import { CreateDamage } from '../../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit {
  product!: any;
  selectedProduct: any | null = null;
  showDamageModal = false;
  damageModel: CreateDamage = {
    productId: '',
    size: null as any,   // or '' if your interface defines string
    quantity: 1,
    reason: '',
    remarks: '',
    adjustmentType: 'Damaged'
  };
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadProducts();

  }
  loadProducts() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  markDamage() {

    this.damageModel = {
      productId: this.product.id,
      size: null as string | null,

      quantity: 1,
      reason: '',
      remarks: '',
      adjustmentType: 'Damaged'
    };

    this.selectedProduct = this.product;
    this.showDamageModal = true;
  }

  saveDamage() {

    if (!this.damageModel.size) {
      this.toastr.warning('Please select a size.');
      return;
    }
    this.productService
      .markProductDamaged(this.damageModel)
      .subscribe((res: string) => {
        console.log('Damage marked successfully:', res);
        this.showDamageModal = false;
        this.toastr.success(res);
        setTimeout(() => {
          this.loadProducts();
        });
      });
  }
}


