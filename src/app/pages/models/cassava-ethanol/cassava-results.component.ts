import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import {
  CassavaResultsAdvancedToolsSectionComponent,
  CassavaResultsCashFlowSectionComponent,
  CassavaResultsDashboardSectionComponent,
  CassavaResultsExportSectionComponent,
  CassavaResultsMonteCarloSectionComponent,
  CassavaResultsPerformanceSectionComponent,
  CassavaResultsPositionSectionComponent,
  CassavaResultsRawJsonSectionComponent,
  CassavaResultsScenarioSectionComponent,
  CassavaResultsSentivitySectionComponent,
} from './components';

interface ResultsSection {
  key: string;
  label: string;
}

@Component({
  selector: 'app-cassava-results',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    CassavaResultsDashboardSectionComponent,
    CassavaResultsPerformanceSectionComponent,
    CassavaResultsPositionSectionComponent,
    CassavaResultsCashFlowSectionComponent,
    CassavaResultsSentivitySectionComponent,
    CassavaResultsScenarioSectionComponent,
    CassavaResultsAdvancedToolsSectionComponent,
    CassavaResultsMonteCarloSectionComponent,
    CassavaResultsExportSectionComponent,
    CassavaResultsRawJsonSectionComponent,
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
          <p-tabpanel value="dashboard">
            <app-cassava-results-dashboard-section></app-cassava-results-dashboard-section>
          </p-tabpanel>

          <p-tabpanel value="performance">
            <app-cassava-results-performance-section></app-cassava-results-performance-section>
          </p-tabpanel>

          <p-tabpanel value="position">
            <app-cassava-results-position-section></app-cassava-results-position-section>
          </p-tabpanel>

          <p-tabpanel value="cash-flow">
            <app-cassava-results-cash-flow-section></app-cassava-results-cash-flow-section>
          </p-tabpanel>

          <p-tabpanel value="sentivity">
            <app-cassava-results-sentivity-section></app-cassava-results-sentivity-section>
          </p-tabpanel>

          <p-tabpanel value="scenario">
            <app-cassava-results-scenario-section></app-cassava-results-scenario-section>
          </p-tabpanel>

          <p-tabpanel value="advanced-tools">
            <app-cassava-results-advanced-tools-section></app-cassava-results-advanced-tools-section>
          </p-tabpanel>

          <p-tabpanel value="monte-carlo">
            <app-cassava-results-monte-carlo-section></app-cassava-results-monte-carlo-section>
          </p-tabpanel>

          <p-tabpanel value="export">
            <app-cassava-results-export-section></app-cassava-results-export-section>
          </p-tabpanel>

          <p-tabpanel value="raw-json">
            <app-cassava-results-raw-json-section></app-cassava-results-raw-json-section>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class CassavaResultsComponent {
  sections: ResultsSection[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'performance', label: 'Performance' },
    { key: 'position', label: 'Position' },
    { key: 'cash-flow', label: 'Cash Flow' },
    { key: 'sentivity', label: 'Sensitivity' },
    { key: 'scenario', label: 'Scenario' },
    { key: 'advanced-tools', label: 'Advanced Tools' },
    { key: 'monte-carlo', label: 'Monte Carlo' },
    { key: 'export', label: 'Export' },
    { key: 'raw-json', label: 'Raw JSON' },
  ];

  activeTab = 'dashboard';
}
