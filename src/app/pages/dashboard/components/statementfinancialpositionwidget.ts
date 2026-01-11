import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';

interface PositionRow {
  index: number;
  year: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  otherAssets: number;
  netPpe: number;
  totalAssets: number;
  accountsPayable: number;
  otherLiabilities: number;
  overdraft: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  totalLiabilitiesEquity: number;
}

@Component({
  standalone: true,
  selector: 'statement-financial-position-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4 w-full">
      <div class="text-xl font-semibold">Statement of Financial Position</div>
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
              <th>Cash</th>
              <th>Accounts Receivable</th>
              <th>Inventory</th>
              <th>Prepaid Expenses</th>
              <th>Other Assets</th>
              <th>Net PP&E</th>
              <th>Total Assets</th>
              <th>Accounts Payable</th>
              <th>Other Liabilities</th>
              <th>Overdraft</th>
              <th>Total Liabilities</th>
              <th>Shareholders' Equity</th>
              <th>Total Liabilities & Equity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.cash) }}</td>
              <td>{{ formatNumber(row.accountsReceivable) }}</td>
              <td>{{ formatNumber(row.inventory) }}</td>
              <td>{{ formatNumber(row.prepaidExpenses) }}</td>
              <td>{{ formatNumber(row.otherAssets) }}</td>
              <td>{{ formatNumber(row.netPpe) }}</td>
              <td>{{ formatNumber(row.totalAssets) }}</td>
              <td>{{ formatNumber(row.accountsPayable) }}</td>
              <td>{{ formatNumber(row.otherLiabilities) }}</td>
              <td>{{ formatNumber(row.overdraft) }}</td>
              <td>{{ formatNumber(row.totalLiabilities) }}</td>
              <td>{{ formatNumber(row.shareholdersEquity) }}</td>
              <td>{{ formatNumber(row.totalLiabilitiesEquity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <p class="text-sm">
        Synthesized balance sheet view connecting working capital, PP&E, debt-like overdraft,
        and equity to keep assets and liabilities in balance across the projection horizon.
      </p>
    </div>
  `,
})
export class StatementFinancialPositionWidget implements OnInit {
  rows: PositionRow[] = [];

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    this.rows = this.buildRows();
  }

  private buildRows(): PositionRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const balance = output?.balance_sheet ?? {};
    const years = (balance.index as number[]) ?? [];
    const data = balance.data ?? {};

    const cash = this.asNumberArray(data['Cash']);
    const accountsReceivable = this.asNumberArray(data['Accounts Receivable']);
    const inventory = this.asNumberArray(data['Inventory']);
    const prepaidExpenses = this.asNumberArray(data['Prepaid Expenses']);
    const otherAssets = this.asNumberArray(data['Other Assets']);
    const netPpe = this.asNumberArray(data['Net PP&E']);
    const totalAssets = this.asNumberArray(data['Total Assets']);
    const accountsPayable = this.asNumberArray(data['Accounts Payable']);
    const otherLiabilities = this.asNumberArray(data['Other Liabilities']);
    const overdraft = this.asNumberArray(data['Overdraft']);
    const totalLiabilities = this.asNumberArray(data['Total Liabilities']);
    const shareholdersEquity = this.asNumberArray(data["Shareholders' Equity"]);
    const totalLiabilitiesEquity = this.asNumberArray(
      data['Total Liabilities & Equity']
    );

    return years.map((year, i) => ({
      index: i,
      year,
      cash: cash[i] ?? 0,
      accountsReceivable: accountsReceivable[i] ?? 0,
      inventory: inventory[i] ?? 0,
      prepaidExpenses: prepaidExpenses[i] ?? 0,
      otherAssets: otherAssets[i] ?? 0,
      netPpe: netPpe[i] ?? 0,
      totalAssets: totalAssets[i] ?? 0,
      accountsPayable: accountsPayable[i] ?? 0,
      otherLiabilities: otherLiabilities[i] ?? 0,
      overdraft: overdraft[i] ?? 0,
      totalLiabilities: totalLiabilities[i] ?? 0,
      shareholdersEquity: shareholdersEquity[i] ?? 0,
      totalLiabilitiesEquity: totalLiabilitiesEquity[i] ?? 0,
    }));
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

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
