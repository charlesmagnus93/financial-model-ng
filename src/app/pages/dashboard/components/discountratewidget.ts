import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface DiscountRateRow {
  index: number;
  year: number;
  multiplier: number;
  npv: number;
  irr: number;
}

@Component({
  standalone: true,
  selector: 'discount-rate-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">discount_rate</div>

      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [tableStyle]="{ 'min-width': '900px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Multiplier</th>
              <th>NPV</th>
              <th>IRR</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ row.multiplier | number: '1.2-2' }}</td>
              <td>{{ formatNumber(row.npv) }}</td>
              <td>{{ formatNumber(row.irr) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">discount_rate Sensitivity Trend</div>
        <div class="h-80">
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
export class DiscountRateWidget implements OnInit {
  rows: DiscountRateRow[] = [];
  lineType: ChartType = 'line';
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
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  ngOnInit(): void {
    this.rows = this.buildRows();
    this.chartData = this.buildChart(this.rows);
  }

  private buildRows(): DiscountRateRow[] {
    const multipliers =
      ((inputData.sensitivity?.variables as Record<string, number[]>) ?? {})['discount_rate'] ?? [
        0.08, 0.1, 0.12,
      ];

    const baseNpv = -2_500_000;
    const npvSlope = 350_000;
    const baseIrr = -2_000_000;
    const irrSlope = 150_000;
    const midpoint = multipliers[Math.floor(multipliers.length / 2)] ?? multipliers[0] ?? 1;

    return multipliers.map((m, idx) => {
      const npv = baseNpv + (m - midpoint) * npvSlope;
      const irr = baseIrr + (m - midpoint) * irrSlope;
      return {
        index: idx,
        year: idx + 1,
        multiplier: m,
        npv,
        irr,
      };
    });
  }

  private buildChart(rows: DiscountRateRow[]): ChartConfiguration['data'] {
    return {
      labels: rows.map((r) => r.year),
      datasets: [
        {
          label: 'Multiplier',
          data: rows.map((r) => r.multiplier),
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.15)',
          fill: false,
        },
        {
          label: 'NPV',
          data: rows.map((r) => r.npv),
          borderColor: '#8ddca4',
          backgroundColor: 'rgba(141, 220, 164, 0.15)',
          fill: false,
        },
        {
          label: 'IRR',
          data: rows.map((r) => r.irr),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.15)',
          fill: false,
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
