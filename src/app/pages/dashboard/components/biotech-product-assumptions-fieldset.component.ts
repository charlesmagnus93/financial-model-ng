import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '@/pages/services/biotech-model.service';

interface ProductAssumptionRow {
  id: string;
  name: string;
  stage: string;
  successProbPct: number;
  includeInConsolidation: boolean;
  firstYearForecast: number;
  timeToMarket: number;
  patentDurationYears: number;
  extras: Record<string, unknown>;
}

interface IncrementHelper {
  column:
    | 'successProbPct'
    | 'firstYearForecast'
    | 'timeToMarket'
    | 'patentDurationYears';
  incrementPerRow: number;
  rowsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-assumptions-fieldset',
  imports: [
    CommonModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    FormsModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
],
  template:`
  <p-fieldset legend="Product assumptions" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">

        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
            [options]="rowOptions"
            [(ngModel)]="selectedRowId"
            (ngModelChange)="onSelectedRowChange()"
            optionLabel="label"
            optionValue="value"
            placeholder="Select product"
            [showClear]="false"
            class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
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
          <div
            class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2"
          >
            <div class="text-xs text-surface-600 font-semibold">
              Edit selected row
            </div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />

                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />

                  <label class="text-xs font-semibold">Stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>

                  <label class="text-xs font-semibold">Success Probability %</label>
                  <p-inputnumber
                    formControlName="successProbPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold mt-2">Consolidation</label>
                  <p-checkbox class="mt-2" formControlName="includeInConsolidation" binary></p-checkbox>

                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">First year forecast</label>
                  <p-inputnumber
                    formControlName="firstYearForecast"
                    [showButtons]="true"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Time to market</label>
                  <p-inputnumber
                    formControlName="timeToMarket"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Market entry year</label>
                  <p-inputnumber
                    [ngModel]="marketEntryYear"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Patent duration years</label>
                  <p-inputnumber
                    formControlName="patentDurationYears"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">End patent year</label>
                  <p-inputnumber
                    [ngModel]="endPatentYear"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="false"
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
            <div class="text-xs text-surface-600 font-semibold">
              Add a new row
            </div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />

                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />

                  <label class="text-xs font-semibold">Stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>

                  <label class="text-xs font-semibold">Success Probability %</label>
                  <p-inputnumber
                    formControlName="successProbPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold mt-2">Consolidation</label>
                  <p-checkbox class="mt-2" formControlName="includeInConsolidation" binary></p-checkbox>
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">First year forecast</label>
                  <p-inputnumber
                    formControlName="firstYearForecast"
                    [showButtons]="true"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Time to market</label>
                  <p-inputnumber
                    formControlName="timeToMarket"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Market entry year</label>
                  <p-inputnumber
                    [ngModel]="newMarketEntryYear"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">Patent duration years</label>
                  <p-inputnumber
                    formControlName="patentDurationYears"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />

                  <label class="text-xs font-semibold">End patent year</label>
                  <p-inputnumber
                    [ngModel]="newEndPatentYear"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="true"
                    [useGrouping]="false"
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
              <label class="text-xs font-semibold">Increment per row</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerRow"
                [showButtons]="true"
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Rows to apply</label>
              <p-inputnumber
                [(ngModel)]="helper.rowsToApply"
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
                <th>Stage</th>
                <th>Success Probability %</th>
                <th>Consolidate</th>
                <th>First year forecast</th>
                <th>Time to market</th>
                <th>Market entry year</th>
                <th>Patent duration years</th>
                <th>End patent year</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.stage }}</td>
                <td>{{ row.successProbPct | number: '1.2-2' }}</td>
                <td>
                  <i
                    class="pi"
                    [ngClass]="row.includeInConsolidation ? 'pi-check' : 'pi-times'"
                  ></i>
                </td>
                <td>{{ row.firstYearForecast }}</td>
                <td>{{ row.timeToMarket }}</td>
                <td>{{ marketEntryYearFor(row) }}</td>
                <td>{{ row.patentDurationYears }}</td>
                <td>{{ endPatentYearFor(row) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductAssumptionsFieldsetComponent implements OnInit {

  rows: ProductAssumptionRow[] = [];
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'successProbPct',
    incrementPerRow: 1,
    rowsToApply: 1,
  };

  stageOptions = [
    { label: 'Discovery', value: 'Discovery' },
    { label: 'Preclinical', value: 'Preclinical' },
    { label: 'Phase I', value: 'Phase I' },
    { label: 'Phase II', value: 'Phase II' },
    { label: 'Phase III', value: 'Phase III' },
    { label: 'Filed', value: 'Filed' },
    { label: 'Approved', value: 'Approved' },
  ];

  helperColumnOptions = [
    { label: 'Success Probability %', value: 'successProbPct' },
    { label: 'First year forecast', value: 'firstYearForecast' },
    { label: 'Time to market', value: 'timeToMarket' },
    { label: 'Patent duration years', value: 'patentDurationYears' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      successProbPct: [0],
      includeInConsolidation: [false],
      firstYearForecast: [0],
      timeToMarket: [0],
      patentDurationYears: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      successProbPct: [0],
      includeInConsolidation: [true],
      firstYearForecast: [0],
      timeToMarket: [0],
      patentDurationYears: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
    if (this.rows.length) {
      return;
    }
    this.rows = [];
    this.selectedRowId = '';
    this.resetNewRow();
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
    if (this.helper.column === 'successProbPct') return row.successProbPct;
    if (this.helper.column === 'firstYearForecast') return row.firstYearForecast;
    if (this.helper.column === 'timeToMarket') return row.timeToMarket;
    return row.patentDurationYears;
  }

  get marketEntryYear(): number {
    const value = this.rowForm.getRawValue() as ProductAssumptionRow;
    return this.computeMarketEntryYear(value);
  }

  get endPatentYear(): number {
    const value = this.rowForm.getRawValue() as ProductAssumptionRow;
    return this.computeEndPatentYear(value);
  }

  get newMarketEntryYear(): number {
    const value = this.newRowForm.getRawValue() as ProductAssumptionRow;
    return this.computeMarketEntryYear(value);
  }

  get newEndPatentYear(): number {
    const value = this.newRowForm.getRawValue() as ProductAssumptionRow;
    return this.computeEndPatentYear(value);
  }

  marketEntryYearFor(row: ProductAssumptionRow): number {
    return this.computeMarketEntryYear(row);
  }

  endPatentYearFor(row: ProductAssumptionRow): number {
    return this.computeEndPatentYear(row);
  }

  removeSelectedRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
    this.onSelectedRowChange();
    this.persist();
  }

  applyIncrement(): void {
    const startRow = this.getSelectedRow();
    if (!startRow) {
      return;
    }
    const rowsToApply = Math.max(1, Math.floor(this.helper.rowsToApply || 0));
    const increment = Number(this.helper.incrementPerRow || 0);
    const startIndex = this.rows.findIndex((row) => row.id === startRow.id);
    if (startIndex === -1) {
      return;
    }
    const updated = [...this.rows];
    for (let i = 0; i < rowsToApply; i += 1) {
      const idx = startIndex + i;
      if (!updated[idx]) {
        break;
      }
      const row = { ...updated[idx] };
      if (this.helper.column === 'successProbPct') {
        row.successProbPct = Number(row.successProbPct || 0) + increment;
      } else if (this.helper.column === 'firstYearForecast') {
        row.firstYearForecast = Number(row.firstYearForecast || 0) + increment;
      } else if (this.helper.column === 'timeToMarket') {
        row.timeToMarket = Number(row.timeToMarket || 0) + increment;
      } else {
        row.patentDurationYears =
          Number(row.patentDurationYears || 0) + increment;
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
      this.rowForm.reset(this.toFormValue(row));
    }
  }

  saveSelectedRow(): void {
    const value = this.rowForm.getRawValue() as ProductAssumptionRow;
    const existing = this.rows.find((row) => row.id === this.selectedRowId);
    const sanitized: ProductAssumptionRow = {
      id: String(value.id ?? '').trim() || this.nextProductId(),
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      successProbPct: Number(value.successProbPct || 0),
      includeInConsolidation: Boolean(value.includeInConsolidation),
      firstYearForecast: Number(value.firstYearForecast || 0),
      timeToMarket: Number(value.timeToMarket || 0),
      patentDurationYears: Number(value.patentDurationYears || 0),
      extras: existing?.extras ?? {},
    };
    let nextRows = [...this.rows];
    const selectedIndex = nextRows.findIndex(
      (row) => row.id === this.selectedRowId
    );
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
    this.rowForm.reset(this.toFormValue(sanitized));
    this.persist();
  }

  addRow(): void {
    const value = this.newRowForm.getRawValue() as ProductAssumptionRow;
    const sanitized: ProductAssumptionRow = {
      id: String(value.id ?? '').trim() || this.nextProductId(),
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      successProbPct: Number(value.successProbPct || 0),
      includeInConsolidation: Boolean(value.includeInConsolidation),
      firstYearForecast: Number(value.firstYearForecast || 0),
      timeToMarket: Number(value.timeToMarket || 0),
      patentDurationYears: Number(value.patentDurationYears || 0),
      extras: {},
    };
    const nextRows = [...this.rows, sanitized];
    this.rows = nextRows;
    this.selectedRowId = sanitized.id;
    this.onSelectedRowChange();
    this.resetNewRow();
    this.persist();
  }

  private getSelectedRow(): ProductAssumptionRow | undefined {
    return this.rows.find((item) => item.id === this.selectedRowId);
  }

  private persist(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const existingProducts = Array.isArray(snapshot.products)
      ? snapshot.products
      : [];
    const productMap = new Map<string, any>();
    existingProducts.forEach((product: any) => {
      const id = String(product?.id ?? '').trim();
      const name = String(product?.name ?? '').trim();
      if (id) productMap.set(id, product);
      if (name) productMap.set(name, product);
    });

    const productsPayload = this.rows.map((row, index) => {
      const base = productMap.get(row.id) ?? productMap.get(row.name) ?? {};
      const { id, name, stage, successProbPct, includeInConsolidation, timeToMarket, patentDurationYears } =
        row;
      return {
        ...base,
        id: String(id ?? '').trim() || this.formatId(index + 1),
        name: String(name ?? '').trim(),
        stage: String(stage ?? '').trim(),
        success_prob: Number(successProbPct ?? 0) / 100,
        include_in_consolidation: Boolean(includeInConsolidation),
        time_to_market: Number(timeToMarket ?? 0),
        patent_years: Number(patentDurationYears ?? 0),
      };
    });

    const vaccineDevelopmentPayload = this.rows.map((row) => ({
      ID_vaccine: row.id,
      'Vaccine name': row.name,
      Stage: row.stage,
      'Success Probability %': row.successProbPct,
      Consolidation: row.includeInConsolidation,
      'First year forecast': row.firstYearForecast,
      'Time to market': row.timeToMarket,
      'Market entry year': this.computeMarketEntryYear(row),
      'Patent duration years': row.patentDurationYears,
      'End patent year': this.computeEndPatentYear(row),
    }));

    this.biotechModelService.patchInput({
      products: productsPayload,
      vaccine_development: vaccineDevelopmentPayload,
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const storedDevelopment = snapshot?.vaccine_development;
    const storedProducts = Array.isArray(snapshot?.products) ? snapshot.products : [];
    const productMap = new Map<string, any>();
    storedProducts.forEach((product: any) => {
      const id = String(product?.id ?? '').trim();
      const name = String(product?.name ?? '').trim();
      if (id) productMap.set(id, product);
      if (name) productMap.set(name, product);
    });

    if (Array.isArray(storedDevelopment) && storedDevelopment.length) {
      this.rows = storedDevelopment.map((row: any, index: number) => {
        const id = String(row?.ID_vaccine ?? '').trim() || this.formatId(index + 1);
        const name = String(row?.['Vaccine name'] ?? '').trim();
        const match = productMap.get(id) ?? productMap.get(name) ?? {};
        return {
          id,
          name,
          stage: String(row?.Stage ?? '').trim() || 'Discovery',
          successProbPct: Number(row?.['Success Probability %'] ?? 0),
          includeInConsolidation: Boolean(row?.Consolidation),
          firstYearForecast: Number(row?.['First year forecast'] ?? new Date().getFullYear()),
          timeToMarket: Number(row?.['Time to market'] ?? 0),
          patentDurationYears: Number(row?.['Patent duration years'] ?? 0),
          extras: { ...match },
        } as ProductAssumptionRow;
      });
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.onSelectedRowChange();
      this.resetNewRow();
      return;
    }

    if (Array.isArray(storedProducts) && storedProducts.length) {
      this.rows = storedProducts.map((product: any, index: number) => {
        const {
          id,
          name,
          stage,
          success_prob,
          include_in_consolidation,
          time_to_market,
          patent_years,
          ...extras
        } = product ?? {};
        const rawSuccess = Number(success_prob ?? 0);
        const successProbPct = rawSuccess <= 1 ? rawSuccess * 100 : rawSuccess;
        return {
          id: String(id ?? '').trim() || this.formatId(index + 1),
          name: String(name ?? '').trim(),
          stage: String(stage ?? '').trim() || 'Discovery',
          successProbPct,
          includeInConsolidation: Boolean(include_in_consolidation),
          firstYearForecast: new Date().getFullYear(),
          timeToMarket: Number(time_to_market ?? 0),
          patentDurationYears: Number(patent_years ?? 0),
          extras,
        } as ProductAssumptionRow;
      });
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.onSelectedRowChange();
      this.resetNewRow();
    }
  }

  private computeMarketEntryYear(row: ProductAssumptionRow): number {
    const firstYear = Number(row.firstYearForecast || 0);
    const timeToMarket = Number(row.timeToMarket || 0);
    return firstYear + timeToMarket;
  }

  private computeEndPatentYear(row: ProductAssumptionRow): number {
    const entryYear = this.computeMarketEntryYear(row);
    const patentYears = Number(row.patentDurationYears || 0);
    return entryYear + Math.max(0, patentYears) - 1;
  }

  private toFormValue(row: ProductAssumptionRow) {
    return {
      id: row.id,
      name: row.name,
      stage: row.stage,
      successProbPct: row.successProbPct,
      includeInConsolidation: row.includeInConsolidation,
      firstYearForecast: row.firstYearForecast,
      timeToMarket: row.timeToMarket,
      patentDurationYears: row.patentDurationYears,
    };
  }

  private resetNewRow(): void {
    const baseYear =
      this.rows[this.rows.length - 1]?.firstYearForecast ??
      new Date().getFullYear();
    this.newRowForm.reset({
      id: this.nextProductId(),
      name: 'New vaccine',
      stage: this.stageOptions[0]?.value ?? 'Discovery',
      successProbPct: 30,
      includeInConsolidation: true,
      firstYearForecast: baseYear + 1,
      timeToMarket: 3,
      patentDurationYears: 15,
    });
  }

  private nextProductId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /VAC-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return this.formatId(maxId + 1);
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}

