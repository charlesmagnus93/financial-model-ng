import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface VaccineCapexRow {
  id: string;
  name: string;
  preGtmCapexSpentUsd: number;
  preGtmCapexRemainingUsd: number;
  postGtmYearlyCapexUsd: number;
}

interface IncrementHelper {
  column: 'preGtmCapexSpentUsd' | 'preGtmCapexRemainingUsd' | 'postGtmYearlyCapexUsd';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-capex-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset
      legend="Vaccine CAPEX assumptions"
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
              <label class="text-xs font-semibold">ID_vaccine</label>
              <input pInputText formControlName="id" class="w-full" />
              <label class="text-xs font-semibold">Vaccine name</label>
              <input pInputText formControlName="name" class="w-full" />
              <label class="text-xs font-semibold">Pre-GTM capex spent (USD)</label>
              <p-inputnumber
                formControlName="preGtmCapexSpentUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Pre-GTM capex remaining (USD)</label>
              <p-inputnumber
                formControlName="preGtmCapexRemainingUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Post-GTM yearly capex (USD)</label>
              <p-inputnumber
                formControlName="postGtmYearlyCapexUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Total Pre-GTM capex (USD)</label>
              <p-inputnumber
                [ngModel]="preGtmTotal(rowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
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

          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">ID_vaccine</label>
              <input pInputText formControlName="id" class="w-full" />
              <label class="text-xs font-semibold">Vaccine name</label>
              <input pInputText formControlName="name" class="w-full" />
              <label class="text-xs font-semibold">Pre-GTM capex spent (USD)</label>
              <p-inputnumber
                formControlName="preGtmCapexSpentUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Pre-GTM capex remaining (USD)</label>
              <p-inputnumber
                formControlName="preGtmCapexRemainingUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Post-GTM yearly capex (USD)</label>
              <p-inputnumber
                formControlName="postGtmYearlyCapexUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Total Pre-GTM capex (USD)</label>
              <p-inputnumber
                [ngModel]="preGtmTotal(newRowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
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

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                [(ngModel)]="helper.column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerYear"
                [showButtons]="true"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
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
              <div class="text-xs text-surface-500">
                Current value: {{ currentHelperValue | number: '1.0-0' }}
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
                <th>Pre-GTM capex spent (USD)</th>
                <th>Pre-GTM capex remaining (USD)</th>
                <th>Total Pre-GTM capex (USD)</th>
                <th>Post-GTM yearly capex (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.preGtmCapexSpentUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmCapexRemainingUsd | number: '1.0-0' }}</td>
                <td>{{ preGtmTotal(row) | number: '1.0-0' }}</td>
                <td>{{ row.postGtmYearlyCapexUsd | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="overflow-auto rounded">
          <p-table [value]="summaryRows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Pre-GTM capex spent (USD)</th>
                <th>Pre-GTM capex remaining (USD)</th>
                <th>Total Pre-GTM capex (USD)</th>
                <th>Post-GTM yearly capex (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.preGtmCapexSpentUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmCapexRemainingUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmTotal | number: '1.0-0' }}</td>
                <td>{{ row.postGtmYearlyCapexUsd | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineCapexFieldsetComponent implements OnInit {
  rows: VaccineCapexRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'preGtmCapexSpentUsd',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Pre-GTM capex spent (USD)', value: 'preGtmCapexSpentUsd' },
    { label: 'Pre-GTM capex remaining (USD)', value: 'preGtmCapexRemainingUsd' },
    { label: 'Post-GTM yearly capex (USD)', value: 'postGtmYearlyCapexUsd' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      preGtmCapexSpentUsd: [0],
      preGtmCapexRemainingUsd: [0],
      postGtmYearlyCapexUsd: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      preGtmCapexSpentUsd: [0],
      preGtmCapexRemainingUsd: [0],
      postGtmYearlyCapexUsd: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: row.name ? `${row.id} - ${row.name}` : row.id,
      value: row.id,
    }));
  }

  get currentHelperValue(): number {
    const row = this.getSelectedRow();
    if (!row) {
      return 0;
    }
    return Number(row[this.helper.column] ?? 0);
  }

  get rowFormValue(): VaccineCapexRow {
    return this.rowForm.getRawValue() as VaccineCapexRow;
  }

  get newRowFormValue(): VaccineCapexRow {
    return this.newRowForm.getRawValue() as VaccineCapexRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      preGtmCapexSpentUsd: row.preGtmCapexSpentUsd,
      preGtmCapexRemainingUsd: row.preGtmCapexRemainingUsd,
      preGtmTotal: this.preGtmTotal(row),
      postGtmYearlyCapexUsd: row.postGtmYearlyCapexUsd,
    }));
  }

  preGtmTotal(row: VaccineCapexRow): number {
    return (row.preGtmCapexSpentUsd || 0) + (row.preGtmCapexRemainingUsd || 0);
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineCapexRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      preGtmCapexSpentUsd: Number(value.preGtmCapexSpentUsd || 0),
      preGtmCapexRemainingUsd: Number(value.preGtmCapexRemainingUsd || 0),
      postGtmYearlyCapexUsd: Number(value.postGtmYearlyCapexUsd || 0),
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
    const sanitized: VaccineCapexRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      preGtmCapexSpentUsd: Number(value.preGtmCapexSpentUsd || 0),
      preGtmCapexRemainingUsd: Number(value.preGtmCapexRemainingUsd || 0),
      postGtmYearlyCapexUsd: Number(value.postGtmYearlyCapexUsd || 0),
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
    const startRow = this.getSelectedRow();
    if (!startRow) {
      return;
    }
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    const startIndex = this.rows.findIndex((row) => row.id === startRow.id);
    if (startIndex === -1) {
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
      row[key] = Number(row[key] ?? 0) + increment;
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineCapexRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_capex: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Pre-GTM capex spent (USD)': row.preGtmCapexSpentUsd,
        'Pre-GTM capex remaining (USD)': row.preGtmCapexRemainingUsd,
        'Post-GTM yearly capex (USD)': row.postGtmYearlyCapexUsd,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccine_capex;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        preGtmCapexSpentUsd: Number(row?.['Pre-GTM capex spent (USD)'] ?? 0),
        preGtmCapexRemainingUsd: Number(row?.['Pre-GTM capex remaining (USD)'] ?? 0),
        postGtmYearlyCapexUsd: Number(row?.['Post-GTM yearly capex (USD)'] ?? 0),
      }));
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.syncSelectedRow();
    }
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
      preGtmCapexSpentUsd: 10000000,
      preGtmCapexRemainingUsd: 5000000,
      postGtmYearlyCapexUsd: 2000000,
    });
  }
}

