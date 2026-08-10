import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';


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
import { MasterService } from '../../../services/masters/master-service';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct implements OnChanges, OnInit {

  @Output() productAdded = new EventEmitter<boolean>();
  @Input() product: any = null;

  productForm: FormGroup;
  workTypes: any[] = [];
  setTypes: any[] = [];
  materialTypes: any[] = [];


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private masterService: MasterService,
    private cdr: ChangeDetectorRef
  ) {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      color: ['', Validators.required],
      cost: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      materialType: [''],
      setType: [''],
      workType: [''],
      sizes: this.fb.array([])
    });

    // start with one row
    this.addSize();
  }


  ngOnInit() {
    this.masterService.getMasterList().subscribe((result: any) => {
      this.materialTypes = result.materialTypes;
      this.setTypes = result.setTypes;
      this.workTypes = result.workTypes;
      this.cdr.detectChanges();
    });
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
        sellingPrice: this.product.sellingPrice,
        materialType: this.product.materialType,
        setType: this.product.setType,
        workType: this.product.workType
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

  getWorkTypeDisplay() {
    return this.workTypes.map(wt => wt.name);
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