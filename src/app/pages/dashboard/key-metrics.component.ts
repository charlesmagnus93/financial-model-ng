import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { KeyMetricsOverviewWidget } from './components/keymetricsoverviewwidget';
import { InvestmentMetricsWidget } from './components/investmentmetricswidget';
import { WorkingCapitalScheduleWidget } from './components/workingcapitalschedulewidget';
import { SensitivityAnalysisWidget } from './components/sensitivityanalysiswidget';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';
import { BreakEvenPaybackWidget } from './components/breakevenpaybackwidget';
import { ButtonModule } from 'primeng/button';

interface MetricsSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-key-metrics',
  imports: [
    CommonModule,
    TabsModule,
    KeyMetricsOverviewWidget,
    InvestmentMetricsWidget,
    WorkingCapitalScheduleWidget,
    SensitivityAnalysisWidget,
    ScenarioAnalysisWidget,
    BreakEvenPaybackWidget,
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
            @switch (section.key) { @case ('overview') {
            <key-metrics-overview-widget></key-metrics-overview-widget>
            } @case ('investment-metrics') {
            <investment-metrics-widget></investment-metrics-widget>
            } @case ('working-capital') {
            <working-capital-schedule-widget></working-capital-schedule-widget>
            } @case ('sensitivity') {
            <sensitivity-analysis-widget></sensitivity-analysis-widget>
            } @case ('scenario') {
            <scenario-analysis-widget></scenario-analysis-widget>
            } @case ('breakeven') {
            <breakeven-payback-widget></breakeven-payback-widget>
            } @default {
            <key-metrics-overview-widget></key-metrics-overview-widget>
            } }
          </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class KeyMetricsComponent {
  sections: MetricsSection[] = [
    {
      key: 'overview',
      label: 'Overview'
    },
    {
      key: 'investment-metrics',
      label: 'Investment Metrics'
    },
    {
      key: 'working-capital',
      label: 'Working Capital Schedule'
    },
    {
      key: 'sensitivity',
      label: 'Sensitivity Analysis'
    },
    {
      key: 'scenario',
      label: 'Scenario / IFs'
    },
    {
      key: 'breakeven',
      label: 'Break-even & Payback'
    }
  ];

  activeTab = this.sections[0]?.key ?? 'overview';

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
