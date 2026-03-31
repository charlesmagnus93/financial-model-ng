import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface DebtScheduleRow {
  index: number;
  beginningBalance: number;
  debtDrawdowns: number;
  debtRepayments: number;
  endingBalance: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-debt-schedule',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset legend="Debt schedule" [toggleable]="true" class="w-full">
      <div class="overflow-auto rounded" [style]="{ width: '76vw' }">
        <p-table
          [value]="rows"
          showGridlines
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          class="text-sm"
        >
          <ng-template #header>
            <tr>
              <th>index</th>
              <th class="text-right">Beginning balance</th>
              <th class="text-right">Debt drawdowns</th>
              <th class="text-right">Debt repayments</th>
              <th class="text-right">Ending balance</th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td class="text-right">{{ formatNumber(row.beginningBalance) }}</td>
              <td class="text-right">{{ formatNumber(row.debtDrawdowns) }}</td>
              <td class="text-right">{{ formatNumber(row.debtRepayments) }}</td>
              <td class="text-right">{{ formatNumber(row.endingBalance) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fieldset>
  `,
})
export class BiotechDebtScheduleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  rows: DebtScheduleRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

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

    const drawdownsRaw = this.pickSeries(data, ['debt_drawdowns']);
    const repaymentsRaw = this.pickSeries(data, ['debt_repayments']);
    const beginningRaw = this.pickSeries(data, [
      'debt_beginning_balance',
      'debt_balance_beginning',
      'debt_opening_balance',
    ]);
    const endingRaw = this.pickSeries(data, [
      'debt_ending_balance',
      'debt_balance_ending',
      'debt_outstanding',
      'debt_balance',
    ]);

    const requiredLength = Math.max(
      yearsRaw.length,
      drawdownsRaw.length,
      repaymentsRaw.length,
      beginningRaw.length,
      endingRaw.length
    );

    const labels = this.buildLabels(yearsRaw, requiredLength);
    const drawdowns = this.normalizeSeriesLength(drawdownsRaw, requiredLength);
    const repayments = this.normalizeSeriesLength(repaymentsRaw, requiredLength);
    const beginningInput = this.normalizeSeriesLength(beginningRaw, requiredLength);
    const endingInput = this.normalizeSeriesLength(endingRaw, requiredLength);

    const hasBeginningInput = beginningRaw.length > 0;
    const hasEndingInput = endingRaw.length > 0;
    const repaymentMultiplier = this.resolveRepaymentMultiplier(repaymentsRaw);

    let runningBalance = 0;
    this.rows = labels.map((index, idx) => {
      const beginningBalance = hasBeginningInput
        ? (beginningInput[idx] ?? runningBalance)
        : runningBalance;
      const debtDrawdowns = drawdowns[idx] ?? 0;
      const debtRepayments = repayments[idx] ?? 0;
      const endingDerived = Math.max(
        0,
        beginningBalance + debtDrawdowns + repaymentMultiplier * debtRepayments
      );
      const endingBalance = hasEndingInput
        ? (endingInput[idx] ?? endingDerived)
        : endingDerived;
      runningBalance = endingBalance;

      return {
        index,
        beginningBalance,
        debtDrawdowns,
        debtRepayments,
        endingBalance,
      };
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

  private resolveRepaymentMultiplier(values: number[]): number {
    if (!values.length) {
      return 1;
    }
    const hasPositive = values.some((value) => value > 0);
    const hasNegative = values.some((value) => value < 0);
    if (hasPositive && !hasNegative) {
      return -1;
    }
    return 1;
  }
}

