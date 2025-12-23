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
    <!-- <p-tabs scrollable [(value)]="activeTab" (valueChange)="onTabChange($event)" class="w-full">
      <p-tablist>
        @for (section of sections; track section.key) {
        <p-tab [value]="section.key" class="whitespace-nowrap">
          {{ section.label }}
        </p-tab>
        }
      </p-tablist>

      <p-tabpanels>
        @for (section of sections; track section.key) {
        <p-tabpanel [value]="section.key">
          @switch (section.key) {
          @case ('input') {
          <div class="grid grid-cols-12 gap-8 w-full">
            <core-assumption-widget
              class="col-span-12"
            ></core-assumption-widget>
          </div>
          } @case ('metrics') {
          <div class="grid grid-cols-12 gap-6">
            <app-stats-widget
              class="col-span-12 xl:col-span-6"
            ></app-stats-widget>
            <app-chart-view
              class="col-span-12 xl:col-span-6"
              title="Sample Metrics"
              [type]="'bar'"
              [data]="demoChartData"
              [options]="demoChartOptions"
            />
          </div>
          } @case ('performance') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">Financial Performance</div>
            <p class="text-sm text-surface-300">
              Connect income statement visuals and KPI trends here.
            </p>
          </div>
          } @case ('position') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">Financial Position</div>
            <p class="text-sm text-surface-300">
              Add balance sheet snapshots and ratios in this panel.
            </p>
          </div>
          } @case ('cashflow') {
          <div class="card">
            <ng-template #content>
                Complex components that should only be initialized when the tab becomes active
            </ng-template>
            <div class="text-lg font-semibold mb-2">Cash Flow Statement</div>
            <p class="text-sm text-surface-300">
              Operating, investing, and financing cash flow views go here.
            </p>
          </div>
          } @case ('sensitivity') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">Sensitivity Analysis</div>
            <p class="text-sm text-surface-300">
              Wire tornado charts or input sliders to test key drivers.
            </p>
          </div>
          } @case ('scenario') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">
              Scenario / IFs Analysis
            </div>
            <p class="text-sm text-surface-300">
              Hook base/best/worst and IFs into tables and charts here.
            </p>
          </div>
          } @case ('montecarlo') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">Monte Carlo Simulation</div>
            <p class="text-sm text-surface-300">
              Display simulation controls and P50/P90 outcomes.
            </p>
          </div>
          } @case ('breakeven') {
          <div class="card">
            <div class="text-lg font-semibold mb-2">Break-even & Payback</div>
            <p class="text-sm text-surface-300">
              Add break-even charts and payback period calculators.
            </p>
          </div>
          } @default {
          <div class="card">
            <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
            <p class="text-sm text-surface-300">Section content coming soon.</p>
          </div>
          }
        }
        </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs> -->
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
