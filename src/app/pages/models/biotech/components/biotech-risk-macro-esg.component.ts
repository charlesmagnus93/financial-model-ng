import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

@Component({
  standalone: true,
  selector: 'app-biotech-risk-macro-esg',
  imports: [CommonModule, FormsModule, FieldsetModule, SliderModule, NgChartsModule],
  template: `
    <p-fieldset
      legend="Risk, copulas, macro &amp; ESG linkages"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-6">
        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="scatterType"
            [data]="scatterData"
            [options]="scatterOptions"
          ></canvas>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Inflation</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ formatDecimal(inflation) }}
            </div>
            <p-slider
              [(ngModel)]="inflation"
              [min]="0"
              [max]="0.15"
              [step]="0.005"
              (ngModelChange)="onMacroInputsChanged()"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">GDP growth</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ formatDecimal(gdpGrowth) }}
            </div>
            <p-slider
              [(ngModel)]="gdpGrowth"
              [min]="-0.05"
              [max]="0.1"
              [step]="0.005"
              (ngModelChange)="onMacroInputsChanged()"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">FX depreciation</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ formatDecimal(fxDepreciation) }}
            </div>
            <p-slider
              [(ngModel)]="fxDepreciation"
              [min]="-0.1"
              [max]="0.2"
              [step]="0.005"
              (ngModelChange)="onMacroInputsChanged()"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Market sentiment</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ formatDecimal(marketSentiment) }}
            </div>
            <p-slider
              [(ngModel)]="marketSentiment"
              [min]="-0.3"
              [max]="0.3"
              [step]="0.01"
              (ngModelChange)="onMacroInputsChanged()"
            ></p-slider>
          </div>
        </div>

        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="lineType"
            [data]="lineData"
            [options]="lineOptions"
          ></canvas>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Carbon price ($/t)</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ carbonPrice | number: '1.0-0' }}
            </div>
            <p-slider
              [(ngModel)]="carbonPrice"
              [min]="0"
              [max]="200"
              [step]="1"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Emissions (kt)</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ emissionsKt | number: '1.0-0' }}
            </div>
            <p-slider
              [(ngModel)]="emissionsKt"
              [min]="0"
              [max]="500"
              [step]="1"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Renewable share</div>
            <div class="text-xs text-red-400 font-semibold text-center">
              {{ formatDecimal(renewableShare) }}
            </div>
            <p-slider
              [(ngModel)]="renewableShare"
              [min]="0"
              [max]="1"
              [step]="0.01"
            ></p-slider>
          </div>
        </div>

        <div class="text-sm font-semibold">
          ESG-adjusted annual carbon cost: {{ formatNumber(esgCost) }}
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm font-semibold">Market intelligence sentiment</div>
          <div class="text-xs text-red-400 font-semibold text-center">
            {{ formatDecimal(marketIntelligence) }}
          </div>
          <p-slider
            [(ngModel)]="marketIntelligence"
            [min]="-1"
            [max]="1"
            [step]="0.01"
          ></p-slider>
        </div>

        <div class="text-sm font-semibold">
          Sentiment-adjusted revenue uplift:
          {{ formatSignedPercent(sentimentUpliftPct) }} applied to TAM during scenario planning.
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRiskMacroEsgComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private years: Array<string | number> = [];
  private revenueSeries: number[] = [];
  private ebitdaSeries: number[] = [];

  scatterType: ChartType = 'scatter';
  lineType: ChartType = 'line';
  scatterData: ChartConfiguration['data'] = { datasets: [] };
  lineData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  scatterOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true } },
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
  };

  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true } },
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
    elements: { line: { tension: 0.2, borderWidth: 2 }, point: { radius: 2 } },
  };

  inflation = 0.03;
  gdpGrowth = 0.02;
  fxDepreciation = 0.0;
  marketSentiment = 0.0;
  carbonPrice = 75;
  emissionsKt = 120;
  renewableShare = 0.35;
  marketIntelligence = 0.1;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.refreshFromOutput(this.biotechModelService.getOutputSnapshot());
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.refreshFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get esgCost(): number {
    return this.carbonPrice * this.emissionsKt * (1 - this.renewableShare);
  }

  get sentimentUpliftPct(): number {
    return this.marketIntelligence * 5;
  }

  onMacroInputsChanged(): void {
    this.rebuildMacroChart();
  }

  formatDecimal(value: number): string {
    return value.toFixed(2);
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  formatSignedPercent(value: number): string {
    const formatted = `${Math.abs(value).toFixed(1)}%`;
    if (value > 0) {
      return `+${formatted}`;
    }
    if (value < 0) {
      return `-${formatted}`;
    }
    return '0.0%';
  }

  private refreshFromOutput(output: any): void {
    const snapshot = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = snapshot?.consolidated ?? {};
    this.years = Array.isArray(consolidated?.index)
      ? consolidated.index.map((value: unknown) => this.normaliseYear(value))
      : [];
    this.revenueSeries = this.asFiniteNumberArray(consolidated?.data?.['revenue']);
    this.ebitdaSeries = this.asFiniteNumberArray(consolidated?.data?.['ebitda']);
    this.rebuildCopulaScatter();
    this.rebuildMacroChart();
  }

  private rebuildCopulaScatter(): void {
    if (!this.revenueSeries.length || !this.ebitdaSeries.length) {
      this.scatterData = { datasets: [] };
      return;
    }

    const draws = 2000;
    const rho = 0.4;
    const revenueSamples = this.generateCopulaSeries(
      this.mean(this.revenueSeries),
      this.stdPopulation(this.revenueSeries),
      draws,
      rho,
      42
    );
    const ebitdaSamples = this.generateCopulaSeries(
      this.mean(this.ebitdaSeries),
      this.stdPopulation(this.ebitdaSeries),
      draws,
      rho,
      84
    );

    this.scatterData = {
      datasets: [
        {
          label: 'EBITDA',
          data: ebitdaSamples.map((value, idx) => ({ x: idx, y: value })),
          borderColor: '#8fd3ff',
          backgroundColor: 'rgba(143, 211, 255, 0.65)',
          pointRadius: 3,
        },
        {
          label: 'Revenue',
          data: revenueSamples.map((value, idx) => ({ x: idx, y: value })),
          borderColor: '#1d8cf8',
          backgroundColor: 'rgba(29, 140, 248, 0.7)',
          pointRadius: 3,
        },
      ],
    };
  }

  private rebuildMacroChart(): void {
    const labels =
      this.years.length === this.revenueSeries.length
        ? this.years
        : this.revenueSeries.map((_, idx) => idx + 1);
    const macroMultiplier =
      1 +
      this.inflation +
      this.gdpGrowth +
      this.marketSentiment -
      this.fxDepreciation;
    const macroAdjusted = this.revenueSeries.map((value) => value * macroMultiplier);
    this.lineData = {
      labels,
      datasets: [
        {
          label: 'Original',
          data: this.revenueSeries,
          borderColor: '#1d8cf8',
          backgroundColor: '#1d8cf8',
          pointBackgroundColor: '#1d8cf8',
          pointBorderColor: '#1d8cf8',
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: 'Macro-adjusted',
          data: macroAdjusted,
          borderColor: '#8fd3ff',
          backgroundColor: '#8fd3ff',
          pointBackgroundColor: '#8fd3ff',
          pointBorderColor: '#8fd3ff',
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    };
  }

  private generateCopulaSeries(
    mean: number,
    std: number,
    draws: number,
    rho: number,
    seed: number
  ): number[] {
    const series: number[] = [];
    const rng = this.createSeededRng(seed);
    const safeStd = Number.isFinite(std) && std > 0 ? std : 0;
    const corr = Math.max(-0.999, Math.min(0.999, rho));
    const corrScale = Math.sqrt(1 - corr * corr);

    for (let i = 0; i < draws; i += 1) {
      const u1 = Math.max(1e-12, rng());
      const u2 = Math.max(1e-12, rng());
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      const correlated = corr * z1 + corrScale * z2;
      series.push(mean + safeStd * correlated);
    }
    return series;
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

  private normaliseYear(value: unknown): string | number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const year = Number(value);
      return Number.isFinite(year) ? year : value;
    }
    return '';
  }

  private mean(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private stdPopulation(values: number[]): number {
    if (values.length < 2) {
      return 0;
    }
    const avg = this.mean(values);
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private asFiniteNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value)) as number[];
  }
}

