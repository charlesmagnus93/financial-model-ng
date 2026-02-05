import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface SegmentationRow {
  product: string;
  revenueShare: number;
  ebitdaMargin: number;
  fcffProxy: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-trend-seasonality',
  imports: [CommonModule, TableModule, FieldsetModule, NgChartsModule],
  template: `
    <p-fieldset
      legend="Trend, seasonality &amp; segmentation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-6">
        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="trendChartType"
            [data]="trendChartData"
            [options]="trendChartOptions"
          ></canvas>
        </div>

        <div class="overflow-auto">
          <p-table
            [value]="rows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="300px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Product</th>
                <th>Revenue share</th>
                <th>EBITDA margin</th>
                <th>FCFF (PV proxy)</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.product }}</td>
                <td>{{ formatPercent(row.revenueShare) }}</td>
                <td>{{ formatPercent(row.ebitdaMargin) }}</td>
                <td>{{ formatNumber(row.fcffProxy) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="shareChartType"
            [data]="shareChartData"
            [options]="shareChartOptions"
          ></canvas>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechTrendSeasonalityComponent implements OnInit {
  rows: SegmentationRow[] = [];
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
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 2 },
    },
  };
  shareChartType: ChartType = 'bar';
  shareChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  shareChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue share: ${this.formatPercent(ctx.parsed.y ?? 0)}`,
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
          callback: (v) => this.formatPercent(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        min: 0,
        max: 1,
      },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const consolidatedRevenue = this.asNumberArray(consolidated.data?.['revenue']);

    const observed = consolidatedRevenue.map((v) => Number(v ?? 0));
    const trend = this.movingAverage(observed, 3);
    const rawResidual = observed.map((value, idx) => value - (trend[idx] ?? 0));
    const seasonal = rawResidual.map((value) => value * 0.4);
    const resid = rawResidual.map((value) => value * 0.6);

    this.trendChartData = {
      labels: years,
      datasets: [
        {
          label: 'observed',
          data: observed,
          borderColor: '#93c5fd',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'resid',
          data: resid,
          borderColor: '#38bdf8',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'seasonal',
          data: seasonal,
          borderColor: '#fca5a5',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'trend',
          data: trend,
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
      ],
    };

    const perProduct = output?.per_product ?? {};
    const products = Object.keys(perProduct);

    const aggregates = products.map((product) => {
      const data = perProduct[product]?.data ?? {};
      const revenue = this.sumNumbers(data['revenue']);
      const ebitda = this.sumNumbers(data['ebitda']);
      const fcff = this.sumNumbers(data['fcff']);
      return { product, revenue, ebitda, fcff };
    });

    const totalRevenue = aggregates.reduce((sum, row) => sum + row.revenue, 0);
    const totalEbitda = aggregates.reduce((sum, row) => sum + row.ebitda, 0);
    const totalFcff = aggregates.reduce((sum, row) => sum + row.fcff, 0);
    const consolidatedEbitda = this.sumNumbers(consolidated.data?.['ebitda']);
    const consolidatedFcff = this.sumNumbers(consolidated.data?.['fcff']);
    const impliedRevenue = this.sumNumbers(consolidated.data?.['revenue']) - totalRevenue;
    const impliedEbitda = consolidatedEbitda - totalEbitda;
    const impliedFcff = consolidatedFcff - totalFcff;

    aggregates.push({
      product: 'Vaccine Sales (Implied)',
      revenue: impliedRevenue,
      ebitda: impliedEbitda,
      fcff: impliedFcff,
    });

    this.rows = aggregates.map((row) => ({
      product: row.product,
      revenueShare: totalRevenue ? row.revenue / totalRevenue : 0,
      ebitdaMargin: row.revenue ? row.ebitda / row.revenue : 0,
      fcffProxy: row.fcff,
    }));

    this.shareChartData = {
      labels: this.rows.map((row) => row.product),
      datasets: [
        {
          data: this.rows.map((row) => row.revenueShare),
          backgroundColor: '#93c5fd',
          borderRadius: 6,
        },
      ],
    };
  }

  private movingAverage(values: number[], window: number): number[] {
    if (!values.length) return [];
    const w = Math.max(1, Math.floor(window));
    return values.map((_, idx) => {
      const start = Math.max(0, idx - w + 1);
      const slice = values.slice(start, idx + 1);
      const sum = slice.reduce((acc, v) => acc + v, 0);
      return sum / slice.length;
    });
  }

  private sumNumbers(values: unknown): number {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, v) => sum + Number(v ?? 0), 0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

}
