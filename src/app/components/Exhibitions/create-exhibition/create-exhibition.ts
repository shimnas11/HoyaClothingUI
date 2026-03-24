import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ExhibitionService } from '../../../services/exhibition-service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-exhibition',
  standalone: true, // ✅ REQUIRED
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-exhibition.html',
  styleUrl: './create-exhibition.css',
})
export class CreateExhibition implements OnInit {

  @Output() modalClose = new EventEmitter<boolean>();
  exhibitionForm!: FormGroup;

  constructor(
    private exhibitionService: ExhibitionService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() { // ✅ FIXED
    this.exhibitionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      place: ['', [Validators.required, Validators.minLength(3)]],
      runBy: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      bookingCost: [0, [Validators.required, Validators.min(0)]],
    });

    this.exhibitionForm.valueChanges.subscribe(val => {
      if (val.endDate && val.startDate && val.endDate < val.startDate) {
        this.exhibitionForm.get('endDate')?.setErrors({ invalidDate: true });
      }
    });
  }

  closeModal() {
    this.modalClose.emit(true);
  }

  submit() {
    if (this.exhibitionForm.invalid) {
      this.exhibitionForm.markAllAsTouched(); // ✅ show validation errors
      return;
    }

    this.exhibitionService.addExhibitions(this.exhibitionForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Exhibition successfully created');
          this.modalClose.emit(true);
        },
        error: () => {
          this.toastr.error('Failed to create exhibition');
        }
      });
  }
}