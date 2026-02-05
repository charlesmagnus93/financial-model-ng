import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface CashFlowRow {
  year: number;
  cashFlowFromOperations: number;
  netCashFromOperating: number;
  netCashUsedInvesting: number;
  netCashUsedFinancing: number;
  netCashFlowPeriod: number;
  beginningCash: number;
  endingCash: number;
  netIncreaseDecrease: number;
}

@Component({
  standalone: true,
  selector: 'cash-flow-analytical-trends-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Analytical Trends</div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">
            Cash Flow from Operations Trend
          </div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="cfoChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">
            Net Cash Generated from Operating Activities Trend
          </div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="ncfoChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">
            Net Cash Used in Investing Activities Trend
          </div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="investingChart"
              [options]="simpleChartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="text-sm font-semibold text-surface-300 mb-2">
            Net Cash Used in Financing Activities Trend
          </div>
          <div class="h-64">
            <canvas
              baseChart
              [type]="lineType"
              [data]="financingChart"
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
export class CashFlowAnalyticalTrendsWidget implements OnInit {
  lineType: ChartType = 'line';

  cfoChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  ncfoChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  investingChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
  financingChart: ChartConfiguration['data'] = { labels: [], datasets: [] };
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
          callback: (v) => formatNumberCompact(Number(v)),
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
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.35 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const cashRows = this.buildCashRows();
    const years = cashRows.map((row) => row.year);
    this.cfoChart = this.buildSingleChart(
      'Cash Flow from Operations',
      years,
      cashRows.map((r) => r.cashFlowFromOperations)
    );
    this.ncfoChart = this.buildSingleChart(
      'Net Cash Generated from Operating Activities',
      years,
      cashRows.map((r) => r.netCashFromOperating)
    );
    this.investingChart = this.buildSingleChart(
      'Net Cash Used in Investing Activities',
      years,
      cashRows.map((r) => r.netCashUsedInvesting)
    );
    this.financingChart = this.buildSingleChart(
      'Net Cash Used in Financing Activities',
      years,
      cashRows.map((r) => r.netCashUsedFinancing)
    );
    this.metricsChart = this.buildMetricsChart(years, cashRows);
  }

  private buildCashRows(): CashFlowRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const cashFlow = output?.cash_flow ?? {};
    const years = (cashFlow.index as number[]) ?? [];
    const data = cashFlow.data ?? {};

    const cashFlowFromOperations = this.asNumberArray(
      data['Cash Flow from Operations']
    );
    const netCashFromOperating = this.asNumberArray(
      data['Net Cash Generated from Operating Activities']
    );
    const netCashUsedInvesting = this.asNumberArray(
      data['Net Cash Used in Investing Activities']
    );
    const netCashUsedFinancing = this.asNumberArray(
      data['Net Cash Used in Financing Activities']
    );
    const netCashFlowPeriod = this.asNumberArray(
      data['Net Cash Flow for the Period']
    );
    const beginningCash = this.asNumberArray(
      data['Cash and Cash Equivalents at the Beginning of the Period']
    );
    const endingCash = this.asNumberArray(
      data['Cash and Cash Equivalents at the End of the Period']
    );
    const netIncreaseDecrease = this.asNumberArray(
      data['Net Increase/Decrease in Cash']
    );

    return years.map((year, idx) => ({
      year,
      cashFlowFromOperations: cashFlowFromOperations[idx] ?? 0,
      netCashFromOperating: netCashFromOperating[idx] ?? 0,
      netCashUsedInvesting: netCashUsedInvesting[idx] ?? 0,
      netCashUsedFinancing: netCashUsedFinancing[idx] ?? 0,
      netCashFlowPeriod: netCashFlowPeriod[idx] ?? 0,
      beginningCash: beginningCash[idx] ?? 0,
      endingCash: endingCash[idx] ?? 0,
      netIncreaseDecrease: netIncreaseDecrease[idx] ?? 0,
    }));
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

  private buildMetricsChart(years: number[], rows: CashFlowRow[]): ChartConfiguration['data'] {
    return {
      labels: years,
      datasets: [
        {
          label: 'Net Cash Flow for the Period',
          data: rows.map((r) => r.netCashFlowPeriod),
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.15)',
          fill: false,
        },
        {
          label: 'Cash and Cash Equivalents at the Beginning of the Period',
          data: rows.map((r) => r.beginningCash),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          fill: false,
        },
        {
          label: 'Cash and Cash Equivalents at the End of the Period',
          data: rows.map((r) => r.endingCash),
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244, 114, 182, 0.15)',
          fill: false,
        },
        {
          label: 'Net Increase/Decrease in Cash',
          data: rows.map((r) => r.netIncreaseDecrease),
          borderColor: '#fb7185',
          backgroundColor: 'rgba(251, 113, 133, 0.15)',
          fill: false,
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
