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

interface VaccineRevenueRow {
  id: string;
  name: string;
  patentCustomersPerYear: number;
  patentPricePerCustomer: number;
  postPatentCustomerAdjPct: number;
  postPatentPriceAdjPct: number;
}

interface IncrementHelper {
  column:
    | 'patentCustomersPerYear'
    | 'patentPricePerCustomer'
    | 'postPatentCustomerAdjPct'
    | 'postPatentPriceAdjPct';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-revenue-fieldset',
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
      legend="Vaccines revenue estimation"
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
          <div class="col-span-12 lg:col-span-4  rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">Patent customers per year</label>
                  <p-inputnumber
                    formControlName="patentCustomersPerYear"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent price (USD/customer)</label>
                  <p-inputnumber
                    formControlName="patentPricePerCustomer"
                    [showButtons]="true"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent customer adj. %</label>
                  <p-inputnumber
                    formControlName="postPatentCustomerAdjPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Post patent price adj. %</label>
                  <p-inputnumber
                    formControlName="postPatentPriceAdjPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent revenue target (USD)</label>
                  <p-inputnumber
                    [ngModel]="patentRevenueTarget(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent customers per year</label>
                  <p-inputnumber
                    [ngModel]="postPatentCustomersPerYear(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent price (USD/customer)</label>
                  <p-inputnumber
                    [ngModel]="postPatentPricePerCustomer(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent revenue target (USD)</label>
                  <p-inputnumber
                    [ngModel]="postPatentRevenueTarget(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
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
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">Patent customers per year</label>
                  <p-inputnumber
                    formControlName="patentCustomersPerYear"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent price (USD/customer)</label>
                  <p-inputnumber
                    formControlName="patentPricePerCustomer"
                    [showButtons]="true"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent customer adj. %</label>
                  <p-inputnumber
                    formControlName="postPatentCustomerAdjPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Post patent price adj. %</label>
                  <p-inputnumber
                    formControlName="postPatentPriceAdjPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent revenue target (USD)</label>
                  <p-inputnumber
                    [ngModel]="patentRevenueTarget(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent customers per year</label>
                  <p-inputnumber
                    [ngModel]="postPatentCustomersPerYear(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent price (USD/customer)</label>
                  <p-inputnumber
                    [ngModel]="postPatentPricePerCustomer(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post patent revenue target (USD)</label>
                  <p-inputnumber
                    [ngModel]="postPatentRevenueTarget(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
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
                <th style="min-width:130px">ID_vaccine</th>
                <th style="min-width:130px">Vaccine name</th>
                <th>Patent customers per year</th>
                <th>Patent price (USD/customer)</th>
                <th>Post patent customer adj. %</th>
                <th>Post patent price adj. %</th>
                <th>Patent revenue target (USD)</th>
                <th>Post patent customers per year</th>
                <th>Post patent price (USD/customer)</th>
                <th>Post patent revenue target (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.patentCustomersPerYear | number: '1.0-0' }}</td>
                <td>{{ row.patentPricePerCustomer | number: '1.2-2' }}</td>
                <td>{{ row.postPatentCustomerAdjPct | number: '1.2-2' }}</td>
                <td>{{ row.postPatentPriceAdjPct | number: '1.2-2' }}</td>
                <td>{{ patentRevenueTarget(row) | number: '1.0-0' }}</td>
                <td>{{ postPatentCustomersPerYear(row) | number: '1.0-0' }}</td>
                <td>{{ postPatentPricePerCustomer(row) | number: '1.2-2' }}</td>
                <td>{{ postPatentRevenueTarget(row) | number: '1.0-0' }}</td>
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
                <th>Patent revenue target (USD)</th>
                <th>Post patent revenue target (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.patentRevenue | number: '1.0-0' }}</td>
                <td>{{ row.postPatentRevenue | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineRevenueFieldsetComponent implements OnInit {
  rows: VaccineRevenueRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'patentCustomersPerYear',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Patent customers per year', value: 'patentCustomersPerYear' },
    { label: 'Patent price (USD/customer)', value: 'patentPricePerCustomer' },
    { label: 'Post patent customer adj. %', value: 'postPatentCustomerAdjPct' },
    { label: 'Post patent price adj. %', value: 'postPatentPriceAdjPct' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      patentCustomersPerYear: [0],
      patentPricePerCustomer: [0],
      postPatentCustomerAdjPct: [0],
      postPatentPriceAdjPct: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      patentCustomersPerYear: [0],
      patentPricePerCustomer: [0],
      postPatentCustomerAdjPct: [0],
      postPatentPriceAdjPct: [0],
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
    if (this.helper.column === 'patentCustomersPerYear') {
      return row.patentCustomersPerYear;
    }
    if (this.helper.column === 'patentPricePerCustomer') {
      return row.patentPricePerCustomer;
    }
    if (this.helper.column === 'postPatentCustomerAdjPct') {
      return row.postPatentCustomerAdjPct;
    }
    return row.postPatentPriceAdjPct;
  }

  get rowFormValue(): VaccineRevenueRow {
    return this.rowForm.getRawValue() as VaccineRevenueRow;
  }

  get newRowFormValue(): VaccineRevenueRow {
    return this.newRowForm.getRawValue() as VaccineRevenueRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      patentRevenue: this.patentRevenueTarget(row),
      postPatentRevenue: this.postPatentRevenueTarget(row),
    }));
  }

  patentRevenueTarget(row: VaccineRevenueRow): number {
    return (row.patentCustomersPerYear || 0) * (row.patentPricePerCustomer || 0);
  }

  postPatentCustomersPerYear(row: VaccineRevenueRow): number {
    return (row.patentCustomersPerYear || 0) * (row.postPatentCustomerAdjPct || 0) / 100;
  }

  postPatentPricePerCustomer(row: VaccineRevenueRow): number {
    return (row.patentPricePerCustomer || 0) * (row.postPatentPriceAdjPct || 0) / 100;
  }

  postPatentRevenueTarget(row: VaccineRevenueRow): number {
    return this.postPatentCustomersPerYear(row) * this.postPatentPricePerCustomer(row);
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineRevenueRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      patentCustomersPerYear: Number(value.patentCustomersPerYear || 0),
      patentPricePerCustomer: Number(value.patentPricePerCustomer || 0),
      postPatentCustomerAdjPct: Number(value.postPatentCustomerAdjPct || 0),
      postPatentPriceAdjPct: Number(value.postPatentPriceAdjPct || 0),
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
    const sanitized: VaccineRevenueRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      patentCustomersPerYear: Number(value.patentCustomersPerYear || 0),
      patentPricePerCustomer: Number(value.patentPricePerCustomer || 0),
      postPatentCustomerAdjPct: Number(value.postPatentCustomerAdjPct || 0),
      postPatentPriceAdjPct: Number(value.postPatentPriceAdjPct || 0),
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
      if (this.helper.column === 'patentCustomersPerYear') {
        row.patentCustomersPerYear = Number(row.patentCustomersPerYear || 0) + increment;
      } else if (this.helper.column === 'patentPricePerCustomer') {
        row.patentPricePerCustomer = Number(row.patentPricePerCustomer || 0) + increment;
      } else if (this.helper.column === 'postPatentCustomerAdjPct') {
        row.postPatentCustomerAdjPct = Number(row.postPatentCustomerAdjPct || 0) + increment;
      } else {
        row.postPatentPriceAdjPct = Number(row.postPatentPriceAdjPct || 0) + increment;
      }
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineRevenueRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_revenue: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Patent customers per year': row.patentCustomersPerYear,
        'Patent price (USD/customer)': row.patentPricePerCustomer,
        'Post patent customer adj. %': row.postPatentCustomerAdjPct,
        'Post patent price adj. %': row.postPatentPriceAdjPct,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccine_revenue;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        patentCustomersPerYear: Number(row?.['Patent customers per year'] ?? 0),
        patentPricePerCustomer: Number(row?.['Patent price (USD/customer)'] ?? 0),
        postPatentCustomerAdjPct: Number(row?.['Post patent customer adj. %'] ?? 0),
        postPatentPriceAdjPct: Number(row?.['Post patent price adj. %'] ?? 0),
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
      patentCustomersPerYear: 1000000,
      patentPricePerCustomer: 50,
      postPatentCustomerAdjPct: 80,
      postPatentPriceAdjPct: 85,
    });
  }
}

