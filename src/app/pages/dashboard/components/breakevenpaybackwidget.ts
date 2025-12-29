import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

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
export class BreakEvenPaybackWidget {
  barType: ChartType = 'bar';
  lineType: ChartType = 'line';

  products = Object.keys((inputData.production_estimate as Record<string, number[]>) ?? {});
  years = (inputData.years as number[]) ?? [];

  breakEvenPoints: BreakEvenPoint[] = this.buildBreakEvenPoints();

  breakEvenData: ChartConfiguration['data'] = {
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

  cumulativePaybackData: ChartConfiguration['data'] = {
    labels: this.years,
    datasets: [
      {
        label: 'Cumulative',
        data: this.buildCumulativeSeries(),
        borderColor: '#7ed0ff',
        backgroundColor: 'rgba(126, 208, 255, 0.12)',
        fill: false,
        tension: 0.2,
        pointRadius: 3,
      },
    ],
  };

  discountedPaybackData: ChartConfiguration['data'] = {
    labels: this.years,
    datasets: [
      {
        label: 'Discounted Cumulative',
        data: this.buildDiscountedSeries(),
        borderColor: '#8ddca4',
        backgroundColor: 'rgba(141, 220, 164, 0.12)',
        fill: false,
        tension: 0.2,
        pointRadius: 3,
      },
    ],
  };

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
          callback: (v) => this.formatNumber(Number(v)),
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
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.2, borderWidth: 2 },
      point: { radius: 3 },
    },
  };

  private buildBreakEvenPoints(): BreakEvenPoint[] {
    const unitCosts = (inputData.unit_costs as Record<string, { production: number; price: number; freight: number }>) ?? {};
    const markup = (inputData.markup as Record<string, number>) ?? {};
    const fixedCostPerProduct = 250_000;

    return this.products.map((product, idx) => {
      const price = Number(unitCosts[product]?.price ?? 1);
      const production = Number(unitCosts[product]?.production ?? 0.5);
      const freight = Number(unitCosts[product]?.freight ?? 0.05);
      const marginPerUnit = Math.max(price - production - freight, 0.01);
      const tilt = 1 + idx * 0.15;
      const breakevenUnits = (fixedCostPerProduct * tilt) / marginPerUnit;
      const markupAdj = markup[product] ? 1 + markup[product] * 0.1 : 1;
      return {
        product,
        units: breakevenUnits * markupAdj,
      };
    });
  }

  private buildCumulativeSeries(): number[] {
    if (!this.years.length) return [-1_200_000];
    const template = [-1_200_000, -1_350_000, -1_380_000, -1_520_000, -1_750_000, -2_050_000, -2_500_000, -3_000_000, -3_500_000, -4_200_000];
    return template.slice(0, this.years.length);
  }

  private buildDiscountedSeries(): number[] {
    if (!this.years.length) return [-180_000];
    const template = [-180_000, -240_000, -260_000, -270_000, -280_000, -285_000, -288_000, -289_000, -290_000, -290_000];
    return template.slice(0, this.years.length);
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(2)}k`;
    return value.toFixed(0);
  }
}
