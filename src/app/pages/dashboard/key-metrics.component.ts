import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyMetricsOverviewWidget } from './components/keymetricsoverviewwidget';
import { InvestmentMetricsWidget } from './components/investmentmetricswidget';
import { WorkingCapitalScheduleWidget } from './components/workingcapitalschedulewidget';
import { SensitivityAnalysisWidget } from './components/sensitivityanalysiswidget';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';
import { BreakEvenPaybackWidget } from './components/breakevenpaybackwidget';

@Component({
  standalone: true,
  selector: 'app-key-metrics',
  imports: [
    CommonModule,
    KeyMetricsOverviewWidget,
    InvestmentMetricsWidget,
    WorkingCapitalScheduleWidget,
    SensitivityAnalysisWidget,
    ScenarioAnalysisWidget,
    BreakEvenPaybackWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <key-metrics-overview-widget></key-metrics-overview-widget>
      <investment-metrics-widget></investment-metrics-widget>
      <working-capital-schedule-widget></working-capital-schedule-widget>
      <sensitivity-analysis-widget></sensitivity-analysis-widget>
      <scenario-analysis-widget></scenario-analysis-widget>
      <breakeven-payback-widget></breakeven-payback-widget>
    </div>
  `,
})
export class KeyMetricsComponent {
}
