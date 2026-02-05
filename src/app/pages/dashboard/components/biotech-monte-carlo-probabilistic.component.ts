import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
import biotechOutput from '../../../../../biotech_output.json';

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
              [min]="1"
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
              [min]="0"
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
              [min]="0"
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
              [step]="0.01"
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
              [step]="0.01"
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
              [step]="0.01"
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
              [step]="0.01"
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
            (onClick)="runSimulation()"
          ></p-button>
        </div>

        @if (!hasRun) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            Run the simulation to unlock probabilistic metrics.
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
                <div class="text-sm text-surface-300">
                  Mean rNPV: {{ formatNumber(stats.mean) }} | Std: {{ formatNumber(stats.std) }}
                  | VaR95: {{ formatNumber(stats.var95) }} | CVaR95: {{ formatNumber(stats.cvar95) }}
                </div>

              </div>
              <div class="col-span-12 flex flex-col gap-2">
                <div class="text-sm text-surface-300">
                  Probabilistic valuation percentiles:
                </div>
                <ul class=" gap-2 md:grid-cols-3">
                  @for (row of percentileRows; track row.label) {
                    <li class="rounded flex justify-between px-3 py-2 text-sm">
                      <code class="text-xs text-surface-400">{{ row.label }}</code>
                      <code class="font-semibold">{{ row.value }}</code>
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
export class BiotechMonteCarloProbabilisticComponent implements OnInit {
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
  baseRnpv = 0;
  hasRun = false;

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
          callback: (v) => this.formatNumber(Number(v)),
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

  constructor(private readonly biotechModelService: BiotechModelService) {}

  distributionOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Uniform', value: 'uniform' },
  ];

  ngOnInit(): void {
    const output = this.normalizeOutput(this.biotechModelService.getOutputSnapshot());
    this.baseRnpv = Number(output?.rnpv ?? 0);
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  runSimulation(): void {
    const base = Number.isFinite(this.baseRnpv) && this.baseRnpv !== 0 ? this.baseRnpv : 1;
    const samples = this.generateSamples(base, Math.max(1, Math.floor(this.simulations)));
    this.hasRun = true;

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
    this.stats = this.computeStats(samples);
    this.percentileRows = [
      { label: '0.1', value: this.percentile(samples, 0.1) },
      { label: '0.25', value: this.percentile(samples, 0.25) },
      { label: '0.5', value: this.percentile(samples, 0.5) },
      { label: '0.75', value: this.percentile(samples, 0.75) },
      { label: '0.9', value: this.percentile(samples, 0.9) },
    ];
  }

  private generateSamples(base: number, count: number): number[] {
    const rng = this.createSeededRng(this.randomSeed);
    const values: number[] = [];
    for (let i = 0; i < count; i += 1) {
      const revFactor = this.sampleFactor(
        rng,
        this.revenueDistribution,
        this.revenueSigma,
        this.revenueMin,
        this.revenueMax
      );
      const costFactor = this.sampleFactor(
        rng,
        this.costDistribution,
        this.costSigma,
        this.costMin,
        this.costMax
      );
      const adjusted = base * (revFactor - (costFactor - 1));
      values.push(adjusted);
    }
    return values;
  }

  private sampleFactor(
    rng: () => number,
    distribution: string,
    sigma: number,
    min: number,
    max: number
  ): number {
    if (distribution === 'uniform') {
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      return lo + (hi - lo) * rng();
    }
    const z = this.randn(rng);
    return 1 + z * sigma;
  }

  private randn(rng: () => number): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  private createSeededRng(seed: number): () => number {
    let t = Math.floor(seed) || 1;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  private buildHistogram(values: number[], bins: number): ChartConfiguration['data'] {
    if (!values.length) return { labels: [], datasets: [] };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = (max - min) / bins || 1;
    const counts = Array.from({ length: bins }, () => 0);
    values.forEach((v) => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((v - min) / width)));
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
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    const var95 = this.percentile(values, 0.05);
    const tail = values.filter((v) => v <= var95);
    const cvar95 = tail.length ? tail.reduce((sum, v) => sum + v, 0) / tail.length : var95;
    return { mean, std, var95, cvar95 };
  }

  private percentile(values: number[], p: number): number {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
    return sorted[idx] ?? 0;
  }

  private normalizeOutput(rawOutput: unknown): any {
    const fallback = biotechOutput as any;
    const output = rawOutput && typeof rawOutput === 'object' ? (rawOutput as any) : {};
    return {
      ...fallback,
      ...output,
    };
  }
}
