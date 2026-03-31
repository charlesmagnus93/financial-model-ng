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
import { BiotechModelService } from '../../../services/biotech-model.service';

interface VaccineResearchRow {
  id: string;
  name: string;
  costAccounting: string;
  preGtmSpentUsd: number;
  preGtmRemainingUsd: number;
  postGtmAnnualCostUsd: number;
}

interface IncrementHelper {
  column: 'preGtmSpentUsd' | 'preGtmRemainingUsd' | 'postGtmAnnualCostUsd';
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

interface HelperColumnOption {
  sourceKey: string;
  label: string;
  value: IncrementHelper['column'];
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-research-dev-fieldset',
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
    <p-fieldset
      legend="Vaccines research & development (R&D)"
      [toggleable]="true"
      class="w-full"
    >
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
            placeholder="Select vaccine"
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
              <div class="flex flex-col gap-4">
                <label class="text-xs font-semibold">ID_vaccine</label>
                <input pInputText formControlName="id" class="w-full" />
                <label class="text-xs font-semibold">Vaccine name</label>
                <input pInputText formControlName="name" class="w-full" />
                <label class="text-xs font-semibold">Cost accounting (capitalisation)</label>
                <input pInputText formControlName="costAccounting" class="w-full" />
                <label class="text-xs font-semibold">Pre-GTM spent to date (USD)</label>
                <p-inputnumber
                  formControlName="preGtmSpentUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Pre-GTM remaining (USD)</label>
                <p-inputnumber
                  formControlName="preGtmRemainingUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Post-GTM annual cost (USD/year)</label>
                <p-inputnumber
                  formControlName="postGtmAnnualCostUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <p-button
                  label="Save changes"
                  [outlined]="true"
                  (onClick)="saveSelectedRow()"
                  fluid
                ></p-button>
              </div>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <div class="flex flex-col gap-4">
                <label class="text-xs font-semibold">ID_vaccine</label>
                <input pInputText formControlName="id" class="w-full" />
                <label class="text-xs font-semibold">Vaccine name</label>
                <input pInputText formControlName="name" class="w-full" />
                <label class="text-xs font-semibold">Cost accounting (capitalisation)</label>
                <input pInputText formControlName="costAccounting" class="w-full" />
                <label class="text-xs font-semibold">Pre-GTM spent to date (USD)</label>
                <p-inputnumber
                  formControlName="preGtmSpentUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Pre-GTM remaining (USD)</label>
                <p-inputnumber
                  formControlName="preGtmRemainingUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Post-GTM annual cost (USD/year)</label>
                <p-inputnumber
                  formControlName="postGtmAnnualCostUsd"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="true"
                  inputStyleClass="w-full"
                />
                <p-button
                  label="Add row"
                  [outlined]="true"
                  (onClick)="addRow()"
                  fluid
                ></p-button>
              </div>
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

        <div class="overflow-auto rounded">
          <p-table [value]="rows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Cost accounting (capitalisation)</th>
                <th>Pre-GTM spent to date (USD)</th>
                <th>Pre-GTM remaining (USD)</th>
                <th>Post-GTM annual cost (USD/year)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.costAccounting }}</td>
                <td>{{ row.preGtmSpentUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmRemainingUsd | number: '1.0-0' }}</td>
                <td>{{ row.postGtmAnnualCostUsd | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="overflow-auto rounded">
          <p-table [value]="summaryRows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th style="width: 3rem"></th>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Cost accounting (capitalisation)</th>
                <th>Pre-GTM spent to date (USD)</th>
                <th>Pre-GTM remaining (USD)</th>
                <th>Pre-GTM total (USD)</th>
                <th>Post-GTM annual cost (USD/year)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row let-rowIndex="rowIndex">
              <tr>
                <td class="text-right">{{ rowIndex }}</td>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.costAccounting }}</td>
                <td>{{ row.preGtmSpentUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmRemainingUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmTotal | number: '1.0-0' }}</td>
                <td>{{ row.postGtmAnnualCostUsd | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineResearchDevFieldsetComponent implements OnInit {
  rows: VaccineResearchRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'preGtmSpentUsd',
    startRow: 0,
    incrementPerYear: 1,
    yearsToApply: 1,
    compound: false,
  };

  helperColumnOptions: Array<Pick<HelperColumnOption, 'label' | 'value'>> = [];
  private readonly helperColumnDefinitions: HelperColumnOption[] = [
    {
      sourceKey: 'Pre-GTM spent to date (USD)',
      label: 'Pre-GTM spent to date (USD)',
      value: 'preGtmSpentUsd',
    },
    {
      sourceKey: 'Pre-GTM remaining (USD)',
      label: 'Pre-GTM remaining (USD)',
      value: 'preGtmRemainingUsd',
    },
    {
      sourceKey: 'Post-GTM annual cost (USD/year)',
      label: 'Post-GTM annual cost (USD/year)',
      value: 'postGtmAnnualCostUsd',
    },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      costAccounting: [''],
      preGtmSpentUsd: [0],
      preGtmRemainingUsd: [0],
      postGtmAnnualCostUsd: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      costAccounting: [''],
      preGtmSpentUsd: [0],
      preGtmRemainingUsd: [0],
      postGtmAnnualCostUsd: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
    this.refreshHelperColumnOptions();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: row.name ? `${row.id} - ${row.name}` : row.id,
      value: row.id,
    }));
  }

  get rowFormValue(): VaccineResearchRow {
    return this.rowForm.getRawValue() as VaccineResearchRow;
  }

  get newRowFormValue(): VaccineResearchRow {
    return this.newRowForm.getRawValue() as VaccineResearchRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      costAccounting: row.costAccounting,
      preGtmSpentUsd: row.preGtmSpentUsd,
      preGtmRemainingUsd: row.preGtmRemainingUsd,
      preGtmTotal: this.preGtmTotal(row),
      postGtmAnnualCostUsd: row.postGtmAnnualCostUsd,
    }));
  }

  preGtmTotal(row: VaccineResearchRow): number {
    return (row.preGtmSpentUsd || 0) + (row.preGtmRemainingUsd || 0);
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineResearchRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      costAccounting: String(value.costAccounting ?? '').trim(),
      preGtmSpentUsd: Number(value.preGtmSpentUsd || 0),
      preGtmRemainingUsd: Number(value.preGtmRemainingUsd || 0),
      postGtmAnnualCostUsd: Number(value.postGtmAnnualCostUsd || 0),
    };
    let nextRows = [...this.rows];
    const selectedIndex = nextRows.findIndex((row) => row.id === this.selectedRowId);
    const duplicateIndex =
      sanitized.id === this.selectedRowId
        ? -1
        : nextRows.findIndex((row) => row.id === sanitized.id);
    if (duplicateIndex >= 0) {
      nextRows[duplicateIndex] = sanitized;
      if (selectedIndex >= 0 && selectedIndex !== duplicateIndex) {
        nextRows.splice(selectedIndex, 1);
      }
    } else if (selectedIndex >= 0) {
      nextRows[selectedIndex] = sanitized;
    } else {
      nextRows = [...nextRows, sanitized];
    }
    this.selectedRowId = sanitized.id;
    this.rows = nextRows;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  addRow(): void {
    const value = this.newRowFormValue;
    const sanitized: VaccineResearchRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      costAccounting: String(value.costAccounting ?? '').trim(),
      preGtmSpentUsd: Number(value.preGtmSpentUsd || 0),
      preGtmRemainingUsd: Number(value.preGtmRemainingUsd || 0),
      postGtmAnnualCostUsd: Number(value.postGtmAnnualCostUsd || 0),
    };
    const nextRows = [...this.rows, sanitized];
    this.rows = nextRows;
    this.selectedRowId = sanitized.id;
    this.syncSelectedRow();
    this.resetNewRow();
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
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
    const updated = [...this.rows];
    for (let i = 0; i < years; i += 1) {
      const idx = startIndex + i;
      if (!updated[idx]) {
        break;
      }
      const row = { ...updated[idx] };
      const key = this.helper.column;
      const current = Number(row[key] ?? 0);
      const nextValue = this.helper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      row[key] = Math.max(0, nextValue);
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineResearchRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_rd: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Cost accounting (capitalisation)': row.costAccounting,
        'Pre-GTM spent to date (USD)': row.preGtmSpentUsd,
        'Pre-GTM remaining (USD)': row.preGtmRemainingUsd,
        'Post-GTM annual cost (USD/year)': row.postGtmAnnualCostUsd,
      })),
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const stored = snapshot?.vaccine_rd;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        costAccounting: String(row?.['Cost accounting (capitalisation)'] ?? ''),
        preGtmSpentUsd: Number(row?.['Pre-GTM spent to date (USD)'] ?? 0),
        preGtmRemainingUsd: Number(row?.['Pre-GTM remaining (USD)'] ?? 0),
        postGtmAnnualCostUsd: Number(row?.['Post-GTM annual cost (USD/year)'] ?? 0),
      }));
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.syncSelectedRow();
    }
    this.refreshHelperColumnOptions(snapshot);
    this.resetNewRow();
  }

  private nextVaccineId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /VAC-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return `VAC-${String(maxId + 1).padStart(3, '0')}`;
  }

  private resetNewRow(): void {
    this.newRowForm.reset({
      id: this.nextVaccineId(),
      name: 'New vaccine',
      costAccounting: '50% capitalised',
      preGtmSpentUsd: 20000000,
      preGtmRemainingUsd: 10000000,
      postGtmAnnualCostUsd: 500000,
    });
  }

  private refreshHelperColumnOptions(snapshot?: any): void {
    const sourceSnapshot = snapshot ?? this.biotechModelService.getInputSnapshot() ?? {};
    const vaccineRdRows = Array.isArray(sourceSnapshot?.vaccine_rd)
      ? sourceSnapshot.vaccine_rd
      : [];

    const availableKeys = new Set<string>();
    vaccineRdRows.forEach((row: any) => {
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

    const allowedColumns = this.helperColumnOptions.map((item) => item.value);
    if (!allowedColumns.includes(this.helper.column)) {
      this.helper.column = this.helperColumnOptions[0]?.value ?? 'preGtmSpentUsd';
    }
  }
}


