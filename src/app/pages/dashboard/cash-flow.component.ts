import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StatementCashFlowWidget } from './components/statementcashflowwidget';
import { CashFlowAnalyticalTrendsWidget } from './components/cashflowanalyticaltrendswidget';
import { ButtonModule } from 'primeng/button';

interface CashFlowSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-cash-flow',
  imports: [
    CommonModule,
    TabsModule,
    StatementCashFlowWidget,
    CashFlowAnalyticalTrendsWidget,
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
                @case ('statement-cash-flow') {
                  <statement-cash-flow-widget></statement-cash-flow-widget>
                }
                @case ('analytical-trends') {
                  <cash-flow-analytical-trends-widget></cash-flow-analytical-trends-widget>
                }
                @default {
                  <statement-cash-flow-widget></statement-cash-flow-widget>
                }
              }
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class CashFlowComponent {
  sections: CashFlowSection[] = [
    {
      key: 'statement-cash-flow',
      label: 'Statement of Cash Flows'
    },
    {
      key: 'analytical-trends',
      label: 'Analytical Trends'
    },
  ];

  activeTab = this.sections[0]?.key ?? 'statement-cash-flow';

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
