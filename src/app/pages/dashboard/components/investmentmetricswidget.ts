import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

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
export class InvestmentMetricsWidget implements OnInit {
  npv = NaN;
  irr = NaN;
  payback = NaN;
  discountedPayback = NaN;
  netIncomeActual = NaN;
  netIncomeTarget = NaN;

  rows: MetricRow[] = [];

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const summary = output?.summary_metrics ?? {};
    const goalSeek = output?.goal_seek ?? {};

    const summaryIndex = (summary.index as string[]) ?? [];
    const summaryValues = (summary.data?.Value as number[]) ?? [];

    this.npv = this.getMetricValue(summaryIndex, summaryValues, 'NPV');
    this.irr = this.getMetricValue(summaryIndex, summaryValues, 'IRR');
    this.payback = this.getMetricValue(
      summaryIndex,
      summaryValues,
      'Payback Period'
    );
    this.discountedPayback = this.getMetricValue(
      summaryIndex,
      summaryValues,
      'Discounted Payback'
    );

    const goalTarget = (goalSeek.data?.Target as number[]) ?? [];
    const goalActual = (goalSeek.data?.Actual as number[]) ?? [];
    const goalGap = (goalSeek.data?.Gap as number[]) ?? [];
    const goalMultiplier = (goalSeek.data?.['Required Multiplier'] as number[]) ?? [];
    const goalIndex = (goalSeek.index as string[]) ?? [];

    this.netIncomeTarget = goalTarget[0] ?? NaN;
    this.netIncomeActual = goalActual[0] ?? NaN;

    this.rows = goalIndex.map((metric, idx) => ({
      metric,
      target: goalTarget[idx] ?? NaN,
      actual: goalActual[idx] ?? NaN,
      gap: goalGap[idx] ?? NaN,
      requiredMultiplier: goalMultiplier[idx] ?? NaN,
    }));
  }

  private getMetricValue(
    labels: string[],
    values: number[],
    target: string
  ): number {
    const idx = labels.indexOf(target);
    if (idx === -1) return NaN;
    const value = (values as Array<number | null | undefined>)[idx];
    if (value === null || value === undefined) return NaN;
    return Number(value);
  }

  formatNumber(value: number, currency = false): string {
    if (Number.isNaN(value)) return 'nan';
    const formatted = formatNumberEnglish(value);
    return currency ? `${value < 0 ? '-' : ''}$${formatNumberEnglish(Math.abs(value))}` : formatted;
  }
}
