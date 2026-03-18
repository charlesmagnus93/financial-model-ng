import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

type TextFieldKey = 'poolName' | 'appliesTo' | 'allocationMethod';
type NumericFieldKey =
  | 'manufacturingScaleUpAssetsPreGtmUsd'
  | 'manufacturingScaleUpAssetsPostGtmUsdPerYear'
  | 'qualityComplianceInfrastructurePreGtmUsd'
  | 'qualityComplianceInfrastructurePostGtmUsdPerYear'
  | 'coldChainDistributionAssetsPreGtmUsd'
  | 'coldChainDistributionAssetsPostGtmUsdPerYear'
  | 'itDataDigitalInfrastructurePreGtmUsd'
  | 'itDataDigitalInfrastructurePostGtmUsdPerYear'
  | 'facilityBuildOutLeaseholdImprovementsPreGtmUsd'
  | 'facilityBuildOutLeaseholdImprovementsPostGtmUsdPerYear'
  | 'processDevelopmentTechTransferAssetsPreGtmUsd'
  | 'processDevelopmentTechTransferAssetsPostGtmUsdPerYear';

interface SharedCapexPoolRow {
  rowId: string;
  poolName: string;
  appliesTo: string;
  allocationMethod: string;
  manufacturingScaleUpAssetsPreGtmUsd: number;
  manufacturingScaleUpAssetsPostGtmUsdPerYear: number;
  qualityComplianceInfrastructurePreGtmUsd: number;
  qualityComplianceInfrastructurePostGtmUsdPerYear: number;
  coldChainDistributionAssetsPreGtmUsd: number;
  coldChainDistributionAssetsPostGtmUsdPerYear: number;
  itDataDigitalInfrastructurePreGtmUsd: number;
  itDataDigitalInfrastructurePostGtmUsdPerYear: number;
  facilityBuildOutLeaseholdImprovementsPreGtmUsd: number;
  facilityBuildOutLeaseholdImprovementsPostGtmUsdPerYear: number;
  processDevelopmentTechTransferAssetsPreGtmUsd: number;
  processDevelopmentTechTransferAssetsPostGtmUsdPerYear: number;
}

interface IncrementHelper {
  column: NumericFieldKey;
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

interface ColumnDefinition<K extends string> {
  key: K;
  label: string;
  sourceKey: string;
}

interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

const TEXT_FIELD_DEFINITIONS: Array<ColumnDefinition<TextFieldKey>> = [
  { key: 'poolName', label: 'Pool name', sourceKey: 'Pool name' },
  {
    key: 'appliesTo',
    label: 'Applies to (IDs or ALL)',
    sourceKey: 'Applies to (IDs or ALL)',
  },
  {
    key: 'allocationMethod',
    label: 'Allocation method',
    sourceKey: 'Allocation method',
  },
];

const NUMERIC_FIELD_DEFINITIONS: Array<ColumnDefinition<NumericFieldKey>> = [
  {
    key: 'manufacturingScaleUpAssetsPreGtmUsd',
    label: 'Manufacturing & Scale-up Assets (Pre-GTM, USD)',
    sourceKey: 'Manufacturing & Scale-up Assets (Pre-GTM, USD)',
  },
  {
    key: 'manufacturingScaleUpAssetsPostGtmUsdPerYear',
    label: 'Manufacturing & Scale-up Assets (Post-GTM, USD/year)',
    sourceKey: 'Manufacturing & Scale-up Assets (Post-GTM, USD/year)',
  },
  {
    key: 'qualityComplianceInfrastructurePreGtmUsd',
    label: 'Quality & Compliance Infrastructure (Pre-GTM, USD)',
    sourceKey: 'Quality & Compliance Infrastructure (Pre-GTM, USD)',
  },
  {
    key: 'qualityComplianceInfrastructurePostGtmUsdPerYear',
    label: 'Quality & Compliance Infrastructure (Post-GTM, USD/year)',
    sourceKey: 'Quality & Compliance Infrastructure (Post-GTM, USD/year)',
  },
  {
    key: 'coldChainDistributionAssetsPreGtmUsd',
    label: 'Cold-chain / Distribution Assets (Pre-GTM, USD)',
    sourceKey: 'Cold-chain / Distribution Assets (Pre-GTM, USD)',
  },
  {
    key: 'coldChainDistributionAssetsPostGtmUsdPerYear',
    label: 'Cold-chain / Distribution Assets (Post-GTM, USD/year)',
    sourceKey: 'Cold-chain / Distribution Assets (Post-GTM, USD/year)',
  },
  {
    key: 'itDataDigitalInfrastructurePreGtmUsd',
    label: 'IT / Data / Digital Infrastructure (Pre-GTM, USD)',
    sourceKey: 'IT / Data / Digital Infrastructure (Pre-GTM, USD)',
  },
  {
    key: 'itDataDigitalInfrastructurePostGtmUsdPerYear',
    label: 'IT / Data / Digital Infrastructure (Post-GTM, USD/year)',
    sourceKey: 'IT / Data / Digital Infrastructure (Post-GTM, USD/year)',
  },
  {
    key: 'facilityBuildOutLeaseholdImprovementsPreGtmUsd',
    label: 'Facility Build-out / Leasehold Improvements (Pre-GTM, USD)',
    sourceKey: 'Facility Build-out / Leasehold Improvements (Pre-GTM, USD)',
  },
  {
    key: 'facilityBuildOutLeaseholdImprovementsPostGtmUsdPerYear',
    label: 'Facility Build-out / Leasehold Improvements (Post-GTM, USD/year)',
    sourceKey: 'Facility Build-out / Leasehold Improvements (Post-GTM, USD/year)',
  },
  {
    key: 'processDevelopmentTechTransferAssetsPreGtmUsd',
    label: 'Process Development & Tech-Transfer Assets (Pre-GTM, USD)',
    sourceKey: 'Process Development & Tech-Transfer Assets (Pre-GTM, USD)',
  },
  {
    key: 'processDevelopmentTechTransferAssetsPostGtmUsdPerYear',
    label: 'Process Development & Tech-Transfer Assets (Post-GTM, USD/year)',
    sourceKey: 'Process Development & Tech-Transfer Assets (Post-GTM, USD/year)',
  },
];

@Component({
  standalone: true,
  selector: 'biotech-product-shared-capex-pools-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset legend="Shared CAPEX pools" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [(ngModel)]="selectedRowId"
              (ngModelChange)="syncSelectedRow()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select row"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-start">
                <ng-container *ngFor="let field of textFieldDefinitions">
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs font-semibold">{{ field.label }}</label>
                    <input pInputText [formControlName]="field.key" class="w-full" />
                  </div>
                </ng-container>
                <ng-container *ngFor="let field of numericFieldDefinitions">
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs font-semibold">{{ field.label }}</label>
                    <p-inputnumber
                      [formControlName]="field.key"
                      [showButtons]="true"
                      [min]="0"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="2"
                      [useGrouping]="true"
                      inputStyleClass="w-full"
                    />
                  </div>
                </ng-container>
              </div>
              <p-button
                label="Save changes"
                size="small"
                [outlined]="true"
                (onClick)="saveSelectedRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-start">
                <ng-container *ngFor="let field of textFieldDefinitions">
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs font-semibold">{{ field.label }}</label>
                    <input pInputText [formControlName]="field.key" class="w-full" />
                  </div>
                </ng-container>
                <ng-container *ngFor="let field of numericFieldDefinitions">
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs font-semibold">{{ field.label }}</label>
                    <p-inputnumber
                      [formControlName]="field.key"
                      [showButtons]="true"
                      [min]="0"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="2"
                      [useGrouping]="true"
                      inputStyleClass="w-full"
                    />
                  </div>
                </ng-container>
              </div>
              <p-button
                label="Add row"
                size="small"
                [outlined]="true"
                (onClick)="addRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <p class="text-xs text-surface-500">
                Apply a fixed change or % growth from a start year onward. "Increment per year" is
                the step size (or growth rate when compounding). "Years to apply" controls how many
                consecutive rows are updated.
              </p>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                [(ngModel)]="helper.column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Start row</label>
              <p-inputnumber
                [(ngModel)]="helper.startRow"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Years to apply</label>
              <p-inputnumber
                [(ngModel)]="helper.yearsToApply"
                [showButtons]="true"
                [min]="1"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerYear"
                [showButtons]="true"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <div class="flex items-center gap-2 mt-1">
                <p-checkbox [(ngModel)]="helper.compound" [binary]="true"></p-checkbox>
                <label class="text-xs font-semibold">
                  Compound annually (apply % growth)
                </label>
              </div>
              <p-button
                label="Apply increment"
                size="small"
                [outlined]="true"
                (onClick)="applyIncrement()"
                fluid
              ></p-button>
            </div>
          </div>
        </div>

        <div class="overflow-auto rounded" [style]="{ width: '75vw' }">
          <p-table 
            [value]="rows" 
            showGridlines
            responsiveLayout="scroll"
            [scrollable]="true"
            class="text-sm" 
            [size]="'small'"
          >
            <ng-template #header>
              <tr>
                <th style="min-width:180px">Pool name</th>
                <th style="min-width:140px">Applies to (IDs or ALL)</th>
                <th style="min-width:130px">Allocation method</th>
                <th style="min-width:350px" *ngFor="let field of numericFieldDefinitions">{{ field.label }}</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.poolName }}</td>
                <td>{{ row.appliesTo }}</td>
                <td>{{ row.allocationMethod }}</td>
                <td *ngFor="let field of numericFieldDefinitions">
                  {{ row[field.key] | number: '1.0-0' }}
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

      </div>
    </p-fieldset>
  `,
})
export class BiotechProductSharedCapexPoolsFieldsetComponent implements OnInit {
  rows: SharedCapexPoolRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;

  helper: IncrementHelper = {
    column: 'manufacturingScaleUpAssetsPreGtmUsd',
    startRow: 0,
    incrementPerYear: 1,
    yearsToApply: 1,
    compound: false,
  };

  readonly textFieldDefinitions = TEXT_FIELD_DEFINITIONS;
  readonly numericFieldDefinitions = NUMERIC_FIELD_DEFINITIONS;
  readonly helperColumnDefinitions = NUMERIC_FIELD_DEFINITIONS.map((field) => ({
    sourceKey: field.sourceKey,
    label: field.label,
    value: field.key,
  }));
  helperColumnOptions: SelectOption<NumericFieldKey>[] = [];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.buildForm(this.buildEmptyRow(''));
    this.newRowForm = this.buildForm(this.buildNewRowTemplate(this.formatRowId(1)));
  }

  ngOnInit(): void {
    this.syncFromModel();
    this.refreshHelperColumnOptions();
  }

  get rowOptions(): SelectOption[] {
    return this.rows.map((row, index) => ({
      label: `Row ${index + 1}${row.poolName ? ` - ${row.poolName}` : ''}`,
      value: row.rowId,
    }));
  }

  get rowFormValue(): SharedCapexPoolRow {
    return this.rowForm.getRawValue() as SharedCapexPoolRow;
  }

  get newRowFormValue(): SharedCapexPoolRow {
    return this.newRowForm.getRawValue() as SharedCapexPoolRow;
  }

  syncSelectedRow(): void {
    const selected = this.getSelectedRow();
    if (selected) {
      this.rowForm.reset({ ...selected });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const fallbackRowId = this.selectedRowId || this.nextRowId();
    const sanitized = this.sanitizeRow(value, fallbackRowId);
    const selectedIndex = this.rows.findIndex((row) => row.rowId === this.selectedRowId);
    const nextRows = [...this.rows];
    if (selectedIndex >= 0) {
      nextRows[selectedIndex] = sanitized;
    } else {
      nextRows.push(sanitized);
    }
    this.rows = nextRows;
    this.selectedRowId = sanitized.rowId;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  addRow(): void {
    const value = this.newRowFormValue;
    const sanitized = this.sanitizeRow(value, this.nextRowId());
    this.rows = [...this.rows, sanitized];
    this.selectedRowId = sanitized.rowId;
    this.syncSelectedRow();
    this.resetNewRow();
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.rowId !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.rowId ?? '';
    this.syncSelectedRow();
    this.resetNewRow();
    this.persist();
  }

  applyIncrement(): void {
    const startIndex = Math.max(0, Math.floor(this.helper.startRow || 0));
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    if (startIndex >= this.rows.length) {
      return;
    }
    const nextRows = [...this.rows];
    for (let offset = 0; offset < years; offset += 1) {
      const index = startIndex + offset;
      if (!nextRows[index]) {
        break;
      }
      const key = this.helper.column;
      const row = { ...nextRows[index] };
      const current = Number(row[key] ?? 0);
      const nextValue = this.helper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      row[key] = Math.max(0, nextValue);
      nextRows[index] = row;
    }
    this.rows = nextRows;
    this.syncSelectedRow();
    this.persist();
  }

  private buildForm(row: SharedCapexPoolRow): FormGroup {
    const controls: Record<string, unknown> = {
      rowId: [row.rowId],
      poolName: [row.poolName],
      appliesTo: [row.appliesTo],
      allocationMethod: [row.allocationMethod],
    };
    this.numericFieldDefinitions.forEach((field) => {
      controls[field.key] = [row[field.key]];
    });
    return this.formBuilder.group(controls);
  }

  private buildEmptyRow(rowId: string): SharedCapexPoolRow {
    const empty: SharedCapexPoolRow = {
      rowId,
      poolName: '',
      appliesTo: '',
      allocationMethod: '',
      manufacturingScaleUpAssetsPreGtmUsd: 0,
      manufacturingScaleUpAssetsPostGtmUsdPerYear: 0,
      qualityComplianceInfrastructurePreGtmUsd: 0,
      qualityComplianceInfrastructurePostGtmUsdPerYear: 0,
      coldChainDistributionAssetsPreGtmUsd: 0,
      coldChainDistributionAssetsPostGtmUsdPerYear: 0,
      itDataDigitalInfrastructurePreGtmUsd: 0,
      itDataDigitalInfrastructurePostGtmUsdPerYear: 0,
      facilityBuildOutLeaseholdImprovementsPreGtmUsd: 0,
      facilityBuildOutLeaseholdImprovementsPostGtmUsdPerYear: 0,
      processDevelopmentTechTransferAssetsPreGtmUsd: 0,
      processDevelopmentTechTransferAssetsPostGtmUsdPerYear: 0,
    };
    return empty;
  }

  private buildNewRowTemplate(rowId: string): SharedCapexPoolRow {
    return {
      ...this.buildEmptyRow(rowId),
      poolName: 'New shared pool',
      appliesTo: 'ALL',
      allocationMethod: 'Equal',
    };
  }

  private buildSeedRow(rowId: string): SharedCapexPoolRow {
    return {
      rowId,
      poolName: 'Core manufacturing facility',
      appliesTo: 'ALL',
      allocationMethod: 'Equal',
      manufacturingScaleUpAssetsPreGtmUsd: 20000000,
      manufacturingScaleUpAssetsPostGtmUsdPerYear: 2500000,
      qualityComplianceInfrastructurePreGtmUsd: 5000000,
      qualityComplianceInfrastructurePostGtmUsdPerYear: 600000,
      coldChainDistributionAssetsPreGtmUsd: 3000000,
      coldChainDistributionAssetsPostGtmUsdPerYear: 400000,
      itDataDigitalInfrastructurePreGtmUsd: 2000000,
      itDataDigitalInfrastructurePostGtmUsdPerYear: 250000,
      facilityBuildOutLeaseholdImprovementsPreGtmUsd: 8000000,
      facilityBuildOutLeaseholdImprovementsPostGtmUsdPerYear: 850000,
      processDevelopmentTechTransferAssetsPreGtmUsd: 4000000,
      processDevelopmentTechTransferAssetsPostGtmUsdPerYear: 350000,
    };
  }

  private sanitizeRow(value: Partial<SharedCapexPoolRow>, fallbackRowId: string): SharedCapexPoolRow {
    const row = this.buildEmptyRow(String(fallbackRowId || '').trim() || this.nextRowId());
    row.poolName = String(value.poolName ?? '').trim();
    row.appliesTo = String(value.appliesTo ?? '').trim() || 'ALL';
    row.allocationMethod = String(value.allocationMethod ?? '').trim() || 'Equal';
    this.numericFieldDefinitions.forEach((field) => {
      row[field.key] = this.toNumber(value[field.key]);
    });
    return row;
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const stored = snapshot?.shared_capex_pools;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((raw: any, index: number) => this.fromStoredRow(raw, index));
    } else {
      this.rows = [this.buildSeedRow(this.formatRowId(1))];
    }
    this.selectedRowId = this.rows[0]?.rowId ?? '';
    this.syncSelectedRow();
    this.refreshHelperColumnOptions(snapshot);
    this.resetNewRow();
  }

  private fromStoredRow(raw: any, index: number): SharedCapexPoolRow {
    const row = this.buildEmptyRow(this.formatRowId(index + 1));
    row.poolName = String(raw?.['Pool name'] ?? raw?.poolName ?? '').trim();
    row.appliesTo = String(raw?.['Applies to (IDs or ALL)'] ?? raw?.appliesTo ?? 'ALL').trim();
    row.allocationMethod = String(raw?.['Allocation method'] ?? raw?.allocationMethod ?? 'Equal').trim();
    this.numericFieldDefinitions.forEach((field) => {
      row[field.key] = this.toNumber(raw?.[field.sourceKey] ?? raw?.[field.key]);
    });
    return row;
  }

  private persist(): void {
    const payloadRows = this.rows.map((row) => {
      const payload: Record<string, unknown> = {
        'Pool name': row.poolName,
        'Applies to (IDs or ALL)': row.appliesTo,
        'Allocation method': row.allocationMethod,
      };
      this.numericFieldDefinitions.forEach((field) => {
        payload[field.sourceKey] = row[field.key];
      });
      return payload;
    });
    this.biotechModelService.patchInput({
      shared_capex_pools: payloadRows,
    });
  }

  private getSelectedRow(): SharedCapexPoolRow | undefined {
    return this.rows.find((row) => row.rowId === this.selectedRowId);
  }

  private resetNewRow(): void {
    this.newRowForm.reset(this.buildNewRowTemplate(this.nextRowId()));
  }

  private nextRowId(): string {
    const max = this.rows.reduce((currentMax, row) => {
      const match = /ROW-(\d+)/i.exec(row.rowId);
      if (!match) {
        return currentMax;
      }
      return Math.max(currentMax, Number(match[1] || 0));
    }, 0);
    return this.formatRowId(max + 1);
  }

  private formatRowId(value: number): string {
    return `ROW-${String(value).padStart(3, '0')}`;
  }

  private refreshHelperColumnOptions(snapshot?: any): void {
    const sourceSnapshot = snapshot ?? this.biotechModelService.getInputSnapshot() ?? {};
    const storedRows = Array.isArray(sourceSnapshot?.shared_capex_pools)
      ? sourceSnapshot.shared_capex_pools
      : [];
    const availableKeys = new Set<string>();
    storedRows.forEach((row: any) => {
      Object.keys(row ?? {}).forEach((key) => {
        const normalized = String(key ?? '').trim();
        if (normalized) {
          availableKeys.add(normalized);
        }
      });
    });
    const optionsFromData = this.helperColumnDefinitions
      .filter((definition) => availableKeys.has(definition.sourceKey))
      .map((definition) => ({
        label: definition.label,
        value: definition.value,
      }));
    this.helperColumnOptions =
      optionsFromData.length > 0
        ? optionsFromData
        : this.helperColumnDefinitions.map((definition) => ({
            label: definition.label,
            value: definition.value,
          }));
    const allowedColumns = this.helperColumnOptions.map((option) => option.value);
    if (!allowedColumns.includes(this.helper.column)) {
      this.helper.column = this.helperColumnOptions[0]?.value ?? 'manufacturingScaleUpAssetsPreGtmUsd';
    }
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
