import { Component, EventEmitter, Input, OnChanges, Output, output, SimpleChanges } from '@angular/core';


import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct implements OnChanges {

  @Output() productAdded = new EventEmitter<boolean>();
  @Input() product: any = null;

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService
  ) {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      color: ['', Validators.required],
      cost: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      sizes: this.fb.array([])
    });

    // start with one row
    this.addSize();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {

      // ✅ Clear old sizes
      this.sizes.clear();

      // ✅ Patch basic fields
      this.productForm.patchValue({
        name: this.product.name,
        code: this.product.code,
        color: this.product.color,
        cost: this.product.cost,
        sellingPrice: this.product.sellingPrice
      });

      // ✅ Add sizes dynamically
      if (this.product.sizes && this.product.sizes.length > 0) {
        this.product.sizes.forEach((s: any) => {
          this.sizes.push(this.fb.group({
            size: [s.size, Validators.required],
            quantity: [s.quantity, Validators.required]
          }));
        });
      } else {
        this.addSize();
      }
    }
  }
  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  createSize(): FormGroup {
    return this.fb.group({
      size: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  addSize() {
    this.sizes.push(this.createSize());
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
  }

  submit() {

    const formValue = this.productForm.value;

    const totalQuantity = formValue.sizes.reduce(
      (sum: number, s: any) => sum + Number(s.quantity),
      0
    );

    const payload = {
      ...formValue,
      totalQuantity
    };
    if (this.product?.id) {
      payload.id = this.product?.id;
      this.productService.updateProducts(this.product.id, payload).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully');
          this.productAdded.emit(true);
        },
        error: err => console.error(err)
      });
    } else {
      this.productService.addProducts(payload).subscribe({
        next: () => {
          this.toastr.success('Product added successfully');
          this.productForm.reset();
          this.sizes.clear();
          this.addSize();
          this.productAdded.emit(true);

        },
        error: err => console.error(err)
      });
    }
  }

  closeModal() {
    this.productAdded.emit(false);
  }
}