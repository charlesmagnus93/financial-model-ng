import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { BiotechFinancialStatementsComponent } from './biotech-financial-statements.component';
import { BiotechDashboardComponent } from './components/biotech-dashboard.component';
import { BiotechAdvancedFinancialAnalyticsComponent } from './components/biotech-advanced-financial-analytics.component';
import { BiotechVcMethodHelperComponent } from './components/biotech-vc-method-helper.component';
import { RagAssistantComponent } from './components/app-rag-assistant.component';
import { PharmaModelService } from '../services/pharma-model.service';
import { BiotechModelService } from '../services/biotech-model.service';

interface ResultsSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-biotech-results',
  imports: [
    CommonModule,
    TabsModule,
    BiotechFinancialStatementsComponent,
    BiotechDashboardComponent,
    BiotechAdvancedFinancialAnalyticsComponent,
    BiotechVcMethodHelperComponent,
    RagAssistantComponent,
  ],
  providers: [BiotechModelService, { provide: PharmaModelService, useExisting: BiotechModelService }],
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
                @case ('dashboard') {
                  <app-biotech-dashboard></app-biotech-dashboard>
                }
                @case ('financial-statements') {
                  <app-biotech-financial-statements></app-biotech-financial-statements>
                }
                @case ('advanced-financial-analytics') {
                  <app-biotech-advanced-financial-analytics></app-biotech-advanced-financial-analytics>
                }
                @case ('rag-assistant') {
                  <app-rag-assistant></app-rag-assistant>
                }
                @case ('vc-helper') {
                  <app-biotech-vc-method-helper></app-biotech-vc-method-helper>
                }
                @default {
                  <app-biotech-dashboard></app-biotech-dashboard>
                }
              }
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class BiotechResultsComponent {
  sections: ResultsSection[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'financial-statements', label: 'Financial statements' },
    { key: 'advanced-financial-analytics', label: 'Advanced financial analytics' },
    { key: 'vc-helper', label: 'VC method helper' },
    { key: 'rag-assistant', label: 'RAG Assistant' },
  ];

  activeTab = this.sections[0]?.key ?? 'dashboard';
}
