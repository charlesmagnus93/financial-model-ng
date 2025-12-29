import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

interface MetricRow {
  metric: string;
  target: number | string;
  actual: number | string;
  gap: number | string;
  requiredMultiplier: number | string;
}

@Component({
  standalone: true,
  selector: 'investment-metrics-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-6 w-full">
      <div class="text-xl font-semibold flex items-center gap-2">
        Investment Metrics
        <i class="pi pi-link text-surface-400 text-sm"></i>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-3">
          <div class="text-sm text-surface-400">NPV</div>
          <div class="text-2xl font-semibold">{{ formatNumber(npv) }}</div>
        </div>
        <div class="col-span-12 sm:col-span-3">
          <div class="text-sm text-surface-400">IRR</div>
          <div class="text-2xl font-semibold">{{ formatNumber(irr) }}</div>
        </div>
        <div class="col-span-12 sm:col-span-3">
          <div class="text-sm text-surface-400">Payback Period</div>
          <div class="text-2xl font-semibold">{{ formatNumber(payback) }}</div>
        </div>
        <div class="col-span-12 sm:col-span-3">
          <div class="text-sm text-surface-400">Discounted Payback</div>
          <div class="text-2xl font-semibold">
            {{ formatNumber(discountedPayback) }}
          </div>
        </div>
      </div>

      <div>
        <div class="text-lg font-semibold mb-2">Goal Seek Metric</div>
        <div class="text-sm text-surface-400">Net Income Actual</div>
        <div class="text-3xl font-bold">
          {{ formatNumber(netIncomeActual, true) }}
        </div>
        <div class="text-emerald-400 text-sm font-semibold flex items-center gap-1">
          <i class="pi pi-arrow-right-arrow-left"></i>
          {{ formatNumber(netIncomeTarget, true) }}
        </div>
      </div>

      <div class="overflow-auto">
        <p-table
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [tableStyle]="{ 'min-width': '900px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="px-2 py-2">Metric</th>
              <th class="px-2 py-2">Target</th>
              <th class="px-2 py-2">Actual</th>
              <th class="px-2 py-2">Gap</th>
              <th class="px-2 py-2">Required Multiplier</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td class="px-2 py-2">{{ row.metric }}</td>
              <td class="px-2 py-2">{{ row.target }}</td>
              <td class="px-2 py-2">{{ row.actual }}</td>
              <td class="px-2 py-2">{{ row.gap }}</td>
              <td class="px-2 py-2">{{ row.requiredMultiplier }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class InvestmentMetricsWidget {
  npv = -309_890;
  irr = NaN;
  payback = NaN;
  discountedPayback = NaN;
  netIncomeActual = 7_110_000;
  netIncomeTarget = 7_110_000;

  rows: MetricRow[] = [
    {
      metric: 'Net Income',
      target: 20,
      actual: 20,
      gap: 0,
      requiredMultiplier: 0,
    },
  ];

  formatNumber(value: number, currency = false): string {
    if (Number.isNaN(value)) return 'nan';
    const abs = Math.abs(value);
    let formatted =
      abs >= 1_000_000
        ? `${(abs / 1_000_000).toFixed(2)}M`
        : abs >= 1_000
          ? `${(abs / 1_000).toFixed(2)}k`
          : abs.toFixed(2);
    if (currency) {
      formatted = `${value < 0 ? '-' : ''}$${formatted}`;
    } else if (value < 0) {
      formatted = `-${formatted}`;
    }
    return formatted;
  }
}
