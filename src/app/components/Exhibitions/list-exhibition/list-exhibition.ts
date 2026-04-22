import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ExhibitionService } from '../../../services/exhibition-service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExhibitionOverviewModal } from '../../../models/overview-modal';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RefundModal } from '../refund-modal/refund-modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-exhibition',
  imports: [DatePipe, CommonModule, RefundModal, ReactiveFormsModule, MatIcon, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './list-exhibition.html',
  styleUrl: './list-exhibition.css',
})
export class ListExhibition implements OnInit, OnDestroy {

  private sub!: Subscription;

  exhibitions: any[] = [];          // full data
  paginatedExhibitions: any[] = []; // paginated data
  showModal = false;
  isRefundOpen = false;
  // ✅ pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  amount = 0;
  exhibitionId: any;
  data = new ExhibitionOverviewModal();
  constructor(
    private exhibitionService: ExhibitionService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadExhibitions();
    }
  }

  loadExhibitions() {
    this.sub = this.exhibitionService.getExhibitions().subscribe(res => {

      // optional sorting (latest first)
      this.exhibitions = [...res].sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      this.totalPages = Math.ceil(this.exhibitions.length / this.pageSize);

      this.updatePaginatedExhibitions();

      this.cd.detectChanges();
    });
  }

  // ✅ pagination logic
  updatePaginatedExhibitions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedExhibitions = this.exhibitions.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedExhibitions();
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

  detailExhibition(exhibition: any) {
    this.router.navigate(['/details', exhibition.id]);
  }

  GetExhibitionOverview(exhibition: any) {
    this.exhibitionService.getOverview(exhibition.id).subscribe(details => {
      this.data = details;
      this.showModal = true;
      if (this.data.additional < 0) {
        this.data.additional = this.data.additional * -1;
      }
      this.data.profit = this.data.profit > 0 ? this.data.profit : 0;
      this.data.loss = this.data.profit < 0 ? this.data.profit : 0;
      this.data.totalExpense = exhibition.totalExpense + exhibition.bookingCost;
      this.cd.detectChanges();

    });
  }

  trackByCode(index: number, item: any) {
    return item.code;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }



  close() {
    this.showModal = false;
  }

  refund(exhibition: any) {
    this.exhibitionId = exhibition.id;
    this.isRefundOpen = true;

  }

  closeRefund() {
    this.isRefundOpen = false;
  }

  handleRefund(event: any) {
    this.isRefundOpen = false;
    //  this.exhibitionService
    console.log('Refund submitted:', event);

    this.exhibitionService.addRefund({
      exhibitionId: this.exhibitionId,
      amount: event.amount
    }).subscribe(res => {
      this.exhibitionId = null;
      this.toastr.success('Refund added successfully');
      this.loadExhibitions();
    }, err => {
      this.toastr.error('Error adding refund');
    });
  }


}