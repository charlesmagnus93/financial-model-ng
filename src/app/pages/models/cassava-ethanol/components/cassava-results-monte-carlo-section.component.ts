import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import {
  CassavaModelService,
  CassavaMonteCarloDefaultsPayload,
  CassavaMonteCarloRunResultPayload,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cassava-results-monte-carlo-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TableModule,
    DividerModule,
  ],
  template: `
    <div class="flex flex-col gap-6">
      @if (successMessage) {
        <div class="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ errorMessage }}
        </div>
      }

      <h3 class="text-3xl font-semibold">Monte Carlo</h3>

      <div>
        <p-button
          label="Load Monte Carlo Defaults"
          [outlined]="true"
          [loading]="isLoadingDefaults"
          [disabled]="isLoadingDefaults"
          (onClick)="loadDefaults(true)"
        ></p-button>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Iterations</label>
          <p-inputnumber
            [showButtons]="true"
            [min]="1"
            [max]="20000"
            [useGrouping]="false"
            [ngModel]="iterations"
            (ngModelChange)="onIterationsChange($event)"
            inputStyleClass="w-full"
          ></p-inputnumber>
        </div>
  
        <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Random seed</label>
          <p-inputnumber
            [showButtons]="true"
            [min]="0"
            [useGrouping]="false"
            [ngModel]="randomSeed"
            (ngModelChange)="onRandomSeedChange($event)"
            inputStyleClass="w-full"
          ></p-inputnumber>
        </div>
      </div>

      <p-divider />

      @if (parameterColumns.length) {
        <form class="grid grid-cols-12 gap-4" (ngSubmit)="saveParameterRow()">
          @for (column of parameterColumns; track column) {
            <div class="flex flex-col gap-2"
              [class]="parameterColumnClass()"
            >
              <label class="text-xs text-surface-500">{{ column }}</label>
              @if (isDistributionColumn(column)) {
                <p-select
                  class="w-full"
                  [options]="distributionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="formValue(column)"
                  (ngModelChange)="onFormValueChange(column, $event)"
                  [name]="controlName(column)"
                ></p-select>
              } @else if (isNumericConfigColumn(column)) {
                <p-inputnumber
                  [showButtons]="true"
                  [useGrouping]="false"
                  [maxFractionDigits]="6"
                  [ngModel]="formNumberValue(column)"
                  (ngModelChange)="onFormValueChange(column, $event)"
                  [name]="controlName(column)"
                  inputStyleClass="w-full"
                ></p-inputnumber>
              } @else {
                <input
                  pInputText
                  class="w-full"
                  [ngModel]="formValue(column)"
                  (ngModelChange)="onFormValueChange(column, $event)"
                  [name]="controlName(column)"
                />
              }
            </div>
          }

          <div class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-12]="!isEditingParameter"
            [class.lg:col-span-6]="isEditingParameter"
          >
            <p-button
              fluid
              type="submit"
              severity="success"
              variant="outlined"
              [label]="isEditingParameter ? 'Edit' : 'Add'"
              [icon]="isEditingParameter ? 'pi pi-check' : 'pi pi-plus'"
              class="w-full"
              [disabled]="isRunning || isLoadingDefaults"
            ></p-button>
          </div>

          @if (isEditingParameter) {
            <div class="col-span-12 flex flex-col gap-2"
              [class.lg:col-span-6]="isEditingParameter"
            >
              <p-button
                fluid
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                [disabled]="isRunning || isLoadingDefaults"
                (onClick)="cancelParameterEdit()"
              ></p-button>
            </div>
          }
        </form>

        @if (formErrorMessage) {
          <div class="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {{ formErrorMessage }}
          </div>
        }

        <p-table
          [value]="parameterRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="320px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '92rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of parameterColumns; track column) {
                <th>{{ column }}</th>
              }
              <th class="w-28 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
            <tr>
              @for (column of parameterColumns; track column) {
                <td class="min-w-40 whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
              <td class="text-right">
                <div class="flex justify-end gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    severity="secondary"
                    size="small"
                    [text]="true"
                    [disabled]="isRunning || isLoadingDefaults"
                    (onClick)="onEditParameterRow(row, rowIndex)"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    [text]="true"
                    [disabled]="isRunning || isLoadingDefaults"
                    (onClick)="removeParameterRow(rowIndex)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="parameterColumns.length + 1" class="text-center text-sm text-surface-500">
                Monte Carlo Parameter Configuration is empty.
              </td>
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-blue-500/30 bg-blue-500/10 px-3 py-3 text-sm text-blue-300">
          {{
            isLoadingDefaults
              ? 'Loading Monte Carlo Defaults...'
              : 'Monte Carlo Parameter Configuration is empty.'
          }}
        </div>
      }

      <div>
        <p-button
          label="Run Monte Carlo"
          [outlined]="true"
          [loading]="isRunning"
          [disabled]="isRunning || !parameterRows.length"
          (onClick)="runMonteCarlo()"
        ></p-button>
      </div>

      <h3 class="text-3xl font-semibold">Monte Carlo Summary</h3>
      @if (summaryRows.length && summaryColumns.length) {
        <p-table
          [value]="summaryRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="240px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '46rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of summaryColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of summaryColumns; track column) {
                <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-blue-500/30 bg-blue-300 px-3 py-3 text-sm text-blue-600">
          {{
            isRunning
              ? 'Running Monte Carlo simulation...'
              : 'Monte Carlo Summary is empty.'
          }}
        </div>
      }

      <h3 class="text-3xl font-semibold">Monte Carlo Results</h3>
      @if (resultRows.length && resultColumns.length) {
        <p-table
          [value]="resultRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '64rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of resultColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of resultColumns; track column) {
                <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-blue-500/30 bg-blue-300 px-3 py-3 text-sm text-blue-600">
          {{
            isRunning
              ? 'Running Monte Carlo simulation...'
              : 'Monte Carlo Results is empty.'
          }}
        </div>
      }
    </div>
  `,
})
export class CassavaResultsMonteCarloSectionComponent implements OnInit {
  private readonly textConfigColumns = ['parameter', 'distribution', 'pvals'];

  successMessage = '';
  errorMessage = '';

  defaultsLoaded = false;
  isLoadingDefaults = false;
  isRunning = false;

  iterations = 250;
  randomSeed = 42;

  distributionOptions: SelectOption[] = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Lognormal', value: 'Lognormal' },
    { label: 'Uniform', value: 'Uniform' },
  ];

  parameterColumns: string[] = [];
  parameterRows: Array<Record<string, unknown>> = [];
  parameterFormValues: Record<string, unknown> = {};
  editingRowIndex: number | null = null;
  formErrorMessage = '';

  summaryColumns: string[] = [];
  summaryRows: Array<Record<string, unknown>> = [];

  resultColumns: string[] = [];
  resultRows: Array<Record<string, unknown>> = [];

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.loadDefaults(false);
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  isDistributionColumn(column: string): boolean {
    return String(column).trim().toLowerCase() === 'distribution';
  }

  isNumericConfigColumn(column: string): boolean {
    const normalized = String(column).trim().toLowerCase();
    return !this.textConfigColumns.includes(normalized);
  }

  get isEditingParameter(): boolean {
    return this.editingRowIndex !== null;
  }

  parameterColumnClass(): string {
    const count = this.parameterColumns.length;
    if (count <= 4) {
      return 'col-span-12 md:col-span-3';
    }
    if (count <= 6) {
      return 'col-span-12 md:col-span-2';
    }
    return 'col-span-12 md:col-span-3 lg:col-span-2';
  }

  controlName(column: string): string {
    return `mc_${String(column)
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase()}`;
  }

  formValue(column: string): string {
    const raw = this.parameterFormValues[column];
    return raw === null || raw === undefined ? '' : String(raw);
  }

  formNumberValue(column: string): number | null {
    return this.toFiniteNumber(this.parameterFormValues[column]);
  }

  onFormValueChange(column: string, value: unknown): void {
    this.parameterFormValues[column] = this.coerceFormValue(column, value);
  }

  saveParameterRow(): void {
    if (!this.parameterColumns.length) {
      return;
    }

    const parameterColumn = this.parameterColumnName(this.parameterColumns);
    const parameterValue = String(this.parameterFormValues[parameterColumn] ?? '').trim();
    if (!parameterValue) {
      this.formErrorMessage = `${parameterColumn} is required.`;
      return;
    }

    this.formErrorMessage = '';
    const rows = this.deepClone(this.parameterRows);
    const candidateIndex =
      this.editingRowIndex !== null &&
      this.editingRowIndex >= 0 &&
      this.editingRowIndex < rows.length
        ? this.editingRowIndex
        : rows.findIndex(
            (row) =>
              String(row[parameterColumn] ?? '')
                .trim()
                .toLowerCase() === parameterValue.toLowerCase(),
          );

    const nextRow: Record<string, unknown> = {};
    for (const column of this.parameterColumns) {
      nextRow[column] = this.coerceFormValue(column, this.parameterFormValues[column]);
    }

    const distributionColumn = this.distributionColumnName(this.parameterColumns);
    if (!String(nextRow[distributionColumn] ?? '').trim()) {
      nextRow[distributionColumn] = this.distributionOptions[0]?.value ?? 'Normal';
    }

    if (candidateIndex >= 0) {
      rows[candidateIndex] = nextRow;
    } else {
      rows.push(nextRow);
    }

    this.parameterRows = rows;
    this.resetParameterForm();
  }

  onEditParameterRow(row: Record<string, unknown>, index: number): void {
    this.editingRowIndex = index;
    for (const column of this.parameterColumns) {
      this.parameterFormValues[column] = this.coerceFormValue(column, row[column]);
    }
    this.formErrorMessage = '';
  }

  removeParameterRow(index: number): void {
    if (index < 0 || index >= this.parameterRows.length) {
      return;
    }
    const rows = this.deepClone(this.parameterRows);
    rows.splice(index, 1);
    this.parameterRows = rows;

    if (this.editingRowIndex === index) {
      this.resetParameterForm();
      return;
    }
    if (this.editingRowIndex !== null && this.editingRowIndex > index) {
      this.editingRowIndex -= 1;
    }
  }

  cancelParameterEdit(): void {
    this.resetParameterForm();
  }

  onIterationsChange(value: number | null | undefined): void {
    this.iterations = this.clampInteger(value, 1, 20000, 250);
  }

  onRandomSeedChange(value: number | null | undefined): void {
    this.randomSeed = this.clampInteger(value, 0, 999999999, 42);
  }

  loadDefaults(forceReload: boolean): void {
    if (this.isLoadingDefaults) {
      return;
    }
    if (this.defaultsLoaded && !forceReload) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isLoadingDefaults = true;

    this.cassavaModelService
      .getMonteCarloDefaults()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingDefaults = false;
        }),
      )
      .subscribe({
        next: (defaults) => {
          this.applyDefaults(defaults);
          this.setSuccess('Monte Carlo defaults loaded.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Unable to load Monte Carlo defaults.'),
          );
        },
      });
  }

  runMonteCarlo(): void {
    if (this.isRunning) {
      return;
    }
    if (!this.parameterRows.length || !this.parameterColumns.length) {
      this.setError('No Monte Carlo parameter configuration is available.');
      return;
    }

    const parameterConfigs = this.buildParameterConfigs();
    if (!parameterConfigs.length) {
      this.setError('Add at least one valid parameter row before running Monte Carlo.');
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isRunning = true;

    this.cassavaModelService
      .runMonteCarlo({
        iterations: this.iterations,
        randomSeed: this.randomSeed,
        parameterConfigs,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunning = false;
        }),
      )
      .subscribe({
        next: (result) => {
          this.applyRunResult(result);
          this.setSuccess('Monte Carlo simulation completed.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Monte Carlo simulation failed.'),
          );
        },
      });
  }

  private applyDefaults(defaults: CassavaMonteCarloDefaultsPayload): void {
    this.defaultsLoaded = true;

    this.iterations = this.clampInteger(defaults?.iterations, 1, 20000, 250);
    this.randomSeed = this.clampInteger(defaults?.seed, 0, 999999999, 42);

    const distributions = Array.isArray(defaults?.distributions)
      ? defaults.distributions.filter((value) => typeof value === 'string' && value.trim())
      : [];
    if (distributions.length) {
      this.distributionOptions = distributions.map((distribution) => ({
        label: distribution,
        value: distribution,
      }));
    }

    const parameterTable = resolveCassavaTable(
      defaults?.parameter_configs as CassavaTablePayload | undefined,
      'Row',
    );
    const filteredColumns = parameterTable.columns.filter(
      (column) => !this.isIndexColumn(column),
    );

    this.parameterColumns = filteredColumns.length
      ? filteredColumns
      : parameterTable.columns;
    const distributionColumn = this.distributionColumnName(this.parameterColumns);
    this.parameterRows = parameterTable.rows.map((sourceRow) => {
      const nextRow: Record<string, unknown> = {};
      for (const column of this.parameterColumns) {
        const value = sourceRow[column];
        nextRow[column] = this.coerceFormValue(column, value);
      }
      if (!String(nextRow[distributionColumn] ?? '').trim()) {
        nextRow[distributionColumn] = this.distributionOptions[0]?.value ?? 'Normal';
      }
      return nextRow;
    });
    this.resetParameterForm();
  }

  private applyRunResult(result: CassavaMonteCarloRunResultPayload): void {
    const summary = resolveCassavaTable(
      result?.summary as CassavaTablePayload | undefined,
      'Row',
    );
    this.summaryColumns = summary.columns;
    this.summaryRows = summary.rows;

    const rows = resolveCassavaTable(
      result?.results as CassavaTablePayload | undefined,
      'Simulation',
    );
    this.resultColumns = rows.columns;
    this.resultRows = rows.rows;
  }

  private buildParameterConfigs(): Array<Record<string, any>> {
    const parameterColumn = this.parameterColumnName(this.parameterColumns);
    const distributionColumn = this.distributionColumnName(this.parameterColumns);

    const configs = this.parameterRows
      .map((row) => {
        const next: Record<string, any> = {};
        for (const column of this.parameterColumns) {
          const raw = row[column];
          if (this.isNumericConfigColumn(column)) {
            const numeric = this.toFiniteNumber(raw);
            if (numeric !== null) {
              next[column] = numeric;
            }
          } else {
            const text = raw === null || raw === undefined ? '' : String(raw).trim();
            if (text) {
              next[column] = text;
            }
          }
        }

        const parameter = String(next[parameterColumn] ?? '').trim();
        if (!parameter) {
          return null;
        }

        if (!String(next[distributionColumn] ?? '').trim()) {
          next[distributionColumn] = this.distributionOptions[0]?.value ?? 'Normal';
        }

        return next;
      })
      .filter((row): row is Record<string, any> => !!row);

    return configs;
  }

  private coerceFormValue(column: string, value: unknown): unknown {
    if (this.isNumericConfigColumn(column)) {
      return this.toFiniteNumber(value);
    }

    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private parameterColumnName(columns: string[]): string {
    return this.pickExistingColumn(columns, ['Parameter', 'parameter']) ?? columns[0] ?? 'Parameter';
  }

  private distributionColumnName(columns: string[]): string {
    return this.pickExistingColumn(columns, ['Distribution', 'distribution']) ?? 'Distribution';
  }

  private pickExistingColumn(columns: string[], candidates: string[]): string | null {
    for (const candidate of candidates) {
      const found = columns.find(
        (column) => column.toLowerCase() === candidate.toLowerCase(),
      );
      if (found) {
        return found;
      }
    }
    return null;
  }

  private resetParameterForm(): void {
    this.editingRowIndex = null;
    this.formErrorMessage = '';

    const next: Record<string, unknown> = {};
    const distributionColumn = this.distributionColumnName(this.parameterColumns);
    for (const column of this.parameterColumns) {
      if (column === distributionColumn) {
        next[column] = this.distributionOptions[0]?.value ?? 'Normal';
        continue;
      }
      next[column] = this.isNumericConfigColumn(column) ? null : '';
    }
    this.parameterFormValues = next;
  }

  private toFiniteNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'string' && !value.trim()) {
      return null;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return numeric;
  }

  private isIndexColumn(column: string): boolean {
    const normalized = String(column).trim().toLowerCase();
    return normalized === 'row' || normalized === 'index';
  }

  private clampInteger(
    value: number | null | undefined,
    min: number,
    max: number,
    fallback: number,
  ): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.trunc(numeric)));
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const maybeError = error as { message?: string; error?: unknown };
      if (maybeError.error && typeof maybeError.error === 'object') {
        const body = maybeError.error as { detail?: string; message?: string };
        if (typeof body.detail === 'string' && body.detail.trim()) {
          return body.detail;
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return body.message;
        }
      }
      if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
        return maybeError.error;
      }
      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
    }
    return fallback;
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
