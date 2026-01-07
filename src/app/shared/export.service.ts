import { Injectable } from '@angular/core';

export type CsvCell = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportToCsv(filename: string, rows: CsvCell[][], headers?: string[]): void {
    const csv = this.buildCsv(rows, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private buildCsv(rows: CsvCell[][], headers?: string[]): string {
    const lines: string[] = [];

    if (headers?.length) {
      lines.push(this.serializeRow(headers));
    }

    rows.forEach((row) => lines.push(this.serializeRow(row)));
    return lines.join('\r\n');
  }

  private serializeRow(row: CsvCell[]): string {
    return row.map((cell) => this.escapeCell(cell)).join(',');
  }

  private escapeCell(cell: CsvCell): string {
    if (cell === null || cell === undefined) {
      return '';
    }

    const value = String(cell);
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }
}
