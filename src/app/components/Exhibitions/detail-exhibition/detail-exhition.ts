import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  totalSale = 0;
  id!: string;
  name = signal('');
  place = signal('');
  startDate!: Date;
  endDate!: Date;
  exhibition: any = {};
  activeTab: 'invoices' | 'expenses' = 'invoices';
  showModal = false;
  exhibitionsInvoices: any[] = [

  ];

  expenses: any[] = [

  ];


  constructor(private route: ActivatedRoute,
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
        this.exhibitionsInvoices = [...details.invoices];
        this.exhibitionsInvoices.forEach(element => {
          element.netAmount = element.totalAmount - element.discountAmount;
          this.totalSale += element.netAmount;
        });
        if (details.expenses) {
          this.expenses = [...details.expenses].sort((a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
        }
        // You can assign the details to a local variable to display in the template
      });
    }
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
}

