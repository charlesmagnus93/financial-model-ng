import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface FinancialPerformanceRow {
  netRevenue: number;
  grossProfit: number;
  ebitda: number;
  netIncome: number;
  ebitdaMargin: number;
}

@Component({
  standalone: true,
  selector: 'profit-loss-trends-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Profit &amp; Loss Trends</div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">
          Income Statement Highlights
        </div>
        <div class="h-96">
          <canvas
            baseChart
            [type]="lineType"
            [data]="incomeData"
            [options]="incomeChartOptions"
            class="w-full h-full"
          ></canvas>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">EBITDA Margin</div>
        <div class="h-72">
          <canvas
            baseChart
            [type]="lineType"
            [data]="marginData"
            [options]="marginChartOptions"
            class="w-full h-full"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class ProfitLossTrendsWidget implements OnInit {
  lineType: ChartType = 'line';

  labels: number[] = [];
  financials: FinancialPerformanceRow[] = [];

  incomeData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  marginData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  incomeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#cbd5e1' },
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
      line: { tension: 0.35 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  marginChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${(Number(ctx.parsed.y ?? 0) * 100).toFixed(2)}%`,
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
          callback: (v) => `${(Number(v) * 100).toFixed(2)}%`,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.35 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  ngOnInit(): void {
    this.labels = (inputData.years as number[]) ?? [];
    this.financials = this.buildFinancials();
    this.incomeData = this.buildIncomeChart();
    this.marginData = this.buildMarginChart();
  }

  private buildFinancials(): FinancialPerformanceRow[] {
    const baseGross = 1_550_000;
    const grossGrowth = 1.12;
    const distributorRate = 0.05;
    const costOfSalesRate = 0.62;
    const generalAdminRate = 0.035;
    const depreciationRate = 0.03;
    const interestRate = 0.015;

    return this.labels.map((_, idx) => {
      const grossRevenue = baseGross * Math.pow(grossGrowth, idx);
      const distributorCommission = grossRevenue * distributorRate;
      const netRevenue = grossRevenue - distributorCommission;
      const costOfSales = netRevenue * costOfSalesRate;
      const grossProfit = netRevenue - costOfSales;
      const generalAdmin = netRevenue * generalAdminRate;
      const ebitda = grossProfit - generalAdmin;
      const depreciation = netRevenue * depreciationRate;
      const ebit = ebitda - depreciation;
      const interest = grossRevenue * interestRate * 0.1;
      const ebt = ebit - interest;
      const taxes = ebt * 0.0;
      const netIncome = ebt - taxes;

      return {
        netRevenue,
        grossProfit,
        ebitda,
        netIncome,
        ebitdaMargin: netRevenue > 0 ? ebitda / netRevenue : 0,
      };
    });
  }

  private buildIncomeChart(): ChartConfiguration['data'] {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Net Revenue',
          data: this.financials.map((f) => f.netRevenue),
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Gross Profit',
          data: this.financials.map((f) => f.grossProfit),
          borderColor: '#8ddca4',
          backgroundColor: 'rgba(141, 220, 164, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'EBITDA',
          data: this.financials.map((f) => f.ebitda),
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Net Income',
          data: this.financials.map((f) => f.netIncome),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }

  private buildMarginChart(): ChartConfiguration['data'] {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'EBITDA Margin',
          data: this.financials.map((f) => f.ebitdaMargin),
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }

  private formatNumber(value: number): string {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const formatted =
      abs >= 1_000_000
        ? `${(abs / 1_000_000).toFixed(1)}M`
        : abs >= 1_000
          ? `${(abs / 1_000).toFixed(1)}k`
          : abs.toFixed(0);
    return `${sign}${formatted}`;
  }
}
