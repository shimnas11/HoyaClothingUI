import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateInvoice } from '../../Invoices/create-invoice/create-invoice';
import { ExhibitionService } from '../../../services/exhibition-service';

@Component({
  selector: 'app-detail-exhition',
  imports: [CreateInvoice, CommonModule],
  templateUrl: './detail-exhition.html',
  styleUrl: './detail-exhition.css',
})
export class DetailExhition {
  totalSale = 0;
  id!: string;
  name = '';
  startDate!: Date;
  endDate!: Date;
  exhibition: any = {};
  activeTab: 'invoices' | 'expenses' = 'invoices';
  showModal = false;
  exhibitionsInvoices: any[] = [

  ];

  expenses: any[] = [
    { date: '02-01-2026', name: 'Rent', amount: 2000 }
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
        this.name = details.name;
        this.startDate = details.startDate;
        this.endDate = details.endDate;
        this.exhibitionsInvoices = [...details.invoices];
        this.exhibitionsInvoices.forEach(element => {
          element.netAmount = element.totalAmount - element.discountAmount;
          this.totalSale += element.netAmount;
        });
        // You can assign the details to a local variable to display in the template
        console.log('Exhibition details:', details);
      });
    }
  }

  addInvoice() {
    this.showModal = true;
  }

  closeModal(event: any) {
    this.showModal = false;
    console.log('New invoice data:', event);
    if (event) {
      this.getDetails();
    }
  }

  setActiveTab(tab: 'invoices' | 'expenses') {
    this.activeTab = tab;
  }
}

