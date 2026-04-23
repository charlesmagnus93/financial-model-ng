import { CassavaTablePayload } from '../../../services/cassava-model.service';

export interface CassavaResolvedTable {
  columns: string[];
  rows: Array<Record<string, unknown>>;
}

interface MetricRow {
  metric: string;
  value: unknown;
}

type IndexValue = string | number;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function uniqueColumnName(candidate: string, used: string[]): string {
  const base = candidate.trim() || 'Index';
  if (!used.includes(base)) {
    return base;
  }
  let suffix = 2;
  let next = `${base} (${suffix})`;
  while (used.includes(next)) {
    suffix += 1;
    next = `${base} (${suffix})`;
  }
  return next;
}

function toNumeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    if (!normalized) {
      return null;
    }
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function orderedColumnsFromRows(rows: Array<Record<string, unknown>>): string[] {
  const ordered: string[] = [];
  for (const row of rows) {
    for (const column of Object.keys(row)) {
      if (!ordered.includes(column)) {
        ordered.push(column);
      }
    }
  }
  return ordered;
}

function fromColumnarData(
  data: Record<string, unknown>,
  indexValues: IndexValue[],
  indexLabel: string,
): CassavaResolvedTable {
  const columns = Object.keys(data);
  const vectors: Record<string, unknown[]> = {};
  let rowCount = indexValues.length;

  for (const column of columns) {
    const values = Array.isArray(data[column]) ? (data[column] as unknown[]) : [];
    vectors[column] = values;
    if (values.length > rowCount) {
      rowCount = values.length;
    }
  }

  if (!rowCount) {
    return { columns: [], rows: [] };
  }

  const resolvedIndexLabel = uniqueColumnName(indexLabel, columns);
  const rows = Array.from({ length: rowCount }, (_unused, rowIndex) => {
    const row: Record<string, unknown> = {
      [resolvedIndexLabel]: indexValues[rowIndex] ?? rowIndex + 1,
    };
    for (const column of columns) {
      const columnValues = vectors[column] ?? [];
      row[column] = columnValues[rowIndex] ?? null;
    }
    return row;
  });

  return {
    columns: [resolvedIndexLabel, ...columns],
    rows,
  };
}

function fromRowData(
  data: Array<Record<string, unknown>>,
  indexValues: IndexValue[],
  indexLabel: string,
): CassavaResolvedTable {
  if (!data.length && !indexValues.length) {
    return { columns: [], rows: [] };
  }

  const rows = data.map((row) => ({ ...row }));
  const baseColumns = orderedColumnsFromRows(rows);
  if (!indexValues.length) {
    return { columns: baseColumns, rows };
  }

  const resolvedIndexLabel = uniqueColumnName(indexLabel, baseColumns);
  const rowCount = Math.max(rows.length, indexValues.length);
  const paddedRows = Array.from({ length: rowCount }, (_unused, rowIndex) => {
    const row = { ...(rows[rowIndex] ?? {}) };
    row[resolvedIndexLabel] = indexValues[rowIndex] ?? rowIndex + 1;
    return row;
  });

  const columns = [resolvedIndexLabel, ...baseColumns];
  return { columns, rows: paddedRows };
}

export function resolveCassavaTable(
  payload: CassavaTablePayload | null | undefined,
  fallbackIndexName = 'Index',
): CassavaResolvedTable {
  if (!payload) {
    return { columns: [], rows: [] };
  }

  const rawIndexName =
    typeof payload.index_name === 'string' && payload.index_name.trim()
      ? payload.index_name.trim()
      : fallbackIndexName;
  const indexValues: IndexValue[] = Array.isArray(payload.index)
    ? payload.index
        .map((value) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value;
          }
          return null;
        })
        .filter((value): value is IndexValue => value !== null)
    : [];

  if (Array.isArray(payload.data)) {
    const rows = payload.data
      .filter((row): row is Record<string, unknown> => isRecord(row))
      .map((row) => ({ ...row }));
    return fromRowData(rows, indexValues, rawIndexName);
  }

  if (isRecord(payload.data)) {
    return fromColumnarData(payload.data, indexValues, rawIndexName);
  }

  return { columns: [], rows: [] };
}

export function metricsToRows(
  metrics: Record<string, unknown> | null | undefined,
): MetricRow[] {
  if (!metrics) {
    return [];
  }
  return Object.entries(metrics).map(([metric, value]) => ({ metric, value }));
}

export function isNumericValue(value: unknown): boolean {
  return toNumeric(value) !== null;
}

function isYearLikeColumnName(columnName: string | undefined): boolean {
  if (!columnName) {
    return false;
  }
  const normalized = String(columnName).trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (/\byears\b/.test(normalized)) {
    return false;
  }
  return /\byear\b/.test(normalized);
}

export function formatCassavaCell(
  value: unknown,
  columnName?: string,
): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  const numeric = toNumeric(value);
  if (numeric === null) {
    return String(value);
  }
  if (
    isYearLikeColumnName(columnName) &&
    Number.isInteger(numeric) &&
    Math.abs(numeric) >= 1000 &&
    Math.abs(numeric) <= 9999
  ) {
    return `${numeric}`;
  }
  const precision = Number.isInteger(numeric)
    ? 0
    : Math.abs(numeric) < 1
      ? 4
      : 2;
  return numeric.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  });
}
