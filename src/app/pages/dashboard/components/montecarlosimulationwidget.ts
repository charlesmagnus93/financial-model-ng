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
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

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
    { label: 'NPV', value: 'NPV' },
    { label: 'Average Net Income', value: 'Average Net Income' },
    { label: 'Average EBITDA', value: 'Average EBITDA' },
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

  constructor(
    private fb: FormBuilder,
    private pharmaModelService: PharmaModelService
  ) {
    const input = this.pharmaModelService.getInputSnapshot();
    const monteCarlo = input?.monte_carlo ?? {};
    this.form = this.fb.group({
      iterations: new FormControl<number>(monteCarlo.iterations ?? 1000),
      minGrowth: new FormControl<number>(monteCarlo.revenue_growth_range?.[0] ?? 0.05),
      maxGrowth: new FormControl<number>(monteCarlo.revenue_growth_range?.[1] ?? 0.15),
      metrics: new FormControl<string[]>(
        (monteCarlo.metrics as string[]) ?? ['NPV', 'Average Net Income', 'Average EBITDA']
      ),
      variables: new FormControl<string[]>(
        (monteCarlo.variables as string[]) ?? ['revenue_growth']
      ),
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
    const output = this.pharmaModelService.getOutputSnapshot();
    const table = output?.monte_carlo ?? {};
    const data = table.data ?? {};
    const metricsSelected = this.form.get('metrics')?.value ?? [];
    const primarySeries = this.asNumberArray(data['NPV']);
    const fallbackSeries = this.asNumberArray(data[metricsSelected[0]]);
    const histogramSeries = primarySeries.length ? primarySeries : fallbackSeries;

    this.buildHistogram(histogramSeries);
    this.buildSummary(data, metricsSelected);
  }

  private buildHistogram(samples: number[]): void {
    if (!samples.length) {
      this.histogramData = { labels: [], datasets: [] };
      return;
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const bins = 25;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const width = (max - min) / bins || 1;

    const counts = new Array(bins).fill(0);
    sorted.forEach((v) => {
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

  private buildSummary(data: Record<string, unknown>, metricsSelected: string[]): void {
    if (!metricsSelected.length) {
      this.summaryRows = [];
      return;
    }

    this.summaryRows = metricsSelected.map((metric) => {
      const series = this.asNumberArray(data[metric]);
      if (!series.length) {
        return {
          metric,
          count: 0,
          mean: 0,
          std: 0,
          min: 0,
          p25: 0,
          p50: 0,
          p75: 0,
          max: 0,
        };
      }
      const stats = this.computeStats(series);
      return {
        metric,
        ...stats,
      };
    });
  }

  private computeStats(values: number[]): Omit<SummaryRow, 'metric'> {
    const count = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / count;
    const variance =
      values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
    const std = Math.sqrt(variance);
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p25 = this.percentile(sorted, 0.25);
    const p50 = this.percentile(sorted, 0.5);
    const p75 = this.percentile(sorted, 0.75);

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

  private formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0)).filter((v) => Number.isFinite(v));
  }
}
