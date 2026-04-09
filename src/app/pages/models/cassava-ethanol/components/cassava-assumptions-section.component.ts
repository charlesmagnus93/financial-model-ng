import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import {
  CassavaInputsPayload,
  CassavaModelService,
  CassavaProjectionPayload,
} from '../../../services/cassava-model.service';

type CassavaScenario = 'FARM_ONLY' | 'BUY_ONLY' | 'HYBRID';

interface KeyAssumptionField {
  parameter: string;
  label: string;
}

interface RowOption {
  index: number;
  label: string;
}

@Component({
  selector: 'app-cassava-assumptions-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, TableModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-4 items-end">
          <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Scenario</label>
            <select
              class="p-inputtext p-component w-full"
              [ngModel]="selectedScenario"
              (ngModelChange)="onScenarioChange($event)"
            >
              @for (scenario of scenarios; track scenario) {
                <option [value]="scenario">{{ scenario }}</option>
              }
            </select>
          </div>
          <div class="col-span-12 md:col-span-8 flex flex-wrap gap-2 md:justify-end">
            <p-button
              label="Load defaults"
              icon="pi pi-download"
              severity="secondary"
              [disabled]="isLoadingDefaults"
              (click)="reloadDefaults()"
            ></p-button>
            <p-button
              label="Apply scenario"
              icon="pi pi-check"
              severity="contrast"
              [disabled]="isLoadingDefaults"
              (click)="applyScenario()"
            ></p-button>
          </div>
        </div>

        @if (isLoadingDefaults) {
          <div class="text-xs text-surface-500">Loading defaults...</div>
        }
        @if (loadErrorMessage) {
          <div class="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {{ loadErrorMessage }}
          </div>
        }
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-2xl font-semibold">Projection Horizon</div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Projection start year</label>
            <input
              type="number"
              class="p-inputtext p-component w-full"
              [ngModel]="projection.start_year"
              (ngModelChange)="onProjectionNumberChange('start_year', $event)"
            />
          </div>
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Projection end year</label>
            <input
              type="number"
              class="p-inputtext p-component w-full"
              [ngModel]="projection.end_year"
              (ngModelChange)="onProjectionNumberChange('end_year', $event)"
            />
          </div>
          <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Planning start (YYYY-MM)</label>
            <input
              type="month"
              class="p-inputtext p-component w-full"
              [ngModel]="projection.planning_start"
              (ngModelChange)="onPlanningStartChange($event)"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2 justify-end">
            <label class="text-xs text-surface-500">Years</label>
            <div class="text-4xl font-semibold">{{ projectionYears }}</div>
          </div>
        </div>
      </div>

      <div class=" flex flex-col gap-4">
        <div class="text-2xl font-semibold">Assumptions Snapshot</div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Projection Horizon</div>
            <div class="text-4xl font-semibold">
              {{ projectionYears }} {{ projectionYears > 1 ? 'years' : 'year' }}
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Planning Start</div>
            <div class="text-4xl font-semibold">{{ planningStartDisplay }}</div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Initial Investment</div>
            <div class="text-4xl font-semibold">{{ formatCurrency(initialInvestmentTotal) }}</div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">First-Year Cassava</div>
            <div class="text-4xl font-semibold">{{ formatTon(firstYearCassavaTon) }}</div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Corporate tax rate</div>
            <div class="text-4xl font-semibold">
              {{ formatPercent(keyAssumptionValue('Corporate tax rate')) }}
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Investor share capital</div>
            <div class="text-4xl font-semibold">
              {{ formatPercent(keyAssumptionValue('Investor share capital')) }}
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Owner share capital</div>
            <div class="text-4xl font-semibold">
              {{ formatPercent(keyAssumptionValue('Owner share capital')) }}
            </div>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-xs text-surface-500">Discount rate</div>
            <div class="text-4xl font-semibold">
              {{ formatPercent(keyAssumptionValue('Discount rate')) }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-2xl font-semibold">Key Assumptions</div>
        <div class="text-xs text-surface-500">
          Quick controls for the most frequently adjusted global assumptions.
        </div>
        <div class="grid grid-cols-12 gap-4">
          @for (field of keyAssumptionFields; track field.parameter) {
            <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
              <label class="text-xs text-surface-500">{{ field.label }}</label>
              <input
                type="number"
                step="0.0001"
                min="0"
                class="p-inputtext p-component w-full"
                [ngModel]="keyAssumptionValue(field.parameter)"
                (ngModelChange)="onKeyAssumptionChange(field.parameter, $event)"
              />
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 xl:col-span-6">
          <div class=" flex flex-col gap-4 h-full">
            <div class="text-2xl font-semibold">Production Schedule</div>
            <div class="text-xs text-surface-500">
              Adjust cassava tonnage from the monthly production table.
            </div>

            @if (monthlyRowOptions.length) {
              <div class="flex flex-col gap-2">
                <label class="text-xs text-surface-500">Month to adjust</label>
                <p-select
                  [options]="monthlyRowOptions"
                  [ngModel]="selectedMonthlyRowIndex"
                  (ngModelChange)="onSelectedMonthlyRowChange($event)"
                  optionLabel="label"
                  optionValue="index"
                  class="w-full"
                ></p-select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs text-surface-500">Adjustment step (tons)</label>
                <input
                  type="number"
                  min="0"
                  class="p-inputtext p-component w-full"
                  [ngModel]="productionStepTon"
                  (ngModelChange)="onProductionStepChange($event)"
                />
              </div>

              <div class="flex flex-col gap-2">
                <div class="text-xs text-surface-500">Selected Cassava ton</div>
                <input
                  type="number"
                  min="0"
                  [step]="1"
                  class="p-inputtext p-component w-full"
                  [ngModel]="selectedCassavaTon"
                  (ngModelChange)="onSelectedCassavaTonChange($event)"
                />
              </div>
            } @else {
              <div class="text-xs text-surface-500">
                No data available in production_monthly.
              </div>
            }
          </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
          <div class=" flex flex-col gap-4 h-full">
            <div class="text-2xl font-semibold">Modify Default Inputs & Figures</div>
            <div class="text-xs text-surface-500">
              Choose a table and a row to edit one value quickly.
            </div>

            @if (tableKeys.length) {
              <div class="flex flex-col gap-2">
                <label class="text-xs text-surface-500">Select table</label>
                <select
                  class="p-inputtext p-component w-full"
                  [ngModel]="selectedTableKey"
                  (ngModelChange)="onSelectedTableChange($event)"
                >
                  @for (tableKey of tableKeys; track tableKey) {
                    <option [value]="tableKey">{{ tableDisplayName(tableKey) }}</option>
                  }
                </select>
              </div>

              @if (selectedTableRowOptions.length) {
                <div class="flex flex-col gap-2">
                  <label class="text-xs text-surface-500">Select row</label>
                  <select
                    class="p-inputtext p-component w-full"
                    [ngModel]="selectedRowIndex"
                    (ngModelChange)="onSelectedRowChange($event)"
                  >
                    @for (row of selectedTableRowOptions; track row.index) {
                      <option [ngValue]="row.index">{{ row.label }}</option>
                    }
                  </select>
                </div>

                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs text-surface-500">Parameter</label>
                    <input
                      type="text"
                      class="p-inputtext p-component w-full"
                      [value]="selectedRowLabel"
                      readonly
                    />
                  </div>
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs text-surface-500">Value</label>
                    <input
                      type="text"
                      class="p-inputtext p-component w-full"
                      [ngModel]="selectedRowValue"
                      (ngModelChange)="onSelectedRowValueChange($event)"
                    />
                  </div>
                  <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label class="text-xs text-surface-500">Units</label>
                    <input
                      type="text"
                      class="p-inputtext p-component w-full"
                      [value]="selectedRowUnits"
                      readonly
                    />
                  </div>
                </div>
              } @else {
                <div class="text-xs text-surface-500">The selected table has no rows.</div>
              }
            } @else {
              <div class="text-xs text-surface-500">No input tables are available.</div>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 xl:col-span-6">
          <div class=" flex flex-col gap-4 h-full">
            <div class="text-2xl font-semibold">Production Monthly</div>
            @if (productionMonthlyRows.length && productionMonthlyColumns.length) {
              <p-table
                showGridlines
                class="shadow-none"
                [size]="'small'"
                class="text-sm"
                responsiveLayout="scroll"
                [value]="productionMonthlyRows"
                [tableStyle]="{ 'min-width': '36rem' }"
                scrollHeight="200px"
                responsiveLayout="scroll"
              >
                <ng-template pTemplate="header">
                  <tr>
                    @for (column of productionMonthlyColumns; track column) {
                      <th>{{ displayColumnLabel('production_monthly', column) }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    @for (column of productionMonthlyColumns; track column) {
                      <td class="whitespace-nowrap">
                        {{ formatCellValue(row[column], column) }}
                      </td>
                    }
                  </tr>
                </ng-template>
              </p-table>
            } @else {
              <div class="text-xs text-surface-500">
                No data available in production_monthly.
              </div>
            }
          </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
          <div class=" flex flex-col gap-4 h-full">
            <div class="text-2xl font-semibold">Production Annual</div>
            @if (productionAnnualRows.length && productionAnnualColumns.length) {
              <p-table
                showGridlines
                class="shadow-none"
                [size]="'small'"
                class="text-sm"
                responsiveLayout="scroll"
                [value]="productionAnnualRows"
                [tableStyle]="{ 'min-width': '36rem' }"
                responsiveLayout="scroll"
              >
                <ng-template pTemplate="header">
                  <tr>
                    @for (column of productionAnnualColumns; track column) {
                      <th>{{ displayColumnLabel('production_annual', column) }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    @for (column of productionAnnualColumns; track column) {
                      <td class="whitespace-nowrap">
                        {{ formatCellValue(row[column], column) }}
                      </td>
                    }
                  </tr>
                </ng-template>
              </p-table>
            } @else {
              <div class="text-xs text-surface-500">
                No data available in production_annual.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CassavaAssumptionsSectionComponent implements OnInit, OnDestroy {
  readonly scenarios: CassavaScenario[] = ['FARM_ONLY', 'BUY_ONLY', 'HYBRID'];
  readonly keyAssumptionFields: KeyAssumptionField[] = [
    { parameter: 'Corporate tax rate', label: 'Corporate tax rate' },
    { parameter: 'Investor share capital', label: 'Investor share capital' },
    { parameter: 'Owner share capital', label: 'Owner share capital' },
    { parameter: 'Discount rate', label: 'Discount rate' },
  ];

  private readonly tableOrder = [
    'global_inputs',
    'initial_investment',
    'revenue_inputs',
    'production_annual',
    'production_monthly',
    'direct_costs_monthly',
    'staff_positions',
    'staff_costs_monthly',
    'other_opex_monthly',
    'accounts_receivable',
    'inventory_payable',
    'loan_schedule',
    'tax_schedule',
    'inflation_schedule',
    'risk_schedule',
  ];

  private readonly productionMonthlyPriority = [
    'Start Month',
    'start_month',
    'Month',
    'month',
    'Cassava ton',
    'cassava_ton',
    'Ethanol litres',
    'ethanol_litres',
    'Animal Feed ton',
    'animal_feed_ton',
    'Growth %',
    'growth_pct',
  ];

  private readonly productionAnnualPriority = [
    'Year',
    'year',
    'Start Month',
    'start_month',
    'Month',
    'month',
    'Cassava ton',
    'cassava_ton',
    'Ethanol litres',
    'ethanol_litres',
    'Animal Feed ton',
    'animal_feed_ton',
    'Growth %',
    'growth_pct',
  ];

  payload: CassavaInputsPayload = {};
  selectedScenario: CassavaScenario = 'FARM_ONLY';
  isLoadingDefaults = false;
  loadErrorMessage = '';

  selectedMonthlyRowIndex = 0;
  productionStepTon = 100;

  selectedTableKey = 'global_inputs';
  selectedRowIndex = 0;

  private inputSub?: Subscription;

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.inputSub = this.cassavaModelService.input$.subscribe((input) => {
      this.applySnapshot(input);
    });

    const snapshot = this.cassavaModelService.getInputSnapshot();
    if (this.hasPayloadData(snapshot)) {
      this.applySnapshot(snapshot);
      return;
    }
    this.reloadDefaults();
  }

  ngOnDestroy(): void {
    this.inputSub?.unsubscribe();
  }

  get projection(): CassavaProjectionPayload {
    this.ensureProjection();
    return this.payload.projection as CassavaProjectionPayload;
  }

  get projectionYears(): number {
    const start = Number(this.projection.start_year || 0);
    const end = Number(this.projection.end_year || 0);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return 0;
    }
    return Math.max(0, end - start + 1);
  }

  get planningStartDisplay(): string {
    return String(this.projection.planning_start || 'n/a');
  }

  get initialInvestmentTotal(): number {
    const rows = this.tableRows('initial_investment');
    return rows.reduce((sum, row) => sum + this.asNumber(row['Cost']), 0);
  }

  get firstYearCassavaTon(): number {
    const rows = this.tableRows('production_annual');
    if (!rows.length) {
      return 0;
    }
    return this.asNumber(rows[0]['Cassava ton']);
  }

  get monthlyRowOptions(): RowOption[] {
    const rows = this.productionMonthlyRows;
    const columns = this.tableColumns('production_monthly');
    const monthColumn = this.pickExistingColumn(
      columns,
      ['Start Month', 'start_month', 'Month', 'month'],
    );
    const fallbackColumn = columns[0] ?? null;

    return rows.map((row, index) => {
      const rawValue = monthColumn
        ? row[monthColumn]
        : fallbackColumn
          ? row[fallbackColumn]
          : null;
      const label = this.normalizeMonthLabel(rawValue, index);
      return { index, label };
    });
  }

  get selectedCassavaTon(): number {
    const rows = this.tableRows('production_monthly');
    if (!rows.length) {
      return 0;
    }
    const index = Math.min(Math.max(this.selectedMonthlyRowIndex, 0), rows.length - 1);
    return this.asNumber(rows[index]['Cassava ton']);
  }

  get productionMonthlyRows(): Array<Record<string, any>> {
    return this.tableRows('production_monthly');
  }

  get productionAnnualRows(): Array<Record<string, any>> {
    return this.tableRows('production_annual');
  }

  get productionMonthlyColumns(): string[] {
    return this.orderedColumns(
      this.tableColumns('production_monthly'),
      this.productionMonthlyPriority,
    );
  }

  get productionAnnualColumns(): string[] {
    return this.orderedColumns(
      this.tableColumns('production_annual'),
      this.productionAnnualPriority,
    );
  }

  get tableKeys(): string[] {
    const tables = this.payload.tables ?? {};
    const ordered = this.tableOrder.filter((key) => tables[key]);
    const extras = Object.keys(tables).filter((key) => !ordered.includes(key));
    return [...ordered, ...extras];
  }

  get selectedTableRows(): Array<Record<string, any>> {
    return this.tableRows(this.selectedTableKey);
  }

  get selectedTableColumns(): string[] {
    return this.tableColumns(this.selectedTableKey);
  }

  get selectedTableRowOptions(): RowOption[] {
    const rows = this.selectedTableRows;
    const parameterColumn = this.parameterColumnName(this.selectedTableColumns);
    return rows.map((row, index) => {
      const head = parameterColumn ? String(row[parameterColumn] ?? '').trim() : '';
      return {
        index,
        label: head ? `${index + 1}. ${head}` : `Row ${index + 1}`,
      };
    });
  }

  get selectedRowLabel(): string {
    const row = this.selectedRow();
    if (!row) {
      return '';
    }
    const parameterColumn = this.parameterColumnName(this.selectedTableColumns);
    if (!parameterColumn) {
      return '';
    }
    return String(row[parameterColumn] ?? '');
  }

  get selectedRowValue(): string {
    const row = this.selectedRow();
    if (!row) {
      return '';
    }
    const valueColumn = this.valueColumnName(this.selectedTableColumns);
    if (!valueColumn) {
      return '';
    }
    const value = row[valueColumn];
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  get selectedRowUnits(): string {
    const row = this.selectedRow();
    if (!row) {
      return '';
    }
    const unitsColumn = this.unitsColumnName(this.selectedTableColumns);
    if (!unitsColumn) {
      return '';
    }
    return String(row[unitsColumn] ?? '');
  }

  onScenarioChange(value: string): void {
    this.selectedScenario = this.normalizeScenario(value);
  }

  reloadDefaults(): void {
    if (this.isLoadingDefaults) {
      return;
    }
    this.isLoadingDefaults = true;
    this.loadErrorMessage = '';

    this.cassavaModelService.loadDefaultsForScenario(this.selectedScenario).subscribe({
      next: () => {
        this.isLoadingDefaults = false;
      },
      error: (error) => {
        this.loadErrorMessage =
          error?.error?.detail ||
          error?.message ||
          'Unable to load cassava defaults.';
        this.isLoadingDefaults = false;
      },
    });
  }

  applyScenario(): void {
    this.payload.scenario = this.selectedScenario;
    this.syncInput();
  }

  onProjectionNumberChange(
    field: 'start_year' | 'end_year',
    value: number | string,
  ): void {
    this.ensureProjection();
    if (!this.payload.projection) {
      return;
    }
    this.payload.projection[field] = this.asNumber(value, this.payload.projection[field]);
    this.syncInput();
  }

  onPlanningStartChange(value: string): void {
    this.ensureProjection();
    if (!this.payload.projection) {
      return;
    }
    this.payload.projection.planning_start = String(value || '');
    this.syncInput();
  }

  keyAssumptionValue(parameter: string): number {
    const rows = this.tableRows('global_inputs');
    const valueColumn = this.valueColumnName(this.tableColumns('global_inputs')) ?? 'Value';
    const parameterColumn =
      this.parameterColumnName(this.tableColumns('global_inputs')) ?? 'Parameter';
    const row = rows.find(
      (entry) => String(entry[parameterColumn] ?? '').trim() === parameter,
    );
    return this.asNumber(row?.[valueColumn]);
  }

  onKeyAssumptionChange(parameter: string, rawValue: number | string): void {
    const rows = this.deepClone(this.tableRows('global_inputs'));
    const columns = this.tableColumns('global_inputs');
    const parameterColumn = this.parameterColumnName(columns) ?? 'Parameter';
    const valueColumn = this.valueColumnName(columns) ?? 'Value';
    const unitsColumn = this.unitsColumnName(columns);
    const nextValue = this.asNumber(rawValue);

    const rowIndex = rows.findIndex(
      (row) => String(row[parameterColumn] ?? '').trim() === parameter,
    );

    if (rowIndex >= 0) {
      rows[rowIndex] = {
        ...rows[rowIndex],
        [valueColumn]: nextValue,
      };
    } else {
      const newRow: Record<string, any> = {};
      const safeColumns = columns.length ? columns : ['Parameter', 'Value', 'Units'];
      for (const column of safeColumns) {
        newRow[column] = '';
      }
      newRow[parameterColumn] = parameter;
      newRow[valueColumn] = nextValue;
      if (unitsColumn) {
        newRow[unitsColumn] = '%';
      }
      rows.push(newRow);
    }

    this.replaceTableRows('global_inputs', rows, true);
  }

  onSelectedMonthlyRowChange(value: number | string): void {
    this.selectedMonthlyRowIndex = Math.max(0, Math.trunc(this.asNumber(value)));
  }

  onProductionStepChange(value: number | string): void {
    this.productionStepTon = Math.max(0, this.asNumber(value, this.productionStepTon));
  }

  onSelectedCassavaTonChange(value: number | string): void {
    const monthlyRows = this.deepClone(this.tableRows('production_monthly'));
    if (!monthlyRows.length) {
      return;
    }
    const tonColumn = this.pickExistingColumn(
      this.tableColumns('production_monthly'),
      ['Cassava ton', 'cassava_ton', 'Cassava Ton'],
    );
    if (!tonColumn) {
      return;
    }

    const rowIndex = Math.min(
      Math.max(this.selectedMonthlyRowIndex, 0),
      monthlyRows.length - 1,
    );
    const current = this.asNumber(monthlyRows[rowIndex][tonColumn]);
    monthlyRows[rowIndex] = {
      ...monthlyRows[rowIndex],
      [tonColumn]: Math.max(0, this.asNumber(value, current)),
    };

    this.replaceTableRows('production_monthly', monthlyRows, false);
    this.syncAnnualCassavaTon(monthlyRows);
    this.syncInput();
  }

  adjustSelectedCassavaTon(direction: -1 | 1): void {
    const monthlyRows = this.deepClone(this.tableRows('production_monthly'));
    if (!monthlyRows.length) {
      return;
    }
    const tonColumn = this.pickExistingColumn(
      this.tableColumns('production_monthly'),
      ['Cassava ton', 'cassava_ton', 'Cassava Ton'],
    );
    if (!tonColumn) {
      return;
    }
    const rowIndex = Math.min(
      Math.max(this.selectedMonthlyRowIndex, 0),
      monthlyRows.length - 1,
    );
    const current = this.asNumber(monthlyRows[rowIndex][tonColumn]);
    const delta = this.productionStepTon * direction;
    monthlyRows[rowIndex] = {
      ...monthlyRows[rowIndex],
      [tonColumn]: Math.max(0, current + delta),
    };

    this.replaceTableRows('production_monthly', monthlyRows, false);
    this.syncAnnualCassavaTon(monthlyRows);
    this.syncInput();
  }

  onSelectedTableChange(tableKey: string): void {
    this.selectedTableKey = String(tableKey || '');
    this.selectedRowIndex = 0;
    this.normalizeSelections();
  }

  onSelectedRowChange(value: number | string): void {
    this.selectedRowIndex = Math.max(0, Math.trunc(this.asNumber(value)));
    this.normalizeSelections();
  }

  onSelectedRowValueChange(value: string): void {
    const rows = this.deepClone(this.selectedTableRows);
    if (!rows.length) {
      return;
    }
    const valueColumn = this.valueColumnName(this.selectedTableColumns);
    if (!valueColumn) {
      return;
    }
    const rowIndex = Math.min(Math.max(this.selectedRowIndex, 0), rows.length - 1);
    const current = rows[rowIndex][valueColumn];
    rows[rowIndex] = {
      ...rows[rowIndex],
      [valueColumn]: this.coerceValue(current, value),
    };
    this.replaceTableRows(this.selectedTableKey, rows, true);
  }

  tableDisplayName(tableKey: string): string {
    const table = this.payload.tables?.[tableKey];
    if (table?.name) {
      return table.name;
    }
    return this.formatTableName(tableKey);
  }

  displayColumnLabel(tableKey: string, column: string): string {
    if (
      (tableKey === 'production_monthly' || tableKey === 'production_annual') &&
      column === 'Month'
    ) {
      return 'Start Month';
    }
    return this.humanizeLabel(column);
  }

  formatCellValue(value: unknown, column: string): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    const numeric =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
          ? Number(value)
          : null;
    if (numeric === null) {
      return String(value);
    }

    const isPercentLike = column.includes('%') || /growth/i.test(column);
    if (isPercentLike) {
      return numeric.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return numeric.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
    });
  }

  formatPercent(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return `${(safe * 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  }

  formatCurrency(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return safe.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }

  formatTon(value: number): string {
    return `${this.formatNumber(value)} ton`;
  }

  formatNumber(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return safe.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  private applySnapshot(snapshot: CassavaInputsPayload | null | undefined): void {
    this.payload = this.deepClone(snapshot ?? {});
    if (!this.payload.tables) {
      this.payload.tables = {};
    }
    this.ensureProjection();
    this.selectedScenario = this.normalizeScenario(this.payload.scenario);
    this.normalizeSelections();
  }

  private tableRows(tableKey: string): Array<Record<string, any>> {
    return this.payload.tables?.[tableKey]?.rows ?? [];
  }

  private tableColumns(tableKey: string): string[] {
    const table = this.payload.tables?.[tableKey];
    if (table?.columns?.length) {
      return table.columns;
    }
    const rows = table?.rows ?? [];
    if (!rows.length) {
      return [];
    }
    return Object.keys(rows[0]);
  }

  private selectedRow(): Record<string, any> | null {
    const rows = this.selectedTableRows;
    if (!rows.length) {
      return null;
    }
    const rowIndex = Math.min(Math.max(this.selectedRowIndex, 0), rows.length - 1);
    return rows[rowIndex] ?? null;
  }

  private valueColumnName(columns: string[]): string | null {
    if (!columns.length) {
      return null;
    }
    if (columns.includes('Value')) {
      return 'Value';
    }
    return columns.length > 1 ? columns[1] : columns[0];
  }

  private unitsColumnName(columns: string[]): string | null {
    if (columns.includes('Units')) {
      return 'Units';
    }
    return null;
  }

  private parameterColumnName(columns: string[]): string | null {
    if (!columns.length) {
      return null;
    }
    if (columns.includes('Parameter')) {
      return 'Parameter';
    }
    return columns[0];
  }

  private pickExistingColumn(columns: string[], candidates: string[]): string | null {
    for (const candidate of candidates) {
      if (columns.includes(candidate)) {
        return candidate;
      }
    }
    return null;
  }

  private normalizeMonthLabel(value: unknown, index: number): string {
    const raw = String(value ?? '').trim();
    if (!raw) {
      return `Row ${index + 1}`;
    }
    const match = raw.match(/^(\d{4})-(\d{1,2})$/);
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    }
    return raw;
  }

  private orderedColumns(columns: string[], priority: string[]): string[] {
    const ordered: string[] = [];
    for (const candidate of priority) {
      if (columns.includes(candidate) && !ordered.includes(candidate)) {
        ordered.push(candidate);
      }
    }
    for (const column of columns) {
      if (!ordered.includes(column)) {
        ordered.push(column);
      }
    }
    return ordered;
  }

  private syncAnnualCassavaTon(monthlyRows: Array<Record<string, any>>): void {
    const annualRows = this.deepClone(this.tableRows('production_annual'));
    if (!annualRows.length) {
      return;
    }

    const monthColumn = this.pickExistingColumn(
      this.tableColumns('production_monthly'),
      ['Start Month', 'start_month', 'Month', 'month'],
    );
    const monthlyTonColumn = this.pickExistingColumn(
      this.tableColumns('production_monthly'),
      ['Cassava ton', 'cassava_ton', 'Cassava Ton'],
    );
    const annualYearColumn = this.pickExistingColumn(
      this.tableColumns('production_annual'),
      ['Year', 'year'],
    );
    const annualTonColumn = this.pickExistingColumn(
      this.tableColumns('production_annual'),
      ['Cassava ton', 'cassava_ton', 'Cassava Ton'],
    );

    if (!monthColumn || !monthlyTonColumn || !annualYearColumn || !annualTonColumn) {
      return;
    }

    const totalsByYear = new Map<string, number>();
    for (const row of monthlyRows) {
      const monthText = String(row[monthColumn] ?? '');
      const yearKey = monthText.slice(0, 4);
      if (!/^\d{4}$/.test(yearKey)) {
        continue;
      }
      const running = totalsByYear.get(yearKey) ?? 0;
      totalsByYear.set(yearKey, running + this.asNumber(row[monthlyTonColumn]));
    }

    const updatedAnnualRows = annualRows.map((row) => {
      const yearText = String(row[annualYearColumn] ?? '');
      const yearKey = yearText.slice(0, 4);
      const value = totalsByYear.get(yearKey);
      if (value === undefined) {
        return row;
      }
      return {
        ...row,
        [annualTonColumn]: value,
      };
    });

    this.replaceTableRows('production_annual', updatedAnnualRows, false);
  }

  private replaceTableRows(
    tableKey: string,
    rows: Array<Record<string, any>>,
    sync: boolean,
  ): void {
    if (!this.payload.tables) {
      this.payload.tables = {};
    }
    const tables = { ...this.payload.tables };
    const current = tables[tableKey];
    const columns = current?.columns?.length
      ? [...current.columns]
      : this.inferColumns(rows);

    tables[tableKey] = {
      ...(current ?? {}),
      name: current?.name || this.formatTableName(tableKey),
      columns,
      rows: this.deepClone(rows),
      placeholder: false,
    };

    this.payload.tables = tables;
    this.normalizeSelections();
    if (sync) {
      this.syncInput();
    }
  }

  private inferColumns(rows: Array<Record<string, any>>): string[] {
    const keys = new Set<string>();
    for (const row of rows) {
      Object.keys(row ?? {}).forEach((key) => keys.add(key));
    }
    return Array.from(keys);
  }

  private normalizeSelections(): void {
    const allTables = this.tableKeys;
    if (!allTables.length) {
      this.selectedTableKey = '';
      this.selectedRowIndex = 0;
    } else {
      if (!allTables.includes(this.selectedTableKey)) {
        this.selectedTableKey = allTables[0];
      }
      const rows = this.selectedTableRows;
      if (!rows.length) {
        this.selectedRowIndex = 0;
      } else if (this.selectedRowIndex >= rows.length || this.selectedRowIndex < 0) {
        this.selectedRowIndex = 0;
      }
    }

    const monthRows = this.tableRows('production_monthly');
    if (!monthRows.length) {
      this.selectedMonthlyRowIndex = 0;
    } else if (
      this.selectedMonthlyRowIndex >= monthRows.length ||
      this.selectedMonthlyRowIndex < 0
    ) {
      this.selectedMonthlyRowIndex = 0;
    }
  }

  private syncInput(): void {
    this.ensureProjection();
    if (!this.payload.tables) {
      this.payload.tables = {};
    }
    this.payload.scenario = this.selectedScenario;
    this.cassavaModelService.setInput(this.deepClone(this.payload));
  }

  private ensureProjection(): void {
    if (!this.payload.projection) {
      this.payload.projection = {
        start_year: 2024,
        end_year: 2034,
        planning_start: '2025-01',
      };
      return;
    }

    this.payload.projection.start_year = this.asNumber(
      this.payload.projection.start_year,
      2024,
    );
    this.payload.projection.end_year = this.asNumber(
      this.payload.projection.end_year,
      2034,
    );
    this.payload.projection.planning_start = String(
      this.payload.projection.planning_start ?? '2025-01',
    );
  }

  private formatTableName(tableKey: string): string {
    return tableKey
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private humanizeLabel(value: string): string {
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private hasPayloadData(payload: CassavaInputsPayload | null | undefined): boolean {
    if (!payload) {
      return false;
    }
    const tables = payload.tables;
    return !!tables && Object.keys(tables).length > 0;
  }

  private normalizeScenario(value: string | null | undefined): CassavaScenario {
    const scenario = String(value || 'FARM_ONLY')
      .trim()
      .toUpperCase();
    if (scenario === 'BUY_ONLY' || scenario === 'HYBRID') {
      return scenario;
    }
    return 'FARM_ONLY';
  }

  private coerceValue(current: any, raw: string): any {
    if (typeof current === 'number') {
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : current;
    }
    return raw;
  }

  private asNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
