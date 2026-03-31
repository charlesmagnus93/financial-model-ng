import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CassavaLandingTablePayload } from '../../../services/cassava-model.service';

@Component({
  selector: 'app-cassava-table-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule],
  template: `
    <div class="card flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">
          {{ table?.name || 'Input Table' }}
        </div>
        <p-button
          label="Add row"
          icon="pi pi-plus"
          size="small"
          [outlined]="true"
          (onClick)="addRow()"
        ></p-button>
      </div>

      @if (!table || !columns.length) {
        <div class="text-sm text-surface-500">No table structure available.</div>
      } @else {
        <p-table
          [value]="table.rows || []"
          [tableStyle]="{ 'min-width': '65rem' }"
          responsiveLayout="scroll"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of columns; track column) {
                <th>{{ formatColumnLabel(column) }}</th>
              }
              <th class="w-12"></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
            <tr>
              @for (column of columns; track column) {
                <td>
                  <input
                    pInputText
                    class="w-full"
                    [value]="displayValue(row?.[column])"
                    (input)="onCellInput(rowIndex, column, $any($event.target).value)"
                  />
                </td>
              }
              <td class="text-right">
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [text]="true"
                  (onClick)="removeRow(rowIndex)"
                ></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="columns.length + 1" class="text-center text-sm text-surface-500">
                No rows yet.
              </td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
})
export class CassavaTableEditorComponent {
  @Input() table: CassavaLandingTablePayload | null = null;
  @Output() tableChange = new EventEmitter<CassavaLandingTablePayload>();

  get columns(): string[] {
    return this.table?.columns ?? [];
  }

  addRow(): void {
    if (!this.table) {
      return;
    }

    const row: Record<string, any> = {};
    for (const column of this.columns) {
      row[column] = this.defaultValueForColumn(column);
    }

    const rows = [...(this.table.rows ?? []), row];
    this.emitRows(rows);
  }

  removeRow(index: number): void {
    if (!this.table) {
      return;
    }

    const rows = [...(this.table.rows ?? [])];
    if (index < 0 || index >= rows.length) {
      return;
    }
    rows.splice(index, 1);
    this.emitRows(rows);
  }

  onCellInput(rowIndex: number, column: string, rawValue: string): void {
    if (!this.table) {
      return;
    }

    const rows = [...(this.table.rows ?? [])];
    const row = { ...(rows[rowIndex] ?? {}) };
    row[column] = this.coerceValue(row[column], rawValue);
    rows[rowIndex] = row;
    this.emitRows(rows);
  }

  formatColumnLabel(column: string): string {
    return column
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  displayValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  private defaultValueForColumn(column: string): any {
    const firstDefined = (this.table?.rows ?? [])
      .map((row) => row?.[column])
      .find((value) => value !== undefined && value !== null);

    if (typeof firstDefined === 'number') {
      return 0;
    }
    return '';
  }

  private coerceValue(current: any, rawValue: string): any {
    if (typeof current === 'number') {
      const parsed = Number(rawValue);
      return Number.isFinite(parsed) ? parsed : current;
    }
    return rawValue;
  }

  private emitRows(rows: Array<Record<string, any>>): void {
    if (!this.table) {
      return;
    }

    this.tableChange.emit({
      ...this.table,
      rows,
      placeholder: false,
    });
  }
}
