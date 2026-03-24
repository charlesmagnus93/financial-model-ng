import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { finalize, take } from 'rxjs';
import {
  BiotechModelService,
  TablePayload,
} from '../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

@Component({
  standalone: true,
  selector: 'app-biotech-time-series-forecast',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    SelectModule,
    SliderModule,
    ButtonModule,
    NgChartsModule,
  ],
  template: `
    <p-fieldset
      legend="Time-series &amp; ML forecasting"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Series to forecast</div>
          <p-select
            [options]="seriesOptions"
            [(ngModel)]="series"
            (ngModelChange)="onSelectionChange()"
            optionLabel="label"
            optionValue="value"
            placeholder="Select series"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Forecast model</div>
          <p-select
            [options]="modelOptions"
            [(ngModel)]="model"
            (ngModelChange)="onSelectionChange()"
            optionLabel="label"
            optionValue="value"
            placeholder="Select model"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Forecast steps</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>{{ horizonMin }}</span>
            <span class="text-red-400">{{ steps | number }}</span>
            <span>{{ horizonMax }}</span>
          </div>
          <p-slider
            [(ngModel)]="steps"
            [min]="horizonMin"
            [max]="horizonMax"
            [step]="1"
          ></p-slider>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Run time-series model"
            [outlined]="true"
            [loading]="isLoading"
            [disabled]="isLoading"
            (onClick)="runModel()"
          ></p-button>
        </div>

        @if (missingDependencyMessage) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            {{ missingDependencyMessage }}
          </div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }

        @if (hasRun) {
          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="chartType"
              [data]="chartData"
              [options]="chartOptions"
            ></canvas>
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechTimeSeriesForecastComponent implements OnInit {
  series: 'revenue' | 'ebitda' = 'revenue';
  model: 'ARIMA' | 'Prophet' | 'LSTM' = 'ARIMA';
  steps = 10;
  horizonMin = 5;
  horizonMax = 10;
  seriesOptions = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'EBITDA', value: 'ebitda' }
  ];
  modelOptions = [
    { label: 'ARIMA', value: 'ARIMA' },
    { label: 'Prophet', value: 'Prophet' },
    { label: 'LSTM', value: 'LSTM' },
  ];
  modelCapabilities: Record<string, boolean> = {};
  missingDependencyMessage = '';
  errorMessage = '';
  isLoading = false;
  hasRun = false;
  chartType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => this.formatNumber(Number(ctx.parsed.y ?? 0)),
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
      line: { tension: 0.15, borderWidth: 1.5 },
      point: { radius: 1.5 },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.refreshHorizonBounds();
    this.loadForecastCapabilities();
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  onSelectionChange(): void {
    this.updateMissingDependencyMessage();
    this.errorMessage = '';
  }

  runModel(): void {
    if (this.isLoading) {
      return;
    }
    this.refreshHorizonBounds();
    this.errorMessage = '';
    const boundedSteps = Math.max(this.horizonMin, Math.min(this.horizonMax, Math.floor(this.steps)));
    this.steps = boundedSteps;
    this.isLoading = true;

    this.biotechModelService
      .runForecast({
        metric: this.series,
        method: this.model,
        steps: boundedSteps,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.steps = Number(response?.steps ?? boundedSteps);
          this.applyForecast(response?.forecast);
          this.hasRun = true;
        },
        error: (err) => {
          this.hasRun = false;
          this.chartData = { labels: [], datasets: [] };
          this.errorMessage = this.resolveErrorMessage(err, 'Forecast failed.');
        },
      });
  }

  private loadForecastCapabilities(): void {
    this.biotechModelService
      .getForecastCapabilities()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.modelCapabilities = response?.models ?? {};
          this.updateMissingDependencyMessage();
        },
        error: () => {
          this.modelCapabilities = {};
          this.updateMissingDependencyMessage();
        },
      });
  }

  private refreshHorizonBounds(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const configured = Number(
      snapshot?.model_config?.n_years ??
        snapshot?.generalAssumptions?.numberOfYears ??
        5
    );
    const boundedConfigured =
      Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : 5;
    this.horizonMax = Math.max(5, boundedConfigured);
    this.steps = Math.max(this.horizonMin, Math.min(this.horizonMax, this.steps || 10));
  }

  private updateMissingDependencyMessage(): void {
    const supported = this.modelCapabilities?.[this.model];
    if (supported !== false) {
      this.missingDependencyMessage = '';
      return;
    }
    const dependencyMap: Record<string, string> = {
      ARIMA: 'statsmodels',
      Prophet: 'prophet',
      LSTM: 'tensorflow',
    };
    const dependency = dependencyMap[this.model] ?? this.model.toLowerCase();
    this.missingDependencyMessage = `Install \`${dependency}\` to use the ${this.model} forecast model.`;
  }

  private applyForecast(payload?: TablePayload): void {
    const rows = this.tablePayloadToRows(payload);
    if (!rows.length || !payload?.data) {
      this.chartData = { labels: [], datasets: [] };
      this.hasRun = false;
      return;
    }

    const columns = Object.keys(payload.data);
    const forecastColumn =
      columns.find((column) =>
        (payload.data?.[column] ?? []).some((value) => Number.isFinite(Number(value)))
      ) ?? columns[0];
    const values = rows.map((row) => this.toNumber(row[forecastColumn]));
    const labels = rows.map((row, index) => this.resolveLabel(row['__index'], index));

    this.chartData = {
      labels,
      datasets: [
        {
          label: forecastColumn,
          data: values,
          borderColor: '#93c5fd',
          backgroundColor: 'rgba(147, 197, 253, 0.2)',
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
    const rows: Array<Record<string, unknown>> = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row: Record<string, unknown> = {
        __index: rowIndex < indexValues.length ? indexValues[rowIndex] : rowIndex + 1,
      };
      for (const column of columns) {
        const values = payload.data[column];
        row[column] = Array.isArray(values) ? values[rowIndex] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }

  private resolveLabel(value: unknown, fallbackIndex: number): string {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    return String(fallbackIndex + 1);
  }

  private toNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
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
}
