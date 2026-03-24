import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ExhibitionService } from '../../../services/exhibition-service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-exhibition',
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './list-exhibition.html',
  styleUrl: './list-exhibition.css',
})
export class ListExhibition implements OnInit, OnDestroy {

  private sub!: Subscription;

  exhibitions: any[] = [];          // full data
  paginatedExhibitions: any[] = []; // paginated data

  // ✅ pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(
    private exhibitionService: ExhibitionService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

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

  trackByCode(index: number, item: any) {
    return item.code;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}