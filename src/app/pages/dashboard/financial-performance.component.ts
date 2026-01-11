import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateFinancialPerformanceWidget } from './components/statefinancialperformancewidget';
import { ProfitLossTrendsWidget } from './components/profitlosstrendswidget';
import { GrossRevenueScheduleWidget } from './components/grossrevenueschedulewidget';
import { ExpensesScheduleWidget } from './components/expensesschedulewidget';

@Component({
  standalone: true,
  selector: 'app-financial-performance',
  imports: [
    CommonModule,
    StateFinancialPerformanceWidget,
    ProfitLossTrendsWidget,
    GrossRevenueScheduleWidget,
    ExpensesScheduleWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <state-financial-performance-widget></state-financial-performance-widget>
      <profit-loss-trends-widget></profit-loss-trends-widget>
      <gross-revenue-schedule-widget></gross-revenue-schedule-widget>
      <expenses-schedule-widget></expenses-schedule-widget>
    </div>
  `,
})
export class FinancialPerformanceComponent {
}
