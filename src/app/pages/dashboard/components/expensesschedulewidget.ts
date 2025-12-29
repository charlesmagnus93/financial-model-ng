import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface ExpenseRow {
  index: number;
  year: number;
  rawMaterials: number;
  utilities: number;
  directLabor: number;
  costOfSales: number;
  generalAdmin: number;
  totalExpenses: number;
}

@Component({
  standalone: true,
  selector: 'expenses-schedule-widget',
  imports: [CommonModule, TableModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold">Total Expenses Schedule</div>

      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [tableStyle]="{ 'min-width': '1200px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Raw Materials</th>
              <th>Utilities</th>
              <th>Direct Labor</th>
              <th>Cost of Sales</th>
              <th>General & Admin</th>
              <th>Total Expenses</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.rawMaterials) }}</td>
              <td>{{ formatNumber(row.utilities) }}</td>
              <td>{{ formatNumber(row.directLabor) }}</td>
              <td>{{ formatNumber(row.costOfSales) }}</td>
              <td>{{ formatNumber(row.generalAdmin) }}</td>
              <td>{{ formatNumber(row.totalExpenses) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p class="text-sm">
        Total Expenses comprise raw materials, utilities, direct labour, cost of sales, and general & administrative costs.
      </p>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-surface-300">Expense Mix Over Time</div>
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
export class ExpensesScheduleWidget implements OnInit {
  lineType: ChartType = 'line';
  rows: ExpenseRow[] = [];
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
        stacked: true,
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#cbd5e1',
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25 },
      point: { radius: 2.5, hoverRadius: 5 },
    },
  };

  ngOnInit(): void {
    const years = (inputData.years as number[]) ?? [];
    this.rows = this.buildRows(years);
    this.chartData = this.buildChartData(years, this.rows);
  }

  private buildRows(years: number[]): ExpenseRow[] {
    const baseGross = 1_550_000;
    const grossGrowth = 1.12;
    const distributorRate = 0.05;
    const costOfSalesRate = 0.62;
    const generalAdminRate = 0.035;

    // Expense mix within cost of sales bucket
    const rawMaterialShare = 0.45;
    const utilitiesShare = 0.15;
    const directLaborShare = 0.25;

    return years.map((year, idx) => {
      const grossRevenue = baseGross * Math.pow(grossGrowth, idx);
      const distributorCommission = grossRevenue * distributorRate;
      const netRevenue = grossRevenue - distributorCommission;
      const costOfSales = netRevenue * costOfSalesRate;
      const generalAdmin = netRevenue * generalAdminRate;
      const rawMaterials = costOfSales * rawMaterialShare;
      const utilities = costOfSales * utilitiesShare;
      const directLabor = costOfSales * directLaborShare;
      const totalExpenses = costOfSales + generalAdmin;

      return {
        index: idx,
        year,
        rawMaterials,
        utilities,
        directLabor,
        costOfSales,
        generalAdmin,
        totalExpenses,
      };
    });
  }

  private buildChartData(years: number[], rows: ExpenseRow[]): ChartConfiguration['data'] {
    return {
      labels: years,
      datasets: [
        {
          label: 'Raw Materials',
          data: rows.map((r) => r.rawMaterials),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.25)',
          fill: true,
        },
        {
          label: 'Utilities',
          data: rows.map((r) => r.utilities),
          borderColor: '#fb7185',
          backgroundColor: 'rgba(251, 113, 133, 0.25)',
          fill: true,
        },
        {
          label: 'Direct Labor',
          data: rows.map((r) => r.directLabor),
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.25)',
          fill: true,
        },
        {
          label: 'Cost of Sales',
          data: rows.map((r) => r.costOfSales),
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.2)',
          fill: true,
        },
        {
          label: 'General & Admin',
          data: rows.map((r) => r.generalAdmin),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.25)',
          fill: true,
        },
        {
          label: 'Total Expenses',
          data: rows.map((r) => r.totalExpenses),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
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
