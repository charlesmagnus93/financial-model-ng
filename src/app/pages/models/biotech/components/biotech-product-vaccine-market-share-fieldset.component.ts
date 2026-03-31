import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../../services/biotech-model.service';

interface VaccineMarketShareRow {
  id: string;
  name: string;
  marketType: string;
  relevantMarketSizeUsd: number;
  revenueTargetPatentPct: number;
  revenueTargetPostPct: number;
  marketSharePatentPct: number;
  marketSharePostPct: number;
  marketGrowthPct: number;
  salesGrowthPct: number;
}

interface IncrementHelper {
  column:
    | 'relevantMarketSizeUsd'
    | 'revenueTargetPatentPct'
    | 'revenueTargetPostPct'
    | 'marketSharePatentPct'
    | 'marketSharePostPct'
    | 'marketGrowthPct'
    | 'salesGrowthPct';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-market-share-fieldset',
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
      legend="Vaccines market share"
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
          <div class="col-span-12 flex flex-col gap-2">
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
              <label class="text-xs font-semibold">Relevant market type</label>
              <input pInputText formControlName="marketType" class="w-full" />
              <label class="text-xs font-semibold">Relevant market size (USD)</label>
              <p-inputnumber
                formControlName="relevantMarketSizeUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target - patent %</label>
              <p-inputnumber
                formControlName="revenueTargetPatentPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target - post %</label>
              <p-inputnumber
                formControlName="revenueTargetPostPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market share patent %</label>
              <p-inputnumber
                formControlName="marketSharePatentPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market share post %</label>
              <p-inputnumber
                formControlName="marketSharePostPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market growth %</label>
              <p-inputnumber
                formControlName="marketGrowthPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Sales growth %</label>
              <p-inputnumber
                formControlName="salesGrowthPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target patent (USD)</label>
              <p-inputnumber
                [ngModel]="revenueTargetPatentUsd(rowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [showButtons]="true"
                [disabled]="false"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target post (USD)</label>
              <p-inputnumber
                [ngModel]="revenueTargetPostUsd(rowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [showButtons]="true"
                [disabled]="false"
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
              <label class="text-xs font-semibold">Relevant market type</label>
              <input pInputText formControlName="marketType" class="w-full" />
              <label class="text-xs font-semibold">Relevant market size (USD)</label>
              <p-inputnumber
                formControlName="relevantMarketSizeUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target - patent %</label>
              <p-inputnumber
                formControlName="revenueTargetPatentPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target - post %</label>
              <p-inputnumber
                formControlName="revenueTargetPostPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market share patent %</label>
              <p-inputnumber
                formControlName="marketSharePatentPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market share post %</label>
              <p-inputnumber
                formControlName="marketSharePostPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Market growth %</label>
              <p-inputnumber
                formControlName="marketGrowthPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Sales growth %</label>
              <p-inputnumber
                formControlName="salesGrowthPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target patent (USD)</label>
              <p-inputnumber
                [ngModel]="revenueTargetPatentUsd(newRowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [showButtons]="true"
                [disabled]="false"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Revenue target post (USD)</label>
              <p-inputnumber
                [ngModel]="revenueTargetPostUsd(newRowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [showButtons]="true"
                [disabled]="false"
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
                <th style="min-width:130px">ID_vaccine</th>
                <th style="min-width:130px">Vaccine name</th>
                <th>Relevant market type</th>
                <th>Relevant market size (USD)</th>
                <th>Revenue target - patent %</th>
                <th>Revenue target - post %</th>
                <th>Market share patent %</th>
                <th>Market share post %</th>
                <th>Market growth %</th>
                <th>Sales growth %</th>
                <th>Revenue target patent (USD)</th>
                <th>Revenue target post (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.marketType }}</td>
                <td>{{ row.relevantMarketSizeUsd | number: '1.0-0' }}</td>
                <td>{{ row.revenueTargetPatentPct | number: '1.2-2' }}</td>
                <td>{{ row.revenueTargetPostPct | number: '1.2-2' }}</td>
                <td>{{ row.marketSharePatentPct | number: '1.2-2' }}</td>
                <td>{{ row.marketSharePostPct | number: '1.2-2' }}</td>
                <td>{{ row.marketGrowthPct | number: '1.2-2' }}</td>
                <td>{{ row.salesGrowthPct | number: '1.2-2' }}</td>
                <td>{{ revenueTargetPatentUsd(row) | number: '1.0-0' }}</td>
                <td>{{ revenueTargetPostUsd(row) | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="overflow-auto rounded">
          <p-table [value]="summaryRows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th style="min-width:130px">ID_vaccine</th>
                <th style="min-width:130px">Vaccine name</th>
                <th>Relevant market type</th>
                <th>Relevant market size (USD)</th>
                <th>Revenue target patent (USD)</th>
                <th>Revenue target post (USD)</th>
                <th>Market share patent %</th>
                <th>Market share post %</th>
                <th>Market growth %</th>
                <th>Sales growth %</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.marketType }}</td>
                <td>{{ row.relevantMarketSizeUsd | number: '1.0-0' }}</td>
                <td>{{ row.revenueTargetPatentUsd | number: '1.0-0' }}</td>
                <td>{{ row.revenueTargetPostUsd | number: '1.0-0' }}</td>
                <td>{{ row.marketSharePatentPct | number: '1.2-2' }}</td>
                <td>{{ row.marketSharePostPct | number: '1.2-2' }}</td>
                <td>{{ row.marketGrowthPct | number: '1.2-2' }}</td>
                <td>{{ row.salesGrowthPct | number: '1.2-2' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineMarketShareFieldsetComponent implements OnInit {
  rows: VaccineMarketShareRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'relevantMarketSizeUsd',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Relevant market size (USD)', value: 'relevantMarketSizeUsd' },
    { label: 'Revenue target - patent %', value: 'revenueTargetPatentPct' },
    { label: 'Revenue target - post %', value: 'revenueTargetPostPct' },
    { label: 'Market share patent %', value: 'marketSharePatentPct' },
    { label: 'Market share post %', value: 'marketSharePostPct' },
    { label: 'Market growth %', value: 'marketGrowthPct' },
    { label: 'Sales growth %', value: 'salesGrowthPct' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      marketType: [''],
      relevantMarketSizeUsd: [0],
      revenueTargetPatentPct: [0],
      revenueTargetPostPct: [0],
      marketSharePatentPct: [0],
      marketSharePostPct: [0],
      marketGrowthPct: [0],
      salesGrowthPct: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      marketType: [''],
      relevantMarketSizeUsd: [0],
      revenueTargetPatentPct: [0],
      revenueTargetPostPct: [0],
      marketSharePatentPct: [0],
      marketSharePostPct: [0],
      marketGrowthPct: [0],
      salesGrowthPct: [0],
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

  get rowFormValue(): VaccineMarketShareRow {
    return this.rowForm.getRawValue() as VaccineMarketShareRow;
  }

  get newRowFormValue(): VaccineMarketShareRow {
    return this.newRowForm.getRawValue() as VaccineMarketShareRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      marketType: row.marketType,
      relevantMarketSizeUsd: row.relevantMarketSizeUsd,
      revenueTargetPatentUsd: this.revenueTargetPatentUsd(row),
      revenueTargetPostUsd: this.revenueTargetPostUsd(row),
      marketSharePatentPct: row.marketSharePatentPct,
      marketSharePostPct: row.marketSharePostPct,
      marketGrowthPct: row.marketGrowthPct,
      salesGrowthPct: row.salesGrowthPct,
    }));
  }

  revenueTargetPatentUsd(row: VaccineMarketShareRow): number {
    return (row.relevantMarketSizeUsd || 0) * (row.revenueTargetPatentPct || 0) / 100;
  }

  revenueTargetPostUsd(row: VaccineMarketShareRow): number {
    return (row.relevantMarketSizeUsd || 0) * (row.revenueTargetPostPct || 0) / 100;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineMarketShareRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      marketType: String(value.marketType ?? '').trim(),
      relevantMarketSizeUsd: Number(value.relevantMarketSizeUsd || 0),
      revenueTargetPatentPct: Number(value.revenueTargetPatentPct || 0),
      revenueTargetPostPct: Number(value.revenueTargetPostPct || 0),
      marketSharePatentPct: Number(value.marketSharePatentPct || 0),
      marketSharePostPct: Number(value.marketSharePostPct || 0),
      marketGrowthPct: Number(value.marketGrowthPct || 0),
      salesGrowthPct: Number(value.salesGrowthPct || 0),
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
    const sanitized: VaccineMarketShareRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      marketType: String(value.marketType ?? '').trim(),
      relevantMarketSizeUsd: Number(value.relevantMarketSizeUsd || 0),
      revenueTargetPatentPct: Number(value.revenueTargetPatentPct || 0),
      revenueTargetPostPct: Number(value.revenueTargetPostPct || 0),
      marketSharePatentPct: Number(value.marketSharePatentPct || 0),
      marketSharePostPct: Number(value.marketSharePostPct || 0),
      marketGrowthPct: Number(value.marketGrowthPct || 0),
      salesGrowthPct: Number(value.salesGrowthPct || 0),
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

  private getSelectedRow(): VaccineMarketShareRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_market_share: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Relevant market type': row.marketType,
        'Relevant market size (USD)': row.relevantMarketSizeUsd,
        'Revenue target - patent %': row.revenueTargetPatentPct,
        'Revenue target - post %': row.revenueTargetPostPct,
        'Market share patent %': row.marketSharePatentPct,
        'Market share post %': row.marketSharePostPct,
        'Market growth %': row.marketGrowthPct,
        'Sales growth %': row.salesGrowthPct,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccine_market_share;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        marketType: String(row?.['Relevant market type'] ?? ''),
        relevantMarketSizeUsd: Number(row?.['Relevant market size (USD)'] ?? 0),
        revenueTargetPatentPct: Number(row?.['Revenue target - patent %'] ?? 0),
        revenueTargetPostPct: Number(row?.['Revenue target - post %'] ?? 0),
        marketSharePatentPct: Number(row?.['Market share patent %'] ?? 0),
        marketSharePostPct: Number(row?.['Market share post %'] ?? 0),
        marketGrowthPct: Number(row?.['Market growth %'] ?? 0),
        salesGrowthPct: Number(row?.['Sales growth %'] ?? 0),
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
      marketType: 'New segment',
      relevantMarketSizeUsd: 1000000000,
      revenueTargetPatentPct: 10,
      revenueTargetPostPct: 5,
      marketSharePatentPct: 5,
      marketSharePostPct: 3,
      marketGrowthPct: 5,
      salesGrowthPct: 8,
    });
  }
}

