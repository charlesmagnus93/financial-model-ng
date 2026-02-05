import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface RegressionRow {
  target: string;
  intercept: number;
  revenueBeta: number;
  r2: number;
}

interface ClassificationRow {
  product: string;
  revenueShare: number;
  ebitdaMargin: number;
  highMarginProbability: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-regression-classification',
  imports: [CommonModule, FieldsetModule, TableModule],
  template: `
    <p-fieldset
      legend="Regression &amp; classification models"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="overflow-auto">
          <p-table
            [value]="regressionRows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="220px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>Target</th>
                <th>Intercept</th>
                <th>Revenue beta</th>
                <th>R^2</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td class="font-semibold">{{ row.target }}</td>
                <td class="text-right">{{ formatNumber(row.intercept) }}</td>
                <td class="text-right">{{ row.revenueBeta.toFixed(2) }}</td>
                <td class="text-right">{{ row.r2.toFixed(2) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="overflow-auto">
          <p-table
            [value]="classificationRows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="220px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Revenue share</th>
                <th>EBITDA margin</th>
                <th>High-margin probability</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td class="font-semibold">{{ row.product }}</td>
                <td class="text-right">{{ formatPercent(row.revenueShare) }}</td>
                <td class="text-right">{{ formatPercent(row.ebitdaMargin) }}</td>
                <td class="text-right">{{ formatPercent(row.highMarginProbability) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRegressionClassificationComponent implements OnInit {
  regressionRows: RegressionRow[] = [];
  classificationRows: ClassificationRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const data = consolidated.data ?? {};
    const revenue = this.asNumberArray(data['revenue']);

    this.regressionRows = [
      this.buildRegressionRow('EBITDA', revenue, this.asNumberArray(data['ebitda'])),
      this.buildRegressionRow('NOPAT', revenue, this.asNumberArray(data['nopat'])),
      this.buildRegressionRow(
        'FCFF_AFTER_WC',
        revenue,
        this.asNumberArray(data['fcff_after_wc'])
      ),
    ];

    const perProduct = output?.per_product ?? {};
    const products = Object.keys(perProduct);
    const aggregates = products.map((product) => {
      const series = perProduct[product]?.data ?? {};
      const rev = this.sumNumbers(series['revenue']);
      const ebitda = this.sumNumbers(series['ebitda']);
      return { product, revenue: rev, ebitda };
    });

    const totalRevenue = aggregates.reduce((sum, row) => sum + row.revenue, 0);
    const totalEbitda = aggregates.reduce((sum, row) => sum + row.ebitda, 0);
    const impliedRevenue = this.sumNumbers(data['revenue']) - totalRevenue;
    const impliedEbitda = this.sumNumbers(data['ebitda']) - totalEbitda;
    aggregates.push({
      product: 'Vaccine Sales (Implied)',
      revenue: impliedRevenue,
      ebitda: impliedEbitda,
    });

    this.classificationRows = aggregates.map((row) => {
      const revenueShare = totalRevenue ? row.revenue / totalRevenue : 0;
      const ebitdaMargin = row.revenue ? row.ebitda / row.revenue : 0;
      const highMarginProbability = this.toProbability(ebitdaMargin);
      return {
        product: row.product,
        revenueShare,
        ebitdaMargin,
        highMarginProbability,
      };
    });
  }

  private buildRegressionRow(
    label: string,
    x: number[],
    y: number[]
  ): RegressionRow {
    if (!x.length || !y.length) {
      return { target: label, intercept: 0, revenueBeta: 0, r2: 0 };
    }
    const n = Math.min(x.length, y.length);
    const xVals = x.slice(0, n);
    const yVals = y.slice(0, n);
    const meanX = xVals.reduce((sum, v) => sum + v, 0) / n;
    const meanY = yVals.reduce((sum, v) => sum + v, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i += 1) {
      const dx = xVals[i] - meanX;
      const dy = yVals[i] - meanY;
      num += dx * dy;
      den += dx * dx;
    }
    const beta = den ? num / den : 0;
    const intercept = meanY - beta * meanX;
    const ssTot = yVals.reduce((sum, v) => sum + Math.pow(v - meanY, 2), 0);
    const ssRes = yVals.reduce((sum, v, i) => {
      const pred = intercept + beta * xVals[i];
      return sum + Math.pow(v - pred, 2);
    }, 0);
    const r2 = ssTot ? 1 - ssRes / ssTot : 0;
    return {
      target: label,
      intercept,
      revenueBeta: beta,
      r2,
    };
  }

  private toProbability(margin: number): number {
    if (!Number.isFinite(margin)) return 0;
    const scaled = margin / 0.4;
    return Math.min(1, Math.max(0, 0.5 + 0.25 * scaled));
  }

  private sumNumbers(values: unknown): number {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, v) => sum + Number(v ?? 0), 0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }
}
