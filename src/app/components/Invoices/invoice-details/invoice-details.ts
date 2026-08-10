
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InvoiceService } from '../../../services/invoice-service';



interface InvoiceItem {
  productId: string;
  productName: string;
  code: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  discountAmount: number;
  paymentMode: string;
  exhibitionId: string;
  status: string;
  items: InvoiceItem[];
}


@Component({
  selector: 'app-invoice-details',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.css',
})

export class InvoiceDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private cdr = inject(ChangeDetectorRef);

  invoice: Invoice | null = null;
  returnUrl = '';
  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['from'];

    });
    if (!id) {
      return;
    }

    this.loadInvoice(id);
  }


  loadInvoice(id: string): void {


    this.invoiceService.getInvoiceById(id).subscribe({
      next: (response: Invoice) => {

        this.invoice = response;

        this.cdr.detectChanges();
        // this.loading = false;
      },
      error: (error) => {

        console.error('Failed to load invoice', error);

      }
    });
  }

  get subtotal(): number {

    if (!this.invoice?.items) {
      return 0;
    }

    return this.invoice.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }

  get totalItems(): number {

    if (!this.invoice?.items) {
      return 0;
    }

    return this.invoice.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  get finalAmount(): number {

    if (!this.invoice) {
      return 0;
    }

    return this.invoice.totalAmount;
  }

  goBack(): void {
    if (this.returnUrl === 'exhibition') {
      var exhibitionId = this.route.snapshot.queryParamMap.get('exhibitionId');

      this.router.navigate(['/details', exhibitionId]);
      // Back to exhibition
    } else {
      this.router.navigateByUrl('/invoices');
    }

  }

  printInvoice(): void {
    window.print();
  }

  getPaymentMode(): string {

    if (!this.invoice?.paymentMode) {
      return '-';
    }

    return this.invoice.paymentMode.charAt(0).toUpperCase() +
      this.invoice.paymentMode.slice(1);
  }

  getStatusClass(): string {

    switch (this.invoice?.status?.toLowerCase()) {

      case 'created':
        return 'status-created';

      case 'paid':
        return 'status-paid';

      case 'cancelled':
        return 'status-cancelled';

      case 'returned':
        return 'status-returned';

      default:
        return 'status-default';
    }
  }
}
