import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface GrossRevenueRow {
  index: number;
  year: number;
  capsules: number;
  liquid: number;
  ointment: number;
  tablets: number;
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
    this.rows = this.buildRows(years);
    this.chartData = this.buildChartData(years, this.rows);
  }

  private buildRows(years: number[]): GrossRevenueRow[] {
    const baseGross = 1_578_000;
    const grossGrowth = 1.12;
    const distributorRate = 0.05;
    const mix = {
      capsules: 0.08,
      liquid: 0.06,
      ointment: 0.2,
      tablets: 0.66,
    };

    return years.map((year, idx) => {
      const grossRevenue = baseGross * Math.pow(grossGrowth, idx);
      const capsules = grossRevenue * mix.capsules;
      const liquid = grossRevenue * mix.liquid;
      const ointment = grossRevenue * mix.ointment;
      const tablets = grossRevenue * mix.tablets;
      const distributorCommission = grossRevenue * distributorRate;
      const netRevenue = grossRevenue - distributorCommission;

      return {
        index: idx,
        year,
        capsules,
        liquid,
        ointment,
        tablets,
        grossRevenue,
        distributorCommission,
        netRevenue,
      };
    });
  }

  private buildChartData(years: number[], rows: GrossRevenueRow[]): ChartConfiguration['data'] {
    return {
      labels: years,
      datasets: [
        {
          label: 'Capsules',
          data: rows.map((r) => r.capsules),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Liquid',
          data: rows.map((r) => r.liquid),
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244, 114, 182, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Ointment',
          data: rows.map((r) => r.ointment),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Tablets',
          data: rows.map((r) => r.tablets),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.15)',
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
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
        },
      ],
    };
  }

  formatNumber(value: number): string {
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
