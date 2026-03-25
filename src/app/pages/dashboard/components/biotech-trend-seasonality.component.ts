import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Subject, take, takeUntil } from 'rxjs';
import {
  BiotechModelService,
  TablePayload,
} from '../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface SegmentationRow {
  product: string;
  revenueShare: number;
  ebitdaMargin: number;
  fcffProxy: number;
}

interface DecompositionSeriesConfig {
  key: 'observed' | 'trend' | 'seasonal' | 'resid';
  label: string;
  color: string;
}

@Component({
  standalone: true,
  selector: 'app-biotech-trend-seasonality',
  imports: [CommonModule, TableModule, FieldsetModule, NgChartsModule],
  template: `
    <p-fieldset
      legend="Trend, seasonality &amp; segmentation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-6">
        @if (!hasDecomposition) {
          <div class="rounded-lg bg-blue-900/40 px-4 py-3 text-sm text-blue-500">
            Need more history to decompose trend/seasonality.
          </div>
        } @else {
          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="trendChartType"
              [data]="trendChartData"
              [options]="trendChartOptions"
            ></canvas>
          </div>
        }

        @if (rows.length) {
          <div class="overflow-auto">
            <p-table
              [value]="rows"
              showGridlines
              responsiveLayout="scroll"
              class="text-sm"
              [size]="'small'"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Product</th>
                  <th>Revenue share</th>
                  <th>EBITDA margin</th>
                  <th>FCFF (PV proxy)</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.product }}</td>
                  <td>{{ formatPercent(row.revenueShare) }}</td>
                  <td>{{ formatPercent(row.ebitdaMargin) }}</td>
                  <td>{{ formatNumber(row.fcffProxy) }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="shareChartType"
              [data]="shareChartData"
              [options]="shareChartOptions"
            ></canvas>
          </div>
        } @else {
          <div class="rounded-lg bg-surface-900 px-4 py-3 text-sm text-surface-300">
            Add probability-weighted products to see segmentation insights.
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
export class BiotechTrendSeasonalityComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private isRefreshing = false;
  private pendingRefresh = false;
  private readonly decompositionSeries: DecompositionSeriesConfig[] = [
    { key: 'observed', label: 'Observed', color: '#93c5fd' },
    { key: 'trend', label: 'Trend', color: '#ef4444' },
    { key: 'seasonal', label: 'Seasonal', color: '#fca5a5' },
    { key: 'resid', label: 'Residual', color: '#38bdf8' },
  ];

  rows: SegmentationRow[] = [];
  hasDecomposition = false;
  errorMessage = '';

  trendChartType: ChartType = 'line';
  trendChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  trendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
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
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 2 },
    },
  };

  shareChartType: ChartType = 'bar';
  shareChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  shareChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue share: ${this.formatPercent(ctx.parsed.y ?? 0)}`,
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
          callback: (v) => this.formatPercent(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        min: 0,
        max: 1,
      },
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

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
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
          const charts = bundle?.chart_tables ?? {};
          this.applyDecomposition(charts['analytics_decomposition']);
          this.applySegmentation(charts['analytics_segmentation']);
          this.isRefreshing = false;
          if (this.pendingRefresh) {
            this.pendingRefresh = false;
            this.refreshDynamicTables();
          }
        },
        error: (err: Error) => {
          this.errorMessage = err?.message || 'Unable to load trend and segmentation data.';
          const output = this.biotechModelService.getOutputSnapshot() ?? {};
          this.applyDecomposition(undefined);
          this.applySegmentation(undefined, output);
          this.isRefreshing = false;
          if (this.pendingRefresh) {
            this.pendingRefresh = false;
            this.refreshDynamicTables();
          }
        },
      });
  }

  private applyDecomposition(payload?: TablePayload): void {
    const rows = this.tablePayloadToRows(payload);
    const labels = Array.isArray(payload?.index)
      ? payload!.index!.map((value) => String(value ?? ''))
      : [];
    if (!rows.length) {
      this.hasDecomposition = false;
      this.trendChartData = { labels: [], datasets: [] };
      return;
    }

    const observed = rows.map((row) => this.toOptionalNumber(row['observed']));
    const trend = rows.map((row) => this.toOptionalNumber(row['trend']));
    const seasonal = rows.map((row) => this.toOptionalNumber(row['seasonal']));
    const resid = rows.map((row) => this.toOptionalNumber(row['resid']));

    const hasAnySignal = [observed, trend, seasonal, resid]
      .flat()
      .some((value) => value !== null);
    if (!hasAnySignal) {
      this.hasDecomposition = false;
      this.trendChartData = { labels: [], datasets: [] };
      return;
    }

    const fallbackLabels = rows.map((_, index) => String(index + 1));
    const dataBySeries: Record<DecompositionSeriesConfig['key'], Array<number | null>> = {
      observed,
      trend,
      seasonal,
      resid,
    };
    this.hasDecomposition = true;
    this.trendChartData = {
      labels: labels.length === rows.length ? labels : fallbackLabels,
      datasets: this.decompositionSeries.map((series) => ({
        label: series.label,
        data: dataBySeries[series.key],
        borderColor: series.color,
        backgroundColor: series.color,
        pointBackgroundColor: series.color,
        pointBorderColor: series.color,
        pointRadius: 2,
      })),
    };
  }

  private applySegmentation(payload?: TablePayload, fallbackOutput?: any): void {
    const rows = this.tablePayloadToRows(payload);
    if (rows.length) {
      this.rows = rows
        .map((row) => ({
          product: String(row['Product'] ?? ''),
          revenueShare: this.toNumber(row['Revenue share']),
          ebitdaMargin: this.toNumber(row['EBITDA margin']),
          fcffProxy: this.toNumber(row['FCFF (PV proxy)']),
        }))
        .filter((row) => row.product);
    } else {
      this.rows = this.buildSegmentationFromOutput(
        fallbackOutput ?? this.biotechModelService.getOutputSnapshot()
      );
    }

    this.shareChartData = {
      labels: this.rows.map((row) => row.product),
      datasets: [
        {
          data: this.rows.map((row) => row.revenueShare),
          backgroundColor: '#93c5fd',
          borderRadius: 6,
        },
      ],
    };
  }

  private buildSegmentationFromOutput(output: any): SegmentationRow[] {
    const perProductProb = output?.per_product_prob ?? {};
    const source =
      perProductProb && typeof perProductProb === 'object' && Object.keys(perProductProb).length
        ? perProductProb
        : output?.per_product ?? {};
    const products = Object.keys(source ?? {});
    const aggregates = products.map((product) => {
      const data = source[product]?.data ?? {};
      const revenue = this.sumNumbers(data['revenue']);
      const ebitda = this.sumNumbers(data['ebitda']);
      const fcff = this.sumNumbers(data['fcff']);
      return { product, revenue, ebitda, fcff };
    });

    const totalRevenue = aggregates.reduce((sum, row) => sum + row.revenue, 0);
    return aggregates.map((row) => ({
      product: row.product,
      revenueShare: totalRevenue ? row.revenue / totalRevenue : 0,
      ebitdaMargin: row.revenue ? row.ebitda / row.revenue : 0,
      fcffProxy: row.fcff,
    }));
  }

  private toNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private toOptionalNumber(value: unknown): number | null {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
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
    const rows: Array<Record<string, unknown>> = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row: Record<string, unknown> = {};
      for (const column of columns) {
        const values = payload.data[column];
        row[column] = Array.isArray(values) ? values[rowIndex] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }

  private sumNumbers(values: unknown): number {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, v) => sum + Number(v ?? 0), 0);
  }
}
