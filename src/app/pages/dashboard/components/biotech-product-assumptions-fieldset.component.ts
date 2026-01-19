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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '@/pages/services/biotech-model.service';
import { PharmaModelService } from '@/pages/services/pharma-model.service';

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
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
],
  template:`
  <p-fieldset legend="Product assumptions" [toggleable]="true" class="w-full">
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
              placeholder="Select product"
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
          <div
            class="col-span-12 lg:col-span-8 rounded border border-surface-700 p-3 flex flex-col gap-2"
          >
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
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID</label>
                  <input pInputText formControlName="id" class="w-full" />

                  <label class="text-xs font-semibold">Product name</label>
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
                  <p-inputSwitch formControlName="includeInConsolidation"></p-inputSwitch>

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
                    [disabled]="false"
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
                    [disabled]="false"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                </div>
              </div>
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
          <p-table [value]="rows" showGridlines class="text-sm">
            <ng-template #header>
              <tr>
                <th>ID</th>
                <th>Product name</th>
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
  isCreatingRow = false;
  rowForm: FormGroup;
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
  }

  ngOnInit(): void {
    const storedProducts = this.biotechModelService.getInputSnapshot()?.products;
    // console.log('Stored products on init:', storedProducts);
    if (Array.isArray(storedProducts) && storedProducts.length) {
      this.syncFromModel();
      return;
    }
    this.rows = [];
    this.selectedRowId = '';
    this.isCreatingRow = false;
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
      this.isCreatingRow = false;
      this.rowForm.reset(this.toFormValue(row));
    }
  }

  startNewRow(): void {
    const baseYear =
      this.rows[this.rows.length - 1]?.firstYearForecast ??
      new Date().getFullYear();
    this.isCreatingRow = true;
    this.rowForm.reset({
      id: this.nextProductId(),
      name: '',
      stage: this.stageOptions[0]?.value ?? 'Discovery',
      successProbPct: 30,
      includeInConsolidation: true,
      firstYearForecast: baseYear + 1,
      timeToMarket: 3,
      patentDurationYears: 15,
    });
  }

  saveRow(): void {
    const value = this.rowForm.getRawValue() as ProductAssumptionRow;
    const existing =
      this.rows.find((row) => row.id === this.selectedRowId) ??
      this.rows.find((row) => row.id === value.id);
    const sanitized: ProductAssumptionRow = {
      id: String(value.id ?? '').trim() || this.nextProductId(),
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      successProbPct: Number(value.successProbPct || 0),
      includeInConsolidation: Boolean(value.includeInConsolidation),
      firstYearForecast: Number(value.firstYearForecast || 0),
      timeToMarket: Number(value.timeToMarket || 0),
      patentDurationYears: Number(value.patentDurationYears || 0),
      extras: this.isCreatingRow ? {} : existing?.extras ?? {},
    };
    let nextRows = [...this.rows];
    if (this.isCreatingRow) {
      const existingIndex = nextRows.findIndex((row) => row.id === sanitized.id);
      if (existingIndex >= 0) {
        nextRows[existingIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.selectedRowId = sanitized.id;
      this.isCreatingRow = false;
    } else {
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
    }
    this.rows = nextRows;
    this.rowForm.reset(this.toFormValue(sanitized));
    this.persist();
  }

  private getSelectedRow(): ProductAssumptionRow | undefined {
    return this.rows.find((item) => item.id === this.selectedRowId);
  }

  private persist(): void {
    const payload = this.rows.map((row) => ({
      ...row.extras,
      id: row.id,
      name: row.name,
      stage: row.stage,
      success_prob: row.successProbPct / 100,
      include_in_consolidation: row.includeInConsolidation,
      first_year_forecast: row.firstYearForecast,
      time_to_market: row.timeToMarket,
      market_entry_year: this.computeMarketEntryYear(row),
      patent_years: row.patentDurationYears,
      end_patent_year: this.computeEndPatentYear(row),
    }));
    this.biotechModelService.patchInput({ products: payload });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.products;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((product: any, index: number) => {
        const {
          id,
          name,
          stage,
          success_prob,
          include_in_consolidation,
          first_year_forecast,
          time_to_market,
          patent_years,
          market_entry_year,
          end_patent_year,
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
          firstYearForecast: Number(
            first_year_forecast ?? new Date().getFullYear()
          ),
          timeToMarket: Number(time_to_market ?? 0),
          patentDurationYears: Number(patent_years ?? 0),
          extras: {
            ...extras,
            market_entry_year,
            end_patent_year,
          },
        } as ProductAssumptionRow;
      });
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.onSelectedRowChange();
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

