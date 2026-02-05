import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface GrossRevenueRow {
  index: number;
  year: number;
  [product: string]: number | string;
  grossRevenue: number;
  distributorCommission: number;
  netRevenue: number;
}

@Component({
  standalone: true,
  selector: 'gross-revenue-schedule-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Gross Revenue Schedule</div>

      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Capsules</th>
              <th>Liquid</th>
              <th>Ointment</th>
              <th>Tablets</th>
              <th>Gross Revenue</th>
              <th>Distributors Commission</th>
              <th>Net Revenue</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.capsules) }}</td>
              <td>{{ formatNumber(row.liquid) }}</td>
              <td>{{ formatNumber(row.ointment) }}</td>
              <td>{{ formatNumber(row.tablets) }}</td>
              <td>{{ formatNumber(row.grossRevenue) }}</td>
              <td>{{ formatNumber(row.distributorCommission) }}</td>
              <td>{{ formatNumber(row.netRevenue) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p class="text-sm">
        Gross Revenue is decomposed into product-level sales, distributor commissions, and resulting net revenue.
      </p>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">Revenue Drivers</div>
        <div class="text-sm font-semibold text-surface-200">Revenue Schedule</div>
        <div class="h-96">
          <canvas
            baseChart
            [type]="lineType"
            [data]="chartData"
            [options]="chartOptions"
            class="w-full h-full"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class GrossRevenueScheduleWidget implements OnInit {
  lineType: ChartType = 'line';
  rows: GrossRevenueRow[] = [];

  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
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
    const output = this.pharmaModelService.getOutputSnapshot();
    const input = this.pharmaModelService.getInputSnapshot();
    const years = (output?.income_statement?.index as number[]) ?? (input?.years ?? []);
    this.rows = this.buildRows(years, output, input);
    this.chartData = this.buildChartData(years, this.rows);
  }

  private buildRows(years: number[], output: any, input: any): GrossRevenueRow[] {
    const income = output?.income_statement ?? {};
    const data = income.data ?? {};
    const grossRevenue = this.asNumberArray(data['Gross Revenue']);
    const distributorCommission = this.asNumberArray(data['Distributors Commission']);
    const netRevenue = this.asNumberArray(data['Net Revenue']);

    const productionEstimate =
      (input?.production_estimate as Record<string, number[]>) ?? {};
    const unitCosts = (input?.unit_costs as Record<string, { price?: number }>) ?? {};
    const products = Object.keys(productionEstimate);

    return years.map((year, idx) => {
      const totalGross = grossRevenue[idx] ?? 0;
      const totalScore = products.reduce((sum, product) => {
        const estimate = productionEstimate[product]?.[idx] ?? 0;
        const price = unitCosts[product]?.price ?? 0;
        return sum + estimate * price;
      }, 0);

      const allocations: Record<string, number> = {};
      products.forEach((product) => {
        const estimate = productionEstimate[product]?.[idx] ?? 0;
        const price = unitCosts[product]?.price ?? 0;
        const share = totalScore > 0 ? (estimate * price) / totalScore : 0;
        allocations[product.toLowerCase()] = totalGross * share;
      });

      const row: GrossRevenueRow = {
        index: idx,
        year,
        grossRevenue: totalGross,
        distributorCommission: distributorCommission[idx] ?? 0,
        netRevenue: netRevenue[idx] ?? 0,
      };
      products.forEach((product) => {
        row[product.toLowerCase()] = allocations[product.toLowerCase()] ?? 0;
      });
      return row;
    });
  }

  private buildChartData(years: number[], rows: GrossRevenueRow[]): ChartConfiguration['data'] {
    const products = Object.keys(rows[0] || {}).filter(
      (key) => !['index', 'year', 'grossRevenue', 'distributorCommission', 'netRevenue'].includes(key)
    );

    const colors = ['#60a5fa', '#f472b6', '#f59e0b', '#a78bfa', '#ec4899', '#06b6d4', '#8b5cf6'];
    const datasets = products.map((product, idx) => ({
      label: product.charAt(0).toUpperCase() + product.slice(1),
      data: rows.map((r) => Number(r[product])),
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length] + '26',
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
    }));

    datasets.push(
      {
      label: 'Gross Revenue',
      data: rows.map((r) => r.grossRevenue),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
      },
      {
      label: 'Distributors Commission',
      data: rows.map((r) => r.distributorCommission),
      borderColor: '#fb7185',
      backgroundColor: 'rgba(251, 113, 133, 0.1)',
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
      },
      {
      label: 'Net Revenue',
      data: rows.map((r) => r.netRevenue),
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
      }
    );

    return {
      labels: years,
      datasets,
    };
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
