import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from '../../../services/dashboard-service';
import { forkJoin } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIcon, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  financialChart!: Chart;
  exhibitionChart!: Chart;
  hotSellingChart!: Chart;
  hideSummary = false;
  hotSellingProducts: any[] = [];
  exhibitions: any[] = [];
  dashboardService = inject(DashboardService);
  dashboard: any;
  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.getOverview();
  }

  getOverview() {
    forkJoin({
      dashboard: this.dashboardService.getDashboardData(),
      hotSellingProducts: this.dashboardService.getHotSellingProducts(),
      exhibitions: this.dashboardService.getExhibitionOverview()
    }).subscribe({

      next: (result: any) => {

        this.dashboard = result.dashboard;
        this.hotSellingProducts = result.hotSellingProducts;
        this.exhibitions = result.exhibitions;
        this.cdr.markForCheck();
        // Create charts after all data is available
        setTimeout(() => {

          this.createPieChart();
          this.createFinancialChart();
          this.createHotSellingChart();
          this.createExhibitionChart();

        });


      },

      error: (error: any) => {
        console.error('Failed to load dashboard data', error);
      }

    });




  }

  createExhibitionChart() {

    if (this.exhibitionChart) {
      this.exhibitionChart.destroy();
    }

    this.exhibitionChart = new Chart('exhibitionChart', {

      type: 'bar',

      data: {

        labels: this.exhibitions.map(x => x.name),

        datasets: [{
          label: 'Sales',

          data: this.exhibitions.map(x => x.totalSales),

          backgroundColor: '#4CAF50',

          borderRadius: 8
        }]

      },

      options: {

        indexAxis: 'y',

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {

            callbacks: {

              afterLabel: (context) => {

                const item = this.exhibitions[context.dataIndex];

                const margin =
                  (item.profit / item.totalSales * 100).toFixed(1);

                return [
                  'Profit : ₹' + item.profit.toLocaleString('en-IN'),
                  'Margin : ' + margin + '%',
                  'Items Sold : ' + item.totalItemSelled
                ];
              }

            }

          }

        }

      }

    });
    this.cdr.detectChanges();
  }


  toggleSummary() {
    this.hideSummary = !this.hideSummary;
  }

  detailExhibition(id: any) {
    console.log('id')
    this.router.navigate(['/details', id]);
  }


  createFinancialChart() {

    if (!this.dashboard) {
      return;
    }

    if (this.financialChart) {
      this.financialChart.destroy();
    }

    this.financialChart = new Chart("financialChart", {

      type: 'bar',

      data: {

        labels: [
          'Revenue',
          'Profit',
          'Expense'
        ],

        datasets: [

          {
            label: 'Amount',

            data: [
              this.dashboard.revenue,
              this.dashboard.profit,
              this.dashboard.totalExpense
            ],

            backgroundColor: [
              '#4CAF50',
              '#2196F3',
              '#F44336'
            ],

            borderRadius: 8,

            borderWidth: 1
          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {

            callbacks: {

              label(context) {

                return '₹ ' + Number(context.raw).toLocaleString('en-IN');

              }

            }

          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {

              callback(value) {

                return '₹ ' + Number(value).toLocaleString('en-IN');

              }

            }

          }

        }

      }

    });

  }

  createPieChart() {

    const sold = this.dashboard.totalSold;
    const remaining = this.dashboard.totalProducts - this.dashboard.totalSold;

    new Chart('inventoryChart', {

      type: 'doughnut',

      data: {

        labels: ['Sold', 'Remaining'],

        datasets: [
          {
            data: [sold, remaining],
            backgroundColor: [
              '#4CAF50',
              '#2196F3'
            ],
            borderWidth: 2,
            hoverOffset: 10
          }
        ]
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            position: 'bottom'
          },

          title: {

            display: true,
            text: 'Inventory Distribution'
          },

          tooltip: {

            callbacks: {

              label(context) {

                const total = sold + remaining;

                const value = context.raw as number;

                const percent = ((value / total) * 100).toFixed(1);

                return `${context.label}: ${value} (${percent}%)`;
              }
            }
          }
        }
      }
    });
  }

  createHotSellingChart() {

    if (this.hotSellingChart) {

      this.hotSellingChart.destroy();

    }

    this.hotSellingChart = new Chart('hotSellingChart', {

      type: 'bar',

      data: {

        labels: this.hotSellingProducts.map(x => x.productName),

        datasets: [{

          label: 'Revenue',

          data: this.hotSellingProducts.map(x => x.revenue),

          backgroundColor: '#4CAF50',

          borderRadius: 8

        }]
      },

      options: {

        indexAxis: 'y',

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {

            callbacks: {

              label(context) {

                return "₹ " + Number(context.raw).toLocaleString('en-IN');

              }

            }

          }

        },

        scales: {

          x: {

            ticks: {

              callback(value) {

                return "₹" + Number(value).toLocaleString('en-IN');

              }

            }

          }

        }

      }

    });

  }


  getProfitMargin(item: any): number {

    if (!item.totalSales) {
      return 0;
    }

    return Number(((item.profit / item.totalSales) * 100).toFixed(1));

  }

  getProgressColor(item: any): 'primary' | 'accent' | 'warn' {

    const margin = this.getProfitMargin(item);

    if (margin >= 30)
      return 'primary';

    if (margin >= 15)
      return 'accent';

    return 'warn';
  }
  getProgressWidth(item: any): number {

    const margin = this.getProfitMargin(item);

    if (margin < 0) {
      return 0;
    }

    return Math.min(margin, 100);

  }

}
