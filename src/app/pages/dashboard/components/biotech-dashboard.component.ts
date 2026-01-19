import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-dashboard',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="flex items-center gap-2 text-xl font-semibold">Dashboard</div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Portfolio rNPV</div>
          <div class="text-2xl font-semibold">{{ formatCurrency(rnpv) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Peak revenue</div>
          <div class="text-2xl font-semibold">{{ formatNumber(peakRevenue) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Avg EBITDA margin</div>
          <div class="text-2xl font-semibold">{{ formatPercent(avgEbitdaMargin) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Total FCFF after WC</div>
          <div class="text-2xl font-semibold">{{ formatNumber(totalFcffAfterWc) }}</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">Portfolio trend</div>
        <div class="h-72 md:h-[26rem]">
          <canvas
            baseChart
            [type]="trendChartType"
            [data]="trendChartData"
            [options]="trendChartOptions"
          ></canvas>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">FCFF after WC</div>
        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="fcffChartType"
            [data]="fcffChartData"
            [options]="fcffChartOptions"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class BiotechDashboardComponent implements OnInit {
  rnpv = 0;
  peakRevenue = 0;
  avgEbitdaMargin = 0;
  totalFcffAfterWc = 0;

  trendChartType: ChartType = 'line';
  trendChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  trendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 16 },
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
        ticks: { color: '#cbd5e1' },
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
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 2 },
    },
  };

  fcffChartType: ChartType = 'bar';
  fcffChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  fcffChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `FCFF after WC: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
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
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const revenue = this.asNumberArray(data['revenue']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const fcffAfterWc = this.asNumberArray(data['fcff_after_wc']);

    this.rnpv = Number(output?.rnpv ?? 0);
    this.peakRevenue = revenue.reduce((max, value) => Math.max(max, value ?? 0), 0);
    this.totalFcffAfterWc = fcffAfterWc.reduce((sum, value) => sum + (value ?? 0), 0);
    this.avgEbitdaMargin = this.calculateAverageMargin(revenue, ebitda);

    this.trendChartData = {
      labels: years,
      datasets: [
        {
          label: 'Revenue',
          data: revenue,
          borderColor: '#fca5a5',
          backgroundColor: 'rgba(252, 165, 165, 0.45)',
          fill: true,
          pointRadius: 2,
        },
        {
          label: 'EBITDA',
          data: ebitda,
          borderColor: '#7dd3fc',
          backgroundColor: 'rgba(125, 211, 252, 0.35)',
          fill: true,
          pointRadius: 2,
        },
        {
          label: 'FCFF after WC',
          data: fcffAfterWc,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.25)',
          fill: true,
          pointRadius: 2,
        },
      ],
    };

    this.fcffChartData = {
      labels: years,
      datasets: [
        {
          data: fcffAfterWc,
          backgroundColor: '#93c5fd',
          borderRadius: 4,
        },
      ],
    };
  }

  private calculateAverageMargin(revenue: number[], ebitda: number[]): number {
    let revenueTotal = 0;
    let ebitdaTotal = 0;
    revenue.forEach((value, idx) => {
      if ((value ?? 0) <= 0) return;
      revenueTotal += value ?? 0;
      ebitdaTotal += ebitda[idx] ?? 0;
    });
    if (!revenueTotal) return 0;
    return ebitdaTotal / revenueTotal;
  }

  formatCurrency(value: number): string {
    return `${this.formatNumber(value)} USD`;
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
