import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product-service';
import { InvoiceService } from '../../../services/invoice-service';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.css'
})
export class CreateInvoice implements OnInit, OnChanges {

  filteredProducts: any[] = [];
  selectedProduct: any;

  invoiceForm!: FormGroup;
  selectionForm!: FormGroup;
  productSearch: any;
  @Input() exhibitionId!: string;
  @Output() modalClose = new EventEmitter<boolean>();
  @Output() exhibitionInvoice = new EventEmitter<any>();

  constructor(private fb: FormBuilder,

    private toastr: ToastrService,
    private productService: ProductService,
    private invoiceService: InvoiceService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['exhibitionId']) {
      // console.log('Changed ID:', this.exhibitionId);
    }
  }

  ngOnInit() {

    this.productSearch = this.fb.control('');

    this.selectionForm = this.fb.group({
      product: [null, Validators.required],
      size: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.invoiceForm = this.fb.group({
      discount: [0, [Validators.min(0)]],
      paymentMode: ['cash', Validators.required],
      products: this.fb.array([])
    });

    this.loadProducts();
  }

  get products(): FormArray {
    return this.invoiceForm.get('products') as FormArray;
  }

  loadProducts() {
    const items = this.productService.products();
    this.filteredProducts = items.filter(x => x.totalQuantity > 0);
  }

  getAvailableSizes(product: any) {
    return product.sizes.filter((s: any) => s.quantity > 0);
  }

  onProductSelected(product: any) {
    this.selectedProduct = product;

    this.selectionForm.patchValue({
      product: product,
      size: '',
      quantity: 1
    });
    this.productSearch.setValue('');
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
      alert('Not enough stock');
      return;
    }

    // Reduce stock
    selectedSize.quantity -= quantity;

    // Remove size if stock = 0
    if (selectedSize.quantity === 0) {
      product.sizes = product.sizes.filter((s: any) => s.quantity > 0);
    }

    // Remove product if no sizes left
    if (product.sizes.length === 0) {
      this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
    }

    // Check if already exists → merge
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

    // Reset selection
    this.selectionForm.reset({ quantity: 1 });
    this.selectedProduct = null;
    this.productSearch.setValue('');
  }

  removeProduct(index: number, event: Event) {
    // 🔥 P
    const product = this.products.at(index).value;

    // Restore stock
    const mainProduct = this.filteredProducts.find(p => p.id === product.productId);

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
    return this.products.controls.reduce((sum, p) => {
      return sum + (p.value.price * p.value.quantity);
    }, 0);
  }

  netAmount() {
    return this.totalAmount() - (this.invoiceForm.value.discount || 0);
  }

  submit() {

    if (this.invoiceForm.invalid) return;

    const payload = {
      netAmount: this.netAmount(),
      exhibitionId: '',
      discount: this.invoiceForm.value.discount,
      paymentMode: this.invoiceForm.value.paymentMode,
      products: this.products.controls.map(p => ({
        productId: p.value.productId,
        size: p.value.size,
        quantity: p.value.quantity,
        amount: p.value.price
      }))
    };

    if (payload.products.length === 0) {
      this.toastr.warning('Add at least one product');
      return;
    }
    if (this.exhibitionId) {
      payload.exhibitionId = this.exhibitionId;

    }
    this.invoiceService.addInvoice(payload).subscribe(res => {
      this.toastr.success('Invoice successfully created');
      this.modalClose.emit(true);
    });

  }

  closeModal() {
    this.modalClose.emit();
  }
}