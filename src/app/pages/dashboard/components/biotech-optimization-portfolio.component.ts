import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface PortfolioRow {
  product: string;
  mean: number;
  std: number;
  weight: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-optimization-portfolio',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset
      legend="Optimisation, portfolio design &amp; real options"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="text-sm text-surface-500">
          Install SciPy to enable nonlinear optimisation.
        </div>

        @if (rows.length) {
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
                  <th>#</th>
                  <th>Product</th>
                  <th class="text-right">Mean</th>
                  <th class="text-right">Std</th>
                  <th class="text-right">Suggested weight</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td>{{ i }}</td>
                  <td class="font-semibold">{{ row.product }}</td>
                  <td class="text-right">{{ formatNumber(row.mean) }}</td>
                  <td class="text-right">{{ formatNumber(row.std) }}</td>
                  <td class="text-right">{{ formatPercent(row.weight) }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        }

        @if (realOptionValue !== null) {
          <div class="text-sm text-surface-200 font-semibold">
            Real option (deferral) value estimate: {{ formatNumber(realOptionValue) }}
          </div>
        } @else {
          <div class="text-sm text-surface-500">
            Provide R&amp;D cash flows and install SciPy to compute real options.
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechOptimizationPortfolioComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  rows: PortfolioRow[] = [];
  realOptionValue: number | null = null;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.refreshFromOutput(this.biotechModelService.getOutputSnapshot());
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.refreshFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private refreshFromOutput(output: any): void {
    const snapshot = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    this.rows = this.buildMeanVarianceRows(snapshot);
    this.realOptionValue = this.buildRealOptionValue(snapshot);
  }

  private buildMeanVarianceRows(output: any): PortfolioRow[] {
    const perProductProb =
      output?.per_product_prob && typeof output?.per_product_prob === 'object'
        ? output.per_product_prob
        : output?.per_product && typeof output?.per_product === 'object'
          ? output.per_product
          : {};

    const baseRows = Object.entries(perProductProb)
      .map(([product, payload]) => {
        const data = (payload as { data?: Record<string, unknown[]> })?.data ?? {};
        const returns = this.asFiniteNumberArray(data['fcff']);
        if (returns.length < 2) {
          return null;
        }
        return {
          product: String(product),
          mean: this.mean(returns),
          std: this.stdPopulation(returns),
        };
      })
      .filter((row): row is { product: string; mean: number; std: number } => Boolean(row));

    if (!baseRows.length) {
      return [];
    }

    const invStd = baseRows.map((row) => (row.std > 0 ? 1 / row.std : 0));
    const invStdTotal = invStd.reduce((sum, value) => sum + value, 0);

    return baseRows.map((row, idx) => ({
      product: row.product,
      mean: row.mean,
      std: row.std,
      weight: invStdTotal > 0 ? invStd[idx] / invStdTotal : 1 / baseRows.length,
    }));
  }

  private buildRealOptionValue(output: any): number | null {
    const years = 3;
    const volatility = 0.35;
    const underlying = Math.max(this.toNumber(output?.rnpv, 0), 0);
    const rdCash = this.asFiniteNumberArray(output?.consolidated?.data?.['rd_cash']).map((v) =>
      Math.abs(v)
    );
    const strike = years > 0 ? rdCash.reduce((sum, value) => sum + value, 0) / years : 1;

    if (underlying <= 0 || strike <= 0 || volatility <= 0 || years <= 0) {
      return null;
    }

    const r = 0.05;
    const t = Math.max(1e-6, years);
    const sqrtT = Math.sqrt(t);
    const d1 =
      (Math.log(underlying / strike) + (r + 0.5 * volatility * volatility) * t) /
      (volatility * sqrtT);
    const d2 = d1 - volatility * sqrtT;

    const optionValue =
      underlying * this.normalCdf(d1) - strike * Math.exp(-r * t) * this.normalCdf(d2);
    return Number.isFinite(optionValue) ? optionValue : null;
  }

  private mean(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private stdPopulation(values: number[]): number {
    if (values.length < 2) {
      return 0;
    }
    const avg = this.mean(values);
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private asFiniteNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value)) as number[];
  }

  private toNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  private normalCdf(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.SQRT2));
  }

  // Numerical approximation of the Gauss error function.
  private erf(x: number): number {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * absX);
    const y =
      1 -
      (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
        Math.exp(-absX * absX);
    return sign * y;
  }
}
