import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Subject, take, takeUntil } from 'rxjs';
import {
  BiotechModelService,
  TablePayload,
} from '../../../services/biotech-model.service';

interface ClusterRow {
  product: string;
  cluster: number;
}

interface MlMultipleRow {
  year: string | number;
  predictedMultiple: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-comparative-ml-valuation',
  imports: [CommonModule, FieldsetModule, TableModule, NgChartsModule],
  template: `
    <p-fieldset
      legend="Comparative &amp; ML-based valuation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        @if (clusterRows.length) {
          <div class="overflow-auto">
            <p-table
              [value]="clusterRows"
              showGridlines
              responsiveLayout="scroll"
              class="text-sm"
              [scrollable]="true"
              scrollHeight="220px"
              [size]="'small'"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Cluster</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td>{{ i }}</td>
                  <td class="font-semibold">{{ row.product }}</td>
                  <td class="text-right">{{ row.cluster }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        } @else {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            Need scikit-learn and multiple products for clustering.
          </div>
        }

        @if (mlRows.length) {
          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="chartType"
              [data]="chartData"
              [options]="chartOptions"
            ></canvas>
          </div>
        } @else {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            Install scikit-learn to run ML-driven multiple predictions.
          </div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechComparativeMlValuationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private isRefreshing = false;
  private pendingRefresh = false;

  clusterRows: ClusterRow[] = [];
  mlRows: MlMultipleRow[] = [];
  errorMessage = '';
  chartType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatMultiple(Number(ctx.parsed.y ?? 0))}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => this.formatMultiple(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.2, borderWidth: 2 },
      point: { radius: 2 },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.refreshDynamicTables();
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshDynamicTables());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshDynamicTables(): void {
    if (this.isRefreshing) {
      this.pendingRefresh = true;
      return;
    }
    this.isRefreshing = true;
    this.errorMessage = '';

    this.biotechModelService
      .getReportBundleV2()
      .pipe(take(1))
      .subscribe({
        next: (bundle) => {
          const tables = bundle?.chart_tables ?? {};
          this.applyClusterTable(tables['analytics_clustering']);
          this.applyMlMultipleTable(tables['analytics_ml_multiple']);
          this.isRefreshing = false;
          if (this.pendingRefresh) {
            this.pendingRefresh = false;
            this.refreshDynamicTables();
          }
        },
        error: (err: Error) => {
          this.errorMessage =
            err?.message || 'Unable to load comparative and ML-based valuation data.';
          this.applyClusterTable(undefined);
          this.applyMlMultipleTable(undefined);
          this.isRefreshing = false;
          if (this.pendingRefresh) {
            this.pendingRefresh = false;
            this.refreshDynamicTables();
          }
        },
      });
  }

  private applyClusterTable(payload?: TablePayload): void {
    const rows = this.tablePayloadToRows(payload);
    this.clusterRows = rows
      .map((row) => ({
        product: String(row['Product'] ?? row['product'] ?? '').trim(),
        cluster: this.toNumber(row['Cluster'] ?? row['cluster']),
      }))
      .filter((row) => row.product.length > 0);
  }

  private applyMlMultipleTable(payload?: TablePayload): void {
    const rows = this.tablePayloadToRows(payload);
    this.mlRows = rows
      .map((row, idx) => ({
        year: this.resolveYear(row['Year'] ?? row['year'] ?? row['__index'], idx),
        predictedMultiple: this.toNumber(
          row['Predicted multiple'] ?? row['predicted_multiple'] ?? row['predictedMultiple']
        ),
      }))
      .filter((row) => row.year !== '');

    if (!this.mlRows.length) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    this.chartData = {
      labels: this.mlRows.map((row) => String(row.year)),
      datasets: [
        {
          label: 'Predicted multiple',
          data: this.mlRows.map((row) => row.predictedMultiple),
          borderColor: '#93c5fd',
          backgroundColor: 'rgba(147, 197, 253, 0.3)',
          pointBackgroundColor: '#93c5fd',
          pointBorderColor: '#93c5fd',
        },
      ],
    };
  }

  private tablePayloadToRows(payload?: TablePayload): Array<Record<string, unknown>> {
    if (!payload || !payload.data || typeof payload.data !== 'object') {
      return [];
    }
    const columns = Object.keys(payload.data);
    if (!columns.length) {
      return [];
    }
    const rowCount = Math.max(
      0,
      ...columns.map((column) =>
        Array.isArray(payload.data?.[column]) ? payload.data[column].length : 0
      )
    );
    const indexValues = Array.isArray(payload.index) ? payload.index : [];
    const indexName =
      typeof payload.index_name === 'string' && payload.index_name.trim()
        ? payload.index_name
        : '__index';
    const rows: Array<Record<string, unknown>> = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row: Record<string, unknown> = {};
      if (rowIndex < indexValues.length) {
        row[indexName] = indexValues[rowIndex];
        row['__index'] = indexValues[rowIndex];
      }
      for (const column of columns) {
        const values = payload.data[column];
        row[column] = Array.isArray(values) ? values[rowIndex] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }

  private toNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private resolveYear(value: unknown, fallbackIndex: number): string | number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : value;
    }
    return fallbackIndex + 1;
  }

  private formatMultiple(value: number): string {
    if (!Number.isFinite(value)) {
      return '0.000';
    }
    return value.toFixed(3);
  }
}

