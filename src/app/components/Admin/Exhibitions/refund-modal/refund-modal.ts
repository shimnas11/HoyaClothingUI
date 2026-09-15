import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-refund-modal',
  imports: [FormsModule],
  templateUrl: './refund-modal.html',
  styleUrl: './refund-modal.css',
})
export class RefundModal {


  amount: number = 0;
  @Input() isOpen: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitRefund = new EventEmitter<any>();


  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submitRefund.emit({
      amount: this.amount
    });
  }
}