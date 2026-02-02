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

interface VaccineSalesRow {
  year: number;
  dosesMillions: number;
  pricePerDose: number;
  comments: string;
}

interface IncrementHelper {
  column: 'year' | 'dosesMillions' | 'pricePerDose';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-vaccine-sales-assumptions-fieldset',
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
    <p-fieldset legend="Vaccine sales" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-9 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [(ngModel)]="selectedRowId"
              (ngModelChange)="onSelectedRowChange()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select year"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-3 flex">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeSelectedRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="text-xs text-surface-600 font-semibold">
                {{ isCreatingRow ? 'Add a new row' : 'Edit selected row' }}
              </div>
              <p-button
                label="New row"
                size="small"
                [outlined]="true"
                (onClick)="startNewRow()"
              ></p-button>
            </div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
            <label class="text-xs font-semibold">Year</label>
            <p-inputnumber
              formControlName="year"
              [showButtons]="true"
              [useGrouping]="false"
              inputStyleClass="w-full"
            />
            <label class="text-xs font-semibold">Doses (M)</label>
            <p-inputnumber
              formControlName="dosesMillions"
              [showButtons]="true"
              [min]="0"
              [step]="0.1"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
            <label class="text-xs font-semibold">Price per dose</label>
            <p-inputnumber
              formControlName="pricePerDose"
              [showButtons]="true"
              [min]="0"
              [step]="0.5"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
            <label class="text-xs font-semibold">Comments</label>
            <input
              pInputText
              formControlName="comments"
              class="w-full"
            />
            <p-button
              [label]="isCreatingRow ? 'Add row' : 'Save changes'"
              size="small"
              [outlined]="true"
              (onClick)="saveRow()"
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
                [step]="0.5"
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
                Current value: {{ currentHelperValue | number: '1.2-2' }}
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
          <p-table [value]="rows" showGridlines class="text-sm">
            <ng-template #header>
              <tr>
                <th>Year</th>
                <th>Doses (M)</th>
                <th>Price per dose</th>
                <th>Comments</th>
                <th>Implied revenue</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.year }}</td>
                <td>{{ row.dosesMillions | number: '1.2-2' }}</td>
                <td>{{ row.pricePerDose | number: '1.2-2' }}</td>
                <td>{{ row.comments }}</td>
                <td>{{ impliedRevenue(row) | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-xs text-surface-600">{{ salesHorizonLabel }}</div>
        <div class="text-2xl font-semibold">
          {{ fiveYearRevenue | number: '1.0-0' }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechVaccineSalesAssumptionsFieldsetComponent implements OnInit {
  rows: VaccineSalesRow[] = [];
  selectedRowId = 0;
  isCreatingRow = false;
  rowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'year',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Year', value: 'year' },
    { label: 'Doses (M)', value: 'dosesMillions' },
    { label: 'Price per dose', value: 'pricePerDose' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      year: [0],
      dosesMillions: [0],
      pricePerDose: [0],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: String(row.year),
      value: row.year,
    }));
  }

  get selectedImpliedRevenue(): number {
    const value = this.rowForm.getRawValue() as VaccineSalesRow;
    return this.impliedRevenue(value);
  }

  get currentHelperValue(): number {
    const row = this.getSelectedRow();
    if (!row) {
      return 0;
    }
    if (this.helper.column === 'year') return row.year;
    if (this.helper.column === 'dosesMillions') return row.dosesMillions;
    return row.pricePerDose;
  }

  get fiveYearRevenue(): number {
    return this.rows.slice(0, 5).reduce((sum, row) => sum + this.impliedRevenue(row), 0);
  }

  get salesHorizonLabel(): string {
    const count = this.rows.length;
    if (count <= 0) {
      return 'Vaccine sales';
    }
    return `${count}-year vaccine sales`;
  }

  impliedRevenue(row: VaccineSalesRow): number {
    return (row.dosesMillions || 0) * 1_000_000 * (row.pricePerDose || 0);
  }

  removeSelectedRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.year !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.year ?? 0;
    this.onSelectedRowChange();
    this.persist();
  }

  applyIncrement(): void {
    const startRow = this.getSelectedRow();
    if (!startRow) {
      return;
    }
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    const startIndex = this.rows.findIndex((row) => row.year === startRow.year);
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
      if (this.helper.column === 'year') {
        row.year = Number(row.year || 0) + increment;
      } else if (this.helper.column === 'dosesMillions') {
        row.dosesMillions = Number(row.dosesMillions || 0) + increment;
      } else {
        row.pricePerDose = Number(row.pricePerDose || 0) + increment;
      }
      updated[idx] = row;
    }
    this.rows = updated;
    this.onSelectedRowChange();
    this.persist();
  }

  onSelectedRowChange(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.isCreatingRow = false;
      this.rowForm.reset({ ...row });
    }
  }

  startNewRow(): void {
    const lastYear = this.rows[this.rows.length - 1]?.year ?? new Date().getFullYear();
    this.isCreatingRow = true;
    this.rowForm.reset({
      year: lastYear + 1,
      dosesMillions: 0,
      pricePerDose: 0,
      comments: '',
    });
  }

  saveRow(): void {
    const value = this.rowForm.getRawValue() as VaccineSalesRow;
    const sanitized: VaccineSalesRow = {
      year: Number(value.year || 0),
      dosesMillions: Number(value.dosesMillions || 0),
      pricePerDose: Number(value.pricePerDose || 0),
      comments: value.comments ?? '',
    };
    let nextRows = [...this.rows];
    if (this.isCreatingRow) {
      const existingIndex = nextRows.findIndex((row) => row.year === sanitized.year);
      if (existingIndex >= 0) {
        nextRows[existingIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.selectedRowId = sanitized.year;
      this.isCreatingRow = false;
    } else {
      const selectedIndex = nextRows.findIndex((row) => row.year === this.selectedRowId);
      const duplicateIndex =
        sanitized.year === this.selectedRowId
          ? -1
          : nextRows.findIndex((row) => row.year === sanitized.year);
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
      this.selectedRowId = sanitized.year;
    }
    this.rows = nextRows;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  private getSelectedRow(): VaccineSalesRow | undefined {
    return this.rows.find((item) => item.year === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccineSalesAssumptions: {
        rows: this.rows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccineSalesAssumptions?.rows;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        year: Number(row?.year ?? 0),
        dosesMillions: Number(row?.dosesMillions ?? 0),
        pricePerDose: Number(row?.pricePerDose ?? 0),
        comments: String(row?.comments ?? ''),
      }));
      this.selectedRowId = this.rows[0]?.year ?? 0;
      this.onSelectedRowChange();
    }
  }
}

