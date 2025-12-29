import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface PositionRow {
  year: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  otherAssets: number;
  netPpe: number;
  totalAssets: number;
  accountsPayable: number;
  otherLiabilities: number;
  overdraft: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  totalLiabilitiesEquity: number;
}

@Component({
  standalone: true,
  selector: 'analytical-trends-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Analytical Trends</div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">Cash Trend</div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="cashChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">Accounts Receivable Trend</div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="arChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">Inventory Trend</div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="inventoryChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">Prepaid Expenses Trend</div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="prepaidChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">Additional Statement Metrics</div>
        <div class="h-80">
          <canvas
            baseChart
            [type]="lineType"
            [data]="metricsChart"
            [options]="metricsChartOptions"
            class="w-full h-full"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticalTrendsWidget implements OnInit {
  lineType: ChartType = 'line';

  cashChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  arChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  inventoryChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  prepaidChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  metricsChart: ChartConfiguration['data'] = { labels: [], datasets: [] };

  simpleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  metricsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#cbd5e1' } },
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

  ngOnInit(): void {
    const years = (inputData.years as number[]) ?? [];
    const rows = this.buildRows(years);
    this.cashChart = this.buildSingleChart('Cash', years, rows.map((r) => r.cash));
    this.arChart = this.buildSingleChart(
      'Accounts Receivable',
      years,
      rows.map((r) => r.accountsReceivable)
    );
    this.inventoryChart = this.buildSingleChart('Inventory', years, rows.map((r) => r.inventory));
    this.prepaidChart = this.buildSingleChart(
      'Prepaid Expenses',
      years,
      rows.map((r) => r.prepaidExpenses)
    );
    this.metricsChart = this.buildMetricsChart(years, rows);
  }

  private buildRows(years: number[]): PositionRow[] {
    const wc = inputData.working_capital ?? {};
    const days = wc.days ?? {};
    const arDays = (days.accounts_receivable as number[]) ?? [];
    const inventoryDays = (days.inventory as number[]) ?? [];
    const prepaidDays = (days.prepaid_expenses as number[]) ?? [];
    const otherAssetDays = (days.other_assets as number[]) ?? [];
    const apDays = (days.accounts_payable as number[]) ?? [];
    const otherLiabilityDays = (days.other_liabilities as number[]) ?? [];

    const arFactor = 4098;
    const inventoryFactor = 2710;
    const prepaidFactor = 2700;
    const otherAssetFactor = 2700;
    const apFactor = 2725;
    const otherLiabilityFactor = 2712;

    const cashBase = -350_000;
    const cashGrowth = 1.18;
    const overdraftBase = 50_000;
    const overdraftGrowth = 1.08;
    const netPpeBase = 250_000;
    const netPpeGrowth = 1.05;

    return years.map((year, idx) => {
      const cash = cashBase * Math.pow(cashGrowth, idx);
      const arBase = (arDays[idx] ?? 0) * arFactor;
      const distributorReceivables = arBase * 0.66;
      const accountsReceivable = arBase + distributorReceivables;
      const inventory = (inventoryDays[idx] ?? 0) * inventoryFactor;
      const prepaidExpenses = (prepaidDays[idx] ?? 0) * prepaidFactor;
      const otherAssets = (otherAssetDays[idx] ?? 0) * otherAssetFactor;
      const netPpe = netPpeBase * Math.pow(netPpeGrowth, idx);
      const totalAssets =
        cash + accountsReceivable + inventory + prepaidExpenses + otherAssets + netPpe;

      const accountsPayable = (apDays[idx] ?? 0) * apFactor;
      const otherLiabilities = (otherLiabilityDays[idx] ?? 0) * otherLiabilityFactor;
      const overdraft = overdraftBase * Math.pow(overdraftGrowth, idx);
      const totalLiabilities = accountsPayable + otherLiabilities + overdraft;
      const shareholdersEquity = totalAssets - totalLiabilities;

      return {
        year,
        cash,
        accountsReceivable,
        inventory,
        prepaidExpenses,
        otherAssets,
        netPpe,
        totalAssets,
        accountsPayable,
        otherLiabilities,
        overdraft,
        totalLiabilities,
        shareholdersEquity,
        totalLiabilitiesEquity: totalAssets,
      };
    });
  }

  private buildSingleChart(
    label: string,
    years: number[],
    values: number[]
  ): ChartConfiguration['data'] {
    return {
      labels: years,
      datasets: [
        {
          label,
          data: values,
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }

  private buildMetricsChart(years: number[], rows: PositionRow[]): ChartConfiguration['data'] {
    return {
      labels: years,
      datasets: [
        {
          label: 'Other Assets',
          data: rows.map((r) => r.otherAssets),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          fill: false,
        },
        {
          label: 'Net PP&E',
          data: rows.map((r) => r.netPpe),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.15)',
          fill: false,
        },
        {
          label: 'Total Assets',
          data: rows.map((r) => r.totalAssets),
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.15)',
          fill: false,
        },
        {
          label: 'Accounts Payable',
          data: rows.map((r) => r.accountsPayable),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.15)',
          fill: false,
        },
        {
          label: 'Other Liabilities',
          data: rows.map((r) => r.otherLiabilities),
          borderColor: '#fb7185',
          backgroundColor: 'rgba(251, 113, 133, 0.15)',
          fill: false,
        },
        {
          label: 'Overdraft',
          data: rows.map((r) => r.overdraft),
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.15)',
          fill: false,
        },
        {
          label: 'Total Liabilities',
          data: rows.map((r) => r.totalLiabilities),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          fill: false,
        },
        {
          label: "Shareholders' Equity",
          data: rows.map((r) => r.shareholdersEquity),
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244, 114, 182, 0.15)',
          fill: false,
        },
        {
          label: 'Total Liabilities & Equity',
          data: rows.map((r) => r.totalLiabilitiesEquity),
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.15)',
          borderDash: [6, 4],
          fill: false,
        },
      ],
    };
  }

  private formatNumber(value: number): string {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const formatted =
      abs >= 1_000_000
        ? `${(abs / 1_000_000).toFixed(3)}`
        : abs >= 1_000
          ? `${(abs / 1_000).toFixed(3)}`
          : abs.toFixed(3);
    const suffix = abs >= 1_000_000 ? 'M' : abs >= 1_000 ? 'k' : '';
    return `${sign}${formatted}${suffix}`;
  }
}
