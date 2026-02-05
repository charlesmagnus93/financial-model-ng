import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface BreakEvenPoint {
  product: string;
  units: number;
}

@Component({
  standalone: true,
  selector: 'breakeven-payback-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-2xl font-semibold">Break-even Analysis</div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">Break-even Units by Product</div>
        <div class="h-72 md:h-80">
          <canvas
            baseChart
            [type]="barType"
            [data]="breakEvenData"
            [options]="barOptions"
          ></canvas>
        </div>
      </div>

      <div class="text-2xl font-semibold">Payback Schedule</div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">Cumulative Payback</div>
        <div class="h-72 md:h-80">
          <canvas
            baseChart
            [type]="lineType"
            [data]="cumulativePaybackData"
            [options]="lineOptions"
          ></canvas>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">Discounted Cumulative Payback</div>
        <div class="h-72 md:h-80">
          <canvas
            baseChart
            [type]="lineType"
            [data]="discountedPaybackData"
            [options]="lineOptions"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class BreakEvenPaybackWidget implements OnInit {
  barType: ChartType = 'bar';
  lineType: ChartType = 'line';

  products: string[] = [];
  years: number[] = [];
  breakEvenPoints: BreakEvenPoint[] = [];
  breakEvenData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  cumulativePaybackData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  discountedPaybackData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Product', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Break-even Units', color: '#cbd5e1' },
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
      legend: {
        labels: { color: '#e2e8f0', usePointStyle: true, padding: 12 },
      },
      tooltip: {
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
        title: { display: true, text: 'Cumulative', color: '#cbd5e1' },
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.2, borderWidth: 2 },
      point: { radius: 3 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const breakEven = output?.break_even ?? {};
    const payback = output?.payback ?? {};
    const discounted = output?.discounted_payback ?? {};

    this.products = (breakEven.index as string[]) ?? [];
    this.years = (payback.index as number[]) ?? [];

    const units = this.asNumberArray(breakEven.data?.['Break-even Units']);
    this.breakEvenPoints = this.products.map((product, idx) => ({
      product,
      units: units[idx] ?? 0,
    }));

    this.breakEvenData = {
      labels: this.breakEvenPoints.map((p) => p.product),
      datasets: [
        {
          label: 'Break-even Units',
          data: this.breakEvenPoints.map((p) => p.units),
          backgroundColor: 'rgba(126, 208, 255, 0.3)',
          borderColor: '#7ed0ff',
          borderWidth: 1.5,
        },
      ],
    };

    this.cumulativePaybackData = {
      labels: this.years,
      datasets: [
        {
          label: 'Cumulative',
          data: this.asNumberArray(payback.data?.Cumulative),
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.12)',
          fill: false,
          tension: 0.2,
          pointRadius: 3,
        },
      ],
    };

    this.discountedPaybackData = {
      labels: this.years,
      datasets: [
        {
          label: 'Discounted Cumulative',
          data: this.asNumberArray(discounted.data?.Cumulative),
          borderColor: '#8ddca4',
          backgroundColor: 'rgba(141, 220, 164, 0.12)',
          fill: false,
          tension: 0.2,
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
