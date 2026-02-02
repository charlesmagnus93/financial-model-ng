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

interface VaccineMarketRow {
  id: string;
  name: string;
  marketSizeCustomers: number;
  avgSpendUsd: number;
  samPctOfTam: number;
  samPctOfMarket: number;
  somPct: number;
}

interface IncrementHelper {
  column: 'marketSizeCustomers' | 'avgSpendUsd' | 'samPctOfTam' | 'samPctOfMarket' | 'somPct';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-market-fieldset',
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
      legend="Vaccine market size estimation"
      [toggleable]="true"
      class="w-full"
    >
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
              placeholder="Select vaccine"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div
            class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2"
          >
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">Market size (# customers)</label>
                  <p-inputnumber
                    formControlName="marketSizeCustomers"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Average spend (USD/customer)</label>
                  <p-inputnumber
                    formControlName="avgSpendUsd"
                    [showButtons]="true"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Available Market (% TAM)</label>
                  <p-inputnumber
                    formControlName="samPctOfTam"
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
                  <label class="text-xs font-semibold">Serviceable Available Market (% Market size)</label>
                  <p-inputnumber
                    formControlName="samPctOfMarket"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Obtainable Market (%)</label>
                  <p-inputnumber
                    formControlName="somPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Total Addressable Market Size (USD)</label>
                  <p-inputnumber
                    [ngModel]="totalAddressableMarket(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Available Market (USD)</label>
                  <p-inputnumber
                    [ngModel]="serviceableAvailableMarket(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Obtainable Market (USD)</label>
                  <p-inputnumber
                    [ngModel]="serviceableObtainableMarket(rowFormValue)"
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

          <div
            class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2"
          >
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">Market size (# customers)</label>
                  <p-inputnumber
                    formControlName="marketSizeCustomers"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Average spend (USD/customer)</label>
                  <p-inputnumber
                    formControlName="avgSpendUsd"
                    [showButtons]="true"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Available Market (% TAM)</label>
                  <p-inputnumber
                    formControlName="samPctOfTam"
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
                  <label class="text-xs font-semibold">Serviceable Available Market (% Market size)</label>
                  <p-inputnumber
                    formControlName="samPctOfMarket"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Obtainable Market (%)</label>
                  <p-inputnumber
                    formControlName="somPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Total Addressable Market Size (USD)</label>
                  <p-inputnumber
                    [ngModel]="totalAddressableMarket(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Available Market (USD)</label>
                  <p-inputnumber
                    [ngModel]="serviceableAvailableMarket(newRowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Serviceable Obtainable Market (USD)</label>
                  <p-inputnumber
                    [ngModel]="serviceableObtainableMarket(newRowFormValue)"
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

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
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
                <th>Market size (# customers)</th>
                <th>Average spend (USD/customer)</th>
                <th>Serviceable Available Market (% TAM)</th>
                <th>Serviceable Available Market (% Market size)</th>
                <th>Serviceable Obtainable Market (%)</th>
                <th>Total Addressable Market Size (USD)</th>
                <th>Serviceable Available Market (USD)</th>
                <th>Serviceable Obtainable Market (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.marketSizeCustomers | number: '1.0-0' }}</td>
                <td>{{ row.avgSpendUsd | number: '1.2-2' }}</td>
                <td>{{ row.samPctOfTam | number: '1.2-2' }}</td>
                <td>{{ row.samPctOfMarket | number: '1.2-2' }}</td>
                <td>{{ row.somPct | number: '1.2-2' }}</td>
                <td>{{ totalAddressableMarket(row) | number: '1.0-0' }}</td>
                <td>{{ serviceableAvailableMarket(row) | number: '1.0-0' }}</td>
                <td>{{ serviceableObtainableMarket(row) | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="overflow-auto rounded">
          <p-table
            [value]="summaryRows"
            showGridlines
            class="text-sm"
            [size]="'small'"
          >
            <ng-template #header>
              <tr>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Total Addressable Market Size (USD)</th>
                <th>Serviceable Available Market (USD)</th>
                <th>Serviceable Obtainable Market (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.totalAddressable | number: '1.0-0' }}</td>
                <td>{{ row.serviceableAvailable | number: '1.0-0' }}</td>
                <td>{{ row.serviceableObtainable | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineMarketFieldsetComponent implements OnInit {
  rows: VaccineMarketRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'marketSizeCustomers',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Market size (# customers)', value: 'marketSizeCustomers' },
    { label: 'Average spend (USD/customer)', value: 'avgSpendUsd' },
    { label: 'Serviceable Available Market (% TAM)', value: 'samPctOfTam' },
    { label: 'Serviceable Available Market (% Market size)', value: 'samPctOfMarket' },
    { label: 'Serviceable Obtainable Market (%)', value: 'somPct' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      marketSizeCustomers: [0],
      avgSpendUsd: [0],
      samPctOfTam: [0],
      samPctOfMarket: [0],
      somPct: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      marketSizeCustomers: [0],
      avgSpendUsd: [0],
      samPctOfTam: [0],
      samPctOfMarket: [0],
      somPct: [0],
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
    if (this.helper.column === 'marketSizeCustomers') return row.marketSizeCustomers;
    if (this.helper.column === 'avgSpendUsd') return row.avgSpendUsd;
    if (this.helper.column === 'samPctOfTam') return row.samPctOfTam;
    if (this.helper.column === 'samPctOfMarket') return row.samPctOfMarket;
    return row.somPct;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      totalAddressable: this.totalAddressableMarket(row),
      serviceableAvailable: this.serviceableAvailableMarket(row),
      serviceableObtainable: this.serviceableObtainableMarket(row),
    }));
  }

  totalAddressableMarket(row: VaccineMarketRow): number {
    return (row.marketSizeCustomers || 0) * (row.avgSpendUsd || 0);
  }

  serviceableAvailableMarket(row: VaccineMarketRow): number {
    return this.totalAddressableMarket(row) * (row.samPctOfTam || 0) / 100;
  }

  serviceableObtainableMarket(row: VaccineMarketRow): number {
    return this.serviceableAvailableMarket(row) * (row.somPct || 0) / 100;
  }

  get rowFormValue(): VaccineMarketRow {
    return this.rowForm.getRawValue() as VaccineMarketRow;
  }

  get newRowFormValue(): VaccineMarketRow {
    return this.newRowForm.getRawValue() as VaccineMarketRow;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineMarketRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      marketSizeCustomers: Number(value.marketSizeCustomers || 0),
      avgSpendUsd: Number(value.avgSpendUsd || 0),
      samPctOfTam: Number(value.samPctOfTam || 0),
      samPctOfMarket: Number(value.samPctOfMarket || 0),
      somPct: Number(value.somPct || 0),
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
    const sanitized: VaccineMarketRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      marketSizeCustomers: Number(value.marketSizeCustomers || 0),
      avgSpendUsd: Number(value.avgSpendUsd || 0),
      samPctOfTam: Number(value.samPctOfTam || 0),
      samPctOfMarket: Number(value.samPctOfMarket || 0),
      somPct: Number(value.somPct || 0),
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
      if (this.helper.column === 'marketSizeCustomers') {
        row.marketSizeCustomers = Number(row.marketSizeCustomers || 0) + increment;
      } else if (this.helper.column === 'avgSpendUsd') {
        row.avgSpendUsd = Number(row.avgSpendUsd || 0) + increment;
      } else if (this.helper.column === 'samPctOfTam') {
        row.samPctOfTam = Number(row.samPctOfTam || 0) + increment;
      } else if (this.helper.column === 'samPctOfMarket') {
        row.samPctOfMarket = Number(row.samPctOfMarket || 0) + increment;
      } else {
        row.somPct = Number(row.somPct || 0) + increment;
      }
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineMarketRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      market_size_estimation: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Market size (# customers)': row.marketSizeCustomers,
        'Average spend (USD/customer)': row.avgSpendUsd,
        'Serviceable Available Market (% TAM)': row.samPctOfTam,
        'Serviceable Available Market (% Market size)': row.samPctOfMarket,
        'Serviceable Obtainable Market (%)': row.somPct,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.market_size_estimation;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        marketSizeCustomers: Number(row?.['Market size (# customers)'] ?? 0),
        avgSpendUsd: Number(row?.['Average spend (USD/customer)'] ?? 0),
        samPctOfTam: Number(row?.['Serviceable Available Market (% TAM)'] ?? 0),
        samPctOfMarket: Number(
          row?.['Serviceable Available Market (% Market size)'] ?? 0
        ),
        somPct: Number(row?.['Serviceable Obtainable Market (%)'] ?? 0),
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
      marketSizeCustomers: 1000000,
      avgSpendUsd: 100,
      samPctOfTam: 50,
      samPctOfMarket: 40,
      somPct: 20,
    });
  }
}
