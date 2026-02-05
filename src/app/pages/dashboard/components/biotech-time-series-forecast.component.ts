import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
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
            optionLabel="label"
            optionValue="value"
            placeholder="Select model"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Forecast steps</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>2</span>
            <!-- <span>{{ steps }}</span> -->
            <span>25</span>
          </div>
          <p-slider [(ngModel)]="steps" [min]="5" [max]="25" [step]="1"></p-slider>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Run time-series model"
            [outlined]="true"
            (onClick)="runModel()"
          ></p-button>
        </div>

        @if (!hasRun) {
          <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
            Forecasting uses historical revenue. Current base rNPV:
            <span class="font-semibold">{{ formatNumber(baseRnpv) }}</span>
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
  series = 'revenue';
  model = 'ARIMA';
  steps = 10;
  seriesOptions = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'EBITDA', value: 'ebitda' }
  ];
  modelOptions = [
    { label: 'ARIMA', value: 'ARIMA' },
    { label: 'Prophet', value: 'Prophet' },
    { label: 'LSTM', value: 'LSTM' },
  ];
  baseRnpv = 0;
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
      point: { radius: 0 },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    this.baseRnpv = Number(output?.rnpv ?? 0);
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  runModel(): void {
    this.hasRun = true;
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const seriesValues = this.asNumberArray(data[this.series]);
    const history = seriesValues.filter((v) => Number.isFinite(v));
    const lastValue = history.length ? history[history.length - 1] : 0;
    const horizon = Math.max(1, Math.floor(this.steps));

    const forecastLabels: string[] = [];
    const forecastValues: number[] = [];
    const lastYear = years.length ? years[years.length - 1] : new Date().getFullYear();
    const monthLabels = ['April', 'July', 'October'];

    for (let i = 1; i <= horizon; i += 1) {
      const year = lastYear + Math.floor((i - 1) / 3) + 1;
      const month = monthLabels[(i - 1) % 3];
      forecastLabels.push(`${year} ${month}`);
      forecastValues.push(lastValue);
    }

    this.chartData = {
      labels: forecastLabels,
      datasets: [
        {
          data: forecastValues,
          borderColor: '#93c5fd',
          backgroundColor: 'transparent',
        },
      ],
    };
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

}
