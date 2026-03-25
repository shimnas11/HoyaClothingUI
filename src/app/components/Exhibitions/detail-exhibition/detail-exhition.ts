import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateInvoice } from '../../Invoices/create-invoice/create-invoice';
import { ExhibitionService } from '../../../services/exhibition-service';
import { CreateExpense } from '../create-expense/create-expense';
import { sign } from 'crypto';

@Component({
  selector: 'app-detail-exhition',
  imports: [CreateInvoice, CommonModule, CreateExpense],
  templateUrl: './detail-exhition.html',
  styleUrl: './detail-exhition.css',
})
export class DetailExhition {
  showExpenseModal = false;
  totalSale = signal(0);
  id!: string;
  name = signal('');
  place = signal('');
  paginatedExhibitions: any[] = [];
  paginatedExpenses: any[] = [];
  startDate!: Date;
  endDate!: Date;
  exhibition: any = {};
  // ✅ pagination
  currentPage = 1;
  currentExpensePage = 1;

  pageSize = 5;
  totalPages = 0;
  totalExpensePages = 0;
  activeTab: 'invoices' | 'expenses' = 'invoices';
  showModal = false;
  exhibitionsInvoices: any[] = [

  ];

  expenses: any[] = [

  ];


  constructor(private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private exhibitionService: ExhibitionService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.getDetails();
  }

  getDetails() {
    if (this.id) {
      this.exhibitionService.getDetails(this.id).subscribe(details => {
        // this.exhibition = details;
        this.name.set(details.name);
        this.place.set(details.place);
        // this.name =  ) details.name;
        this.startDate = details.startDate;
        this.endDate = details.endDate;
        this.exhibitionsInvoices = [];
        this.expenses = [];
        let sum = 0;
        this.exhibitionsInvoices = [...details.invoices].sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()) || [];
        this.exhibitionsInvoices.forEach(element => {
          element.netAmount = element.totalAmount - element.discountAmount;
          sum += element.netAmount;
        });
        this.totalSale.set(sum);
        if (details.expenses) {
          this.expenses = [...details.expenses].sort((a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
        }


        this.totalPages = Math.ceil(this.exhibitionsInvoices.length / this.pageSize);
        this.totalExpensePages = Math.ceil(this.expenses.length / this.pageSize);
        this.updatePaginatedExhibitions();
        this.updatePaginatedExpenses();

        this.cd.detectChanges();
        // You can assign the details to a local variable to display in the template
      });
    }
  }


  // ✅ pagination logic
  updatePaginatedExhibitions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedExhibitions = this.exhibitionsInvoices.slice(start, end);
  }


  updatePaginatedExpenses() {
    const start = (this.currentExpensePage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedExpenses = this.expenses.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedExhibitions();
    }
  }

  prevExpensePage() {
    if (this.currentExpensePage > 1) {
      this.currentExpensePage--;
      this.updatePaginatedExpenses();
    }
  }

  nextExpensePage() {
    if (this.currentExpensePage < this.totalExpensePages) {
      this.currentExpensePage++;
      this.updatePaginatedExpenses();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedExhibitions();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedExhibitions();
  }

  goToExpensePage(page: number) {
    this.currentExpensePage = page;
    this.updatePaginatedExpenses();
  }

  addInvoice() {
    this.showModal = true;
  }

  closeModal(event: any) {
    this.showModal = false;
    if (event) {
      this.getDetails();
    }
  }

  setActiveTab(tab: 'invoices' | 'expenses') {
    this.activeTab = tab;
  }


  openExpenseModal() {
    this.showExpenseModal = true;
  }

  handleClose(refresh: boolean) {
    this.showExpenseModal = false;

    if (refresh) {
      this.getDetails();
    }
  }

  trackByInvoice(index: number, item: any) {
    return item.invoiceNumber;
  }
}

