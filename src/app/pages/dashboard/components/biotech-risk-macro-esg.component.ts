import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
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
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Risk dispersion</div>
          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="scatterType"
              [data]="scatterData"
              [options]="scatterOptions"
            ></canvas>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Inflation</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0.00</span>
              <span>{{ formatPercent(inflation) }}</span>
              <span>0.10</span>
            </div>
            <p-slider [(ngModel)]="inflation" [min]="0" [max]="0.1" [step]="0.005"></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">GDP growth</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0.00</span>
              <span>{{ formatPercent(gdpGrowth) }}</span>
              <span>0.10</span>
            </div>
            <p-slider [(ngModel)]="gdpGrowth" [min]="0" [max]="0.1" [step]="0.005"></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">FX depreciation</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.05</span>
              <span>{{ formatPercent(fxDepreciation) }}</span>
              <span>0.05</span>
            </div>
            <p-slider [(ngModel)]="fxDepreciation" [min]="-0.05" [max]="0.05" [step]="0.005"></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Market sentiment</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.05</span>
              <span>{{ formatPercent(sentimentShift) }}</span>
              <span>0.05</span>
            </div>
            <p-slider [(ngModel)]="sentimentShift" [min]="-0.05" [max]="0.05" [step]="0.005"></p-slider>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Macro-adjusted revenue</div>
          <div class="h-64 md:h-[20rem]">
            <canvas
              baseChart
              [type]="lineType"
              [data]="lineData"
              [options]="lineOptions"
            ></canvas>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Carbon price ($/t)</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0</span>
              <span>{{ carbonPrice }}</span>
              <span>200</span>
            </div>
            <p-slider [(ngModel)]="carbonPrice" [min]="0" [max]="200" [step]="1"></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Emissions (kt)</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0</span>
              <span>{{ emissionsKt }}</span>
              <span>250</span>
            </div>
            <p-slider [(ngModel)]="emissionsKt" [min]="0" [max]="250" [step]="5"></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Renewable share</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0.00</span>
              <span>{{ formatPercent(renewableShare) }}</span>
              <span>1.00</span>
            </div>
            <p-slider [(ngModel)]="renewableShare" [min]="0" [max]="1" [step]="0.01"></p-slider>
          </div>
        </div>

        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          ESG-adjusted annual carbon cost:
          <span class="font-semibold">{{ formatNumber(esgCost) }}</span>
        </div>

        
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Market intelligence sentiment</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>-0.10</span>
            <span>{{ formatPercent(marketIntelligence) }}</span>
            <span>0.10</span>
          </div>
          <p-slider
            [(ngModel)]="marketIntelligence"
            [min]="-0.1"
            [max]="0.1"
            [step]="0.005"
          ></p-slider>
        </div>

        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Sentiment-adjusted revenue uplift: +{{ formatPercent(sentimentShift) }}
          applied to base revenue.
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRiskMacroEsgComponent implements OnInit {
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
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
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
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: { line: { tension: 0.25, borderWidth: 2 }, point: { radius: 2 } },
  };

  inflation = 0.03;
  gdpGrowth = 0.02;
  fxDepreciation = 0.0;
  sentimentShift = 0.01;
  carbonPrice = 75;
  emissionsKt = 120;
  renewableShare = 0.35;
  marketIntelligence = 0.0;
  esgCost = 0;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const revenue = this.asNumberArray(data['revenue']);
    const ebitda = this.asNumberArray(data['ebitda']);

    this.scatterData = {
      datasets: [
        {
          label: 'Revenue',
          data: years.map((year, idx) => ({ x: year, y: revenue[idx] ?? 0 })),
          backgroundColor: 'rgba(59, 130, 246, 0.65)',
        },
        {
          label: 'EBITDA',
          data: years.map((year, idx) => ({ x: year, y: ebitda[idx] ?? 0 })),
          backgroundColor: 'rgba(147, 197, 253, 0.65)',
        },
      ],
    };

    const macroMultiplier =
      1 +
      this.inflation +
      this.gdpGrowth -
      this.fxDepreciation +
      this.sentimentShift +
      this.marketIntelligence;
    const macroAdjusted = revenue.map((value) => (value ?? 0) * macroMultiplier);

    this.lineData = {
      labels: years,
      datasets: [
        {
          label: 'Macro-adjusted',
          data: macroAdjusted,
          borderColor: '#93c5fd',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'Original',
          data: revenue,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
      ],
    };

    this.esgCost = this.carbonPrice * this.emissionsKt * (1 - this.renewableShare) * 1000;
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
