import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

@Component({
  standalone: true,
  selector: 'key-metrics-overview-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 lg:col-span-6">
        <div class="card h-full">
          <div class="text-lg font-semibold mb-3">Net Revenue</div>
          <div class="h-80">
            <canvas
              baseChart
              [type]="lineType"
              [data]="netRevenueData"
              [options]="chartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-6">
        <div class="card h-full">
          <div class="text-lg font-semibold mb-3">EBITDA</div>
          <div class="h-80">
            <canvas
              baseChart
              [type]="lineType"
              [data]="ebitdaData"
              [options]="chartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class KeyMetricsOverviewWidget {
  lineType: ChartType = 'line';

  labels = (inputData.years as number[]) ?? [];

  netRevenueData: ChartConfiguration['data'] = {
    labels: this.labels,
    datasets: [
      {
        label: 'Net Revenue',
        data: this.buildGrowthSeries(2_500_000, 22_000_000, this.labels.length),
        borderColor: '#7ed0ff',
        backgroundColor: 'rgba(126, 208, 255, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  ebitdaData: ChartConfiguration['data'] = {
    labels: this.labels,
    datasets: [
      {
        label: 'EBITDA',
        data: this.buildGrowthSeries(500_000, 7_500_000, this.labels.length),
        borderColor: '#8ddca4',
        backgroundColor: 'rgba(141, 220, 164, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.35 },
      point: { radius: 0 },
    },
  };

  private buildGrowthSeries(
    start: number,
    end: number,
    count: number
  ): number[] {
    if (count <= 1) return [start];
    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, idx) => start + step * idx);
  }

  private formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`;
    }
    return value.toString();
  }
}
