import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StatsWidget } from './components/statswidget';
import { AssumptionCoreWidget } from './components/assumptioncorewidget';
import { ChartViewComponent } from '../../shared/chart-view.component';
import { ChartConfiguration } from 'chart.js';
import { TabsModule } from 'primeng/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    // StatsWidget,
    // AssumptionCoreWidget,
    // ChartViewComponent,
    TabsModule,
  ],
  template: `
    <router-outlet></router-outlet>
    <!-- <app-chart-view
      class="col-span-12 xl:col-span-6"
      title="Sample Metrics"
      [type]="'bar'"
      [data]="demoChartData"
      [options]="demoChartOptions"
    /> -->
  `,
})
export class Dashboard implements OnInit, OnDestroy {
  sections = [
    { key: 'input', label: 'Input Landing Page' },
    { key: 'metrics', label: 'Key Metrics Dashboard' },
    { key: 'performance', label: 'Financial Performance' },
    { key: 'position', label: 'Financial Position' },
    { key: 'cashflow', label: 'Cash Flow Statement' },
    { key: 'sensitivity', label: 'Sensitivity Analysis' },
    { key: 'scenario', label: 'Scenario / IFs Analysis' },
    { key: 'montecarlo', label: 'Monte Carlo Simulation' },
    { key: 'breakeven', label: 'Break-even & Payback' },
  ];

  activeTab = 'input';

  demoChartData: ChartConfiguration['data'] = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [120, 150, 180, 210],
        label: 'Revenue ($k)',
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
      {
        data: [80, 95, 130, 160],
        label: 'Costs ($k)',
        backgroundColor: '#22c55e',
        borderRadius: 6,
      },
    ],
  };

  demoChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  private queryParamSub?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const section = params.get('section');
      if (section && this.sections.some((s) => s.key === section)) {
        this.activeTab = section;
      } else {
        this.activeTab = 'input';
      }
    });
  }

  onTabChange(key: string | number) {
    this.activeTab = String(key);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: this.activeTab },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub?.unsubscribe();
  }
}
