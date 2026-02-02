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

interface VaccineCostRow {
  id: string;
  name: string;
  cogsPatentPct: number;
  cogsPostPct: number;
  marketingAnnualPct: number;
  marketingLaunchUsd: number;
  indirectStaffUsd: number;
  electricityUsd: number;
  depreciationUsd: number;
  interestAmortizationUsd: number;
  royaltiesPct: number;
  gnaTotalUsd: number;
  patentOperatingCostPct: number;
  postOperatingCostPct: number;
}

interface IncrementHelper {
  column:
    | 'cogsPatentPct'
    | 'cogsPostPct'
    | 'marketingAnnualPct'
    | 'marketingLaunchUsd'
    | 'indirectStaffUsd'
    | 'electricityUsd'
    | 'depreciationUsd'
    | 'interestAmortizationUsd'
    | 'royaltiesPct'
    | 'gnaTotalUsd'
    | 'patentOperatingCostPct'
    | 'postOperatingCostPct';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-cost-fieldset',
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
      legend="Vaccine cost assumptions"
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
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">COGS patent % of sales</label>
                  <p-inputnumber
                    formControlName="cogsPatentPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">COGS post % of sales</label>
                  <p-inputnumber
                    formControlName="cogsPostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Marketing annual % of sales</label>
                  <p-inputnumber
                    formControlName="marketingAnnualPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Marketing launch cost (USD)</label>
                  <p-inputnumber
                    formControlName="marketingLaunchUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Indirect staff cost (USD)</label>
                  <p-inputnumber
                    formControlName="indirectStaffUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Electricity (USD)</label>
                  <p-inputnumber
                    formControlName="electricityUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Depreciation (USD)</label>
                  <p-inputnumber
                    formControlName="depreciationUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Interest & amortization (USD)</label>
                  <p-inputnumber
                    formControlName="interestAmortizationUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Royalties cost % of sales</label>
                  <p-inputnumber
                    formControlName="royaltiesPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">G&A total (USD)</label>
                  <p-inputnumber
                    formControlName="gnaTotalUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent operating cost %</label>
                  <p-inputnumber
                    formControlName="patentOperatingCostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post operating cost %</label>
                  <p-inputnumber
                    formControlName="postOperatingCostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
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
                  <label class="text-xs font-semibold">COGS patent % of sales</label>
                  <p-inputnumber
                    formControlName="cogsPatentPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">COGS post % of sales</label>
                  <p-inputnumber
                    formControlName="cogsPostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Marketing annual % of sales</label>
                  <p-inputnumber
                    formControlName="marketingAnnualPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Marketing launch cost (USD)</label>
                  <p-inputnumber
                    formControlName="marketingLaunchUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Indirect staff cost (USD)</label>
                  <p-inputnumber
                    formControlName="indirectStaffUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Electricity (USD)</label>
                  <p-inputnumber
                    formControlName="electricityUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Depreciation (USD)</label>
                  <p-inputnumber
                    formControlName="depreciationUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Interest & amortization (USD)</label>
                  <p-inputnumber
                    formControlName="interestAmortizationUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Royalties cost % of sales</label>
                  <p-inputnumber
                    formControlName="royaltiesPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">G&A total (USD)</label>
                  <p-inputnumber
                    formControlName="gnaTotalUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Patent operating cost %</label>
                  <p-inputnumber
                    formControlName="patentOperatingCostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post operating cost %</label>
                  <p-inputnumber
                    formControlName="postOperatingCostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
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
          <p-table [value]="rows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>COGS patent % of sales</th>
                <th>COGS post % of sales</th>
                <th>Marketing annual % of sales</th>
                <th>Marketing launch cost (USD)</th>
                <th>Indirect staff cost (USD)</th>
                <th>Electricity (USD)</th>
                <th>Depreciation (USD)</th>
                <th>Interest & amortization (USD)</th>
                <th>Royalties cost % of sales</th>
                <th>G&A total (USD)</th>
                <th>Patent operating cost %</th>
                <th>Post operating cost %</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.cogsPatentPct | number: '1.2-2' }}</td>
                <td>{{ row.cogsPostPct | number: '1.2-2' }}</td>
                <td>{{ row.marketingAnnualPct | number: '1.2-2' }}</td>
                <td>{{ row.marketingLaunchUsd | number: '1.0-0' }}</td>
                <td>{{ row.indirectStaffUsd | number: '1.0-0' }}</td>
                <td>{{ row.electricityUsd | number: '1.0-0' }}</td>
                <td>{{ row.depreciationUsd | number: '1.0-0' }}</td>
                <td>{{ row.interestAmortizationUsd | number: '1.0-0' }}</td>
                <td>{{ row.royaltiesPct | number: '1.2-2' }}</td>
                <td>{{ row.gnaTotalUsd | number: '1.0-0' }}</td>
                <td>{{ row.patentOperatingCostPct | number: '1.2-2' }}</td>
                <td>{{ row.postOperatingCostPct | number: '1.2-2' }}</td>
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
                <th>COGS patent % of sales</th>
                <th>COGS post % of sales</th>
                <th>Marketing annual % of sales</th>
                <th>Marketing launch cost (USD)</th>
                <th>Royalties cost % of sales</th>
                <th>G&A total (USD)</th>
                <th>Patent operating cost %</th>
                <th>Post operating cost %</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.cogsPatentPct | number: '1.2-2' }}</td>
                <td>{{ row.cogsPostPct | number: '1.2-2' }}</td>
                <td>{{ row.marketingAnnualPct | number: '1.2-2' }}</td>
                <td>{{ row.marketingLaunchUsd | number: '1.0-0' }}</td>
                <td>{{ row.royaltiesPct | number: '1.2-2' }}</td>
                <td>{{ row.gnaTotalUsd | number: '1.0-0' }}</td>
                <td>{{ row.patentOperatingCostPct | number: '1.2-2' }}</td>
                <td>{{ row.postOperatingCostPct | number: '1.2-2' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineCostFieldsetComponent implements OnInit {
  rows: VaccineCostRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'cogsPatentPct',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'COGS patent % of sales', value: 'cogsPatentPct' },
    { label: 'COGS post % of sales', value: 'cogsPostPct' },
    { label: 'Marketing annual % of sales', value: 'marketingAnnualPct' },
    { label: 'Marketing launch cost (USD)', value: 'marketingLaunchUsd' },
    { label: 'Indirect staff cost (USD)', value: 'indirectStaffUsd' },
    { label: 'Electricity (USD)', value: 'electricityUsd' },
    { label: 'Depreciation (USD)', value: 'depreciationUsd' },
    { label: 'Interest & amortization (USD)', value: 'interestAmortizationUsd' },
    { label: 'Royalties cost % of sales', value: 'royaltiesPct' },
    { label: 'G&A total (USD)', value: 'gnaTotalUsd' },
    { label: 'Patent operating cost %', value: 'patentOperatingCostPct' },
    { label: 'Post operating cost %', value: 'postOperatingCostPct' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      cogsPatentPct: [0],
      cogsPostPct: [0],
      marketingAnnualPct: [0],
      marketingLaunchUsd: [0],
      indirectStaffUsd: [0],
      electricityUsd: [0],
      depreciationUsd: [0],
      interestAmortizationUsd: [0],
      royaltiesPct: [0],
      gnaTotalUsd: [0],
      patentOperatingCostPct: [0],
      postOperatingCostPct: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      cogsPatentPct: [0],
      cogsPostPct: [0],
      marketingAnnualPct: [0],
      marketingLaunchUsd: [0],
      indirectStaffUsd: [0],
      electricityUsd: [0],
      depreciationUsd: [0],
      interestAmortizationUsd: [0],
      royaltiesPct: [0],
      gnaTotalUsd: [0],
      patentOperatingCostPct: [0],
      postOperatingCostPct: [0],
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

  get rowFormValue(): VaccineCostRow {
    return this.rowForm.getRawValue() as VaccineCostRow;
  }

  get newRowFormValue(): VaccineCostRow {
    return this.newRowForm.getRawValue() as VaccineCostRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      cogsPatentPct: row.cogsPatentPct,
      cogsPostPct: row.cogsPostPct,
      marketingAnnualPct: row.marketingAnnualPct,
      marketingLaunchUsd: row.marketingLaunchUsd,
      royaltiesPct: row.royaltiesPct,
      gnaTotalUsd: row.gnaTotalUsd,
      patentOperatingCostPct: row.patentOperatingCostPct,
      postOperatingCostPct: row.postOperatingCostPct,
    }));
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineCostRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      cogsPatentPct: Number(value.cogsPatentPct || 0),
      cogsPostPct: Number(value.cogsPostPct || 0),
      marketingAnnualPct: Number(value.marketingAnnualPct || 0),
      marketingLaunchUsd: Number(value.marketingLaunchUsd || 0),
      indirectStaffUsd: Number(value.indirectStaffUsd || 0),
      electricityUsd: Number(value.electricityUsd || 0),
      depreciationUsd: Number(value.depreciationUsd || 0),
      interestAmortizationUsd: Number(value.interestAmortizationUsd || 0),
      royaltiesPct: Number(value.royaltiesPct || 0),
      gnaTotalUsd: Number(value.gnaTotalUsd || 0),
      patentOperatingCostPct: Number(value.patentOperatingCostPct || 0),
      postOperatingCostPct: Number(value.postOperatingCostPct || 0),
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
    const sanitized: VaccineCostRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      cogsPatentPct: Number(value.cogsPatentPct || 0),
      cogsPostPct: Number(value.cogsPostPct || 0),
      marketingAnnualPct: Number(value.marketingAnnualPct || 0),
      marketingLaunchUsd: Number(value.marketingLaunchUsd || 0),
      indirectStaffUsd: Number(value.indirectStaffUsd || 0),
      electricityUsd: Number(value.electricityUsd || 0),
      depreciationUsd: Number(value.depreciationUsd || 0),
      interestAmortizationUsd: Number(value.interestAmortizationUsd || 0),
      royaltiesPct: Number(value.royaltiesPct || 0),
      gnaTotalUsd: Number(value.gnaTotalUsd || 0),
      patentOperatingCostPct: Number(value.patentOperatingCostPct || 0),
      postOperatingCostPct: Number(value.postOperatingCostPct || 0),
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

  private getSelectedRow(): VaccineCostRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_costs: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'COGS patent % of sales': row.cogsPatentPct,
        'COGS post % of sales': row.cogsPostPct,
        'Marketing annual % of sales': row.marketingAnnualPct,
        'Marketing launch cost (USD)': row.marketingLaunchUsd,
        'Indirect staff cost (USD)': row.indirectStaffUsd,
        'Electricity (USD)': row.electricityUsd,
        'Depreciation (USD)': row.depreciationUsd,
        'Interest & amortization (USD)': row.interestAmortizationUsd,
        'Royalties cost % of sales': row.royaltiesPct,
        'G&A total (USD)': row.gnaTotalUsd,
        'Patent operating cost %': row.patentOperatingCostPct,
        'Post operating cost %': row.postOperatingCostPct,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccine_costs;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        cogsPatentPct: Number(row?.['COGS patent % of sales'] ?? 0),
        cogsPostPct: Number(row?.['COGS post % of sales'] ?? 0),
        marketingAnnualPct: Number(row?.['Marketing annual % of sales'] ?? 0),
        marketingLaunchUsd: Number(row?.['Marketing launch cost (USD)'] ?? 0),
        indirectStaffUsd: Number(row?.['Indirect staff cost (USD)'] ?? 0),
        electricityUsd: Number(row?.['Electricity (USD)'] ?? 0),
        depreciationUsd: Number(row?.['Depreciation (USD)'] ?? 0),
        interestAmortizationUsd: Number(row?.['Interest & amortization (USD)'] ?? 0),
        royaltiesPct: Number(row?.['Royalties cost % of sales'] ?? 0),
        gnaTotalUsd: Number(row?.['G&A total (USD)'] ?? 0),
        patentOperatingCostPct: Number(row?.['Patent operating cost %'] ?? 0),
        postOperatingCostPct: Number(row?.['Post operating cost %'] ?? 0),
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
      cogsPatentPct: 30,
      cogsPostPct: 45,
      marketingAnnualPct: 15,
      marketingLaunchUsd: 1000000,
      indirectStaffUsd: 500000,
      electricityUsd: 100000,
      depreciationUsd: 200000,
      interestAmortizationUsd: 100000,
      royaltiesPct: 3,
      gnaTotalUsd: 1000000,
      patentOperatingCostPct: 50,
      postOperatingCostPct: 70,
    });
  }
}

