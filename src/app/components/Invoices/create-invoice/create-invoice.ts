import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product-service';
import { InvoiceService } from '../../../services/invoice-service';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.css'
})
export class CreateInvoice implements OnInit {

  filteredProducts: any[] = [];
  selectedProduct: any;
  allProducts: any[] = [];

  invoiceForm!: FormGroup;
  selectionForm!: FormGroup;
  productSearch: any;

  @Input() exhibitionId!: string;
  @Output() modalClose = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {

    this.productSearch = this.fb.control('');

    this.selectionForm = this.fb.group({
      product: [null, Validators.required],
      size: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.invoiceForm = this.fb.group({
      discount: [0],
      paymentMode: ['cash', Validators.required],
      products: this.fb.array([])
    });

    this.allProducts = this.productService.products();

    // ✅ SEARCH
    this.productSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: string) => {

      if (!value) {
        this.filteredProducts = [];
        return;
      }

      const search = value.toLowerCase();

      this.filteredProducts = this.allProducts
        .filter(p =>
          p.totalQuantity > 0 &&
          (
            p.name.toLowerCase().includes(search) ||
            p.code.toLowerCase().includes(search)
          )
        )
        .slice(0, 10);
    });
  }

  get products(): FormArray {
    return this.invoiceForm.get('products') as FormArray;
  }

  onProductSelected(product: any) {
    this.selectedProduct = product;

    this.selectionForm.patchValue({
      product: product,
      size: '',
      quantity: 1
    });

    this.productSearch.setValue('');
    this.filteredProducts = [];
  }

  getAvailableSizes(product: any) {
    return product.sizes.filter((s: any) => s.quantity > 0);
  }

  getMaxQuantity(): number {
    if (!this.selectedProduct) return 1;

    const selectedSize = this.selectionForm.value.size;

    const sizeObj = this.selectedProduct.sizes.find(
      (s: any) => s.size === selectedSize
    );

    return sizeObj ? sizeObj.quantity : 1;
  }

  addSelectedProduct() {

    if (this.selectionForm.invalid) return;

    const { product, size, quantity } = this.selectionForm.value;

    const selectedSize = product.sizes.find((s: any) => s.size === size);

    if (!selectedSize || selectedSize.quantity < quantity) {
      this.toastr.warning('Not enough stock');
      return;
    }

    selectedSize.quantity -= quantity;

    if (selectedSize.quantity === 0) {
      product.sizes = product.sizes.filter((s: any) => s.quantity > 0);
    }

    if (product.sizes.length === 0) {
      this.allProducts = this.allProducts.filter(p => p.id !== product.id);
    }

    const existing = this.products.controls.find(p =>
      p.value.productId === product.id && p.value.size === size
    );

    if (existing) {
      existing.patchValue({
        quantity: existing.value.quantity + quantity
      });
    } else {
      const group = this.fb.group({
        productId: [product.id],
        name: [product.code + '-' + product.name],
        price: [product.sellingPrice],
        color: [product.color],
        size: [size],
        quantity: [quantity]
      });

      this.products.push(group);
    }

    this.selectionForm.reset({ quantity: 1 });
    this.selectedProduct = null;
  }

  removeProduct(index: number, event: Event) {

    const product = this.products.at(index).value;

    const mainProduct = this.allProducts.find(p => p.id === product.productId);

    if (mainProduct) {
      let sizeObj = mainProduct.sizes.find((s: any) => s.size === product.size);

      if (sizeObj) {
        sizeObj.quantity += product.quantity;
      } else {
        mainProduct.sizes.push({
          size: product.size,
          quantity: product.quantity
        });
      }
    }

    this.products.removeAt(index);
    event.stopPropagation();
  }

  rowTotal(i: number) {
    const row = this.products.at(i).value;
    return row.price * row.quantity;
  }

  totalAmount() {
    return this.products.controls.reduce((sum, p) =>
      sum + (p.value.price * p.value.quantity), 0);
  }

  netAmount() {
    return this.totalAmount() - (this.invoiceForm.value.discount || 0);
  }

  submit() {

    if (this.invoiceForm.invalid) return;

    if (this.products.length === 0) {
      this.toastr.warning('Add at least one product');
      return;
    }

    const payload = {
      netAmount: this.netAmount(),
      exhibitionId: this.exhibitionId || '',
      discount: this.invoiceForm.value.discount,
      paymentMode: this.invoiceForm.value.paymentMode,
      products: this.products.controls.map(p => ({
        productId: p.value.productId,
        size: p.value.size,
        quantity: p.value.quantity,
        amount: p.value.price
      }))
    };

    this.invoiceService.addInvoice(payload).subscribe(() => {
      this.toastr.success('Invoice successfully created');
      this.modalClose.emit(true);
    });
  }

  closeModal() {
    this.modalClose.emit(false);
  }
}