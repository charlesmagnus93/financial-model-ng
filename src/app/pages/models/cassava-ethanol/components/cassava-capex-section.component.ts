import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {
  CassavaInputsPayload,
  CassavaLandingTablePayload,
  CassavaModelService,
} from '../../../services/cassava-model.service';

@Component({
  selector: 'app-cassava-capex-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, InputTextModule, ButtonModule, TableModule],
  template: `
    <p-fieldset legend="Initial Investment" [toggleable]="true" class="w-full">
      <form class="grid grid-cols-12 gap-4 mb-4" (ngSubmit)="saveItem()">
        <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Item</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="itemValue"
            name="item"
            placeholder="Ex: Land"
          />
        </div>
        <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Cost</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="costValue"
            name="cost"
            placeholder="Ex: 2000000"
          />
        </div>
        <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Life (years)</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="lifeValue"
            name="life"
            placeholder="Ex: 10"
          />
        </div>
        <div class="col-span-12 md:col-span-2 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Depreciation Rate</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="depreciationRateValue"
            name="depreciationRate"
            placeholder="Ex: 0.1"
          />
        </div>
        <div class="col-span-12 md:col-span-3 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Start Month</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="startMonthValue"
            name="startMonth"
            placeholder="YYYY-MM"
          />
        </div>
        <div class="col-span-12 flex flex-col gap-2"
          [class.lg:col-span-12]="!isEditing"
          [class.lg:col-span-6]="isEditing"
        >
          <p-button
            fluid
            type="submit"
            severity="success"
            variant="outlined"
            [label]="isEditing ? 'Edit' : 'Add'"
            [icon]="isEditing ? 'pi pi-check' : 'pi pi-plus'"
            class="w-full"
          ></p-button>
        </div>
        @if (isEditing) {
          <div class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-6]="isEditing"
          >
            <p-button
              fluid
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              [outlined]="true"
              (onClick)="cancelEdit()"
            ></p-button>
          </div>
        }
      </form>


      @if (formErrorMessage) {
        <div class="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {{ formErrorMessage }}
        </div>
      }

      <p-table
        [value]="capexRows"
        [scrollable]="true"
        scrollHeight="320px"
        responsiveLayout="scroll"
        [tableStyle]="{ 'min-width': '70rem' }"
        showGridlines
        class="shadow-none text-sm"
        [size]="'small'"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>{{ formatColumnLabel(itemColumn) }}</th>
            <th>{{ formatColumnLabel(costColumn) }}</th>
            <th>{{ formatColumnLabel(lifeColumn) }}</th>
            <th>{{ formatColumnLabel(depreciationRateColumn) }}</th>
            <th>{{ formatColumnLabel(startMonthColumn) }}</th>
            <th class="w-28 text-right">Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
          <tr>
            <td>{{ displayCell(row[itemColumn]) }}</td>
            <td>{{ formatNumericCell(row[costColumn]) }}</td>
            <td>{{ formatNumericCell(row[lifeColumn]) }}</td>
            <td>{{ formatNumericCell(row[depreciationRateColumn]) }}</td>
            <td>{{ displayCell(row[startMonthColumn]) }}</td>
            <td class="text-right">
              <div class="flex justify-end gap-2">
                <p-button
                  icon="pi pi-pencil"
                  severity="secondary"
                  size="small"
                  [text]="true"
                  (onClick)="onEditRow(row, rowIndex)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  [text]="true"
                  (onClick)="removeRow(rowIndex)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center text-sm text-surface-500">
              No capex items found.
            </td>
          </tr>
        </ng-template>
      </p-table>

      <div class="mt-4 flex flex-col gap-1">
        <div class="text-xs text-surface-500">Total Initial Investment</div>
        <div class="text-4xl font-semibold">{{ formatCurrency(totalInitialInvestment) }}</div>
      </div>
    </p-fieldset>
  `,
})
export class CassavaCapexSectionComponent implements OnInit, OnDestroy {
  payload: CassavaInputsPayload = {};

  itemValue = '';
  costValue = '';
  lifeValue = '';
  depreciationRateValue = '';
  startMonthValue = '';

  editingRowIndex: number | null = null;
  formErrorMessage = '';

  private inputSub?: Subscription;

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

  get isEditing(): boolean {
    return this.editingRowIndex !== null;
  }

  get capexRows(): Array<Record<string, unknown>> {
    const rows = this.payload.tables?.['initial_investment']?.rows;
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows;
  }

  get capexColumns(): string[] {
    const columns = this.payload.tables?.['initial_investment']?.columns;
    const safeColumns = Array.isArray(columns) ? columns : [];
    return this.ensureColumns(safeColumns);
  }

  get itemColumn(): string {
    return this.pickColumn(this.capexColumns, ['Item']) ?? 'Item';
  }

  get costColumn(): string {
    return this.pickColumn(this.capexColumns, ['Cost']) ?? 'Cost';
  }

  get lifeColumn(): string {
    return this.pickColumn(this.capexColumns, ['Life (years)', 'Life Years', 'Life']) ?? 'Life (years)';
  }

  get depreciationRateColumn(): string {
    return this.pickColumn(
      this.capexColumns,
      ['Depreciation Rate', 'Depreciation rate'],
    ) ?? 'Depreciation Rate';
  }

  get startMonthColumn(): string {
    return this.pickColumn(this.capexColumns, ['Start Month', 'start_month', 'Month']) ?? 'Start Month';
  }

  get totalInitialInvestment(): number {
    return this.capexRows.reduce((sum, row) => sum + this.toNumber(row[this.costColumn]), 0);
  }

  saveItem(): void {
    const item = this.itemValue.trim();
    if (!item) {
      this.formErrorMessage = 'Item is required.';
      return;
    }

    this.formErrorMessage = '';
    const columns = this.ensureColumns(this.capexColumns);
    const rows = this.deepClone(this.capexRows);

    const itemColumn = this.pickColumn(columns, ['Item']) ?? 'Item';
    const costColumn = this.pickColumn(columns, ['Cost']) ?? 'Cost';
    const lifeColumn =
      this.pickColumn(columns, ['Life (years)', 'Life Years', 'Life']) ?? 'Life (years)';
    const depreciationRateColumn =
      this.pickColumn(columns, ['Depreciation Rate', 'Depreciation rate']) ??
      'Depreciation Rate';
    const startMonthColumn =
      this.pickColumn(columns, ['Start Month', 'start_month', 'Month']) ?? 'Start Month';

    const candidateIndex =
      this.editingRowIndex !== null &&
      this.editingRowIndex >= 0 &&
      this.editingRowIndex < rows.length
        ? this.editingRowIndex
        : rows.findIndex(
            (row) =>
              String(row[itemColumn] ?? '')
                .trim()
                .toLowerCase() === item.toLowerCase(),
          );

    const baseRow: Record<string, unknown> =
      candidateIndex >= 0 ? { ...(rows[candidateIndex] ?? {}) } : this.emptyRow(columns);
    baseRow[itemColumn] = item;
    baseRow[costColumn] = this.coerceNumberOrText(this.costValue);
    baseRow[lifeColumn] = this.coerceNumberOrText(this.lifeValue);
    baseRow[depreciationRateColumn] = this.coerceNumberOrText(this.depreciationRateValue);
    baseRow[startMonthColumn] = this.startMonthValue.trim();

    if (candidateIndex >= 0) {
      rows[candidateIndex] = baseRow;
    } else {
      rows.push(baseRow);
    }

    this.replaceCapexTable(columns, rows);
    this.resetForm();
  }

  onEditRow(row: Record<string, unknown>, index: number): void {
    this.editingRowIndex = index;
    this.itemValue = String(row[this.itemColumn] ?? '');
    this.costValue = this.displayCell(row[this.costColumn], '');
    this.lifeValue = this.displayCell(row[this.lifeColumn], '');
    this.depreciationRateValue = this.displayCell(row[this.depreciationRateColumn], '');
    this.startMonthValue = this.displayCell(row[this.startMonthColumn], '');
    this.formErrorMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  removeRow(index: number): void {
    const rows = this.deepClone(this.capexRows);
    if (index < 0 || index >= rows.length) {
      return;
    }
    rows.splice(index, 1);
    this.replaceCapexTable(this.capexColumns, rows);

    if (this.editingRowIndex === index) {
      this.resetForm();
      return;
    }
    if (this.editingRowIndex !== null && this.editingRowIndex > index) {
      this.editingRowIndex -= 1;
    }
  }

  displayCell(value: unknown, fallback = '-'): string {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return String(value);
  }

  formatNumericCell(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    const numeric = this.toNumber(value, NaN);
    if (!Number.isFinite(numeric)) {
      return String(value);
    }
    return numeric.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(numeric) ? 0 : 4,
    });
  }

  formatColumnLabel(column: string): string {
    return String(column)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatCurrency(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return safe.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }

  private applySnapshot(input: CassavaInputsPayload | null | undefined): void {
    this.payload = this.deepClone(input ?? {});
  }

  private replaceCapexTable(
    columns: string[],
    rows: Array<Record<string, unknown>>,
  ): void {
    const tables = { ...(this.payload.tables ?? {}) };
    const current = tables['initial_investment'];
    tables['initial_investment'] = {
      ...(current ?? {}),
      name: current?.name || 'Initial Investment',
      columns: [...columns],
      rows: this.deepClone(rows as Array<Record<string, any>>),
      placeholder: false,
    } as CassavaLandingTablePayload;

    this.payload = {
      ...this.payload,
      tables,
    };
    this.syncInput();
  }

  private syncInput(): void {
    this.cassavaModelService.setInput(this.deepClone(this.payload));
  }

  private ensureColumns(columns: string[]): string[] {
    const safe = [...columns];
    const requiredColumns = [
      'Item',
      'Cost',
      'Life (years)',
      'Depreciation Rate',
      'Start Month',
    ];
    for (const required of requiredColumns) {
      if (!this.hasColumn(safe, required)) {
        safe.push(required);
      }
    }
    return safe;
  }

  private hasColumn(columns: string[], expected: string): boolean {
    return columns.some((column) => column.toLowerCase() === expected.toLowerCase());
  }

  private pickColumn(columns: string[], candidates: string[]): string | null {
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

  private toNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private resetForm(): void {
    this.editingRowIndex = null;
    this.itemValue = '';
    this.costValue = '';
    this.lifeValue = '';
    this.depreciationRateValue = '';
    this.startMonthValue = '';
    this.formErrorMessage = '';
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}

