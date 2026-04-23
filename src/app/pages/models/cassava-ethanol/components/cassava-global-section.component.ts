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
  selector: 'app-cassava-global-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, InputTextModule, ButtonModule, TableModule],
  template: `
    <p-fieldset legend="Global Inputs" [toggleable]="true" class="w-full">
      <form class="grid grid-cols-12 gap-4 mb-4" (ngSubmit)="saveParameter()">
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Parameter</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="parameterValue"
            name="parameter"
            placeholder="Ex: Corporate tax rate"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Value</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="rawValue"
            name="value"
            placeholder="Ex: 0.28"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Units</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="unitsValue"
            name="units"
            placeholder="% / year / tons"
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
        [value]="globalRows"
        [scrollable]="true"
        scrollHeight="300px"
        responsiveLayout="scroll"
        [tableStyle]="{ 'min-width': '60rem' }"
        showGridlines
        class="shadow-none"
        [size]="'small'"
        class="text-sm"
        scrollHeight="400px"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>{{ formatColumnLabel(parameterColumn) }}</th>
            <th>{{ formatColumnLabel(valueColumn) }}</th>
            <th>{{ formatColumnLabel(unitsColumn) }}</th>
            <th class="w-28 text-right">Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
          <tr>
            <td>{{ displayCell(row[parameterColumn]) }}</td>
            <td>{{ displayCell(row[valueColumn]) }}</td>
            <td>{{ displayCell(row[unitsColumn]) }}</td>
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
            <td colspan="4" class="text-center text-sm text-surface-500">
              No global parameters found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-fieldset>
  `,
})
export class CassavaGlobalSectionComponent implements OnInit, OnDestroy {
  payload: CassavaInputsPayload = {};

  parameterValue = '';
  rawValue = '';
  unitsValue = '';

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

  get globalRows(): Array<Record<string, unknown>> {
    const rows = this.payload.tables?.['global_inputs']?.rows;
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows;
  }

  get globalColumns(): string[] {
    const columns = this.payload.tables?.['global_inputs']?.columns;
    const safeColumns = Array.isArray(columns) ? columns : [];
    return this.ensureColumns(safeColumns);
  }

  get parameterColumn(): string {
    return this.parameterColumnName(this.globalColumns);
  }

  get valueColumn(): string {
    return this.valueColumnName(this.globalColumns);
  }

  get unitsColumn(): string {
    return this.unitsColumnName(this.globalColumns);
  }

  saveParameter(): void {
    const parameter = this.parameterValue.trim();
    if (!parameter) {
      this.formErrorMessage = 'Parameter is required.';
      return;
    }

    this.formErrorMessage = '';
    const columns = this.ensureColumns(this.globalColumns);
    const parameterColumn = this.parameterColumnName(columns);
    const valueColumn = this.valueColumnName(columns);
    const unitsColumn = this.unitsColumnName(columns);
    const rows = this.deepClone(this.globalRows);

    const candidateIndex =
      this.editingRowIndex !== null &&
      this.editingRowIndex >= 0 &&
      this.editingRowIndex < rows.length
        ? this.editingRowIndex
        : rows.findIndex(
            (row) =>
              String(row[parameterColumn] ?? '')
                .trim()
                .toLowerCase() === parameter.toLowerCase(),
          );

    const baseRow: Record<string, unknown> =
      candidateIndex >= 0 ? { ...(rows[candidateIndex] ?? {}) } : this.emptyRow(columns);
    baseRow[parameterColumn] = parameter;
    baseRow[valueColumn] = this.coerceValue(this.rawValue);
    baseRow[unitsColumn] = this.unitsValue.trim();

    if (candidateIndex >= 0) {
      rows[candidateIndex] = baseRow;
    } else {
      rows.push(baseRow);
    }

    this.replaceGlobalTable(columns, rows);
    this.resetForm();
  }

  onEditRow(row: Record<string, unknown>, index: number): void {
    this.editingRowIndex = index;
    this.parameterValue = String(row[this.parameterColumn] ?? '');
    this.rawValue = this.displayCell(row[this.valueColumn], '');
    this.unitsValue = String(row[this.unitsColumn] ?? '');
    this.formErrorMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  removeRow(index: number): void {
    const rows = this.deepClone(this.globalRows);
    if (index < 0 || index >= rows.length) {
      return;
    }
    rows.splice(index, 1);
    this.replaceGlobalTable(this.globalColumns, rows);

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

  formatColumnLabel(column: string): string {
    return String(column)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private applySnapshot(input: CassavaInputsPayload | null | undefined): void {
    this.payload = this.deepClone(input ?? {});
  }

  private replaceGlobalTable(
    columns: string[],
    rows: Array<Record<string, unknown>>,
  ): void {
    const tables = { ...(this.payload.tables ?? {}) };
    const current = tables['global_inputs'];
    tables['global_inputs'] = {
      ...(current ?? {}),
      name: current?.name || 'Global Inputs',
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
    for (const required of ['Parameter', 'Value', 'Units']) {
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

  private parameterColumnName(columns: string[]): string {
    return this.pickExistingColumn(columns, ['Parameter', 'parameter']) ?? 'Parameter';
  }

  private valueColumnName(columns: string[]): string {
    return this.pickExistingColumn(columns, ['Value', 'value']) ?? 'Value';
  }

  private unitsColumnName(columns: string[]): string {
    return this.pickExistingColumn(columns, ['Units', 'units']) ?? 'Units';
  }

  private emptyRow(columns: string[]): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    for (const column of columns) {
      row[column] = '';
    }
    return row;
  }

  private coerceValue(raw: string): string | number {
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

  private resetForm(): void {
    this.editingRowIndex = null;
    this.parameterValue = '';
    this.rawValue = '';
    this.unitsValue = '';
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
