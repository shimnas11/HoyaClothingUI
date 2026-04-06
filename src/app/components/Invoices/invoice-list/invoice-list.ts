import { CreateInvoice } from '../create-invoice/create-invoice';
import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
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

  showModal = false;

  // ✅ DATA SIGNAL
  invoices = signal<any[]>([]);

  // ✅ EXPAND STATE
  expandedInvoice = signal<any | null>(null);

  private sub!: Subscription;

  // ✅ PAGINATION SIGNALS
  currentPage = signal(1);
  pageSize = 5;

  // ✅ PAGINATED DATA
  paginatedInvoices = computed(() => {
    const data = this.invoices();

    const start = (this.currentPage() - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.invoices().length / this.pageSize)
  );

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoices.set([]);

    this.sub = this.invoiceService.getInvoices().subscribe({
      next: (data) => {

        data.forEach(element => {
          element.items?.forEach((item: any) => {
            item.invoiceId = element.id
          });
        });

        const sorted = [...data].sort((a, b) =>
          new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
        );

        this.invoices.set(sorted);

        // ✅ Reset page after reload
        this.currentPage.set(1);
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ✅ PAGINATION METHODS
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(v => v + 1);
      this.expandedInvoice.set(null); // close expanded row
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(v => v - 1);
      this.expandedInvoice.set(null);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.expandedInvoice.set(null);
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

  returnItem(item: any) {
    // Implement return logic here
    console.log('Returning item:', item);

    let product = {
      productId: item.productId,
      quantity: item.quantity,
      productSize: item.size
    };

    this.invoiceService.returnItems(item.invoiceId, product).subscribe({
      next: (response) => {
        console.log('Item returned successfully:', response);
        this.loadInvoices(); // Reload invoices to reflect the return
      },
      error: (err) => {
        console.error('Error returning item:', err);
      }
    });

  }
}