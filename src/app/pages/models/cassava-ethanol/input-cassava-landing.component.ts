import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  CassavaInputsPayload,
  CassavaLandingTablePayload,
  CassavaModelService,
  CassavaProjectionPayload,
  ValidationIssue,
} from '../../services/cassava-model.service';
import { CassavaTableEditorComponent } from './components';

interface InputSection {
  key: string;
  label: string;
}

@Component({
  selector: 'app-input-cassava-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ButtonModule,
    DialogModule,
    CassavaTableEditorComponent,
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
            @for (section of sections; track section.key) {
              <p-tabpanel [value]="section.key">
                @if (sectionErrors(section.key).length) {
                  <div
                    class="mb-4 rounded border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300"
                  >
                    <div class="font-semibold">Required fields</div>
                    <div class="mt-2 flex flex-col gap-1">
                      @for (error of sectionErrors(section.key); track error.path) {
                        <div>{{ formatFieldPath(error.path) }}: {{ error.message }}</div>
                      }
                    </div>
                  </div>
                }

                @if (section.key === 'scenario') {
                  <div class="card flex flex-col gap-4">
                    <div class="text-sm font-semibold">Scenario & Projection</div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                        <label class="text-xs text-surface-500">Scenario</label>
                        <select
                          class="p-inputtext p-component w-full"
                          [ngModel]="payload.scenario || 'FARM_ONLY'"
                          (ngModelChange)="onScenarioChange($event)"
                        >
                          <option value="FARM_ONLY">FARM_ONLY</option>
                          <option value="BUY_ONLY">BUY_ONLY</option>
                          <option value="HYBRID">HYBRID</option>
                        </select>
                      </div>

                      <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
                        <label class="text-xs text-surface-500">Start year</label>
                        <input
                          type="number"
                          class="p-inputtext p-component w-full"
                          [ngModel]="projection.start_year"
                          (ngModelChange)="onProjectionChange('start_year', $event)"
                        />
                      </div>

                      <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
                        <label class="text-xs text-surface-500">End year</label>
                        <input
                          type="number"
                          class="p-inputtext p-component w-full"
                          [ngModel]="projection.end_year"
                          (ngModelChange)="onProjectionChange('end_year', $event)"
                        />
                      </div>

                      <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                        <label class="text-xs text-surface-500">Planning start</label>
                        <input
                          type="month"
                          class="p-inputtext p-component w-full"
                          [ngModel]="projection.planning_start"
                          (ngModelChange)="onProjectionChange('planning_start', $event)"
                        />
                      </div>
                    </div>
                  </div>
                } @else {
                  <app-cassava-table-editor
                    [table]="tableForSection(section.key)"
                    (tableChange)="onTableChange(section.key, $event)"
                  ></app-cassava-table-editor>
                }
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
          Are you sure you want to submit customer data and run the model?
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
  private readonly tableOrder = [
    'global_inputs',
    'initial_investment',
    'revenue_inputs',
    'production_annual',
    'production_monthly',
    'direct_costs_monthly',
    'staff_positions',
    'staff_costs_monthly',
    'other_opex_monthly',
    'accounts_receivable',
    'inventory_payable',
    'loan_schedule',
    'tax_schedule',
    'inflation_schedule',
    'risk_schedule',
  ];

  payload: CassavaInputsPayload = {};
  sections: InputSection[] = [{ key: 'scenario', label: 'Scenario & Projection' }];
  activeTab = 'scenario';

  isSubmitting = false;
  formVisible = false;
  isUsingDefaults = false;
  showSubmitConfirm = false;
  showSubmitError = false;
  submitErrorMessage = '';

  constructor(
    private router: Router,
    private cassavaModelService: CassavaModelService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get projection(): CassavaProjectionPayload {
    this.ensureProjection();
    return this.payload.projection as CassavaProjectionPayload;
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

  useDefaults(): void {
    if (this.isUsingDefaults) {
      return;
    }
    this.isUsingDefaults = true;
    this.cassavaModelService.loadDefaults().subscribe({
      next: () => {
        this.setPayload(this.cassavaModelService.getInputSnapshot());
        this.refreshForms(() => {
          this.isUsingDefaults = false;
        });
      },
      error: (error) => {
        this.submitErrorMessage =
          error?.error?.detail ||
          error?.message ||
          'Unable to load defaults. Please try again.';
        this.showSubmitError = true;
        this.isUsingDefaults = false;
      },
    });
  }

  onScenarioChange(value: string): void {
    this.payload.scenario = String(value || '').toUpperCase();
    this.syncInput();
  }

  onProjectionChange(field: keyof CassavaProjectionPayload, value: any): void {
    this.ensureProjection();
    if (!this.payload.projection) {
      return;
    }

    if (field === 'start_year' || field === 'end_year') {
      this.payload.projection[field] = Number(value || 0);
    } else {
      this.payload.projection[field] = String(value || '');
    }
    this.syncInput();
  }

  tableForSection(sectionKey: string): CassavaLandingTablePayload | null {
    const tableKey = this.tableKeyFromSection(sectionKey);
    if (!tableKey) {
      return null;
    }
    return this.payload.tables?.[tableKey] ?? null;
  }

  onTableChange(
    sectionKey: string,
    updatedTable: CassavaLandingTablePayload,
  ): void {
    const tableKey = this.tableKeyFromSection(sectionKey);
    if (!tableKey) {
      return;
    }
    if (!this.payload.tables) {
      this.payload.tables = {};
    }
    this.payload.tables[tableKey] = this.deepClone(updatedTable);
    this.syncInput();
  }

  sectionErrors(sectionKey: string): ValidationIssue[] {
    return this.cassavaModelService
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

  private initializeForm(): void {
    this.cassavaModelService.clearValidationErrors();
    const snapshot = this.cassavaModelService.getInputSnapshot();
    if (this.hasPayloadData(snapshot)) {
      this.setPayload(snapshot);
      this.refreshForms();
      return;
    }
    this.useDefaults();
  }

  private submitModel(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.cassavaModelService.runCassavaModel().subscribe({
      next: () => {
        localStorage.setItem('selected_model', 'cassava_ethanol');
        localStorage.setItem('model_setup_complete', 'true');
        this.router.navigate(['/dashboard/cassava-ethanol-results']);
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

  private refreshForms(onComplete?: () => void): void {
    this.formVisible = false;
    setTimeout(() => {
      this.formVisible = true;
      if (onComplete) {
        onComplete();
      }
    }, 0);
  }

  private setPayload(payload: CassavaInputsPayload): void {
    this.payload = this.deepClone(payload ?? {});
    this.ensureProjection();
    if (!this.payload.scenario) {
      this.payload.scenario = 'FARM_ONLY';
    }
    if (!this.payload.tables) {
      this.payload.tables = {};
    }
    this.rebuildSections();
  }

  private syncInput(): void {
    this.cassavaModelService.setInput(this.deepClone(this.payload));
    this.rebuildSections();
  }

  private ensureProjection(): void {
    if (!this.payload.projection) {
      this.payload.projection = {
        start_year: 2024,
        end_year: 2034,
        planning_start: '2025-01',
      };
      return;
    }
    this.payload.projection.start_year = Number(
      this.payload.projection.start_year ?? 2024,
    );
    this.payload.projection.end_year = Number(
      this.payload.projection.end_year ?? 2034,
    );
    this.payload.projection.planning_start = String(
      this.payload.projection.planning_start ?? '2025-01',
    );
  }

  private rebuildSections(): void {
    const tables = this.payload.tables ?? {};
    const orderedKeys = this.tableOrder.filter((key) => tables[key]);
    const extraKeys = Object.keys(tables).filter(
      (key) => !orderedKeys.includes(key),
    );
    const tableKeys = [...orderedKeys, ...extraKeys];

    this.sections = [
      { key: 'scenario', label: 'Scenario & Projection' },
      ...tableKeys.map((key) => ({
        key: this.toTableSectionKey(key),
        label: tables[key]?.name || this.formatTableKey(key),
      })),
    ];

    if (!this.sections.some((section) => section.key === this.activeTab)) {
      this.activeTab = this.sections[0]?.key ?? 'scenario';
    }
  }

  private focusFirstErrorSection(): void {
    const errors = this.cassavaModelService.validationErrors();
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
    if (path.startsWith('tables.')) {
      const tableKey = path.split('.')[1];
      if (tableKey) {
        return this.toTableSectionKey(tableKey);
      }
    }
    return 'scenario';
  }

  private tableKeyFromSection(sectionKey: string): string | null {
    if (!sectionKey.startsWith('table:')) {
      return null;
    }
    return sectionKey.slice('table:'.length);
  }

  private toTableSectionKey(tableKey: string): string {
    return `table:${tableKey}`;
  }

  private formatTableKey(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private hasPayloadData(payload: CassavaInputsPayload | null | undefined): boolean {
    if (!payload) {
      return false;
    }
    const tables = payload.tables;
    return !!tables && Object.keys(tables).length > 0;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
