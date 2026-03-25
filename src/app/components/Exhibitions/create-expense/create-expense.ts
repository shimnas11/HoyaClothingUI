import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExhibitionService } from '../../../services/exhibition-service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private exhibitionService: ExhibitionService) {
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

    this.exhibitionService.addExpenses(payload).subscribe({
      next: () => {
        this.toastr.success('Expense added successfully');

        this.closeExpenseModal.emit(true);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  close() {
    this.closeExpenseModal.emit(false);
  }

  get f() {
    return this.expenseForm.controls;
  }
}