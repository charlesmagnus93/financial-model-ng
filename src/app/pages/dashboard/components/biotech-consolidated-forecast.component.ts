import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';

interface ConsolidatedRow {
  year: number;
  revenue: number;
  ebitda: number;
  fcffAfterWc: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-consolidated-forecast',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">Consolidated forecast</div>

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
              <th>Year</th>
              <th>Revenue</th>
              <th>EBITDA</th>
              <th>FCFF after WC</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.revenue) }}</td>
              <td>{{ formatNumber(row.ebitda) }}</td>
              <td>{{ formatNumber(row.fcffAfterWc) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg font-semibold">Consolidated trend</div>
        <div class="h-80 md:h-[26rem]">
          <canvas
            baseChart
            [type]="lineType"
            [data]="chartData"
            [options]="chartOptions"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class BiotechConsolidatedForecastComponent implements OnInit {
  lineType: ChartType = 'line';
  rows: ConsolidatedRow[] = [];
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 16 },
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
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 2 },
    },
  };

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const revenue = this.asNumberArray(data['revenue']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const fcffAfterWc = this.asNumberArray(data['fcff_after_wc']);

    this.rows = years.map((year, idx) => ({
      year,
      revenue: revenue[idx] ?? 0,
      ebitda: ebitda[idx] ?? 0,
      fcffAfterWc: fcffAfterWc[idx] ?? 0,
    }));

    this.chartData = {
      labels: years,
      datasets: [
        {
          label: 'Revenue',
          data: revenue,
          borderColor: '#fca5a5',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'EBITDA',
          data: ebitda,
          borderColor: '#7dd3fc',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
        {
          label: 'FCFF after WC',
          data: fcffAfterWc,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          pointRadius: 2,
        },
      ],
    };
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
