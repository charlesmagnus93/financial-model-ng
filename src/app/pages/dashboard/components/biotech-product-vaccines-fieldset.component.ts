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

interface VaccineProductRow {
  id: string;
  name: string;
  stage: string;
  success_prob: number;
  include_in_consolidation: boolean;
  time_to_market: number;
  patent_years: number;
  preexisting_market: boolean;
  patent_revenue_target: number;
  post_patent_revenue_target: number;
  market_growth_patent: number;
  market_growth_post: number;
  cogs_patent: number;
  cogs_post: number;
  sales_marketing_pct: number;
  gna_pct: number;
  royalty_pct: number;
  rd_remaining_pre_launch: number;
  rd_annual_post_launch: number;
  capex_remaining_pre_launch: number;
  capex_annual_post_launch: number;
  rd_capitalization_ratio: number;
  rd_amort_years: number;
  capex_dep_years: number;
}

interface IncrementHelper {
  column:
    | 'success_prob'
    | 'time_to_market'
    | 'patent_years'
    | 'patent_revenue_target'
    | 'post_patent_revenue_target'
    | 'market_growth_patent'
    | 'market_growth_post'
    | 'cogs_patent'
    | 'cogs_post'
    | 'sales_marketing_pct'
    | 'gna_pct'
    | 'royalty_pct'
    | 'rd_remaining_pre_launch'
    | 'rd_annual_post_launch'
    | 'capex_remaining_pre_launch'
    | 'capex_annual_post_launch'
    | 'rd_capitalization_ratio'
    | 'rd_amort_years'
    | 'capex_dep_years';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccines-fieldset',
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
    <p-fieldset
      legend="Vaccines"
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
          <div class="col-span-12 lg:col-span-8 rounded border border-surface-700 p-3 flex flex-col">
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
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
                  <label class="text-xs font-semibold">success_prob</label>
                  <p-inputnumber
                    formControlName="success_prob"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 pt-1">
                    <p-checkbox formControlName="include_in_consolidation" [binary]="true"></p-checkbox>
                    <span class="text-xs font-semibold">include_in_consolidation</span>
                  </div>
                  <label class="text-xs font-semibold">time_to_market</label>
                  <p-inputnumber
                    formControlName="time_to_market"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">patent_years</label>
                  <p-inputnumber
                    formControlName="patent_years"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 pt-1">
                    <p-checkbox formControlName="preexisting_market" [binary]="true"></p-checkbox>
                    <span class="text-xs font-semibold">preexisting_market</span>
                  </div>
                  <label class="text-xs font-semibold">patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">post_patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="post_patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_patent</label>
                  <p-inputnumber
                    formControlName="market_growth_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_post</label>
                  <p-inputnumber
                    formControlName="market_growth_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">cogs_patent</label>
                  <p-inputnumber
                    formControlName="cogs_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">cogs_post</label>
                  <p-inputnumber
                    formControlName="cogs_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">sales_marketing_pct</label>
                  <p-inputnumber
                    formControlName="sales_marketing_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">gna_pct</label>
                  <p-inputnumber
                    formControlName="gna_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="rd_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="rd_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="capex_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="capex_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">royalty_pct</label>
                  <p-inputnumber
                    formControlName="royalty_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_capitalization_ratio</label>
                  <p-inputnumber
                    formControlName="rd_capitalization_ratio"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_amort_years</label>
                  <p-inputnumber
                    formControlName="rd_amort_years"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_dep_years</label>
                  <p-inputnumber
                    formControlName="capex_dep_years"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-12 lg:col-span-6">
                  <p-button
                    [label]="isCreatingRow ? 'Add row' : 'Save changes'"
                    size="small"
                    [outlined]="true"
                    (onClick)="saveRow()"
                    fluid
                  ></p-button>
                </div>
                <div class="col-span-12 lg:col-span-6">
                  <p-button
                    label="Remove row"
                    [outlined]="true"
                    size="small"
                    severity="danger"
                    (onClick)="removeRow()"
                    [disabled]="rows.length <= 1"
                    class="w-full"
                    fluid
                  ></p-button>
                </div>
              </div>
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
                [step]="0.01"
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

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 flex flex-col gap-2">
            <div class="overflow-x-auto rounded max-w-full">
              <p-table [value]="rows" [scrollable]="true" showGridlines class="text-sm w-full" [size]="'small'">
                <ng-template #header>
                  <tr>
                    <th style="min-width:150px">name</th>
                    <th style="min-width:150px">stage</th>
                    <th>success_prob</th>
                    <th>include_in_consolidation</th>
                    <th>time_to_market</th>
                    <th>patent_years</th>
                    <th>preexisting_market</th>
                    <th>patent_revenue_target</th>
                    <th>post_patent_revenue_target</th>
                    <th>market_growth_patent</th>
                    <th>market_growth_post</th>
                    <th>cogs_patent</th>
                    <th>cogs_post</th>
                    <th>sales_marketing_pct</th>
                    <th>gna_pct</th>
                    <th>royalty_pct</th>
                    <th>rd_remaining_pre_launch</th>
                    <th>rd_annual_post_launch</th>
                    <th>capex_remaining_pre_launch</th>
                    <th>capex_annual_post_launch</th>
                    <th>rd_capitalization_ratio</th>
                    <th>rd_amort_years</th>
                    <th>capex_dep_years</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.stage }}</td>
                    <td>{{ row.success_prob | number: '1.2-2' }}</td>
                    <td>
                      <i
                        class="pi"
                        [ngClass]="row.include_in_consolidation ? 'pi-check' : 'pi-times'"
                      ></i>
                    </td>
                    <td>{{ row.time_to_market }}</td>
                    <td>{{ row.patent_years }}</td>
                    <td>
                      <i
                        class="pi"
                        [ngClass]="row.preexisting_market ? 'pi-check' : 'pi-times'"
                      ></i>
                    </td>
                    <td>{{ row.patent_revenue_target | number: '1.0-0' }}</td>
                    <td>{{ row.post_patent_revenue_target | number: '1.0-0' }}</td>
                    <td>{{ row.market_growth_patent | number: '1.2-2' }}</td>
                    <td>{{ row.market_growth_post | number: '1.2-2' }}</td>
                    <td>{{ row.cogs_patent | number: '1.2-2' }}</td>
                    <td>{{ row.cogs_post | number: '1.2-2' }}</td>
                    <td>{{ row.sales_marketing_pct | number: '1.2-2' }}</td>
                    <td>{{ row.gna_pct | number: '1.2-2' }}</td>
                    <td>{{ row.royalty_pct | number: '1.2-2' }}</td>
                    <td>{{ row.rd_remaining_pre_launch | number: '1.0-0' }}</td>
                    <td>{{ row.rd_annual_post_launch | number: '1.0-0' }}</td>
                    <td>{{ row.capex_remaining_pre_launch | number: '1.0-0' }}</td>
                    <td>{{ row.capex_annual_post_launch | number: '1.0-0' }}</td>
                    <td>{{ row.rd_capitalization_ratio | number: '1.2-2' }}</td>
                    <td>{{ row.rd_amort_years }}</td>
                    <td>{{ row.capex_dep_years }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccinesFieldsetComponent implements OnInit {
  rows: VaccineProductRow[] = [];
  selectedRowId = '';
  isCreatingRow = false;
  rowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'success_prob',
    incrementPerYear: 0.01,
    yearsToApply: 1,
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
    { label: 'success_prob', value: 'success_prob' },
    { label: 'time_to_market', value: 'time_to_market' },
    { label: 'patent_years', value: 'patent_years' },
    { label: 'patent_revenue_target', value: 'patent_revenue_target' },
    { label: 'post_patent_revenue_target', value: 'post_patent_revenue_target' },
    { label: 'market_growth_patent', value: 'market_growth_patent' },
    { label: 'market_growth_post', value: 'market_growth_post' },
    { label: 'cogs_patent', value: 'cogs_patent' },
    { label: 'cogs_post', value: 'cogs_post' },
    { label: 'sales_marketing_pct', value: 'sales_marketing_pct' },
    { label: 'gna_pct', value: 'gna_pct' },
    { label: 'royalty_pct', value: 'royalty_pct' },
    { label: 'rd_remaining_pre_launch', value: 'rd_remaining_pre_launch' },
    { label: 'rd_annual_post_launch', value: 'rd_annual_post_launch' },
    { label: 'capex_remaining_pre_launch', value: 'capex_remaining_pre_launch' },
    { label: 'capex_annual_post_launch', value: 'capex_annual_post_launch' },
    { label: 'rd_capitalization_ratio', value: 'rd_capitalization_ratio' },
    { label: 'rd_amort_years', value: 'rd_amort_years' },
    { label: 'capex_dep_years', value: 'capex_dep_years' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      success_prob: [0],
      include_in_consolidation: [false],
      time_to_market: [0],
      patent_years: [0],
      preexisting_market: [false],
      patent_revenue_target: [0],
      post_patent_revenue_target: [0],
      market_growth_patent: [0],
      market_growth_post: [0],
      cogs_patent: [0],
      cogs_post: [0],
      sales_marketing_pct: [0],
      gna_pct: [0],
      royalty_pct: [0],
      rd_remaining_pre_launch: [0],
      rd_annual_post_launch: [0],
      capex_remaining_pre_launch: [0],
      capex_annual_post_launch: [0],
      rd_capitalization_ratio: [0],
      rd_amort_years: [0],
      capex_dep_years: [0],
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

  get rowFormValue(): VaccineProductRow {
    return this.rowForm.getRawValue() as VaccineProductRow;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.isCreatingRow = false;
      this.rowForm.reset({ ...row });
    }
  }

  startNewRow(): void {
    this.isCreatingRow = true;
    this.selectedRowId = '';
    this.rowForm.reset({
      id: this.nextProductId(),
      name: 'New vaccine',
      stage: this.stageOptions[0]?.value ?? 'Discovery',
      success_prob: 0.3,
      include_in_consolidation: true,
      time_to_market: 3,
      patent_years: 15,
      preexisting_market: false,
      patent_revenue_target: 120000000,
      post_patent_revenue_target: 60000000,
      market_growth_patent: 0.04,
      market_growth_post: 0,
      cogs_patent: 0.32,
      cogs_post: 0.5,
      sales_marketing_pct: 0.18,
      gna_pct: 0.12,
      royalty_pct: 0,
      rd_remaining_pre_launch: 180000000,
      rd_annual_post_launch: 12000000,
      capex_remaining_pre_launch: 55000000,
      capex_annual_post_launch: 6500000,
      rd_capitalization_ratio: 0.5,
      rd_amort_years: 10,
      capex_dep_years: 10,
    });
  }

  saveRow(): void {
    const value = this.rowFormValue;
    const sanitized = this.sanitizeRow(value, this.nextProductId());
    let nextRows = [...this.rows];
    if (this.isCreatingRow) {
      const existingIndex = nextRows.findIndex((row) => row.id === sanitized.id);
      if (existingIndex >= 0) {
        nextRows[existingIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.isCreatingRow = false;
    } else {
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
    }
    this.rows = nextRows;
    this.selectedRowId = sanitized.id;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
    this.syncSelectedRow();
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

  private sanitizeRow(value: VaccineProductRow, fallbackId: string): VaccineProductRow {
    return {
      id: String(value.id ?? '').trim() || fallbackId,
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      success_prob: Number(value.success_prob || 0),
      include_in_consolidation: Boolean(value.include_in_consolidation),
      time_to_market: Number(value.time_to_market || 0),
      patent_years: Number(value.patent_years || 0),
      preexisting_market: Boolean(value.preexisting_market),
      patent_revenue_target: Number(value.patent_revenue_target || 0),
      post_patent_revenue_target: Number(value.post_patent_revenue_target || 0),
      market_growth_patent: Number(value.market_growth_patent || 0),
      market_growth_post: Number(value.market_growth_post || 0),
      cogs_patent: Number(value.cogs_patent || 0),
      cogs_post: Number(value.cogs_post || 0),
      sales_marketing_pct: Number(value.sales_marketing_pct || 0),
      gna_pct: Number(value.gna_pct || 0),
      royalty_pct: Number(value.royalty_pct || 0),
      rd_remaining_pre_launch: Number(value.rd_remaining_pre_launch || 0),
      rd_annual_post_launch: Number(value.rd_annual_post_launch || 0),
      capex_remaining_pre_launch: Number(value.capex_remaining_pre_launch || 0),
      capex_annual_post_launch: Number(value.capex_annual_post_launch || 0),
      rd_capitalization_ratio: Number(value.rd_capitalization_ratio || 0),
      rd_amort_years: Number(value.rd_amort_years || 0),
      capex_dep_years: Number(value.capex_dep_years || 0),
    };
  }

  private getSelectedRow(): VaccineProductRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      products: this.rows.map(({ id, ...row }) => ({ ...row })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.products;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any, index: number) => ({
        id: `PROD-${String(index + 1).padStart(3, '0')}`,
        name: String(row?.name ?? ''),
        stage: String(row?.stage ?? ''),
        success_prob: Number(row?.success_prob ?? 0),
        include_in_consolidation: Boolean(row?.include_in_consolidation),
        time_to_market: Number(row?.time_to_market ?? 0),
        patent_years: Number(row?.patent_years ?? 0),
        preexisting_market: Boolean(row?.preexisting_market),
        patent_revenue_target: Number(row?.patent_revenue_target ?? 0),
        post_patent_revenue_target: Number(row?.post_patent_revenue_target ?? 0),
        market_growth_patent: Number(row?.market_growth_patent ?? 0),
        market_growth_post: Number(row?.market_growth_post ?? 0),
        cogs_patent: Number(row?.cogs_patent ?? 0),
        cogs_post: Number(row?.cogs_post ?? 0),
        sales_marketing_pct: Number(row?.sales_marketing_pct ?? 0),
        gna_pct: Number(row?.gna_pct ?? 0),
        royalty_pct: Number(row?.royalty_pct ?? 0),
        rd_remaining_pre_launch: Number(row?.rd_remaining_pre_launch ?? 0),
        rd_annual_post_launch: Number(row?.rd_annual_post_launch ?? 0),
        capex_remaining_pre_launch: Number(row?.capex_remaining_pre_launch ?? 0),
        capex_annual_post_launch: Number(row?.capex_annual_post_launch ?? 0),
        rd_capitalization_ratio: Number(row?.rd_capitalization_ratio ?? 0),
        rd_amort_years: Number(row?.rd_amort_years ?? 0),
        capex_dep_years: Number(row?.capex_dep_years ?? 0),
      }));
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.syncSelectedRow();
    }
  }

  private nextProductId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /PROD-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return `PROD-${String(maxId + 1).padStart(3, '0')}`;
  }
}
