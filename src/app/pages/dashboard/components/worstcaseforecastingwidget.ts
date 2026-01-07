import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

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
export class WorstCaseForecastingWidget {
  lineType: ChartType = 'line';
  years = (inputData.years as number[]) ?? [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

  netRevenueSeries = this.buildSeries(1_400_000, 21_000_000, 0.92);
  ebitdaSeries = this.buildSeries(480_000, 7_000_000, 0.92);
  ebitSeries = this.buildSeries(280_000, 4_400_000, 0.92);
  netIncomeSeries = this.buildSeries(280_000, 6_800_000, 0.92);

  rows: WorstRow[] = this.years.map((year, idx) => ({
    year,
    netRevenue: this.netRevenueSeries[idx],
    ebitda: this.ebitdaSeries[idx],
    ebit: this.ebitSeries[idx],
    netIncome: this.netIncomeSeries[idx],
  }));

  chartData: ChartConfiguration['data'] = {
    labels: this.years,
    datasets: [
      {
        label: 'Net Revenue',
        data: this.netRevenueSeries,
        borderColor: '#7ed0ff',
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 3,
      },
      {
        label: 'EBITDA',
        data: this.ebitdaSeries,
        borderColor: '#8ddca4',
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 3,
      },
      {
        label: 'EBIT',
        data: this.ebitSeries,
        borderColor: '#fbbf24',
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 3,
      },
      {
        label: 'Net Income',
        data: this.netIncomeSeries,
        borderColor: '#f87171',
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  };

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
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 3 },
    },
  };

  private buildSeries(start: number, end: number, drag: number): number[] {
    const count = this.years.length || 1;
    if (count <= 1) return [start * drag];
    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, idx) => (start + step * idx) * drag);
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }
}
