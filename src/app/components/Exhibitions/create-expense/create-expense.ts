import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-expense.html',
  styleUrl: './create-expense.css'
})
export class CreateExpense {

  @Input() exhibitionId!: string;
  @Output() closeExpenseModal = new EventEmitter<boolean>();

  expenseForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      name: ['', [Validators.required]],
      cost: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submit() {
    this.submitted = true;

    if (this.expenseForm.invalid) return;

    const payload = {
      exhibitionId: this.exhibitionId,
      name: this.expenseForm.value.name,
      cost: this.expenseForm.value.cost
    };


    this.closeExpenseModal.emit(true);
  }

  close() {
    this.closeExpenseModal.emit(false);
  }

  get f() {
    return this.expenseForm.controls;
  }
}