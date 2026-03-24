import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { finalize, take } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface TornadoRow {
  year: string | number;
  driver: string;
  change: number;
  shock: number;
  rnpv: number;
  delta: number;
}

interface SpiderRow {
  year: string | number;
  driver: string;
  shock: number;
  rnpv: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-tornado-diagnostics',
  imports: [
    CommonModule,
    TableModule,
    FieldsetModule,
    ButtonModule,
    NgChartsModule,
  ],
  template: `
    <p-fieldset
      legend="Tornado &amp; spider diagnostics"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <p-button
            label="Compute tornado/spider diagnostics"
            [outlined]="true"
            [loading]="isLoading"
            [disabled]="isLoading"
            (onClick)="runDiagnostics()"
          ></p-button>
        </div>

        @if (!hasRun && !errorMessage) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            Run diagnostics to populate tornado/spider outputs.
          </div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }

        @if (hasRun && !tornadoRows.length && !errorMessage) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            No tornado diagnostics returned.
          </div>
        }

        @if (tornadoRows.length) {
          <div class="overflow-auto rounded">
            <p-table
              [value]="tornadoRows"
              showGridlines
              responsiveLayout="scroll"
              class="text-sm"
              [scrollable]="true"
              scrollHeight="300px"
              [size]="'small'"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Year</th>
                  <th>Driver</th>
                  <th>Change</th>
                  <th>Shock %</th>
                  <th class="text-right">rNPV</th>
                  <th class="text-right">Delta</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.year }}</td>
                  <td class="font-semibold">{{ row.driver }}</td>
                  <td>{{ formatSignedPercent(row.change) }}</td>
                  <td>{{ formatShock(row.shock) }}</td>
                  <td class="text-right">{{ formatNumber(row.rnpv) }}</td>
                  <td class="text-right">{{ formatSignedNumber(row.delta) }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="tornadoChartType"
              [data]="tornadoChartData"
              [options]="tornadoChartOptions"
            ></canvas>
          </div>
        }

        @if (spiderRows.length) {
          <div class="overflow-auto rounded">
            <p-table
              [value]="spiderRows"
              showGridlines
              responsiveLayout="scroll"
              class="text-sm"
              [scrollable]="true"
              scrollHeight="260px"
              [size]="'small'"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Year</th>
                  <th>Driver</th>
                  <th>Shock %</th>
                  <th class="text-right">rNPV</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.year }}</td>
                  <td class="font-semibold">{{ row.driver }}</td>
                  <td>{{ formatSignedPercent(row.shock) }}</td>
                  <td class="text-right">{{ formatNumber(row.rnpv) }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="spiderChartType"
              [data]="spiderChartData"
              [options]="spiderChartOptions"
            ></canvas>
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechTornadoDiagnosticsComponent {
  private readonly spiderDriverOrder = [
    'Revenue',
    'COGS',
    'Discount rate',
    'Success probability',
  ];

  private readonly spiderDriverColorMap: Record<string, string> = {
    Revenue: '#636EFA',
    COGS: '#EF553B',
    'Discount rate': '#00CC96',
    'Success probability': '#AB63FA',
  };

  hasRun = false;
  isLoading = false;
  errorMessage = '';
  tornadoRows: TornadoRow[] = [];
  spiderRows: SpiderRow[] = [];

  tornadoChartType: ChartType = 'bar';
  spiderChartType: ChartType = 'line';
  tornadoChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  spiderChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  tornadoChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: true, position: 'bottom', labels: { color: '#cbd5e1' } },
      title: { display: true, text: 'Tornado impact', color: '#2e333a' },
      tooltip: {
        callbacks: {
          label: (ctx) => `Delta: ${this.formatSignedNumber(Number(ctx.parsed.x ?? 0))}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  spiderChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 16 },
      },
      title: { display: true, text: 'Spider diagnostics', color: '#2e333a' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(Number(ctx.parsed.y ?? 0))}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Shock', color: '#2e333a' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'rNPV', color: '#2e333a' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  runDiagnostics(): void {
    if (this.isLoading) {
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.biotechModelService
      .runDiagnostics()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.hasRun = true;
          this.applyTornadoRows(response?.tornado);
          this.applySpiderRows(response?.spider);
          this.rebuildTornadoChart();
          this.rebuildSpiderChart();
        },
        error: (err: unknown) => {
          this.hasRun = false;
          this.errorMessage = this.resolveErrorMessage(err, 'Diagnostics API call failed.');
          this.tornadoRows = [];
          this.spiderRows = [];
          this.tornadoChartData = { labels: [], datasets: [] };
          this.spiderChartData = { labels: [], datasets: [] };
        },
      });
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  formatSignedNumber(value: number): string {
    const formatted = formatNumberEnglish(value);
    if (value > 0) {
      return `+${formatted}`;
    }
    if (value < 0) {
      return formatted;
    }
    return '+0';
  }

  formatSignedPercent(value: number): string {
    const pct = `${Math.abs(value * 100).toFixed(0)}%`;
    if (value > 0) {
      return `+${pct}`;
    }
    if (value < 0) {
      return `-${pct}`;
    }
    return '+0%';
  }

  formatShock(value: number): string {
    return Number.isFinite(value) ? value.toFixed(6) : '0.000000';
  }

  private applyTornadoRows(payload: unknown): void {
    const rows = this.tablePayloadToRows(payload)
      .map((entry) => ({
        year: this.resolveYearValue(entry['Year'] ?? entry['year'] ?? entry['__index']),
        driver: String(entry['Driver'] ?? entry['driver'] ?? '').trim(),
        change: this.toNumber(
          entry['Shock %'],
          this.percentStringToRatio(entry['Change'])
        ),
        shock: this.toNumber(
          entry['Shock %'],
          this.percentStringToRatio(entry['Change'])
        ),
        rnpv: this.toNumber(entry['rNPV']),
        delta: this.toNumber(entry['Delta']),
      }))
      .filter((row) => row.driver.length > 0);
    this.tornadoRows = rows;
  }

  private applySpiderRows(payload: unknown): void {
    const rows = this.tablePayloadToRows(payload)
      .map((entry) => ({
        year: this.resolveYearValue(entry['Year'] ?? entry['year'] ?? entry['__index']),
        driver: String(entry['Driver'] ?? entry['driver'] ?? '').trim(),
        shock: this.toNumber(
          entry['Shock %'],
          this.percentStringToRatio(entry['Change'])
        ),
        rnpv: this.toNumber(entry['rNPV']),
      }))
      .filter((row) => row.driver.length > 0);
    this.spiderRows = rows;
  }

  private rebuildTornadoChart(): void {
    if (!this.tornadoRows.length) {
      this.tornadoChartData = { labels: [], datasets: [] };
      return;
    }
    const positive = this.tornadoRows.map((row) => (row.delta >= 0 ? row.delta : 0));
    const negative = this.tornadoRows.map((row) => (row.delta < 0 ? row.delta : 0));

    this.tornadoChartData = {
      labels: this.tornadoRows.map((row) => row.driver),
      datasets: [
        {
          label: 'Positive',
          data: positive,
          backgroundColor: '#38bdf8',
          borderColor: '#38bdf8',
          borderWidth: 1,
        },
        {
          label: 'Negative',
          data: negative,
          backgroundColor: '#f87171',
          borderColor: '#f87171',
          borderWidth: 1,
        },
      ],
    };
  }

  private rebuildSpiderChart(): void {
    if (!this.spiderRows.length) {
      this.spiderChartData = { labels: [], datasets: [] };
      return;
    }
    const uniqueShocks = [...new Set(this.spiderRows.map((row) => row.shock))].sort(
      (a, b) => a - b
    );
    const labels = uniqueShocks.map((shock) => this.formatSignedPercent(shock));
    const drivers = [...new Set(this.spiderRows.map((row) => row.driver))].sort((a, b) => {
      const ai = this.driverOrderIndex(a);
      const bi = this.driverOrderIndex(b);
      if (ai !== bi) {
        return ai - bi;
      }
      return a.localeCompare(b);
    });

    const palette = [
      '#38bdf8',
      '#ef4444',
      '#f59e0b',
      '#22c55e',
      '#a855f7',
      '#eab308',
      '#06b6d4',
      '#f97316',
    ];

    const datasets = drivers.map((driver, idx) => {
      const byShock = new Map<number, number>();
      this.spiderRows
        .filter((row) => row.driver === driver)
        .forEach((row) => byShock.set(row.shock, row.rnpv));
      const color = this.spiderDriverColorMap[driver] ?? palette[idx % palette.length];
      return {
        label: driver,
        data: uniqueShocks.map((shock) => byShock.get(shock) ?? null),
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 2,
        tension: 0,
      };
    });

    this.spiderChartData = {
      labels,
      datasets,
    };
  }

  private toNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  private percentStringToRatio(value: unknown): number {
    if (typeof value !== 'string') {
      return 0;
    }
    const match = /(-?\d+(?:\.\d+)?)\s*%/.exec(value);
    if (!match) {
      return 0;
    }
    return Number(match[1]) / 100;
  }

  private tablePayloadToRows(payload: unknown): Array<Record<string, unknown>> {
    if (!payload || typeof payload !== 'object') {
      return [];
    }
    const maybePayload = payload as {
      data?: Record<string, unknown[]>;
      index?: unknown[];
      index_name?: string;
    };
    const data = maybePayload.data;
    if (!data || typeof data !== 'object') {
      return [];
    }
    const columns = Object.keys(data);
    if (!columns.length) {
      return [];
    }
    const rowCount = Math.max(
      0,
      ...columns.map((column) =>
        Array.isArray(data[column]) ? (data[column] as unknown[]).length : 0
      )
    );
    const indexValues = Array.isArray(maybePayload.index) ? maybePayload.index : [];
    const indexName =
      typeof maybePayload.index_name === 'string' && maybePayload.index_name.trim()
        ? maybePayload.index_name
        : 'Year';
    const rows: Array<Record<string, unknown>> = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row: Record<string, unknown> = {};
      if (rowIndex < indexValues.length) {
        row[indexName] = indexValues[rowIndex];
        row['__index'] = indexValues[rowIndex];
      }
      for (const column of columns) {
        const values = data[column];
        row[column] = Array.isArray(values) ? values[rowIndex] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const maybeError = error as { message?: string; error?: unknown };
      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
      if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
        return maybeError.error;
      }
      if (maybeError.error && typeof maybeError.error === 'object') {
        const inner = maybeError.error as { detail?: string; message?: string };
        if (typeof inner.detail === 'string' && inner.detail.trim()) {
          return inner.detail;
        }
        if (typeof inner.message === 'string' && inner.message.trim()) {
          return inner.message;
        }
      }
    }
    return fallback;
  }

  private resolveYearValue(value: unknown): string | number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : value;
    }
    return '';
  }

  private driverOrderIndex(driver: string): number {
    const index = this.spiderDriverOrder.indexOf(driver);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }
}
