import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import inputData from '../../../../../input.json';

interface CashFlowRow {
  index: number;
  year: number;
  cashFlowFromOperations: number;
  netCashFromOperating: number;
  netCashUsedInvesting: number;
  netCashUsedFinancing: number;
  netCashFlowPeriod: number;
  beginningCash: number;
  endingCash: number;
  netIncreaseDecrease: number;
}

@Component({
  standalone: true,
  selector: 'statement-cash-flow-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4 w-full">
      <div class="text-xl font-semibold">Statement of Cash Flows</div>
      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="rows"
          responsiveLayout="scroll"
          class="text-sm"
          [tableStyle]="{ 'min-width': '1600px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Cash Flow from Operations</th>
              <th>Net Cash Generated from Operating Activities</th>
              <th>Net Cash Used in Investing Activities</th>
              <th>Net Cash Used in Financing Activities</th>
              <th>Net Cash Flow for the Period</th>
              <th>Cash and Cash Equivalents at the Beginning of the Period</th>
              <th>Cash and Cash Equivalents at the End of the Period</th>
              <th>Net Increase/Decrease in Cash</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.cashFlowFromOperations) }}</td>
              <td>{{ formatNumber(row.netCashFromOperating) }}</td>
              <td>{{ formatNumber(row.netCashUsedInvesting) }}</td>
              <td>{{ formatNumber(row.netCashUsedFinancing) }}</td>
              <td>{{ formatNumber(row.netCashFlowPeriod) }}</td>
              <td>{{ formatNumber(row.beginningCash) }}</td>
              <td>{{ formatNumber(row.endingCash) }}</td>
              <td>{{ formatNumber(row.netIncreaseDecrease) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <p class="text-sm">
        Cash movements reconcile operating inflows, modest investing outflows, and financing uses to the ending cash balances.
      </p>
    </div>
  `,
})
export class StatementCashFlowWidget implements OnInit {
  rows: CashFlowRow[] = [];

  ngOnInit(): void {
    this.rows = this.buildRows();
  }

  private buildRows(): CashFlowRow[] {
    const years = (inputData.years as number[]) ?? [];

    const baseGross = 1_550_000;
    const grossGrowth = 1.12;
    const distributorRate = 0.05;
    const costOfSalesRate = 0.62;
    const generalAdminRate = 0.035;
    const depreciationRate = 0.03;
    const interestRate = 0.015;

    const cashBase = -350_000;
    const cashGrowth = 1.18;

    const rows: CashFlowRow[] = [];
    let priorEndingCash = 0;

    for (let idx = 0; idx < years.length; idx++) {
      const year = years[idx];
      // Simple net income proxy mirroring the financial performance widget.
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
      const netIncome = ebit - interest;

      const cashFlowFromOperations = netIncome * 0.3; // light conversion from earnings to cash
      const netCashFromOperating = cashFlowFromOperations;

      const netCashUsedInvesting = -(netRevenue * 0.0005); // modest ongoing capex

      const endingCash = cashBase * Math.pow(cashGrowth, idx);
      const netChange = endingCash - priorEndingCash;
      const netCashUsedFinancing = netChange - netCashFromOperating - netCashUsedInvesting;

      rows.push({
        index: idx,
        year,
        cashFlowFromOperations,
        netCashFromOperating,
        netCashUsedInvesting,
        netCashUsedFinancing,
        netCashFlowPeriod: netChange,
        beginningCash: priorEndingCash,
        endingCash,
        netIncreaseDecrease: netChange,
      });

      priorEndingCash = endingCash;
    }

    return rows;
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
