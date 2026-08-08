import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateExpense } from '../create-additional-expense/create-additional-expense';
import { AdditionalexpenseService } from '../../../../services/masters/additionalexpense-service';

@Component({
  selector: 'app-additional-expense',
  imports: [CommonModule, FormsModule, CreateExpense,
    ReactiveFormsModule],
  templateUrl: './additional-expense.html',
  styleUrl: './additional-expense.css',
})
export class AdditionalExpense {
  totalExpenseAmount = 0;
  expenses: any[] = [];

  searchText = '';
  showModal = false;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private additionalexpenseService: AdditionalexpenseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {

    this.additionalexpenseService.getAdditionalExpenses().subscribe({

      next: (response: any) => {
        this.expenses = response;

        this.cdr.detectChanges();

      },

      error: () => {
        this.toastr.error('Unable to load expenses');
      }

    });

  }

  filteredExpenses() {

    if (!this.searchText.trim())
      return this.expenses;

    return this.expenses.filter(x =>
      x.expenseName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );

  }

  totalExpense() {

    return this.filteredExpenses().reduce((sum, x) =>
      sum + x.amount, 0);

  }

  addExpense() {

    this.showModal = true;

  }


  deleteExpense(id: string) {

    if (!confirm('Delete this expense?'))
      return;

    // this.expenseService.deleteExpense(id)
    //   .subscribe({

    //     next: () => {

    //       this.toastr.success('Expense Deleted');

    //       this.loadExpenses();

    //     },

    //     error: () => {

    //       this.toastr.error('Delete Failed');

    //     }

    //   });

  }

  close(event: boolean): void {

    this.showModal = false;
    this.loadExpenses();

  }
}
