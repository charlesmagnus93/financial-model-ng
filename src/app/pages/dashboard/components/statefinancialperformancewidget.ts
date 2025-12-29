import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import inputData from '../../../../../input.json';

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

  ngOnInit(): void {
    this.rows = this.buildRows();
  }

  private buildRows(): FinancialPerformanceRow[] {
    const years = (inputData.years as number[]) ?? [];
    const baseGross = 1_550_000;
    const grossGrowth = 1.12;
    const distributorRate = 0.05;
    const costOfSalesRate = 0.62;
    const generalAdminRate = 0.035;
    const depreciationRate = 0.03;
    const interestRate = 0.015;
    const equityBase = 1_750_000;
    const equityGrowth = 1.07;

    return years.map((year, idx) => {
      const grossRevenue = baseGross * Math.pow(grossGrowth, idx);
      const distributorCommission = grossRevenue * distributorRate;
      const netRevenue = grossRevenue - distributorCommission;
      const costOfSales = netRevenue * costOfSalesRate;
      const grossProfit = netRevenue - costOfSales;
      const generalAdmin = netRevenue * generalAdminRate;
      const ebitda = grossProfit - generalAdmin;
      const depreciation = netRevenue * depreciationRate;
      const ebit = ebitda - depreciation;
      const interest = grossRevenue * interestRate * 0.1;
      const ebt = ebit - interest;
      const taxes = ebt * 0.0;
      const netIncome = ebt - taxes;
      const equity = equityBase * Math.pow(equityGrowth, idx);

      return {
        index: idx,
        year,
        grossRevenue,
        distributorCommission,
        netRevenue,
        costOfSales,
        grossProfit,
        generalAdmin,
        ebitda,
        depreciation,
        ebit,
        interest,
        ebt,
        taxes,
        netIncome,
        grossProfitMargin: netRevenue > 0 ? grossProfit / netRevenue : 0,
        ebitdaMargin: netRevenue > 0 ? ebitda / netRevenue : 0,
        ebitMargin: netRevenue > 0 ? ebit / netRevenue : 0,
        returnOnEquity: equity > 0 ? netIncome / equity : 0,
      };
    });
  }

  formatNumber(value: number): string {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const formatted =
      abs >= 1_000_000
        ? `${(abs / 1_000_000).toFixed(3)}`
        : abs >= 1_000
          ? `${(abs / 1_000).toFixed(3)}`
          : abs.toFixed(3);
    const suffix = abs >= 1_000_000 ? 'M' : abs >= 1_000 ? 'k' : '';
    return `${sign}${formatted}${suffix}`;
  }
}
