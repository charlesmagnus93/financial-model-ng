import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { AssumptionCoreWidget } from './components/assumptioncorewidget';
import { DistributorCommissionWidget } from './components/distributorcommissionwidget';
import inputData from '../../../../input.json';
import { DirectLaborWidget } from "./components/directlaborwidget";
import { IndirectLaborWidget } from "./components/indirectlaborwidget";
import { FixedVariableCostWidget } from "./components/fixedvariablecostwidget";
import { UtilityScheduleWidget } from "./components/utilityschedulewidget";
import { AccountsReceivableWidget } from "./components/accountsreceivablewidget";
import { ProjectionWidget } from "./components/projectionwidget";

@Component({
  standalone: true,
  selector: 'app-input-landing',
  imports: [CommonModule, FormsModule, TabsModule, AssumptionCoreWidget, DistributorCommissionWidget, DirectLaborWidget, IndirectLaborWidget, FixedVariableCostWidget, UtilityScheduleWidget, AccountsReceivableWidget, ProjectionWidget],
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
            @switch (section.key) {
              @case ('projection') {
                <projection-widget></projection-widget>
              }
              @case ('core') {
                <div class="grid grid-cols-12 gap-6 w-full">
                  <core-assumption-widget class="col-span-12"></core-assumption-widget>
                </div>
              }
              @case ('commission') {
                <distributor-commission-widget></distributor-commission-widget>
              }
              @case ('direct-labour') {
                <direct-labor-widget></direct-labor-widget>
              }
              @case ('indirect-labour') {
                <indirect-labor-widget></indirect-labor-widget>
              }
              @case ('fixed-variable-costs') {
                <fixed-variable-cost-widget></fixed-variable-cost-widget>
              }
              @case ('utility-schedule') {
                <utility-schedule-widget></utility-schedule-widget>
              }
              @case ('accounts-receivable') {
                <accounts-receivable-widget></accounts-receivable-widget>
              }
              @default {
                <div class="card">
                  <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
                  <p class="text-sm text-surface-300">Section content coming soon.</p>
                </div>
              }
            }
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class InputLandingComponent {
  sections = [
    { key: 'projection', label: 'Projection Horizon' },
    { key: 'core', label: 'Core Assumptions' },
    { key: 'commission', label: 'Distributors Commission Input' },
    { key: 'direct-labour', label: 'Direct Labour Structure' },
    { key: 'indirect-labour', label: 'Indirect Labour Structure' },
    { key: 'fixed-variable-costs', label: 'Fixed & Variable Costs Input Table' },
    { key: 'utility-schedule', label: 'Utility Schedule' },
    { key: 'accounts-receivable', label: 'Accounts Receivable Input Table' },
    { key: 'inventory-accounts-payable', label: 'Inventory & Accounts Payable Input Table' },
    { key: 'fixed-assets-schedule', label: 'Fixed Assets Schedule' },
    { key: 'cost-financing-assumptions', label: 'Cost & Financing Assumptions' },
    { key: 'revolver-loan', label: 'Revolver Loan' },
    { key: 'overdraft', label: 'Overdraft' },
    { key: 'tax-schedule', label: 'Tax Schedule' },
    { key: 'inflation-schedule', label: 'Inflation Schedule' },
    { key: 'risk-schedule', label: 'Risk Schedule' },
  ];

  activeTab = 'projection';
}
