import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
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
                <th>Mean</th>
                <th>Std</th>
                <th>Suggested weight</th>
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

        <div class="text-sm text-surface-200 font-semibold">
          Real option (deferral) value estimate: {{ formatNumber(realOptionValue) }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechOptimizationPortfolioComponent implements OnInit {
  rows: PortfolioRow[] = [];
  realOptionValue = 0;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    this.realOptionValue = Math.max(0, Number(output?.rnpv ?? 0));
    const consolidated = (output as any)?.consolidated ?? {};
    const consolidatedData = consolidated.data ?? {};
    const perProduct = output?.per_product ?? {};
    const products = Object.keys(perProduct);

    const aggregates = products.map((product) => {
      const data = perProduct[product]?.data ?? {};
      const revenue = this.asNumberArray(data['revenue']);
      const fcff = this.asNumberArray(data['fcff']);
      return {
        product,
        mean: this.mean(revenue),
        std: this.std(revenue),
        fcffTotal: fcff.reduce((sum, value) => sum + (value ?? 0), 0),
      };
    });

    const totalMean = aggregates.reduce((sum, row) => sum + row.mean, 0);
    const totalFcff = aggregates.reduce((sum, row) => sum + row.fcffTotal, 0);
    const impliedMean =
      this.mean(this.asNumberArray(consolidatedData['revenue'])) - totalMean;
    const impliedFcff =
      this.asNumberArray(consolidatedData['fcff']).reduce((sum, v) => sum + (v ?? 0), 0) -
      totalFcff;

    aggregates.push({
      product: 'Vaccine Sales (Implied)',
      mean: impliedMean,
      std: 0,
      fcffTotal: impliedFcff,
    });

    const totalFcffWithImplied = aggregates.reduce(
      (sum, row) => sum + row.fcffTotal,
      0
    );

    this.rows = aggregates.map((row) => ({
      product: row.product,
      mean: row.mean,
      std: row.std,
      weight: totalFcffWithImplied ? row.fcffTotal / totalFcffWithImplied : 0,
    }));
  }

  private mean(values: number[]): number {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private std(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = this.mean(values);
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

}
