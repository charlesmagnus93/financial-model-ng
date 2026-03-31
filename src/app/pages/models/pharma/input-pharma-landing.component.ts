import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  AccountsReceivableWidget,
  AssumptionCoreWidget,
  CostFinancingAssumptionsWidget,
  DirectLaborWidget,
  DistributorCommissionWidget,
  FixedAssetsScheduleWidget,
  FixedVariableCostWidget,
  IndirectLaborWidget,
  InflationScheduleWidget,
  InventoryAccountsPayableWidget,
  OverdraftWidget,
  ProjectionWidget,
  RevolverLoanWidget,
  RiskScheduleWidget,
  SeniorDebtWidget,
  TaxScheduleWidget,
  UtilityScheduleWidget,
} from './components';
import { PharmaModelService, ValidationIssue } from '../../services/pharma-model.service';

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
    DialogModule,
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
        <p-button
          label="Use Defaults"
          icon="pi pi-refresh"
          variant="outlined"
          severity="success"
          [disabled]="isUsingDefaults"
          (click)="useDefaults()"
        ></p-button>
        <!-- <div class="text-sm text-surface-400">
          Section {{ currentSectionIndex + 1 }} of {{ sections.length }} -
          {{ currentSectionLabel }}
        </div> -->
        @if (isLastSection) {
          <p-button
            label="Submit Customer Data"
            icon="pi pi-check"
            [disabled]="isSubmitting"
            (click)="openSubmitConfirm()"
          ></p-button>
        } @else {
          <p-button
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            (click)="goToNext()"
          ></p-button>
        }
      </div>

      @if (isUsingDefaults) {
        <div
          class="flex items-center justify-center gap-3 py-16 text-surface-500"
        >
          <i class="pi pi-spinner pi-spin text-xl" aria-hidden="true"></i>
          <span class="text-sm">Loading defaults...</span>
        </div>
      } @else if (formVisible) {
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
              @if (sectionErrors(section.key).length) {
                <div
                  class="mb-4 rounded border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300"
                >
                  <div class="font-semibold">Required fields</div>
                  <div class="mt-2 flex flex-col gap-1">
                    @for (error of sectionErrors(section.key); track error.path) {
                      <div>
                        {{ formatFieldPath(error.path) }}: {{ error.message }}
                      </div>
                    }
                  </div>
                </div>
              }
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
      }
    </div>

    <p-dialog
      header="Confirmation!"
      [(visible)]="showSubmitConfirm"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '26rem' }"
      (onHide)="closeSubmitConfirm()"
    >
      <div class="flex flex-col gap-4">
        <p class="text-sm text-surface-500">
          <!-- This will submit the current inputs and run the model. -->
          Are you sure, you want to submit the customer data and run the model ?
        </p>
        <div class="flex justify-end gap-2">
          <p-button
            label="No"
            icon="pi pi-times"
            severity="secondary"
            [text]="true"
            (click)="closeSubmitConfirm()"
          ></p-button>
          <p-button
            label="Yes"
            icon="pi pi-check"
            [disabled]="isSubmitting"
            (click)="confirmSubmitModel()"
          ></p-button>
        </div>
      </div>
    </p-dialog>

    <p-dialog
      header="Submission failed"
      [(visible)]="showSubmitError"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '26rem' }"
      (onHide)="closeSubmitError()"
    >
      <div class="flex flex-col gap-4">
        <p class="text-sm text-surface-500">{{ submitErrorMessage }}</p>
        <div class="flex justify-end">
          <p-button
            label="Close"
            severity="secondary"
            [text]="true"
            (click)="closeSubmitError()"
          ></p-button>
        </div>
      </div>
    </p-dialog>

    <p-dialog
      header="Running model"
      [(visible)]="isSubmitting"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [style]="{ width: '22rem' }"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-spinner pi-spin text-xl" aria-hidden="true"></i>
        <span class="text-sm text-surface-500">Processing submission...</span>
      </div>
    </p-dialog>
  `,
})
export class InputPharmaLandingComponent implements OnInit {
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
  isSubmitting = false;
  formVisible = false;
  isUsingDefaults = false;
  showSubmitConfirm = false;
  showSubmitError = false;
  submitErrorMessage = '';
  private fieldSectionMap: Record<string, string> = {
    years: 'projection',
    production_estimate: 'projection',
    unit_costs: 'core',
    markup: 'core',
    total_production_units: 'core',
    production_capacity: 'core',
    distributor_commission: 'commission',
    fixed_variable_costs: 'fixed-variable-costs',
    utility_costs: 'utility-schedule',
    depreciation: 'fixed-assets-schedule',
    capital_expenditure: 'fixed-assets-schedule',
    raw_material_cost: 'fixed-variable-costs',
    financing: 'cost-financing-assumptions',
    senior_debt: 'senior-debt',
    revolver: 'revolver-loan',
    overdraft: 'overdraft',
    tax: 'tax-schedule',
    inflation_rate: 'inflation-schedule',
    inflation_series: 'inflation-schedule',
    risk: 'risk-schedule',
    scenarios: 'projection',
    sensitivity: 'projection',
    monte_carlo: 'projection',
  };

  constructor(
    private router: Router,
    private pharmaModelService: PharmaModelService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

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

  openSubmitConfirm(): void {
    if (this.isSubmitting) {
      return;
    }
    this.showSubmitConfirm = true;
  }

  closeSubmitConfirm(): void {
    this.showSubmitConfirm = false;
  }

  confirmSubmitModel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.showSubmitConfirm = false;
    this.submitModel();
  }

  private submitModel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.pharmaModelService.runPharmaModel().subscribe({
      next: () => {
        localStorage.setItem('model_setup_complete', 'true');
        this.router.navigate(['/dashboard/pharma-results']);
        this.isSubmitting = false;
      },
      error: (err: Error) => {
        this.submitErrorMessage =
          err?.message || 'Unable to submit data. Please try again.';
        this.showSubmitError = true;
        this.focusFirstErrorSection();
        this.isSubmitting = false;
      },
    });
  }

  closeSubmitError(): void {
    this.showSubmitError = false;
  }

  useDefaults(): void {
    if (this.isUsingDefaults) {
      return;
    }
    this.isUsingDefaults = true;
    this.pharmaModelService.loadDefaults().subscribe({
      next: () => {
        this.refreshForms(() => {
          this.isUsingDefaults = false;
        });
      },
      error: () => {
        this.isUsingDefaults = false;
      },
    });
  }

  private initializeForm(): void {
    this.pharmaModelService.clearValidationErrors();
    this.refreshForms();
  }

  private refreshForms(onComplete?: () => void): void {
    this.formVisible = false;
    setTimeout(() => {
      this.formVisible = true;
      if (onComplete) {
        onComplete();
      }
    }, 0);
  }

  sectionErrors(sectionKey: string): ValidationIssue[] {
    return this.pharmaModelService
      .validationErrors()
      .filter((error) => this.resolveSection(error.path) === sectionKey);
  }

  formatFieldPath(path: string): string {
    return path
      .split('.')
      .filter(Boolean)
      .map((segment) => segment.replace(/_/g, ' '))
      .join(' > ');
  }

  private focusFirstErrorSection(): void {
    const errors = this.pharmaModelService.validationErrors();
    for (const error of errors) {
      const section = this.resolveSection(error.path);
      if (section) {
        this.activeTab = section;
        return;
      }
    }
  }

  private resolveSection(path: string): string | null {
    if (!path) {
      return null;
    }
    if (path.startsWith('labor.')) {
      if (path.includes('direct')) {
        return 'direct-labour';
      }
      if (path.includes('indirect')) {
        return 'indirect-labour';
      }
      return 'direct-labour';
    }
    if (path.startsWith('working_capital.days.accounts_receivable')) {
      return 'accounts-receivable';
    }
    if (
      path.startsWith('working_capital.days.inventory') ||
      path.startsWith('working_capital.days.accounts_payable')
    ) {
      return 'inventory-accounts-payable';
    }
    const topLevel = path.split('.')[0];
    return this.fieldSectionMap[topLevel] ?? 'projection';
  }
}
