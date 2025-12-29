import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StateFinancialPerformanceWidget } from './components/statefinancialperformancewidget';
import { ProfitLossTrendsWidget } from './components/profitlosstrendswidget';
import { GrossRevenueScheduleWidget } from './components/grossrevenueschedulewidget';
import { ExpensesScheduleWidget } from './components/expensesschedulewidget';

interface PerformanceSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-financial-performance',
  imports: [
    CommonModule,
    TabsModule,
    StateFinancialPerformanceWidget,
    ProfitLossTrendsWidget,
    GrossRevenueScheduleWidget,
    ExpensesScheduleWidget,
  ],
  template: `
    <p-tabs [(value)]="activeTab" class="w-full" scrollable>
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
            @case ('state-financial-perf') {
              <state-financial-performance-widget></state-financial-performance-widget>
            }
            @case ('profit-loss-trends') {
              <profit-loss-trends-widget></profit-loss-trends-widget>
            }
            @case ('gross-revenue-schedule') {
              <gross-revenue-schedule-widget></gross-revenue-schedule-widget>
            }
            @case ('expenses-schedule') {
              <expenses-schedule-widget></expenses-schedule-widget>
            }
            @default {
              <state-financial-performance-widget></state-financial-performance-widget>
            }
          }
        </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class FinancialPerformanceComponent {
  sections: PerformanceSection[] = [
    {
      key: 'state-financial-perf',
      label: 'Statement of Financial Performance',
    },
    { key: 'profit-loss-trends', label: 'Profit & Loss Trends' },
    { key: 'gross-revenue-schedule', label: 'Gross Revenue Schedule' },
    { key: 'expenses-schedule', label: 'Total Expenses Schedule' },
  ];

  activeTab = this.sections[0]?.key ?? 'state-financial-perf';
}
