import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
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
import {
  CassavaInputsPayload,
  CassavaModelService,
} from '../../services/cassava-model.service';

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
    ButtonModule,
    DialogModule,
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

      @if (defaultsErrorMessage) {
        <div class="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {{ defaultsErrorMessage }}
        </div>
      }

      @if (isUsingDefaults) {
        <div class="flex items-center justify-center gap-3 py-16 text-surface-500">
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
export class InputCassavaLandingComponent implements OnInit {
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
  formVisible = false;
  isUsingDefaults = false;
  isSubmitting = false;
  showSubmitConfirm = false;
  showSubmitError = false;
  submitErrorMessage = '';
  defaultsErrorMessage = '';
  @ViewChild(CassavaAssumptionsSectionComponent)
  private assumptionsSection?: CassavaAssumptionsSectionComponent;

  constructor(
    private router: Router,
    private cassavaModelService: CassavaModelService,
  ) {}

  ngOnInit(): void {
    this.cassavaModelService.clearValidationErrors();
    const snapshot = this.cassavaModelService.getInputSnapshot();
    if (this.hasPayloadData(snapshot)) {
      this.refreshForms();
      return;
    }
    this.useDefaults();
  }

  get currentSectionIndex(): number {
    return this.sections.findIndex((section) => section.key === this.activeTab);
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

  useDefaults(): void {
    if (this.isUsingDefaults) {
      return;
    }
    this.isUsingDefaults = true;
    this.defaultsErrorMessage = '';

    const scenario = this.resolveScenario(
      this.assumptionsSection?.getSelectedScenario() ??
        this.cassavaModelService.getInputSnapshot().scenario,
    );
    this.cassavaModelService.loadDefaultsForScenario(scenario).subscribe({
      next: () => {
        this.refreshForms(() => {
          this.isUsingDefaults = false;
        });
      },
      error: (error) => {
        this.defaultsErrorMessage =
          error?.error?.detail ||
          error?.message ||
          'Unable to load cassava defaults.';
        this.isUsingDefaults = false;
      },
    });
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

  closeSubmitError(): void {
    this.showSubmitError = false;
  }

  private submitModel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.cassavaModelService.runCassavaModel().subscribe({
      next: () => {
        localStorage.setItem('model_setup_complete', 'true');
        this.router.navigate(['/dashboard/cassava-ethanol-results']);
        this.isSubmitting = false;
      },
      error: (err: Error) => {
        this.submitErrorMessage =
          err?.message || 'Unable to submit data. Please try again.';
        this.showSubmitError = true;
        this.isSubmitting = false;
      },
    });
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

  private hasPayloadData(payload: CassavaInputsPayload | null | undefined): boolean {
    if (!payload) {
      return false;
    }
    const tables = payload.tables;
    return !!tables && Object.keys(tables).length > 0;
  }

  private resolveScenario(value: string | null | undefined): string {
    const scenario = String(value || 'FARM_ONLY')
      .trim()
      .toUpperCase();
    if (scenario === 'BUY_ONLY' || scenario === 'HYBRID') {
      return scenario;
    }
    return 'FARM_ONLY';
  }
}
