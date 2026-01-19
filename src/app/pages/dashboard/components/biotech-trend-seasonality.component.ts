import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';

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
        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Need more history to decompose trend/seasonality.
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
            [type]="chartType"
            [data]="chartData"
            [options]="chartOptions"
          ></canvas>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechTrendSeasonalityComponent implements OnInit {
  rows: SegmentationRow[] = [];
  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
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
    const output = this.biotechModelService.getOutputSnapshot();
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

    this.rows = aggregates.map((row) => ({
      product: row.product,
      revenueShare: totalRevenue ? row.revenue / totalRevenue : 0,
      ebitdaMargin: row.revenue ? row.ebitda / row.revenue : 0,
      fcffProxy: row.fcff,
    }));

    this.chartData = {
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

  private sumNumbers(values: unknown): number {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, v) => sum + Number(v ?? 0), 0);
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
}
