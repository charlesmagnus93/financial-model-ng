import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';
import { Subject, takeUntil } from 'rxjs';

interface PerformanceRow {
  index: number;
  revenue: number;
  cogs: number;
  materials: number;
  labor: number;
  overhead: number;
  salesMarketing: number;
  gna: number;
  royalty: number;
  rdExpense: number;
  milestones: number;
  ebitda: number;
  ebit: number;
  tax: number;
  nopat: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-financial-performance',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset legend="Statement of Financial Performance" [toggleable]="true" class="w-full">
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>index</th>
              <th class="text-right">Revenue</th>
              <th class="text-right">COGS</th>
              <th class="text-right">Materials</th>
              <th class="text-right">Labor</th>
              <th class="text-right">Overhead</th>
              <th class="text-right">Sales &amp; Marketing</th>
              <th class="text-right">G&amp;A</th>
              <th class="text-right">Royalty</th>
              <th class="text-right">R&amp;D expense</th>
              <th class="text-right">Milestones</th>
              <th class="text-right">EBITDA</th>
              <th class="text-right">EBIT</th>
              <th class="text-right">Tax</th>
              <th class="text-right">NOPAT</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td class="text-right">{{ formatNumber(row.revenue) }}</td>
              <td class="text-right">{{ formatNumber(row.cogs) }}</td>
              <td class="text-right">{{ formatNumber(row.materials) }}</td>
              <td class="text-right">{{ formatNumber(row.labor) }}</td>
              <td class="text-right">{{ formatNumber(row.overhead) }}</td>
              <td class="text-right">{{ formatNumber(row.salesMarketing) }}</td>
              <td class="text-right">{{ formatNumber(row.gna) }}</td>
              <td class="text-right">{{ formatNumber(row.royalty) }}</td>
              <td class="text-right">{{ formatNumber(row.rdExpense) }}</td>
              <td class="text-right">{{ formatNumber(row.milestones) }}</td>
              <td class="text-right">{{ formatNumber(row.ebitda) }}</td>
              <td class="text-right">{{ formatNumber(row.ebit) }}</td>
              <td class="text-right">{{ formatNumber(row.tax) }}</td>
              <td class="text-right">{{ formatNumber(row.nopat) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fieldset>
  `,
})
export class BiotechFinancialPerformanceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  rows: PerformanceRow[] = [];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private updateFromOutput(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (resolvedOutput as any)?.consolidated ?? {};
    const yearsRaw = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};

    const revenueRaw = this.pickSeries(data, ['revenue']);
    const cogsRaw = this.pickSeries(data, ['cogs']);
    const materialsRaw = this.pickSeries(data, [
      'materials',
      'materials_cost',
      'material',
    ]);
    const laborRaw = this.pickSeries(data, ['labor', 'labour', 'labor_cost', 'labour_cost']);
    const overheadRaw = this.pickSeries(data, ['overhead', 'overheads', 'overhead_cost']);
    const salesMarketingRaw = this.pickSeries(data, [
      'sales_marketing',
      'sales_marketing_expense',
      'sales_marketing_cost',
    ]);
    const gnaRaw = this.pickSeries(data, ['gna', 'g_and_a', 'ga']);
    const royaltyRaw = this.pickSeries(data, ['royalty', 'royalties']);
    const rdExpenseRaw = this.pickSeries(data, [
      'rd_expense_pnl',
      'rd_expense',
      'r_and_d_expense',
      'rnd_expense',
    ]);
    const milestonesRaw = this.pickSeries(data, [
      'milestones',
      'milestone_revenue',
      'milestone_payments',
    ]);
    const ebitdaRaw = this.pickSeries(data, ['ebitda']);
    const ebitRaw = this.pickSeries(data, ['ebit']);
    const taxRaw = this.pickSeries(data, ['tax', 'cash_taxes', 'taxes']);
    const nopatRaw = this.pickSeries(data, ['nopat']);

    const requiredLength = Math.max(
      yearsRaw.length,
      revenueRaw.length,
      cogsRaw.length,
      materialsRaw.length,
      laborRaw.length,
      overheadRaw.length,
      salesMarketingRaw.length,
      gnaRaw.length,
      royaltyRaw.length,
      rdExpenseRaw.length,
      milestonesRaw.length,
      ebitdaRaw.length,
      ebitRaw.length,
      taxRaw.length,
      nopatRaw.length
    );

    const labels = this.buildLabels(yearsRaw, requiredLength);
    const revenue = this.normalizeSeriesLength(revenueRaw, requiredLength);
    const cogs = this.normalizeSeriesLength(cogsRaw, requiredLength);
    const materials = this.normalizeSeriesLength(materialsRaw, requiredLength);
    const labor = this.normalizeSeriesLength(laborRaw, requiredLength);
    const overhead = this.normalizeSeriesLength(overheadRaw, requiredLength);
    const salesMarketing = this.normalizeSeriesLength(salesMarketingRaw, requiredLength);
    const gna = this.normalizeSeriesLength(gnaRaw, requiredLength);
    const royalty = this.normalizeSeriesLength(royaltyRaw, requiredLength);
    const rdExpense = this.normalizeSeriesLength(rdExpenseRaw, requiredLength);
    const milestones = this.normalizeSeriesLength(milestonesRaw, requiredLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, requiredLength);
    const ebit = this.normalizeSeriesLength(ebitRaw, requiredLength);
    const tax = this.normalizeSeriesLength(taxRaw, requiredLength);
    const nopat = this.normalizeSeriesLength(nopatRaw, requiredLength);

    this.rows = labels.map((index, idx) => ({
      index,
      revenue: revenue[idx] ?? 0,
      cogs: cogs[idx] ?? 0,
      materials: materials[idx] ?? 0,
      labor: labor[idx] ?? 0,
      overhead: overhead[idx] ?? 0,
      salesMarketing: salesMarketing[idx] ?? 0,
      gna: gna[idx] ?? 0,
      royalty: royalty[idx] ?? 0,
      rdExpense: rdExpense[idx] ?? 0,
      milestones: milestones[idx] ?? 0,
      ebitda: ebitda[idx] ?? 0,
      ebit: ebit[idx] ?? 0,
      tax: tax[idx] ?? 0,
      nopat: nopat[idx] ?? 0,
    }));
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private pickSeries(data: Record<string, unknown>, keys: string[]): number[] {
    for (const key of keys) {
      const series = this.asNumberArray(data[key]);
      if (series.length) {
        return series;
      }
    }
    return [];
  }

  private buildLabels(years: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (years.length >= requiredLength) {
      return years.slice(0, requiredLength);
    }
    if (years.length > 0) {
      const labels = [...years];
      let nextYear = labels[labels.length - 1] ?? 0;
      while (labels.length < requiredLength) {
        nextYear += 1;
        labels.push(nextYear);
      }
      return labels;
    }
    return Array.from({ length: requiredLength }, (_, index) => index + 1);
  }

  private normalizeSeriesLength(values: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const normalized = [...values];
    while (normalized.length < requiredLength) {
      normalized.push(0);
    }
    return normalized;
  }

}

