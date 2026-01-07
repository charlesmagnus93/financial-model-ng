import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { AssumptionCoreWidget } from './components/assumptioncorewidget';
import { DistributorCommissionWidget } from './components/distributorcommissionwidget';
import { DirectLaborWidget } from './components/directlaborwidget';
import { IndirectLaborWidget } from './components/indirectlaborwidget';
import { FixedVariableCostWidget } from './components/fixedvariablecostwidget';
import { UtilityScheduleWidget } from './components/utilityschedulewidget';
import { AccountsReceivableWidget } from './components/accountsreceivablewidget';
import { ProjectionWidget } from './components/projectionwidget';
import { InventoryAccountsPayableWidget } from './components/inventoryaccountspayablewidget';
import { FixedAssetsScheduleWidget } from './components/fixedassetsschedulewidget';
import { CostFinancingAssumptionsWidget } from './components/costfinancingassumptionswidget';
import { SeniorDebtWidget } from './components/seniordebtwidget';
import { RevolverLoanWidget } from './components/revolverloanwidget';
import { OverdraftWidget } from './components/overdraftwidget';
import { TaxScheduleWidget } from './components/taxschedulewidget';
import { InflationScheduleWidget } from './components/inflationschedulewidget';
import { RiskScheduleWidget } from './components/riskschedulewidget';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-input-landing',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    AssumptionCoreWidget,
    DistributorCommissionWidget,
    DirectLaborWidget,
    IndirectLaborWidget,
    FixedVariableCostWidget,
    UtilityScheduleWidget,
    AccountsReceivableWidget,
    ProjectionWidget,
    InventoryAccountsPayableWidget,
    FixedAssetsScheduleWidget,
    CostFinancingAssumptionsWidget,
    SeniorDebtWidget,
    RevolverLoanWidget,
    OverdraftWidget,
    TaxScheduleWidget,
    InflationScheduleWidget,
    RiskScheduleWidget,
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
            @switch (section.key) { @case ('projection') {
            <projection-widget></projection-widget>
            } @case ('core') {
            <div class="grid grid-cols-12 gap-6 w-full">
              <core-assumption-widget
                class="col-span-12"
              ></core-assumption-widget>
            </div>
            } @case ('commission') {
            <distributor-commission-widget></distributor-commission-widget>
            } @case ('direct-labour') {
            <direct-labor-widget></direct-labor-widget>
            } @case ('indirect-labour') {
            <indirect-labor-widget></indirect-labor-widget>
            } @case ('fixed-variable-costs') {
            <fixed-variable-cost-widget></fixed-variable-cost-widget>
            } @case ('utility-schedule') {
            <utility-schedule-widget></utility-schedule-widget>
            } @case ('accounts-receivable') {
            <accounts-receivable-widget></accounts-receivable-widget>
            } @case ('inventory-accounts-payable') {
            <inventory-accounts-payable-widget></inventory-accounts-payable-widget>
            } @case ('fixed-assets-schedule') {
            <fixed-assets-schedule-widget></fixed-assets-schedule-widget>
            } @case ('cost-financing-assumptions') {
            <cost-financing-assumptions-widget></cost-financing-assumptions-widget>
            } @case ('senior-debt') {
            <senior-debt-widget></senior-debt-widget>
            } @case ('revolver-loan') {
            <revolver-loan-widget></revolver-loan-widget>
            } @case ('overdraft') {
            <overdraft-widget></overdraft-widget>
            } @case ('tax-schedule') {
            <tax-schedule-widget></tax-schedule-widget>
            } @case ('inflation-schedule') {
            <inflation-schedule-widget></inflation-schedule-widget>
            } @case ('risk-schedule') {
            <risk-schedule-widget></risk-schedule-widget>
            } @default {
            <projection-widget></projection-widget>
            } }
          </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class InputLandingComponent {
  sections = [
    { key: 'projection', label: 'Projection Horizon' },
    { key: 'core', label: 'Core Assumptions' },
    { key: 'commission', label: 'Distributors Commission Input' },
    { key: 'direct-labour', label: 'Direct Labour Structure' },
    { key: 'indirect-labour', label: 'Indirect Labour Structure' },
    {
      key: 'fixed-variable-costs',
      label: 'Fixed & Variable Costs Input Table',
    },
    { key: 'utility-schedule', label: 'Utility Schedule' },
    { key: 'accounts-receivable', label: 'Accounts Receivable Input Table' },
    {
      key: 'inventory-accounts-payable',
      label: 'Inventory & Accounts Payable Input Table',
    },
    { key: 'fixed-assets-schedule', label: 'Fixed Assets Schedule' },
    {
      key: 'cost-financing-assumptions',
      label: 'Cost & Financing Assumptions',
    },
    { key: 'senior-debt', label: 'Senior Debt' },
    { key: 'revolver-loan', label: 'Revolver Loan' },
    { key: 'overdraft', label: 'Overdraft' },
    { key: 'tax-schedule', label: 'Tax Schedule' },
    { key: 'inflation-schedule', label: 'Inflation Schedule' },
    { key: 'risk-schedule', label: 'Risk Schedule' },
  ];

  activeTab = 'projection';

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





