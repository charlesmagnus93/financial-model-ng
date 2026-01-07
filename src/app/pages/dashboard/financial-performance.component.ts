import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StateFinancialPerformanceWidget } from './components/statefinancialperformancewidget';
import { ProfitLossTrendsWidget } from './components/profitlosstrendswidget';
import { GrossRevenueScheduleWidget } from './components/grossrevenueschedulewidget';
import { ExpensesScheduleWidget } from './components/expensesschedulewidget';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <p-button
          label="Back"
          icon="pi pi-arrow-left"
          variant="outlined"
          severity="secondary"
          [disabled]="isFirstSection"
          (click)="goToPrevious()"
        ></p-button>
        <div class="text-sm text-surface-400">
          Section {{ currentSectionIndex + 1 }} of {{ sections.length }} -
          {{ currentSectionLabel }}
        </div>
        <p-button
          label="Next"
          icon="pi pi-arrow-right"
          iconPos="right"
          [disabled]="isLastSection"
          (click)="goToNext()"
        ></p-button>
      </div>

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
    </div>
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

  get currentSectionIndex(): number {
    return this.sections.findIndex((section) => section.key === this.activeTab);
  }

  get currentSectionLabel(): string {
    return this.sections[this.currentSectionIndex]?.label ?? '';
  }

  get isFirstSection(): boolean {
    return this.currentSectionIndex <= 0;
  }

  get isLastSection(): boolean {
    return this.currentSectionIndex >= this.sections.length - 1;
  }

  goToPrevious(): void {
    const prevIndex = this.currentSectionIndex - 1;
    if (prevIndex >= 0) {
      this.activeTab = this.sections[prevIndex].key;
    }
  }

  goToNext(): void {
    const nextIndex = this.currentSectionIndex + 1;
    if (nextIndex < this.sections.length) {
      this.activeTab = this.sections[nextIndex].key;
    }
  }
}
