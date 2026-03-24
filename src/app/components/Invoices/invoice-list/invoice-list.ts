
import { CreateInvoice } from '../create-invoice/create-invoice';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../services/invoice-service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, CreateInvoice],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceList implements OnInit, OnDestroy {
  // invoices: any[] = [];
  showModal = false;
  invoices = signal<any[]>([]); // start empty
  expandedInvoice = signal<any | null>(null);
  private sub!: Subscription;
  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    // now this.invoiceService is initialized
    // optional, already empty

    // Option 1: subscribe manually
    this.loadInvoices();

    // Option 2: use toSignal (recommended)
    // this.invoices = toSignal(this.invoiceService.getInvoices(), { initialValue: [] });
  }

  loadInvoices() {
    this.invoices.set([]);
    this.sub = this.invoiceService.getInvoices().subscribe({
      next: (data) => {

        this.invoices.set(
          [...data].sort((a, b) =>
            new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
          )
        );
      },
      error: (err) => console.error(err)
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  toggle(invoice: any) {
    this.expandedInvoice.update(current =>
      current === invoice ? null : invoice
    );
  }

  trackByInvoice(index: number, item: any) {
    return item.invoiceNumber;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal(event: boolean) {

    this.showModal = false;
    if (event) {
      this.loadInvoices();
    }
  }
}

