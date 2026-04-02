import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface FinancialPerformanceRow {
  index: number;
  year: number;
  grossRevenue: number;
  distributorCommission: number;
  netRevenue: number;
  costOfSales: number;
  grossProfit: number;
  generalAdmin: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  ebt: number;
  taxes: number;
  netIncome: number;
  grossProfitMargin: number;
  ebitdaMargin: number;
  ebitMargin: number;
  returnOnEquity: number;
}

@Component({
  standalone: true,
  selector: 'state-financial-performance-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4 w-full">
      <div class="text-xl font-semibold">Statement of Financial Performance</div>
      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '2000px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Gross Revenue</th>
              <th>Distributors Commission</th>
              <th>Net Revenue</th>
              <th>Cost of Sales</th>
              <th>Gross Profit</th>
              <th>General & Admin</th>
              <th>EBITDA</th>
              <th>Total Depreciation Expense</th>
              <th>EBIT</th>
              <th>Interest</th>
              <th>EBT</th>
              <th>Taxes</th>
              <th>Net Income</th>
              <th>Gross Profit Margin</th>
              <th>EBITDA Margin</th>
              <th>EBIT Margin</th>
              <th>Return on Equity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.grossRevenue) }}</td>
              <td>{{ formatNumber(row.distributorCommission) }}</td>
              <td>{{ formatNumber(row.netRevenue) }}</td>
              <td>{{ formatNumber(row.costOfSales) }}</td>
              <td>{{ formatNumber(row.grossProfit) }}</td>
              <td>{{ formatNumber(row.generalAdmin) }}</td>
              <td>{{ formatNumber(row.ebitda) }}</td>
              <td>{{ formatNumber(row.depreciation) }}</td>
              <td>{{ formatNumber(row.ebit) }}</td>
              <td>{{ formatNumber(row.interest) }}</td>
              <td>{{ formatNumber(row.ebt) }}</td>
              <td>{{ formatNumber(row.taxes) }}</td>
              <td>{{ formatNumber(row.netIncome) }}</td>
              <td>{{ row.grossProfitMargin | number: '1.3-3' }}</td>
              <td>{{ row.ebitdaMargin | number: '1.3-3' }}</td>
              <td>{{ row.ebitMargin | number: '1.3-3' }}</td>
              <td>{{ formatNumber(row.returnOnEquity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <p class="text-sm">
        Simplified pro forma view of revenue, margin progression, and capital efficiency
        over the projection horizon.
      </p>
    </div>
  `,
})
export class StateFinancialPerformanceWidget implements OnInit {
  rows: FinancialPerformanceRow[] = [];

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    this.rows = this.buildRows();
  }

  private buildRows(): FinancialPerformanceRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const income = output?.income_statement ?? {};
    const years = (income.index as number[]) ?? [];
    const data = income.data ?? {};

    const grossRevenue = this.asNumberArray(data['Gross Revenue']);
    const distributorCommission = this.asNumberArray(data['Distributors Commission']);
    const netRevenue = this.asNumberArray(data['Net Revenue']);
    const costOfSales = this.asNumberArray(data['Cost of Sales']);
    const grossProfit = this.asNumberArray(data['Gross Profit']);
    const generalAdmin = this.asNumberArray(data['General & Admin']);
    const ebitda = this.asNumberArray(data['EBITDA']);
    const depreciation = this.asNumberArray(data['Total Depreciation Expense']);
    const ebit = this.asNumberArray(data['EBIT']);
    const interest = this.asNumberArray(data['Interest']);
    const ebt = this.asNumberArray(data['EBT']);
    const taxes = this.asNumberArray(data['Taxes']);
    const netIncome = this.asNumberArray(data['Net Income']);
    const grossProfitMargin = this.asNumberArray(data['Gross Profit Margin']);
    const ebitdaMargin = this.asNumberArray(data['EBITDA Margin']);
    const ebitMargin = this.asNumberArray(data['EBIT Margin']);
    const returnOnEquity = this.asNumberArray(data['Return on Equity']);

    return years.map((year, idx) => ({
      index: idx,
      year,
      grossRevenue: grossRevenue[idx] ?? 0,
      distributorCommission: distributorCommission[idx] ?? 0,
      netRevenue: netRevenue[idx] ?? 0,
      costOfSales: costOfSales[idx] ?? 0,
      grossProfit: grossProfit[idx] ?? 0,
      generalAdmin: generalAdmin[idx] ?? 0,
      ebitda: ebitda[idx] ?? 0,
      depreciation: depreciation[idx] ?? 0,
      ebit: ebit[idx] ?? 0,
      interest: interest[idx] ?? 0,
      ebt: ebt[idx] ?? 0,
      taxes: taxes[idx] ?? 0,
      netIncome: netIncome[idx] ?? 0,
      grossProfitMargin: grossProfitMargin[idx] ?? 0,
      ebitdaMargin: ebitdaMargin[idx] ?? 0,
      ebitMargin: ebitMargin[idx] ?? 0,
      returnOnEquity: returnOnEquity[idx] ?? 0,
    }));
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
