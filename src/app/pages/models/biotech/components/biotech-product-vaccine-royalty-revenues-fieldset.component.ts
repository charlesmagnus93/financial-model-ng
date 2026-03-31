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

interface VaccineRoyaltyRow {
  id: string;
  name: string;
  monetizationModel: string;
  royaltyRatePct: number;
}

interface IncrementHelper {
  column: 'royaltyRatePct';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-royalty-revenues-fieldset',
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
      legend="Vaccines royalty revenues"
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
              <label class="text-xs font-semibold">Monetization model</label>
              <p-select
                [options]="monetizationOptions"
                formControlName="monetizationModel"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Royalty rate (%)</label>
              <p-inputnumber
                formControlName="royaltyRatePct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Patent revenue (USD)</label>
              <p-inputnumber
                [ngModel]="patentRevenue(rowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Post patent revenue (USD)</label>
              <p-inputnumber
                [ngModel]="postPatentRevenue(rowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Royalty income (USD)</label>
              <p-inputnumber
                [ngModel]="royaltyIncome(rowFormValue)"
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
              <label class="text-xs font-semibold">Monetization model</label>
              <p-select
                [options]="monetizationOptions"
                formControlName="monetizationModel"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Royalty rate (%)</label>
              <p-inputnumber
                formControlName="royaltyRatePct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Patent revenue (USD)</label>
              <p-inputnumber
                [ngModel]="patentRevenue(newRowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Post patent revenue (USD)</label>
              <p-inputnumber
                [ngModel]="postPatentRevenue(newRowFormValue)"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="true"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Royalty income (USD)</label>
              <p-inputnumber
                [ngModel]="royaltyIncome(newRowFormValue)"
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
                <th>Monetization model</th>
                <th>Royalty rate (%)</th>
                <th>Royalty income (USD)</th>
                <th>Patent revenue (USD)</th>
                <th>Post patent revenue (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.monetizationModel }}</td>
                <td>{{ row.royaltyRatePct | number: '1.2-2' }}</td>
                <td>{{ royaltyIncome(row) | number: '1.0-0' }}</td>
                <td>{{ patentRevenue(row) | number: '1.0-0' }}</td>
                <td>{{ postPatentRevenue(row) | number: '1.0-0' }}</td>
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
                <th>Royalty rate (%)</th>
                <th>Royalty income (USD)</th>
                <th>Patent revenue (USD)</th>
                <th>Post patent revenue (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.royaltyRatePct | number: '1.2-2' }}</td>
                <td>{{ row.royaltyIncome | number: '1.0-0' }}</td>
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
export class BiotechProductVaccineRoyaltyRevenuesFieldsetComponent implements OnInit {
  rows: VaccineRoyaltyRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'royaltyRatePct',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  monetizationOptions = [
    { label: 'Product Sale', value: 'Product Sale' },
    { label: 'Licensing', value: 'Licensing' },
    { label: 'Co-development', value: 'Co-development' },
  ];

  helperColumnOptions = [{ label: 'Royalty rate (%)', value: 'royaltyRatePct' }];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      monetizationModel: [''],
      royaltyRatePct: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      monetizationModel: [''],
      royaltyRatePct: [0],
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
    return row.royaltyRatePct ?? 0;
  }

  get rowFormValue(): VaccineRoyaltyRow {
    return this.rowForm.getRawValue() as VaccineRoyaltyRow;
  }

  get newRowFormValue(): VaccineRoyaltyRow {
    return this.newRowForm.getRawValue() as VaccineRoyaltyRow;
  }

  get summaryRows() {
    return this.rows.map((row) => ({
      id: row.id,
      name: row.name,
      royaltyRatePct: row.royaltyRatePct,
      royaltyIncome: this.royaltyIncome(row),
      patentRevenue: this.patentRevenue(row),
      postPatentRevenue: this.postPatentRevenue(row),
    }));
  }

  royaltyIncome(row: VaccineRoyaltyRow): number {
    return this.patentRevenue(row) * (row.royaltyRatePct || 0) / 100;
  }

  patentRevenue(row: VaccineRoyaltyRow): number {
    const snapshot = this.biotechModelService.getInputSnapshot();
    const revenueRows = snapshot?.vaccine_revenue || [];
    const match = revenueRows.find(
      (item: any) => String(item?.ID_vaccine ?? '') === row.id
    );
    if (!match) {
      return 0;
    }
    const patentCustomers = Number(match?.['Patent customers per year'] ?? 0);
    const patentPrice = Number(match?.['Patent price (USD/customer)'] ?? 0);
    return patentCustomers * patentPrice;
  }

  postPatentRevenue(row: VaccineRoyaltyRow): number {
    const snapshot = this.biotechModelService.getInputSnapshot();
    const revenueRows = snapshot?.vaccine_revenue || [];
    const match = revenueRows.find(
      (item: any) => String(item?.ID_vaccine ?? '') === row.id
    );
    if (!match) {
      return 0;
    }
    const patentCustomers = Number(match?.['Patent customers per year'] ?? 0);
    const patentPrice = Number(match?.['Patent price (USD/customer)'] ?? 0);
    const postCustomerAdj =
      Number(match?.['Post patent customer adj. %'] ?? 0) / 100;
    const postPriceAdj =
      Number(match?.['Post patent price adj. %'] ?? 0) / 100;
    const postCustomers = patentCustomers * postCustomerAdj;
    const postPrice = patentPrice * postPriceAdj;
    return postCustomers * postPrice;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineRoyaltyRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      monetizationModel: String(value.monetizationModel ?? '').trim(),
      royaltyRatePct: Number(value.royaltyRatePct || 0),
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
    const sanitized: VaccineRoyaltyRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      monetizationModel: String(value.monetizationModel ?? '').trim(),
      royaltyRatePct: Number(value.royaltyRatePct || 0),
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
      row.royaltyRatePct = Number(row.royaltyRatePct || 0) + increment;
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineRoyaltyRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccine_royalties: this.rows.map((row) => ({
        ID_vaccine: row.id,
        'Vaccine name': row.name,
        'Monetization model': row.monetizationModel,
        'Royalty rate (%)': row.royaltyRatePct,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.vaccine_royalties;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.ID_vaccine ?? ''),
        name: String(row?.['Vaccine name'] ?? ''),
        monetizationModel: String(row?.['Monetization model'] ?? ''),
        royaltyRatePct: Number(row?.['Royalty rate (%)'] ?? 0),
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
      monetizationModel: this.monetizationOptions[0]?.value ?? 'Product Sale',
      royaltyRatePct: 5,
    });
  }
}


