import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import {
  BreakEvenPaybackComponent,
  CashFlowComponent,
  FinancialPerformanceComponent,
  FinancialPositionComponent,
  KeyMetricsComponent,
  MonteCarloSimulationComponent,
  ScenarioIfsComponent,
  SensitivityAnalysisComponent,
} from './components';

interface ResultsSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-pharma-results',
  imports: [
    CommonModule,
    TabsModule,
    KeyMetricsComponent,
    FinancialPerformanceComponent,
    FinancialPositionComponent,
    CashFlowComponent,
    SensitivityAnalysisComponent,
    ScenarioIfsComponent,
    MonteCarloSimulationComponent,
    BreakEvenPaybackComponent,
  ],
  template: `
    <div class="flex flex-col gap-4">
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
                @case ('key-metrics') {
                  <app-key-metrics></app-key-metrics>
                }
                @case ('financial-performance') {
                  <app-financial-performance></app-financial-performance>
                }
                @case ('financial-position') {
                  <app-financial-position></app-financial-position>
                }
                @case ('cash-flow') {
                  <app-cash-flow></app-cash-flow>
                }
                @case ('sensitivity-analysis') {
                  <app-sensitivity-analysis></app-sensitivity-analysis>
                }
                @case ('scenario-ifs') {
                  <app-scenario-ifs></app-scenario-ifs>
                }
                @case ('monte-carlo') {
                  <app-simulation-montecarlo></app-simulation-montecarlo>
                }
                @case ('break-even') {
                  <app-break-even-payback></app-break-even-payback>
                }
                @default {
                  <app-key-metrics></app-key-metrics>
                }
              }
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class PharmaResultsComponent {
  sections: ResultsSection[] = [
    { key: 'key-metrics', label: 'Key Metrics' },
    { key: 'financial-performance', label: 'Financial Performance' },
    { key: 'financial-position', label: 'Financial Position' },
    { key: 'cash-flow', label: 'Cash Flow' },
    { key: 'sensitivity-analysis', label: 'Sensitivity Analysis' },
    { key: 'scenario-ifs', label: 'Scenario / IFs' },
    { key: 'monte-carlo', label: 'Monte Carlo Simulation' },
    { key: 'break-even', label: 'Break-even & Payback' },
  ];

  activeTab = this.sections[0]?.key ?? 'key-metrics';
}
