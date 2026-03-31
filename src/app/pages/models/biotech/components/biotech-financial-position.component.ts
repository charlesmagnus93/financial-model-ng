import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';
import { Subject, takeUntil } from 'rxjs';

interface PositionRow {
  index: number;
  intangibles: number;
  propertyEquipment: number;
  workingCapital: number;
  totalAssets: number;
  retainedEarnings: number;
  paidInCapital: number;
  totalEquity: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-financial-position',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset legend="Statement of Financial Position" [toggleable]="true" class="w-full">
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>index</th>
              <th class="text-right">Intangibles</th>
              <th class="text-right">Property &amp; equipment</th>
              <th class="text-right">Working capital</th>
              <th class="text-right">Total assets</th>
              <th class="text-right">Retained earnings</th>
              <th class="text-right">Paid-in capital</th>
              <th class="text-right">Total equity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td class="text-right">{{ formatNumber(row.intangibles) }}</td>
              <td class="text-right">{{ formatNumber(row.propertyEquipment) }}</td>
              <td class="text-right">{{ formatNumber(row.workingCapital) }}</td>
              <td class="text-right">{{ formatNumber(row.totalAssets) }}</td>
              <td class="text-right">{{ formatNumber(row.retainedEarnings) }}</td>
              <td class="text-right">{{ formatNumber(row.paidInCapital) }}</td>
              <td class="text-right">{{ formatNumber(row.totalEquity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fieldset>
  `,
})
export class BiotechFinancialPositionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  rows: PositionRow[] = [];

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

    const rdCapAddRaw = this.pickSeries(data, ['rd_cap_add', 'rd_capitalized']);
    const capexCashRaw = this.pickSeries(data, ['capex_cash', 'capex']);
    const deltaWcRaw = this.pickSeries(data, ['delta_wc', 'working_capital_change']);
    const nopatRaw = this.pickSeries(data, ['nopat']);

    const requiredLength = Math.max(
      yearsRaw.length,
      rdCapAddRaw.length,
      capexCashRaw.length,
      deltaWcRaw.length,
      nopatRaw.length
    );

    const labels = this.buildLabels(yearsRaw, requiredLength);
    const rdCapAdd = this.normalizeSeriesLength(rdCapAddRaw, requiredLength);
    const capexCash = this.normalizeSeriesLength(capexCashRaw, requiredLength);
    const deltaWc = this.normalizeSeriesLength(deltaWcRaw, requiredLength);
    const nopat = this.normalizeSeriesLength(nopatRaw, requiredLength);

    const intangibles = this.buildCumulative(rdCapAdd, -1);
    const propertyEquipment = this.buildCumulative(capexCash, -1);
    const workingCapital = this.buildCumulative(deltaWc, -1);
    const retainedEarnings = this.buildCumulative(nopat, 1);

    this.rows = labels.map((index, idx) => {
      const totalAssets =
        (intangibles[idx] ?? 0) +
        (propertyEquipment[idx] ?? 0) +
        (workingCapital[idx] ?? 0);
      const retained = retainedEarnings[idx] ?? 0;
      const paidInCapital = totalAssets - retained;

      return {
        index,
        intangibles: intangibles[idx] ?? 0,
        propertyEquipment: propertyEquipment[idx] ?? 0,
        workingCapital: workingCapital[idx] ?? 0,
        totalAssets,
        retainedEarnings: retained,
        paidInCapital,
        totalEquity: totalAssets,
      };
    });
  }

  private buildCumulative(values: number[], multiplier: number): number[] {
    let total = 0;
    return values.map((v) => {
      total += (v ?? 0) * multiplier;
      return total;
    });
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

