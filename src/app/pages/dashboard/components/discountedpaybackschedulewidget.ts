import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface DiscountedPaybackRow {
  index: number;
  year: number;
  discountedCashFlow: number;
  cumulative: number;
}

@Component({
  standalone: true,
  selector: 'discounted-payback-schedule-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Discounted Payback Schedule</div>

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
              <th>Discounted Cash Flow</th>
              <th>Cumulative</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.discountedCashFlow) }}</td>
              <td>{{ formatNumber(row.cumulative) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold">
          Discounted Cumulative Payback
        </div>
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
export class DiscountedPaybackScheduleWidget implements OnInit {
  rows: DiscountedPaybackRow[] = [];
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
          label: 'Discounted Cumulative',
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

  private buildRows(): DiscountedPaybackRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const discounted = output?.discounted_payback ?? {};
    const years = (discounted.index as number[]) ?? [];
    const discountedCashFlow = this.asNumberArray(
      discounted.data?.['Discounted Cash Flow']
    );
    const cumulative = this.asNumberArray(discounted.data?.Cumulative);

    return years.map((year, idx) => ({
      index: idx,
      year,
      discountedCashFlow: discountedCashFlow[idx] ?? 0,
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
