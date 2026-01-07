import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StatementFinancialPositionWidget } from './components/statementfinancialpositionwidget';
import { AnalyticalTrendsWidget } from './components/analyticaltrendswidget';
import { ButtonModule } from 'primeng/button';

interface PositionSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-financial-position',
  imports: [
    CommonModule,
    TabsModule,
    StatementFinancialPositionWidget,
    AnalyticalTrendsWidget,
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
              @case ('statement-financial-position') {
                <statement-financial-position-widget></statement-financial-position-widget>
              }
              @case ('analytical-trends') {
                <analytical-trends-widget></analytical-trends-widget>
              }
              @default {
                <statement-financial-position-widget></statement-financial-position-widget>
              }
            }
          </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class FinancialPositionComponent {
  sections: PositionSection[] = [
    {
      key: 'statement-financial-position',
      label: 'Statement of Financial Position',
    },
    {
      key: 'analytical-trends',
      label: 'Analytical Trends',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'statement-financial-position';

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
