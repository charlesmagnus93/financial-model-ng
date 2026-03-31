import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { finalize, take } from 'rxjs';
import {
  BiotechModelService,
  BiotechMonteCarloResponse,
  BiotechMonteCarloSimulationPayload,
  TablePayload,
} from '../../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

@Component({
  standalone: true,
  selector: 'app-biotech-monte-carlo-probabilistic',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    NgChartsModule,
  ],
  template: `
    <p-fieldset
      legend="Monte Carlo &amp; probabilistic valuation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-3 flex flex-col gap-2">
            <div class="text-xs font-semibold">Simulations</div>
            <p-inputnumber
              [(ngModel)]="simulations"
              [showButtons]="true"
              [min]="100"
              [max]="5000"
              [step]="100"
              [useGrouping]="false"
              inputStyleClass="w-full"
            />
          </div>
          <div class="col-span-3 flex flex-col gap-2">
            <div class="text-xs font-semibold">Revenue distribution</div>
            <p-select
              [options]="distributionOptions"
              [(ngModel)]="revenueDistribution"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-3 flex flex-col gap-2">
            <div class="text-xs font-semibold">Cost distribution</div>
            <p-select
              [options]="distributionOptions"
              [(ngModel)]="costDistribution"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-3 flex flex-col gap-2">
            <div class="text-xs font-semibold">Random seed</div>
            <p-inputnumber
              [(ngModel)]="randomSeed"
              [showButtons]="true"
              [min]="0"
              [useGrouping]="false"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Revenue sigma</div>
            <p-inputnumber
              [(ngModel)]="revenueSigma"
              [showButtons]="true"
              [min]="0.01"
              [max]="0.5"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Cost sigma</div>
            <p-inputnumber
              [(ngModel)]="costSigma"
              [showButtons]="true"
              [min]="0.01"
              [max]="0.5"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Revenue min (uniform)</div>
            <p-inputnumber
              [(ngModel)]="revenueMin"
              [showButtons]="true"
              [min]="0"
              [step]="0.05"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Revenue max (uniform)</div>
            <p-inputnumber
              [(ngModel)]="revenueMax"
              [showButtons]="true"
              [min]="0"
              [step]="0.05"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Cost min (uniform)</div>
            <p-inputnumber
              [(ngModel)]="costMin"
              [showButtons]="true"
              [min]="0"
              [step]="0.05"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs font-semibold">Cost max (uniform)</div>
            <p-inputnumber
              [(ngModel)]="costMax"
              [showButtons]="true"
              [min]="0"
              [step]="0.05"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Run Monte Carlo simulation"
            [outlined]="true"
            [loading]="isRunning"
            [disabled]="isRunning"
            (onClick)="runSimulation()"
          ></p-button>
        </div>

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }

        @if (!hasRun && !errorMessage) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            {{ infoMessage }}
          </div>
        }

        @if (hasRun) {
          <div class="flex flex-col gap-6">
            <div class="grid grid-cols-12 gap-3 items-end">
              <div class="col-span-12 flex flex-col gap-2">
                <div class="h-64 md:h-[20rem]">
                  <canvas
                    baseChart
                    [type]="lineType"
                    [data]="lineData"
                    [options]="lineOptions"
                  ></canvas>
                </div>
              </div>
              <div class="col-span-12 flex flex-col gap-2">
                <div class="h-64 md:h-[20rem]">
                  <canvas
                    baseChart
                    [type]="barType"
                    [data]="histData"
                    [options]="barOptions"
                  ></canvas>
                </div>
                <div class="text-sm text-surface-500">
                  Mean rNPV: {{ formatNumber(stats.mean) }} | Std: {{ formatNumber(stats.std) }}
                  | VaR95: {{ formatNumber(stats.var95) }} | CVaR95: {{ formatNumber(stats.cvar95) }}
                </div>
              </div>
              <div class="col-span-12 flex flex-col gap-2">
                <div class="text-sm">
                  Probabilistic valuation percentiles:
                </div>
                <ul class="grid gap-2 md:grid-cols-3">
                  @for (row of percentileRows; track row.label) {
                    <li class="rounded flex justify-between px-3 py-2 text-sm">
                      <code class="text-xs text-surface-400">{{ row.label }}</code>
                      <code class="font-semibold">{{ formatNumber(row.value) }}</code>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechMonteCarloProbabilisticComponent {
  simulations = 1000;
  revenueDistribution = 'normal';
  costDistribution = 'normal';
  revenueSigma = 0.15;
  costSigma = 0.1;
  revenueMin = 0.8;
  revenueMax = 1.2;
  costMin = 0.8;
  costMax = 1.2;
  randomSeed = 42;

  hasRun = false;
  isRunning = false;
  errorMessage = '';
  infoMessage = 'Run the simulation to unlock probabilistic metrics.';

  lineType: ChartType = 'line';
  barType: ChartType = 'bar';
  lineData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  histData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: { line: { tension: 0.2, borderWidth: 1.5 }, point: { radius: 0 } },
  };
  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  stats = { mean: 0, std: 0, var95: 0, cvar95: 0 };
  percentileRows: Array<{ label: string; value: number }> = [];

  distributionOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Lognormal', value: 'lognormal' },
    { label: 'Uniform', value: 'uniform' },
  ];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  runSimulation(): void {
    if (this.isRunning) {
      return;
    }
    this.errorMessage = '';
    this.isRunning = true;

    const payload: BiotechMonteCarloSimulationPayload = {
      n_sims: this.clampInt(this.simulations, 100, 5000),
      revenue_sigma: this.clampNumber(this.revenueSigma, 0.01, 0.5),
      cost_sigma: this.clampNumber(this.costSigma, 0.01, 0.5),
      revenue_dist: String(this.revenueDistribution || 'normal').toLowerCase(),
      cost_dist: String(this.costDistribution || 'normal').toLowerCase(),
      revenue_min: this.toFiniteNumber(this.revenueMin, 0.8),
      revenue_max: this.toFiniteNumber(this.revenueMax, 1.2),
      cost_min: this.toFiniteNumber(this.costMin, 0.8),
      cost_max: this.toFiniteNumber(this.costMax, 1.2),
      random_seed: this.toOptionalInt(this.randomSeed),
      alpha: 0.95,
    };

    this.biotechModelService
      .runMonteCarlo(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.isRunning = false;
        })
      )
      .subscribe({
        next: (response) => this.applyMonteCarloResponse(response),
        error: (err: unknown) => {
          this.errorMessage = this.resolveErrorMessage(err, 'Monte Carlo API call failed.');
        },
      });
  }

  private applyMonteCarloResponse(response: BiotechMonteCarloResponse): void {
    const samples = this.extractNumericColumn(response?.simulations, 'rnpv_sim');
    if (!samples.length) {
      this.hasRun = false;
      this.infoMessage = 'Simulation payload did not include rnpv_sim values.';
      this.lineData = { labels: [], datasets: [] };
      this.histData = { labels: [], datasets: [] };
      this.stats = { mean: 0, std: 0, var95: 0, cvar95: 0 };
      this.percentileRows = [];
      return;
    }

    this.hasRun = true;
    this.infoMessage = 'Run the simulation to unlock probabilistic metrics.';

    this.lineData = {
      labels: samples.map((_, idx) => idx + 1),
      datasets: [
        {
          data: samples,
          borderColor: '#7dd3fc',
          backgroundColor: 'transparent',
        },
      ],
    };

    this.histData = this.buildHistogram(samples, 20);
    const fallbackStats = this.computeStats(samples);
    const summary = response?.summary ?? {};
    this.stats = {
      mean: this.toFiniteNumber(summary['mean'], fallbackStats.mean),
      std: this.toFiniteNumber(summary['std'], fallbackStats.std),
      var95: this.toFiniteNumber(summary['var'], fallbackStats.var95),
      cvar95: this.toFiniteNumber(summary['cvar'], fallbackStats.cvar95),
    };
    this.percentileRows = [
      { label: '0.1', value: this.percentile(samples, 0.1) },
      { label: '0.25', value: this.percentile(samples, 0.25) },
      { label: '0.5', value: this.percentile(samples, 0.5) },
      { label: '0.75', value: this.percentile(samples, 0.75) },
      { label: '0.9', value: this.percentile(samples, 0.9) },
    ];
  }

  private extractNumericColumn(payload: TablePayload | undefined, column: string): number[] {
    const values = payload?.data?.[column];
    if (!Array.isArray(values)) {
      return [];
    }
    const numeric = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    return numeric as number[];
  }

  private buildHistogram(values: number[], bins: number): ChartConfiguration['data'] {
    if (!values.length || bins <= 0) {
      return { labels: [], datasets: [] };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = (max - min) / bins || 1;
    const counts = Array.from({ length: bins }, () => 0);
    values.forEach((value) => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((value - min) / width)));
      counts[idx] += 1;
    });
    const labels = counts.map((_, i) => (min + i * width).toFixed(0));
    return {
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: '#93c5fd',
          borderColor: '#93c5fd',
        },
      ],
    };
  }

  private computeStats(values: number[]): { mean: number; std: number; var95: number; cvar95: number } {
    if (!values.length) {
      return { mean: 0, std: 0, var95: 0, cvar95: 0 };
    }
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const varianceNumerator = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
    const variance = values.length > 1 ? varianceNumerator / (values.length - 1) : 0;
    const std = Math.sqrt(variance);
    const var95 = this.percentile(values, 0.05);
    const tail = values.filter((value) => value <= var95);
    const cvar95 = tail.length ? tail.reduce((sum, value) => sum + value, 0) / tail.length : var95;
    return { mean, std, var95, cvar95 };
  }

  private percentile(values: number[], p: number): number {
    if (!values.length) {
      return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const clamped = Math.min(1, Math.max(0, p));
    const position = (sorted.length - 1) * clamped;
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    if (lower === upper) {
      return sorted[lower] ?? 0;
    }
    const weight = position - lower;
    const lowValue = sorted[lower] ?? 0;
    const highValue = sorted[upper] ?? lowValue;
    return lowValue + (highValue - lowValue) * weight;
  }

  private clampInt(value: unknown, min: number, max: number): number {
    const numeric = Math.floor(Number(value));
    if (!Number.isFinite(numeric)) {
      return min;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  private clampNumber(value: unknown, min: number, max: number): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return min;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  private toFiniteNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  private toOptionalInt(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return Math.floor(numeric);
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

