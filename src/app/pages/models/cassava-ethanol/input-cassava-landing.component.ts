import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import {
  CassavaAssumptionsSectionComponent,
  CassavaCapexSectionComponent,
  CassavaCostsSectionComponent,
  CassavaFinancialSectionComponent,
  CassavaGlobalSectionComponent,
  CassavaOtherAssumptionsSectionComponent,
  CassavaProductionSectionComponent,
  CassavaWorkingCapitalSectionComponent,
} from './components';

interface InputSection {
  key: string;
  label: string;
}

@Component({
  selector: 'app-input-cassava-landing',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    CassavaAssumptionsSectionComponent,
    CassavaGlobalSectionComponent,
    CassavaCapexSectionComponent,
    CassavaProductionSectionComponent,
    CassavaCostsSectionComponent,
    CassavaWorkingCapitalSectionComponent,
    CassavaFinancialSectionComponent,
    CassavaOtherAssumptionsSectionComponent,
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
        <p-tabpanel value="assumptions">
          <app-cassava-assumptions-section></app-cassava-assumptions-section>
        </p-tabpanel>
        <p-tabpanel value="global">
          <app-cassava-global-section></app-cassava-global-section>
        </p-tabpanel>
        <p-tabpanel value="capex">
          <app-cassava-capex-section></app-cassava-capex-section>
        </p-tabpanel>
        <p-tabpanel value="production">
          <app-cassava-production-section></app-cassava-production-section>
        </p-tabpanel>
        <p-tabpanel value="costs">
          <app-cassava-costs-section></app-cassava-costs-section>
        </p-tabpanel>
        <p-tabpanel value="working-capital">
          <app-cassava-working-capital-section></app-cassava-working-capital-section>
        </p-tabpanel>
        <p-tabpanel value="financial">
          <app-cassava-financial-section></app-cassava-financial-section>
        </p-tabpanel>
        <p-tabpanel value="other-assumptions">
          <app-cassava-other-assumptions-section></app-cassava-other-assumptions-section>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
})
export class InputCassavaLandingComponent {
  sections: InputSection[] = [
    { key: 'assumptions', label: 'Assumptions' },
    { key: 'global', label: 'Global' },
    { key: 'capex', label: 'Capex' },
    { key: 'production', label: 'Production' },
    { key: 'costs', label: 'Costs' },
    { key: 'working-capital', label: 'Working Capital' },
    { key: 'financial', label: 'Financial' },
    { key: 'other-assumptions', label: 'Other Assumptions' },
  ];

  activeTab = 'assumptions';
}
