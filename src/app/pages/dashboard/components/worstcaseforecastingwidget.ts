import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface WorstRow {
  year: number;
  netRevenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
}

@Component({
  standalone: true,
  selector: 'worst-case-forecasting-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-2xl font-semibold">worst</div>

      <p-table
        [value]="rows"
        showGridlines
        class="shadow-none"
        [size]="'small'"
        class="text-sm"
        [tableStyle]="{ 'min-width': '40rem' }"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Year</th>
            <th>Net Revenue</th>
            <th>EBITDA</th>
            <th>EBIT</th>
            <th>Net Income</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.year }}</td>
            <td>{{ row.netRevenue | number: '1.0-4' }}</td>
            <td>{{ row.ebitda | number: '1.0-4' }}</td>
            <td>{{ row.ebit | number: '1.0-4' }}</td>
            <td>{{ row.netIncome | number: '1.0-4' }}</td>
          </tr>
        </ng-template>
      </p-table>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">worst Scenario Results</div>
        <div class="h-96 md:h-[26rem]">
          <canvas
            baseChart
            [type]="lineType"
            [data]="chartData"
            [options]="chartOptions"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class WorstCaseForecastingWidget implements OnInit {
  lineType: ChartType = 'line';
  years: number[] = [];
  rows: WorstRow[] = [];
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#707275ff', usePointStyle: true, padding: 12 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Year', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Value', color: '#cbd5e1' },
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 3 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const scenario = output?.scenario_results?.worst ?? {};
    this.years = (scenario.index as number[]) ?? [];
    const data = scenario.data ?? {};
    const netRevenueSeries = this.asNumberArray(data['Net Revenue']);
    const ebitdaSeries = this.asNumberArray(data['EBITDA']);
    const ebitSeries = this.asNumberArray(data['EBIT']);
    const netIncomeSeries = this.asNumberArray(data['Net Income']);

    this.rows = this.years.map((year, idx) => ({
      year,
      netRevenue: netRevenueSeries[idx] ?? 0,
      ebitda: ebitdaSeries[idx] ?? 0,
      ebit: ebitSeries[idx] ?? 0,
      netIncome: netIncomeSeries[idx] ?? 0,
    }));

    this.chartData = {
      labels: this.years,
      datasets: [
        {
          label: 'Net Revenue',
          data: netRevenueSeries,
          borderColor: '#7ed0ff',
          backgroundColor: 'transparent',
          tension: 0.25,
          pointRadius: 3,
        },
        {
          label: 'EBITDA',
          data: ebitdaSeries,
          borderColor: '#8ddca4',
          backgroundColor: 'transparent',
          tension: 0.25,
          pointRadius: 3,
        },
        {
          label: 'EBIT',
          data: ebitSeries,
          borderColor: '#fbbf24',
          backgroundColor: 'transparent',
          tension: 0.25,
          pointRadius: 3,
        },
        {
          label: 'Net Income',
          data: netIncomeSeries,
          borderColor: '#f87171',
          backgroundColor: 'transparent',
          tension: 0.25,
          pointRadius: 3,
        },
      ],
    };
  }

  private formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
