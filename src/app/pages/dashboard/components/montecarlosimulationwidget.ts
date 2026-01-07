import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FluidModule } from 'primeng/fluid';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

interface Option {
  label: string;
  value: string;
}

interface SummaryRow {
  metric: string;
  count: number;
  mean: number;
  std: number;
  min: number;
  p25: number;
  p50: number;
  p75: number;
  max: number;
}

@Component({
  standalone: true,
  selector: 'monte-carlo-simulation-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    MultiSelectModule,
    TableModule,
    FluidModule,
    NgChartsModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card w-full flex flex-col gap-4">
        <div class="text-2xl font-semibold">Monte Carlo Simulation Configuration</div>

        <form [formGroup]="form" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Iterations</div>
            <p-inputnumber
              formControlName="iterations"
              [showButtons]="true"
              [min]="100"
              [max]="100000"
              [step]="100"
              inputStyleClass="w-full"
              buttonLayout="horizontal"
              decrementButtonClass="p-button-text"
              incrementButtonClass="p-button-text"
              mode="decimal"
            ></p-inputnumber>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Minimum revenue growth</div>
            <p-inputnumber
              formControlName="minGrowth"
              [showButtons]="true"
              [step]="0.005"
              [minFractionDigits]="4"
              [maxFractionDigits]="4"
              inputStyleClass="w-full"
              buttonLayout="horizontal"
              decrementButtonClass="p-button-text"
              incrementButtonClass="p-button-text"
              mode="decimal"
            ></p-inputnumber>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Maximum revenue growth</div>
            <p-inputnumber
              formControlName="maxGrowth"
              [showButtons]="true"
              [step]="0.005"
              [minFractionDigits]="4"
              [maxFractionDigits]="4"
              inputStyleClass="w-full"
              buttonLayout="horizontal"
              decrementButtonClass="p-button-text"
              incrementButtonClass="p-button-text"
              mode="decimal"
            ></p-inputnumber>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Metrics to capture</div>
            <p-multiSelect
              formControlName="metrics"
              [options]="metricOptions"
              optionLabel="label"
              optionValue="value"
              display="chip"
              [showClear]="false"
              [filter]="false"
              styleClass="w-full"
            ></p-multiSelect>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Variables to randomise</div>
            <p-multiSelect
              formControlName="variables"
              [options]="variableOptions"
              optionLabel="label"
              optionValue="value"
              display="chip"
              [showClear]="false"
              [filter]="false"
              styleClass="w-full"
            ></p-multiSelect>
          </div>
        </form>

        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">NPV Distribution</div>
          <div class="h-96 md:h-[26rem]">
            <canvas
              baseChart
              [type]="histogramType"
              [data]="histogramData"
              [options]="histogramOptions"
            ></canvas>
          </div>
        </div>

        <p-table showGridlines [value]="summaryRows" class="shadow-none" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Metric</th>
              <th>count</th>
              <th>mean</th>
              <th>std</th>
              <th>min</th>
              <th>25%</th>
              <th>50%</th>
              <th>75%</th>
              <th>max</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.metric }}</td>
              <td>{{ row.count }}</td>
              <td>{{ row.mean | number: '1.0-4' }}</td>
              <td>{{ row.std | number: '1.0-4' }}</td>
              <td>{{ row.min | number: '1.0-4' }}</td>
              <td>{{ row.p25 | number: '1.0-4' }}</td>
              <td>{{ row.p50 | number: '1.0-4' }}</td>
              <td>{{ row.p75 | number: '1.0-4' }}</td>
              <td>{{ row.max | number: '1.0-4' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fluid>
  `,
})
export class MonteCarloSimulationWidget implements OnDestroy {
  form: FormGroup;
  metricOptions: Option[] = [
    { label: 'NPV', value: 'npv' },
    { label: 'Average Net Income', value: 'avgNetIncome' },
    { label: 'Average EBITDA', value: 'avgEbitda' },
    { label: 'Average Cash Flow', value: 'avgCashFlow' },
  ];

  variableOptions: Option[] = [
    { label: 'Revenue Growth', value: 'revenueGrowth' },
    { label: 'Cost of Materials', value: 'costofMaterials' },
    { label: 'Labour', value: 'labour' },
    { label: 'Tax Rate', value: 'TaxRate' },
    { label: 'Utility', value: 'utility' },
    { label: 'Senior Debt', value: 'seniorDebt' },
    { label: 'Other', value: 'other' },
  ];

  histogramType: ChartType = 'bar';
  histogramData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  histogramOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Count: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'NPV', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Count', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  summaryRows: SummaryRow[] = [];

  private subs = new Subscription();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      iterations: new FormControl<number>(1000),
      minGrowth: new FormControl<number>(0.05),
      maxGrowth: new FormControl<number>(0.15),
      metrics: new FormControl<string[]>(['npv', 'avgNetIncome', 'avgEbitda']),
      variables: new FormControl<string[]>(['revenueGrowth']),
    });

    this.subs.add(
      this.form.valueChanges.subscribe(() => this.runSimulation())
    );

    this.runSimulation();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private runSimulation(): void {
    const iterations = this.form.get('iterations')?.value ?? 1000;
    const minGrowth = this.form.get('minGrowth')?.value ?? 0.05;
    const maxGrowth = this.form.get('maxGrowth')?.value ?? 0.15;

    const simulatedNpv = this.generateNpvSamples(iterations, minGrowth, maxGrowth);
    this.buildHistogram(simulatedNpv);
    this.buildSummary(simulatedNpv);
  }

  private generateNpvSamples(iterations: number, minGrowth: number, maxGrowth: number): number[] {
    const samples: number[] = [];
    const meanGrowth = (minGrowth + maxGrowth) / 2;
    const stdGrowth = (maxGrowth - minGrowth) / 6 || 0.01; // rough spread

    for (let i = 0; i < iterations; i++) {
      const growthShock = this.randomNormal(meanGrowth, stdGrowth);
      const npvBase = 350_000; // base value
      const noise = this.randomNormal(0, 80_000);
      samples.push(npvBase * (1 + growthShock) + noise);
    }

    return samples.sort((a, b) => a - b);
  }

  private buildHistogram(samples: number[]): void {
    if (!samples.length) {
      this.histogramData = { labels: [], datasets: [] };
      return;
    }

    const bins = 25;
    const min = samples[0];
    const max = samples[samples.length - 1];
    const width = (max - min) / bins || 1;

    const counts = new Array(bins).fill(0);
    samples.forEach((v) => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((v - min) / width)));
      counts[idx]++;
    });

    const labels = counts.map((_, i) =>
      this.formatNumber(min + i * width)
    );

    this.histogramData = {
      labels,
      datasets: [
        {
          label: 'NPV',
          data: counts,
          backgroundColor: '#7ed0ff',
          borderColor: '#7ed0ff',
          borderWidth: 1,
        },
      ],
    };
  }

  private buildSummary(samples: number[]): void {
    if (!samples.length) {
      this.summaryRows = [];
      return;
    }
    const metricsSelected = this.form.get('metrics')?.value ?? [];
    const stats = this.computeStats(samples);

    this.summaryRows = metricsSelected.map((metric: any) => ({
      metric: this.metricOptions.find((m) => m.value === metric)?.label ?? metric,
      ...stats,
    }));
  }

  private computeStats(values: number[]): Omit<SummaryRow, 'metric'> {
    const count = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / count;
    const variance =
      values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
    const std = Math.sqrt(variance);
    const min = values[0];
    const max = values[values.length - 1];
    const p25 = this.percentile(values, 0.25);
    const p50 = this.percentile(values, 0.5);
    const p75 = this.percentile(values, 0.75);

    return { count, mean, std, min, p25, p50, p75, max };
  }

  private percentile(values: number[], p: number): number {
    if (!values.length) return 0;
    const idx = (values.length - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return values[lower];
    return values[lower] + (values[upper] - values[lower]) * (idx - lower);
  }

  private randomNormal(mean: number, std: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * std + mean;
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }
}
