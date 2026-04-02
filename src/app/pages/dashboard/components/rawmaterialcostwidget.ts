import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface RawMaterialRow {
  index: number;
  year: number;
  multiplier: number;
  npv: number;
  irr: number;
}

@Component({
  standalone: true,
  selector: 'raw-material-cost-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">raw_material_cost</div>

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
        <div class="text-sm font-semibold text-surface-300">raw_material_cost Sensitivity Trend</div>
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
export class RawMaterialCostWidget implements OnInit {
  rows: RawMaterialRow[] = [];
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
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    this.rows = this.buildRows();
    this.chartData = this.buildChart(this.rows);
  }

  private buildRows(): RawMaterialRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const table = output?.sensitivity_results?.raw_material_cost ?? {};
    const multipliers = this.asNumberArray(table.data?.Multiplier);
    const npv = this.asNumberArray(table.data?.NPV);
    const irr = this.asNumberArray(table.data?.IRR);
    const cases = this.asNumberArray(table.index);

    return multipliers.map((m, idx) => ({
      index: idx,
      year: cases[idx] ?? idx + 1,
      multiplier: m,
      npv: npv[idx] ?? 0,
      irr: irr[idx] ?? 0,
    }));
  }

  private buildChart(rows: RawMaterialRow[]): ChartConfiguration['data'] {
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
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
