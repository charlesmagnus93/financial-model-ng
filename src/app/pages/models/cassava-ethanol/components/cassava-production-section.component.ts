import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  CassavaInputsPayload,
  CassavaLandingTablePayload,
  CassavaModelService,
} from '../../../services/cassava-model.service';

@Component({
  selector: 'app-cassava-production-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, TableModule, InputTextModule, ButtonModule],
  template: `
    <div class="flex flex-col gap-4">
      <p-fieldset legend="Production Annual" [toggleable]="true" class="w-full">
        <form class="grid grid-cols-12 gap-4 mb-4" (ngSubmit)="saveAnnualRow()">
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Year</label>
            <input pInputText class="w-full" [(ngModel)]="annualYearValue" name="annualYear" />
          </div>
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Start Month</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="annualStartMonthValue"
              name="annualStartMonth"
              placeholder="YYYY-MM"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Cassava ton</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="annualCassavaTonValue"
              name="annualCassavaTon"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Ethanol litres</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="annualEthanolLitresValue"
              name="annualEthanolLitres"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Animal Feed ton</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="annualAnimalFeedTonValue"
              name="annualAnimalFeedTon"
            />
          </div>
          <div class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-12]="annualEditingRowIndex == null"
            [class.lg:col-span-6]="annualEditingRowIndex !== null"
          >
            <p-button
              fluid
              type="submit"
              severity="success"
              variant="outlined"
              [label]="annualEditingRowIndex !== null ? 'Edit' : 'Add'"
              [icon]="annualEditingRowIndex !== null ? 'pi pi-check' : 'pi pi-plus'"
              class="w-full"
            ></p-button>
          </div>
          @if (annualEditingRowIndex !== null) {
            <div class="col-span-12 flex flex-col gap-2"
              [class.lg:col-span-6]="annualEditingRowIndex !== null"
            >
              <p-button
                fluid
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                (onClick)="cancelAnnualEdit()"
              ></p-button>
            </div>
          }
        </form>


        @if (annualFormErrorMessage) {
          <div class="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {{ annualFormErrorMessage }}
          </div>
        }

        @if (productionAnnualRows.length && productionAnnualColumns.length) {
          <p-table
            [value]="productionAnnualRows"
            [scrollable]="true"
            scrollHeight="260px"
            responsiveLayout="scroll"
            [tableStyle]="{ 'min-width': '70rem' }"
            showGridlines
            class="shadow-none text-sm"
            [size]="'small'"
          >
            <ng-template pTemplate="header">
              <tr>
                @for (column of productionAnnualColumns; track column) {
                  <th>{{ displayColumnLabel('production_annual', column) }}</th>
                }
                <th class="w-28 text-right">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
              <tr>
                @for (column of productionAnnualColumns; track column) {
                  <td class="whitespace-nowrap" [class.text-right]="isNumericColumn(column)">
                    {{ formatCellValue(row[column], column) }}
                  </td>
                }
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <p-button
                      icon="pi pi-pencil"
                      severity="secondary"
                      size="small"
                      [text]="true"
                      (onClick)="onEditAnnualRow(row, rowIndex)"
                    ></p-button>
                    <p-button
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      [text]="true"
                      (onClick)="removeAnnualRow(rowIndex)"
                    ></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <div class="text-sm text-surface-500">No data available in production_annual.</div>
        }
      </p-fieldset>

      <p-fieldset legend="Production Monthly" [toggleable]="true" class="w-full">
        <form class="grid grid-cols-12 gap-4 mb-4" (ngSubmit)="saveMonthlyRow()">
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Start Month</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="monthlyStartMonthValue"
              name="monthlyStartMonth"
              placeholder="YYYY-MM"
            />
          </div>
          <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Cassava ton</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="monthlyCassavaTonValue"
              name="monthlyCassavaTon"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Ethanol litres</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="monthlyEthanolLitresValue"
              name="monthlyEthanolLitres"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Animal Feed ton</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="monthlyAnimalFeedTonValue"
              name="monthlyAnimalFeedTon"
            />
          </div>
          <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Growth %</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="monthlyGrowthPctValue"
              name="monthlyGrowthPct"
            />
          </div>
          <div class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-12]="monthlyEditingRowIndex == null"
            [class.lg:col-span-6]="monthlyEditingRowIndex !== null"
          >
            <p-button
              fluid
              type="submit"
              severity="success"
              variant="outlined"
              [label]="monthlyEditingRowIndex !== null ? 'Edit' : 'Add'"
              [icon]="monthlyEditingRowIndex !== null ? 'pi pi-check' : 'pi pi-plus'"
              class="w-full"
            ></p-button>
          </div>
          @if (monthlyEditingRowIndex !== null) {
            <div class="col-span-12 flex flex-col gap-2"
              [class.lg:col-span-6]="monthlyEditingRowIndex !== null"
            >
              <p-button
                fluid
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                (onClick)="cancelMonthlyEdit()"
              ></p-button>
            </div>
          }
        </form>


        @if (monthlyFormErrorMessage) {
          <div class="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {{ monthlyFormErrorMessage }}
          </div>
        }

        @if (productionMonthlyRows.length && productionMonthlyColumns.length) {
          <p-table
            [value]="productionMonthlyRows"
            [scrollable]="true"
            scrollHeight="420px"
            responsiveLayout="scroll"
            [tableStyle]="{ 'min-width': '70rem' }"
            showGridlines
            class="shadow-none text-sm"
            [size]="'small'"
          >
            <ng-template pTemplate="header">
              <tr>
                @for (column of productionMonthlyColumns; track column) {
                  <th>{{ displayColumnLabel('production_monthly', column) }}</th>
                }
                <th class="w-28 text-right">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
              <tr>
                @for (column of productionMonthlyColumns; track column) {
                  <td class="whitespace-nowrap" [class.text-right]="isNumericColumn(column)">
                    {{ formatCellValue(row[column], column) }}
                  </td>
                }
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <p-button
                      icon="pi pi-pencil"
                      severity="secondary"
                      size="small"
                      [text]="true"
                      (onClick)="onEditMonthlyRow(row, rowIndex)"
                    ></p-button>
                    <p-button
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      [text]="true"
                      (onClick)="removeMonthlyRow(rowIndex)"
                    ></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <div class="text-sm text-surface-500">No data available in production_monthly.</div>
        }
      </p-fieldset>
    </div>
  `,
})
export class CassavaProductionSectionComponent implements OnInit, OnDestroy {
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
  private inputSub?: Subscription;

  annualYearValue = '';
  annualStartMonthValue = '';
  annualCassavaTonValue = '';
  annualEthanolLitresValue = '';
  annualAnimalFeedTonValue = '';
  annualEditingRowIndex: number | null = null;
  annualFormErrorMessage = '';

  monthlyStartMonthValue = '';
  monthlyCassavaTonValue = '';
  monthlyEthanolLitresValue = '';
  monthlyAnimalFeedTonValue = '';
  monthlyGrowthPctValue = '';
  monthlyEditingRowIndex: number | null = null;
  monthlyFormErrorMessage = '';

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.inputSub = this.cassavaModelService.input$.subscribe((input) => {
      this.applySnapshot(input);
    });
    this.applySnapshot(this.cassavaModelService.getInputSnapshot());
  }

  ngOnDestroy(): void {
    this.inputSub?.unsubscribe();
  }

  get productionMonthlyRows(): Array<Record<string, unknown>> {
    return this.tableRows('production_monthly');
  }

  get productionAnnualRows(): Array<Record<string, unknown>> {
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

  displayColumnLabel(tableKey: string, column: string): string {
    if (
      (tableKey === 'production_monthly' || tableKey === 'production_annual') &&
      (column === 'Month' || column === 'month')
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

  isNumericColumn(column: string): boolean {
    return /year|ton|litres|growth|%/i.test(column) && !/month/i.test(column);
  }

  saveAnnualRow(): void {
    const year = this.annualYearValue.trim();
    if (!year) {
      this.annualFormErrorMessage = 'Year is required.';
      return;
    }
    this.annualFormErrorMessage = '';

    const columns = this.ensureAnnualColumns(this.productionAnnualColumns);
    const yearColumn = this.pickExistingColumn(columns, ['Year', 'year']) ?? 'Year';
    const startMonthColumn =
      this.pickExistingColumn(columns, ['Start Month', 'start_month', 'Month', 'month']) ??
      'Start Month';
    const cassavaColumn =
      this.pickExistingColumn(columns, ['Cassava ton', 'cassava_ton', 'Cassava Ton']) ??
      'Cassava ton';
    const ethanolColumn =
      this.pickExistingColumn(columns, ['Ethanol litres', 'ethanol_litres']) ?? 'Ethanol litres';
    const animalFeedColumn =
      this.pickExistingColumn(columns, ['Animal Feed ton', 'animal_feed_ton']) ??
      'Animal Feed ton';

    const rows = this.deepClone(this.productionAnnualRows);
    const candidateIndex =
      this.annualEditingRowIndex !== null &&
      this.annualEditingRowIndex >= 0 &&
      this.annualEditingRowIndex < rows.length
        ? this.annualEditingRowIndex
        : rows.findIndex(
            (row) =>
              String(row[yearColumn] ?? '').trim() === year &&
              String(row[startMonthColumn] ?? '').trim() === this.annualStartMonthValue.trim(),
          );

    const row =
      candidateIndex >= 0 ? { ...(rows[candidateIndex] ?? {}) } : this.emptyRow(columns);
    row[yearColumn] = this.coerceNumberOrText(year);
    row[startMonthColumn] = this.annualStartMonthValue.trim();
    row[cassavaColumn] = this.coerceNumberOrText(this.annualCassavaTonValue);
    row[ethanolColumn] = this.coerceNumberOrText(this.annualEthanolLitresValue);
    row[animalFeedColumn] = this.coerceNumberOrText(this.annualAnimalFeedTonValue);

    if (candidateIndex >= 0) {
      rows[candidateIndex] = row;
    } else {
      rows.push(row);
    }

    this.replaceTableRows('production_annual', columns, rows, 'Production Annual');
    this.resetAnnualForm();
  }

  onEditAnnualRow(row: Record<string, unknown>, index: number): void {
    const columns = this.productionAnnualColumns;
    const yearColumn = this.pickExistingColumn(columns, ['Year', 'year']) ?? 'Year';
    const startMonthColumn =
      this.pickExistingColumn(columns, ['Start Month', 'start_month', 'Month', 'month']) ??
      'Start Month';
    const cassavaColumn =
      this.pickExistingColumn(columns, ['Cassava ton', 'cassava_ton', 'Cassava Ton']) ??
      'Cassava ton';
    const ethanolColumn =
      this.pickExistingColumn(columns, ['Ethanol litres', 'ethanol_litres']) ?? 'Ethanol litres';
    const animalFeedColumn =
      this.pickExistingColumn(columns, ['Animal Feed ton', 'animal_feed_ton']) ??
      'Animal Feed ton';

    this.annualEditingRowIndex = index;
    this.annualYearValue = this.displayRawValue(row[yearColumn]);
    this.annualStartMonthValue = this.displayRawValue(row[startMonthColumn]);
    this.annualCassavaTonValue = this.displayRawValue(row[cassavaColumn]);
    this.annualEthanolLitresValue = this.displayRawValue(row[ethanolColumn]);
    this.annualAnimalFeedTonValue = this.displayRawValue(row[animalFeedColumn]);
    this.annualFormErrorMessage = '';
  }

  removeAnnualRow(index: number): void {
    const rows = this.deepClone(this.productionAnnualRows);
    if (index < 0 || index >= rows.length) {
      return;
    }
    rows.splice(index, 1);
    this.replaceTableRows(
      'production_annual',
      this.ensureAnnualColumns(this.productionAnnualColumns),
      rows,
      'Production Annual',
    );

    if (this.annualEditingRowIndex === index) {
      this.resetAnnualForm();
      return;
    }
    if (this.annualEditingRowIndex !== null && this.annualEditingRowIndex > index) {
      this.annualEditingRowIndex -= 1;
    }
  }

  cancelAnnualEdit(): void {
    this.resetAnnualForm();
  }

  saveMonthlyRow(): void {
    const startMonth = this.monthlyStartMonthValue.trim();
    if (!startMonth) {
      this.monthlyFormErrorMessage = 'Start Month is required.';
      return;
    }
    this.monthlyFormErrorMessage = '';

    const columns = this.ensureMonthlyColumns(this.productionMonthlyColumns);
    const startMonthColumn =
      this.pickExistingColumn(columns, ['Start Month', 'start_month', 'Month', 'month']) ??
      'Start Month';
    const cassavaColumn =
      this.pickExistingColumn(columns, ['Cassava ton', 'cassava_ton', 'Cassava Ton']) ??
      'Cassava ton';
    const ethanolColumn =
      this.pickExistingColumn(columns, ['Ethanol litres', 'ethanol_litres']) ?? 'Ethanol litres';
    const animalFeedColumn =
      this.pickExistingColumn(columns, ['Animal Feed ton', 'animal_feed_ton']) ??
      'Animal Feed ton';
    const growthColumn = this.pickExistingColumn(columns, ['Growth %', 'growth_pct']) ?? 'Growth %';

    const rows = this.deepClone(this.productionMonthlyRows);
    const candidateIndex =
      this.monthlyEditingRowIndex !== null &&
      this.monthlyEditingRowIndex >= 0 &&
      this.monthlyEditingRowIndex < rows.length
        ? this.monthlyEditingRowIndex
        : rows.findIndex(
            (row) => String(row[startMonthColumn] ?? '').trim() === startMonth,
          );

    const row =
      candidateIndex >= 0 ? { ...(rows[candidateIndex] ?? {}) } : this.emptyRow(columns);
    row[startMonthColumn] = startMonth;
    row[cassavaColumn] = this.coerceNumberOrText(this.monthlyCassavaTonValue);
    row[ethanolColumn] = this.coerceNumberOrText(this.monthlyEthanolLitresValue);
    row[animalFeedColumn] = this.coerceNumberOrText(this.monthlyAnimalFeedTonValue);
    row[growthColumn] = this.coerceNumberOrText(this.monthlyGrowthPctValue);

    if (candidateIndex >= 0) {
      rows[candidateIndex] = row;
    } else {
      rows.push(row);
    }

    this.replaceTableRows('production_monthly', columns, rows, 'Production Monthly');
    this.resetMonthlyForm();
  }

  onEditMonthlyRow(row: Record<string, unknown>, index: number): void {
    const columns = this.productionMonthlyColumns;
    const startMonthColumn =
      this.pickExistingColumn(columns, ['Start Month', 'start_month', 'Month', 'month']) ??
      'Start Month';
    const cassavaColumn =
      this.pickExistingColumn(columns, ['Cassava ton', 'cassava_ton', 'Cassava Ton']) ??
      'Cassava ton';
    const ethanolColumn =
      this.pickExistingColumn(columns, ['Ethanol litres', 'ethanol_litres']) ?? 'Ethanol litres';
    const animalFeedColumn =
      this.pickExistingColumn(columns, ['Animal Feed ton', 'animal_feed_ton']) ??
      'Animal Feed ton';
    const growthColumn = this.pickExistingColumn(columns, ['Growth %', 'growth_pct']) ?? 'Growth %';

    this.monthlyEditingRowIndex = index;
    this.monthlyStartMonthValue = this.displayRawValue(row[startMonthColumn]);
    this.monthlyCassavaTonValue = this.displayRawValue(row[cassavaColumn]);
    this.monthlyEthanolLitresValue = this.displayRawValue(row[ethanolColumn]);
    this.monthlyAnimalFeedTonValue = this.displayRawValue(row[animalFeedColumn]);
    this.monthlyGrowthPctValue = this.displayRawValue(row[growthColumn]);
    this.monthlyFormErrorMessage = '';
  }

  removeMonthlyRow(index: number): void {
    const rows = this.deepClone(this.productionMonthlyRows);
    if (index < 0 || index >= rows.length) {
      return;
    }
    rows.splice(index, 1);
    this.replaceTableRows(
      'production_monthly',
      this.ensureMonthlyColumns(this.productionMonthlyColumns),
      rows,
      'Production Monthly',
    );

    if (this.monthlyEditingRowIndex === index) {
      this.resetMonthlyForm();
      return;
    }
    if (this.monthlyEditingRowIndex !== null && this.monthlyEditingRowIndex > index) {
      this.monthlyEditingRowIndex -= 1;
    }
  }

  cancelMonthlyEdit(): void {
    this.resetMonthlyForm();
  }

  private applySnapshot(input: CassavaInputsPayload | null | undefined): void {
    this.payload = this.deepClone(input ?? {});
  }

  private tableRows(tableKey: string): Array<Record<string, unknown>> {
    const rows = this.payload.tables?.[tableKey]?.rows;
    return Array.isArray(rows) ? rows : [];
  }

  private tableColumns(tableKey: string): string[] {
    const explicit = this.payload.tables?.[tableKey]?.columns;
    if (Array.isArray(explicit) && explicit.length) {
      return explicit.map((column) => String(column));
    }
    const rows = this.tableRows(tableKey);
    if (!rows.length) {
      return [];
    }
    return Object.keys(rows[0]);
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

  private replaceTableRows(
    tableKey: string,
    columns: string[],
    rows: Array<Record<string, unknown>>,
    defaultName: string,
  ): void {
    const tables = { ...(this.payload.tables ?? {}) };
    const current = tables[tableKey];

    tables[tableKey] = {
      ...(current ?? {}),
      name: current?.name || defaultName,
      columns: [...columns],
      rows: this.deepClone(rows as Array<Record<string, any>>),
      placeholder: false,
    } as CassavaLandingTablePayload;

    this.payload = {
      ...this.payload,
      tables,
    };
    this.cassavaModelService.setInput(this.deepClone(this.payload));
  }

  private ensureAnnualColumns(columns: string[]): string[] {
    const safe = [...columns];
    for (const required of ['Year', 'Start Month', 'Cassava ton', 'Ethanol litres', 'Animal Feed ton']) {
      if (!this.hasColumn(safe, required)) {
        safe.push(required);
      }
    }
    return safe;
  }

  private ensureMonthlyColumns(columns: string[]): string[] {
    const safe = [...columns];
    for (const required of ['Start Month', 'Cassava ton', 'Ethanol litres', 'Animal Feed ton', 'Growth %']) {
      if (!this.hasColumn(safe, required)) {
        safe.push(required);
      }
    }
    return safe;
  }

  private hasColumn(columns: string[], expected: string): boolean {
    return columns.some((column) => column.toLowerCase() === expected.toLowerCase());
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

  private emptyRow(columns: string[]): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    for (const column of columns) {
      row[column] = '';
    }
    return row;
  }

  private coerceNumberOrText(raw: string): string | number {
    const value = String(raw ?? '').trim();
    if (!value) {
      return '';
    }
    if (/^-?\d+([.,]\d+)?$/.test(value)) {
      const parsed = Number(value.replace(',', '.'));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return value;
  }

  private displayRawValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  private resetAnnualForm(): void {
    this.annualYearValue = '';
    this.annualStartMonthValue = '';
    this.annualCassavaTonValue = '';
    this.annualEthanolLitresValue = '';
    this.annualAnimalFeedTonValue = '';
    this.annualEditingRowIndex = null;
    this.annualFormErrorMessage = '';
  }

  private resetMonthlyForm(): void {
    this.monthlyStartMonthValue = '';
    this.monthlyCassavaTonValue = '';
    this.monthlyEthanolLitresValue = '';
    this.monthlyAnimalFeedTonValue = '';
    this.monthlyGrowthPctValue = '';
    this.monthlyEditingRowIndex = null;
    this.monthlyFormErrorMessage = '';
  }

  private humanizeLabel(value: string): string {
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}

