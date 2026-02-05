import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

interface BreakEvenRow {
  product: string;
  fixedCost: number;
  sellingPrice: number;
  variableCost: number;
  targetProfit: number;
  expectedVolume: number;
}

interface BreakEvenMetrics {
  contributionMargin: number;
  marginRatio: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  marginOfSafety: number | null;
}

@Component({
  standalone: true,
  selector: 'breakeven-payback-inputs-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    SelectModule,
    TableModule,
    ButtonModule,
    FluidModule,
    InputTextModule,
    NgChartsModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-6 w-full fp-10">
        <div class="text-xl font-semibold">Break-even Analysis Inputs</div>

        <form [formGroup]="form" class="flex flex-col gap-6">
          <div formArrayName="rows" class="space-y-6">
            @for (row of rows.controls; track row; let i = $index) {
              <div [formGroupName]="i" class="flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Product</div>
                    <p-select
                      [options]="products"
                      formControlName="product"
                      placeholder="Select product"
                      class="w-full"
                    ></p-select>
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Fixed Cost</div>
                    <p-inputnumber
                      formControlName="fixedCost"
                      mode="decimal"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="4"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Selling Price</div>
                    <p-inputnumber
                      formControlName="sellingPrice"
                      mode="decimal"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="4"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Variable Cost</div>
                    <p-inputnumber
                      formControlName="variableCost"
                      mode="decimal"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="4"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Target Profit</div>
                    <p-inputnumber
                      formControlName="targetProfit"
                      mode="decimal"
                      [minFractionDigits]="2"
                      [maxFractionDigits]="4"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs font-semibold mb-1">Expected Volume</div>
                    <p-inputnumber
                      formControlName="expectedVolume"
                      mode="decimal"
                      [minFractionDigits]="0"
                      [maxFractionDigits]="4"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                  </div>
                </div>

                @if (getMetrics(row).contributionMargin <= 0) {
                  <div class="bg-red-100 text-red-600 text-sm px-3 py-2 rounded">
                    Contribution margin non-positive
                  </div>
                }

                <div class="grid grid-cols-12 gap-3 text-sm">
                  <div class="col-span-12 md:col-span-3">
                    <div class="text-xs text-surface-400">Contribution Margin</div>
                    <div class="text-lg font-semibold">
                      {{ formatNumber(getMetrics(row).contributionMargin) }}
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs text-surface-400">Margin Ratio</div>
                    <div class="text-lg font-semibold">
                      {{ formatPercent(getMetrics(row).marginRatio) }}
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs text-surface-400">Break-even Units</div>
                    <div class="text-lg font-semibold">
                      {{ formatNullable(getMetrics(row).breakEvenUnits) }}
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs text-surface-400">Break-even Revenue</div>
                    <div class="text-lg font-semibold">
                      {{ formatNullable(getMetrics(row).breakEvenRevenue) }}
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-2">
                    <div class="text-xs text-surface-400">Margin of Safety</div>
                    <div class="text-lg font-semibold">
                      {{ formatNullable(getMetrics(row).marginOfSafety) }}
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-1 flex justify-end">
                    <p-button
                      label="Remove"
                      severity="danger"
                      variant="outlined"
                      (click)="removeRow(i)"
                    ></p-button>
                  </div>
                </div>
              </div>
            }
          </div>
        </form>

        <div class="border border-surface-800 rounded-md p-4 flex flex-col gap-4">
          <div class="text-lg font-semibold">Add Break-even Input</div>
          <form [formGroup]="customRowForm" class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-4">
              <div class="text-xs font-semibold mb-1">Product</div>
              <p-select
                [options]="productOptions"
                formControlName="product"
                class="w-full"
              ></p-select>
            </div>
            <div class="col-span-2">
              <div class="text-xs font-semibold mb-1">Product (custom)</div>
              <input
                pInputText
                class="p-inputtext w-full"
                formControlName="customProduct"
                placeholder="Add new..."
              />
            </div>
            <div class="col-span-2">
              <div class="text-xs font-semibold mb-1">Selling Price</div>
              <p-inputnumber
                formControlName="sellingPrice"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-2">
              <div class="text-xs font-semibold mb-1">Target Profit</div>
              <p-inputnumber
                formControlName="targetProfit"
                mode="decimal"
                [minFractionDigits]="2"
                [maxFractionDigits]="4"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-2">
              <div class="text-xs font-semibold mb-1">Expected Volume</div>
              <p-inputnumber
                formControlName="expectedVolume"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="4"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button
                label="Add"
                icon="pi pi-plus"
                (click)="addCustomRowFromForm()"
              ></p-button>
            </div>
          </form>
        </div>

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">Break-even Summary</div>
          <div class="overflow-auto">
            <p-table
              showGridlines
              [value]="summaryRows"
              responsiveLayout="scroll"
              class="text-sm"
              [tableStyle]="{ 'min-width': '1400px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Fixed Cost</th>
                  <th>Variable Cost per Unit</th>
                  <th>Selling Price</th>
                  <th>Contribution Margin</th>
                  <th>Contribution Margin Ratio</th>
                  <th>Target Profit</th>
                  <th>Break-even Units</th>
                  <th>Break-even Revenue</th>
                  <th>Expected Volume</th>
                  <th>Margin of Safety (Units)</th>
                  <th>Margin of Safety (%)</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.index }}</td>
                  <td>{{ row.product }}</td>
                  <td>{{ formatNumber(row.fixedCost) }}</td>
                  <td>{{ formatNumber(row.variableCost) }}</td>
                  <td>{{ formatNumber(row.sellingPrice) }}</td>
                  <td>{{ formatNumber(row.contributionMargin) }}</td>
                  <td>{{ formatPercent(row.marginRatio) }}</td>
                  <td>{{ formatNumber(row.targetProfit) }}</td>
                  <td>{{ formatNullable(row.breakEvenUnits) }}</td>
                  <td>{{ formatNullable(row.breakEvenRevenue) }}</td>
                  <td>{{ formatNumber(row.expectedVolume) }}</td>
                  <td>{{ formatNullable(row.marginOfSafetyUnits) }}</td>
                  <td>{{ formatNullable(row.marginOfSafetyPercent) }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">Break-even Units by Product</div>
          <div class="h-80">
            <canvas
              baseChart
              [type]="barType"
              [data]="breakEvenUnitsData"
              [options]="barOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>

      </div>
    </p-fluid>
  `,
})
export class BreakEvenPaybackInputsWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  customRowForm: FormGroup;

  products: string[] = [];
  productOptions = [...this.products, 'Add new...'];

  barType: ChartType = 'bar';

  constructor(
    private fb: FormBuilder,
    private pharmaModelService: PharmaModelService
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      product: [''],
      fixedCost: [0],
      sellingPrice: [0],
      variableCost: [0],
      targetProfit: [0],
      expectedVolume: [0],
    });

    this.customRowForm = this.fb.group({
      product: ['Add new...'],
      customProduct: [''],
      sellingPrice: [0],
      targetProfit: [0],
      expectedVolume: [0],
    });
  }

  ngOnInit(): void {
    const rows = this.buildRowsFromOutput().map((row) => this.createRow(row));
    this.products = rows.map((row) => row.get('product')?.value);
    this.productOptions = [...this.products, 'Add new...'];
    this.newRowForm.patchValue({
      product: this.products[0] ?? '',
    });
    this.customRowForm.patchValue({
      product: this.productOptions[0] ?? 'Add new...',
    });
    this.form.setControl('rows', this.fb.array(rows));
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    this.rows.push(this.createRow(value));
  }

  addCustomRowFromForm(): void {
    const value = this.customRowForm.getRawValue();
    const isCustom = value.product === 'Add new...';
    const productName = isCustom ? (value.customProduct ?? '').trim() : value.product;
    if (!productName) return;

    const row: BreakEvenRow = {
      product: productName,
      fixedCost: 0,
      sellingPrice: Number(value.sellingPrice ?? 0),
      variableCost: 0,
      targetProfit: Number(value.targetProfit ?? 0),
      expectedVolume: Number(value.expectedVolume ?? 0),
    };

    this.rows.push(this.createRow(row));
    this.customRowForm.reset({
      product: this.productOptions[0] ?? 'Add new...',
      customProduct: '',
      sellingPrice: 0,
      targetProfit: 0,
      expectedVolume: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  get totalFixedCost(): number {
    return this.rows.controls.reduce(
      (sum, row) => sum + (Number(row.get('fixedCost')?.value) || 0),
      0
    );
  }

  get weightedMarginRatio(): number {
    const totals = this.rows.controls.reduce(
      (acc, row) => {
        const values = row.getRawValue() as BreakEvenRow;
        const contributionMargin = values.sellingPrice - values.variableCost;
        const revenue = values.sellingPrice * values.expectedVolume;
        acc.marginTotal += contributionMargin * values.expectedVolume;
        acc.revenueTotal += revenue;
        return acc;
      },
      { marginTotal: 0, revenueTotal: 0 }
    );
    return totals.revenueTotal > 0 ? totals.marginTotal / totals.revenueTotal : 0;
  }

  get aggregateBreakEvenRevenue(): number | null {
    const ratio = this.weightedMarginRatio;
    if (ratio <= 0) return null;
    return this.totalFixedCost / ratio;
  }

  getMetrics(row: FormGroup): BreakEvenMetrics {
    const value = row.getRawValue() as BreakEvenRow;
    const contributionMargin = value.sellingPrice - value.variableCost;
    const marginRatio = value.sellingPrice !== 0 ? contributionMargin / value.sellingPrice : 0;
    const breakEvenUnits =
      contributionMargin > 0 ? (value.fixedCost + value.targetProfit) / contributionMargin : null;
    const breakEvenRevenue =
      breakEvenUnits !== null ? breakEvenUnits * value.sellingPrice : null;
    const marginOfSafety =
      breakEvenUnits !== null ? value.expectedVolume - breakEvenUnits : null;

    return {
      contributionMargin,
      marginRatio,
      breakEvenUnits,
      breakEvenRevenue,
      marginOfSafety,
    };
  }

  private buildRowsFromOutput(): BreakEvenRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const table = output?.break_even ?? {};
    const products = (table.index as string[]) ?? [];
    const data = table.data ?? {};

    const fixedCost = this.asNumberArray(data['Fixed Cost']);
    const variableCost = this.asNumberArray(data['Variable Cost per Unit']);
    const sellingPrice = this.asNumberArray(data['Selling Price']);
    const targetProfit = this.asNumberArray(data['Target Profit']);
    const expectedVolume = this.asNumberArray(data['Expected Volume']);

    return products.map((product, idx) => ({
      product,
      fixedCost: fixedCost[idx] ?? 0,
      sellingPrice: sellingPrice[idx] ?? 0,
      variableCost: variableCost[idx] ?? 0,
      targetProfit: targetProfit[idx] ?? 0,
      expectedVolume: expectedVolume[idx] ?? 0,
    }));
  }

  private createRow(values: BreakEvenRow): FormGroup {
    return this.fb.group({
      product: [values.product],
      fixedCost: [values.fixedCost],
      sellingPrice: [values.sellingPrice],
      variableCost: [values.variableCost],
      targetProfit: [values.targetProfit],
      expectedVolume: [values.expectedVolume],
    });
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  formatNullable(value: number | null): string {
    if (value === null || Number.isNaN(value)) return 'N/A';
    return this.formatNumber(value);
  }

  get breakEvenUnitsData(): ChartConfiguration['data'] {
    const rows = this.summaryRows;
    return {
      labels: rows.map((r) => r.product),
      datasets: [
        {
          label: 'Break-even Units',
          data: rows.map((r) => r.breakEvenUnits ?? 0),
          backgroundColor: 'rgba(126, 208, 255, 0.3)',
          borderColor: '#7ed0ff',
          borderWidth: 1.5,
        },
      ],
    };
  }

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Break-even Units: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Product', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Break-even Units', color: '#cbd5e1' },
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  get summaryRows(): Array<
    BreakEvenRow & {
      index: number;
      contributionMargin: number;
      marginRatio: number;
      breakEvenUnits: number | null;
      breakEvenRevenue: number | null;
      marginOfSafetyUnits: number | null;
      marginOfSafetyPercent: number | null;
    }
  > {
    return this.rows.controls.map((row, index) => {
      const values = row.getRawValue() as BreakEvenRow;
      const metrics = this.getMetrics(row);
      const marginOfSafetyPercent =
        metrics.marginOfSafety !== null && values.expectedVolume > 0
          ? metrics.marginOfSafety / values.expectedVolume
          : null;

      return {
        index,
        ...values,
        contributionMargin: metrics.contributionMargin,
        marginRatio: metrics.marginRatio,
        breakEvenUnits: metrics.breakEvenUnits,
        breakEvenRevenue: metrics.breakEvenRevenue,
        marginOfSafetyUnits: metrics.marginOfSafety,
        marginOfSafetyPercent,
      };
    });
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}

