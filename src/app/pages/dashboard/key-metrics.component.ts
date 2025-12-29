import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { KeyMetricsOverviewWidget } from './components/keymetricsoverviewwidget';
import { InvestmentMetricsWidget } from './components/investmentmetricswidget';
import { WorkingCapitalScheduleWidget } from './components/workingcapitalschedulewidget';
import { SensitivityAnalysisWidget } from './components/sensitivityanalysiswidget';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';
import { BreakEvenPaybackWidget } from './components/breakevenpaybackwidget';

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

}
