import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

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
export class KeyMetricsOverviewWidget implements OnInit {
  lineType: ChartType = 'line';
  labels: number[] = [];
  netRevenueData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  ebitdaData: ChartConfiguration['data'] = { labels: [], datasets: [] };

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
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.35 },
      point: { radius: 0 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const income = output?.income_statement ?? {};
    const years = (income.index as number[]) ?? [];
    const data = income.data ?? {};
    const netRevenue = this.asNumberArray(data['Net Revenue']);
    const ebitda = this.asNumberArray(data['EBITDA']);

    this.labels = years;
    this.netRevenueData = {
      labels: years,
      datasets: [
        {
          label: 'Net Revenue',
          data: netRevenue,
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    this.ebitdaData = {
      labels: years,
      datasets: [
        {
          label: 'EBITDA',
          data: ebitda,
          borderColor: '#8ddca4',
          backgroundColor: 'rgba(141, 220, 164, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
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
