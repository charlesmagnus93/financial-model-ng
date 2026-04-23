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

interface FinancialSectionConfig {
  key: string;
  legend: string;
  requiredColumns: string[];
  priorityColumns: string[];
  scrollHeight: string;
}

@Component({
  selector: 'app-cassava-financial-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, TableModule, InputTextModule, ButtonModule],
  template: `
    <div class="flex flex-col gap-4">
      @for (section of sections; track section.key) {
        <p-fieldset [legend]="section.legend" [toggleable]="true" class="w-full">
          <form class="grid grid-cols-12 gap-4 mb-4" (ngSubmit)="saveRow(section.key)">
            @for (column of sectionColumns(section.key); track column) {
              <div class="flex flex-col gap-2"
                [class]="columnWidthClass(section.key)"
              >
                <label class="text-xs text-surface-500">
                  {{ displayColumnLabel(section.key, column) }}
                </label>
                <input
                  pInputText
                  class="w-full"
                  [name]="controlName(section.key, column)"
                  [(ngModel)]="formValues[section.key][column]"
                  [placeholder]="displayColumnLabel(section.key, column)"
                />
              </div>
            }
            <div class="col-span-12 flex flex-col gap-2"
              [class.lg:col-span-12]="!isEditing(section.key)"
              [class.lg:col-span-6]="isEditing(section.key)"
            >
              <p-button
                fluid
                type="submit"
                severity="success"
                variant="outlined"
                [label]="isEditing(section.key) ? 'Edit' : 'Add'"
                [icon]="isEditing(section.key) ? 'pi pi-check' : 'pi pi-plus'"
              ></p-button>
            </div>
            <div class="col-span-12 flex flex-col gap-2"
              [class.lg:col-span-6]="isEditing(section.key)"
            >
              @if (isEditing(section.key)) {
                <p-button
                  fluid
                  type="button"
                  label="Cancel"
                  icon="pi pi-times"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="cancelEdit(section.key)"
                ></p-button>
              }
            </div>
          </form>

          @if (formErrorMessage(section.key)) {
            <div class="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {{ formErrorMessage(section.key) }}
            </div>
          }

          @if (sectionRows(section.key).length && sectionColumns(section.key).length) {
            <p-table
              [value]="sectionRows(section.key)"
              [scrollable]="true"
              [scrollHeight]="section.scrollHeight"
              responsiveLayout="scroll"
              [tableStyle]="{ 'min-width': '70rem' }"
              showGridlines
              class="shadow-none text-sm"
              [size]="'small'"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of sectionColumns(section.key); track column) {
                    <th>{{ displayColumnLabel(section.key, column) }}</th>
                  }
                  <th class="w-28 text-right">Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
                <tr>
                  @for (column of sectionColumns(section.key); track column) {
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
                        (onClick)="onEditRow(section.key, row, rowIndex)"
                      ></p-button>
                      <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        [text]="true"
                        (onClick)="removeRow(section.key, rowIndex)"
                      ></p-button>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No data available in {{ section.key }}.</div>
          }
        </p-fieldset>
      }
    </div>
  `,
})
export class CassavaFinancialSectionComponent implements OnInit, OnDestroy {
  readonly sections: FinancialSectionConfig[] = [
    {
      key: 'revenue_inputs',
      legend: 'Revenue Inputs',
      requiredColumns: ['Product', 'Base Price', 'Escalation', 'Units'],
      priorityColumns: ['Product', 'Base Price', 'Escalation', 'Units'],
      scrollHeight: '220px',
    },
    {
      key: 'loan_schedule',
      legend: 'Loan Schedule',
      requiredColumns: [
        'Loan',
        'Type',
        'Loan Amount',
        'Base Interest',
        'Interest Rate',
        'Tenor Years',
        'Grace Years',
        'Amortization',
        'Start Month',
      ],
      priorityColumns: [
        'Loan',
        'Type',
        'Loan Amount',
        'Base Interest',
        'Interest Rate',
        'Tenor Years',
        'Grace Years',
        'Amortization',
        'Start Month',
      ],
      scrollHeight: '230px',
    },
    {
      key: 'tax_schedule',
      legend: 'Tax Schedule',
      requiredColumns: ['Item', 'Base Rate', 'Timing', 'Notes'],
      priorityColumns: ['Item', 'Base Rate', 'Timing', 'Notes'],
      scrollHeight: '220px',
    },
  ];

  payload: CassavaInputsPayload = {};
  formValues: Record<string, Record<string, string>> = {};
  editingRowIndex: Record<string, number | null> = {};
  formErrors: Record<string, string> = {};
  private sectionColumnsMap: Record<string, string[]> = {};
  private inputSub?: Subscription;

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    for (const section of this.sections) {
      this.formValues[section.key] = {};
      this.editingRowIndex[section.key] = null;
      this.formErrors[section.key] = '';
      this.sectionColumnsMap[section.key] = [];
    }

    this.inputSub = this.cassavaModelService.input$.subscribe((input) => {
      this.applySnapshot(input);
    });
    this.applySnapshot(this.cassavaModelService.getInputSnapshot());
  }

  ngOnDestroy(): void {
    this.inputSub?.unsubscribe();
  }

  sectionColumns(tableKey: string): string[] {
    return this.sectionColumnsMap[tableKey] ?? [];
  }

  sectionRows(tableKey: string): Array<Record<string, unknown>> {
    return this.tableRows(tableKey);
  }

  isEditing(tableKey: string): boolean {
    return this.editingRowIndex[tableKey] !== null;
  }

  formErrorMessage(tableKey: string): string {
    return this.formErrors[tableKey] ?? '';
  }

  controlName(tableKey: string, column: string): string {
    return `${tableKey}_${String(column).replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}`;
  }

  columnWidthClass(tableKey: string): string {
    const count = this.sectionColumns(tableKey).length;
    if (count <= 4) {
      return 'col-span-12 md:col-span-3';
    }
    if (count <= 6) {
      return 'col-span-12 md:col-span-2';
    }
    if (count > 6) {
      return 'col-span-12 md:col-span-4 lg:col-span-4';
    }
    return 'col-span-12 md:col-span-2 lg:col-span-1';
  }

  displayColumnLabel(_tableKey: string, column: string): string {
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

    return numeric.toLocaleString(undefined, {
      minimumFractionDigits: this.isNumericColumn(column) && !Number.isInteger(numeric) ? 2 : 0,
      maximumFractionDigits: this.isNumericColumn(column) && !Number.isInteger(numeric) ? 2 : 2,
    });
  }

  isNumericColumn(column: string): boolean {
    return /price|rate|amount|years|year|base rate|value|cost|%/i.test(column);
  }

  saveRow(tableKey: string): void {
    const columns = this.sectionColumns(tableKey);
    if (!columns.length) {
      return;
    }

    const form = this.formValues[tableKey] ?? {};
    const requiredColumn = columns[0];
    if (!String(form[requiredColumn] ?? '').trim()) {
      this.formErrors[tableKey] = `${this.humanizeLabel(requiredColumn)} is required.`;
      return;
    }

    this.formErrors[tableKey] = '';
    const rows = this.deepClone(this.tableRows(tableKey));
    const matchColumn = requiredColumn;
    const currentEditIndex = this.editingRowIndex[tableKey];
    const candidateIndex =
      currentEditIndex !== null &&
      currentEditIndex >= 0 &&
      currentEditIndex < rows.length
        ? currentEditIndex
        : rows.findIndex(
            (row) =>
              String(row[matchColumn] ?? '')
                .trim()
                .toLowerCase() === String(form[matchColumn] ?? '').trim().toLowerCase(),
          );

    const row = candidateIndex >= 0 ? { ...(rows[candidateIndex] ?? {}) } : this.emptyRow(columns);
    for (const column of columns) {
      row[column] = this.coerceNumberOrText(form[column]);
    }

    if (candidateIndex >= 0) {
      rows[candidateIndex] = row;
    } else {
      rows.push(row);
    }

    const section = this.sectionByKey(tableKey);
    this.replaceTableRows(
      tableKey,
      columns,
      rows,
      section?.legend ?? this.humanizeLabel(tableKey),
    );
    this.resetForm(tableKey);
  }

  onEditRow(tableKey: string, row: Record<string, unknown>, rowIndex: number): void {
    this.editingRowIndex[tableKey] = rowIndex;
    const columns = this.sectionColumns(tableKey);
    for (const column of columns) {
      this.formValues[tableKey][column] = this.displayRawValue(row[column]);
    }
    this.formErrors[tableKey] = '';
  }

  removeRow(tableKey: string, rowIndex: number): void {
    const rows = this.deepClone(this.tableRows(tableKey));
    if (rowIndex < 0 || rowIndex >= rows.length) {
      return;
    }
    rows.splice(rowIndex, 1);

    const section = this.sectionByKey(tableKey);
    this.replaceTableRows(
      tableKey,
      this.sectionColumns(tableKey),
      rows,
      section?.legend ?? this.humanizeLabel(tableKey),
    );

    const currentEdit = this.editingRowIndex[tableKey];
    if (currentEdit === rowIndex) {
      this.resetForm(tableKey);
      return;
    }
    if (currentEdit !== null && currentEdit > rowIndex) {
      this.editingRowIndex[tableKey] = currentEdit - 1;
    }
  }

  cancelEdit(tableKey: string): void {
    this.resetForm(tableKey);
  }

  private applySnapshot(input: CassavaInputsPayload | null | undefined): void {
    this.payload = this.deepClone(input ?? {});
    this.refreshSectionsState();
  }

  private refreshSectionsState(): void {
    for (const section of this.sections) {
      const columns = this.orderedColumns(
        this.ensureColumns(this.tableColumns(section.key), section.requiredColumns),
        section.priorityColumns,
      );
      this.sectionColumnsMap[section.key] = columns;
      this.formValues[section.key] = this.formValues[section.key] ?? {};
      for (const column of columns) {
        if (this.formValues[section.key][column] === undefined) {
          this.formValues[section.key][column] = '';
        }
      }

      const editIndex = this.editingRowIndex[section.key];
      const rowCount = this.tableRows(section.key).length;
      if (editIndex !== null && (editIndex < 0 || editIndex >= rowCount)) {
        this.editingRowIndex[section.key] = null;
      }
    }
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

  private ensureColumns(columns: string[], requiredColumns: string[]): string[] {
    const safe = [...columns];
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

  private orderedColumns(columns: string[], priority: string[]): string[] {
    const ordered: string[] = [];
    for (const candidate of priority) {
      const found = columns.find(
        (column) => column.toLowerCase() === candidate.toLowerCase(),
      );
      if (found && !ordered.includes(found)) {
        ordered.push(found);
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

  private emptyRow(columns: string[]): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    for (const column of columns) {
      row[column] = '';
    }
    return row;
  }

  private coerceNumberOrText(raw: unknown): string | number {
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

  private resetForm(tableKey: string): void {
    this.editingRowIndex[tableKey] = null;
    const columns = this.sectionColumns(tableKey);
    for (const column of columns) {
      this.formValues[tableKey][column] = '';
    }
    this.formErrors[tableKey] = '';
  }

  private sectionByKey(tableKey: string): FinancialSectionConfig | undefined {
    return this.sections.find((section) => section.key === tableKey);
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
