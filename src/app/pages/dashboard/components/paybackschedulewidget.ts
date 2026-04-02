import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface PaybackRow {
  index: number;
  year: number;
  cashFlow: number;
  cumulative: number;
}

@Component({
  standalone: true,
  selector: 'payback-schedule-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Payback Schedule</div>

      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '900px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Cash Flow</th>
              <th>Cumulative</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.cashFlow) }}</td>
              <td>{{ formatNumber(row.cumulative) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">Cumulative Payback</div>
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
export class PaybackScheduleWidget implements OnInit {
  rows: PaybackRow[] = [];
  lineType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => `Cumulative: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
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
      point: { radius: 3 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    this.rows = this.buildRows();
    this.chartData = {
      labels: this.rows.map((r) => r.year),
      datasets: [
        {
          label: 'Cumulative',
          data: this.rows.map((r) => r.cumulative),
          borderColor: '#7ed0ff',
          backgroundColor: 'rgba(126, 208, 255, 0.12)',
          fill: false,
          tension: 0.2,
          pointRadius: 3,
        },
      ],
    };
  }

  private buildRows(): PaybackRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const payback = output?.payback ?? {};
    const years = (payback.index as number[]) ?? [];
    const cashFlow = this.asNumberArray(payback.data?.['Cash Flow']);
    const cumulative = this.asNumberArray(payback.data?.Cumulative);

    return years.map((year, idx) => ({
      index: idx,
      year,
      cashFlow: cashFlow[idx] ?? 0,
      cumulative: cumulative[idx] ?? 0,
    }));
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
