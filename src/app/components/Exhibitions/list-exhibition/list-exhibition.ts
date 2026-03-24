import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, Signal } from '@angular/core';
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
  exhibitions: any[] = [];
  searchText = '';
  loading = true;
  constructor(private exhibitionService: ExhibitionService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadExhibitions();
    }
  }

  loadExhibitions() {
    this.exhibitionService.getExhibitions().subscribe(res => {
      this.exhibitions = res;
      this.cd.detectChanges();
    });
  }

  detailExhibition(exhibition: any) {
    this.router.navigate(['/details', exhibition.id]);
  }

  trackByCode(index: number, item: any) {
    return item.code;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
