import { Component, EventEmitter, Output, output } from '@angular/core';


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
export class CreateProduct {

  @Output() productAdded = new EventEmitter<boolean>();


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

  closeModal() {
    this.productAdded.emit(false);
  }
}