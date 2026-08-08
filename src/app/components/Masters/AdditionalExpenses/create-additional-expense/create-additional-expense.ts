import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
// import { ExpenseService } from '../../../services/expense-service';
import { EventEmitter, Output } from '@angular/core';
import { AdditionalexpenseService } from '../../../../services/masters/additionalexpense-service';

@Component({
  selector: 'app-create-additional-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-additional-expense.html',
  styleUrl: './create-additional-expense.css'
})
export class CreateExpense {

  @Output() modalClose = new EventEmitter<boolean>();

  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: AdditionalexpenseService,
    private toastr: ToastrService
  ) {

    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      remark: ['']
    });

  }

  saveExpense() {

    if (this.expenseForm.invalid) {

      this.expenseForm.markAllAsTouched();
      return;

    }

    const payload = {
      expenseName: this.expenseForm.value.name.trim(),
      amount: Number(this.expenseForm.value.amount),
      remarks: this.expenseForm.value.remark?.trim() || ''
    };

    this.expenseService.addAdditionalExpenses(payload).subscribe({

      next: () => {

        this.toastr.success('Expense added successfully');

        this.modalClose.emit(true);

      },

      error: () => {

        this.toastr.error('Unable to save expense');

      }

    });

  }

  close() {

    this.modalClose.emit(false);

  }

}
