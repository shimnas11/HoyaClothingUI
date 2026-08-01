import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ExhibitionService } from '../../../services/exhibition-service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatIcon } from '@angular/material/icon';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIcon],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  financialChart!: Chart;
  hideSummary = false;
  dashboardService = inject(ExhibitionService);
  dashboard: any;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      this.dashboard = data;
      this.createPieChart();
      this.createFinancialChart();
      this.cdr.detectChanges();
    });
  }

  toggleSummary() {
    this.hideSummary = !this.hideSummary;
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



}
