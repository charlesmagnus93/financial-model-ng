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

interface SharedCapexAllocationWeightRow {
  rowId: string;
  poolName: string;
  idVaccine: string;
  weight: number;
}

interface IncrementHelper {
  column: 'weight';
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

@Component({
  standalone: true,
  selector: 'biotech-product-shared-capex-allocation-weights-fieldset',
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
    <p-fieldset legend="Shared CAPEX allocation weights" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 flex flex-col gap-2">
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
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">Pool name</label>
              <input pInputText formControlName="poolName" class="w-full" />

              <label class="text-xs font-semibold">ID_vaccine</label>
              <input pInputText formControlName="idVaccine" class="w-full" />

              <label class="text-xs font-semibold">Weight</label>
              <p-inputnumber
                formControlName="weight"
                [showButtons]="true"
                [min]="0"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />

              <p-button
                label="Save changes"
                size="small"
                [outlined]="true"
                (onClick)="saveSelectedRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">Pool name</label>
              <input pInputText formControlName="poolName" class="w-full" />

              <label class="text-xs font-semibold">ID_vaccine</label>
              <input pInputText formControlName="idVaccine" class="w-full" />

              <label class="text-xs font-semibold">Weight</label>
              <p-inputnumber
                formControlName="weight"
                [showButtons]="true"
                [min]="0"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />

              <p-button
                label="Add row"
                size="small"
                [outlined]="true"
                (onClick)="addRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>

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
                <th style="min-width: 220px">Pool name</th>
                <th style="min-width: 180px">ID_vaccine</th>
                <th style="min-width: 140px">Weight</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.poolName }}</td>
                <td>{{ row.idVaccine }}</td>
                <td>{{ row.weight | number: '1.2-2' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductSharedCapexAllocationWeightsFieldsetComponent implements OnInit {
  rows: SharedCapexAllocationWeightRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;

  helper: IncrementHelper = {
    column: 'weight',
    startRow: 0,
    incrementPerYear: 1,
    yearsToApply: 1,
    compound: false,
  };

  helperColumnOptions: SelectOption<IncrementHelper['column']>[] = [];
  private readonly helperColumnDefinition = {
    sourceKey: 'Weight',
    label: 'Weight',
    value: 'weight' as const,
  };

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
    return this.rows.map((row) => ({
      label: row.idVaccine || row.rowId,
      value: row.rowId,
    }));
  }

  get rowFormValue(): SharedCapexAllocationWeightRow {
    return this.rowForm.getRawValue() as SharedCapexAllocationWeightRow;
  }

  get newRowFormValue(): SharedCapexAllocationWeightRow {
    return this.newRowForm.getRawValue() as SharedCapexAllocationWeightRow;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
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
    for (let i = 0; i < years; i += 1) {
      const idx = startIndex + i;
      if (!nextRows[idx]) {
        break;
      }
      const row = { ...nextRows[idx] };
      const current = Number(row.weight ?? 0);
      const nextValue = this.helper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      row.weight = Math.max(0, nextValue);
      nextRows[idx] = row;
    }

    this.rows = nextRows;
    this.syncSelectedRow();
    this.persist();
  }

  private buildForm(row: SharedCapexAllocationWeightRow): FormGroup {
    return this.formBuilder.group({
      rowId: [row.rowId],
      poolName: [row.poolName],
      idVaccine: [row.idVaccine],
      weight: [row.weight],
    });
  }

  private buildEmptyRow(rowId: string): SharedCapexAllocationWeightRow {
    return {
      rowId,
      poolName: '',
      idVaccine: '',
      weight: 0,
    };
  }

  private buildNewRowTemplate(rowId: string): SharedCapexAllocationWeightRow {
    return {
      rowId,
      poolName: 'Core manufacturing facility',
      idVaccine: 'VAC-003',
      weight: 1,
    };
  }

  private buildSeedRows(): SharedCapexAllocationWeightRow[] {
    return [
      {
        rowId: this.formatRowId(1),
        poolName: 'Core manufacturing facility',
        idVaccine: 'VAC-001',
        weight: 0.5,
      },
      {
        rowId: this.formatRowId(2),
        poolName: 'Core manufacturing facility',
        idVaccine: 'VAC-002',
        weight: 0.5,
      },
    ];
  }

  private sanitizeRow(
    value: Partial<SharedCapexAllocationWeightRow>,
    fallbackRowId: string
  ): SharedCapexAllocationWeightRow {
    return {
      rowId: String(fallbackRowId || '').trim() || this.nextRowId(),
      poolName: String(value.poolName ?? '').trim(),
      idVaccine: String(value.idVaccine ?? '').trim(),
      weight: this.toNumber(value.weight),
    };
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const stored = snapshot?.shared_capex_allocation_weights;

    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any, index: number) => ({
        rowId: this.formatRowId(index + 1),
        poolName: String(row?.['Pool name'] ?? row?.poolName ?? '').trim(),
        idVaccine: String(row?.ID_vaccine ?? row?.idVaccine ?? '').trim(),
        weight: this.toNumber(row?.Weight ?? row?.weight),
      }));
    } else {
      this.rows = this.buildSeedRows();
    }

    this.selectedRowId = this.rows[0]?.rowId ?? '';
    this.syncSelectedRow();
    this.refreshHelperColumnOptions(snapshot);
    this.resetNewRow();
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      shared_capex_allocation_weights: this.rows.map((row) => ({
        'Pool name': row.poolName,
        ID_vaccine: row.idVaccine,
        Weight: row.weight,
      })),
    });
  }

  private getSelectedRow(): SharedCapexAllocationWeightRow | undefined {
    return this.rows.find((row) => row.rowId === this.selectedRowId);
  }

  private resetNewRow(): void {
    this.newRowForm.reset(this.buildNewRowTemplate(this.nextRowId()));
  }

  private nextRowId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /ROW-(\d+)/i.exec(row.rowId);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] ?? 0));
    }, 0);
    return this.formatRowId(maxId + 1);
  }

  private formatRowId(value: number): string {
    return `ROW-${String(value).padStart(3, '0')}`;
  }

  private refreshHelperColumnOptions(snapshot?: any): void {
    const sourceSnapshot = snapshot ?? this.biotechModelService.getInputSnapshot() ?? {};
    const storedRows = Array.isArray(sourceSnapshot?.shared_capex_allocation_weights)
      ? sourceSnapshot.shared_capex_allocation_weights
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

    this.helperColumnOptions = availableKeys.has(this.helperColumnDefinition.sourceKey)
      ? [{ label: this.helperColumnDefinition.label, value: this.helperColumnDefinition.value }]
      : [{ label: this.helperColumnDefinition.label, value: this.helperColumnDefinition.value }];

    if (!this.helperColumnOptions.find((option) => option.value === this.helper.column)) {
      this.helper.column = this.helperColumnOptions[0]?.value ?? 'weight';
    }
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}

