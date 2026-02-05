import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

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

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    this.rows = this.buildRows();
  }

  private buildRows(): CashFlowRow[] {
    const output = this.pharmaModelService.getOutputSnapshot();
    const cashFlow = output?.cash_flow ?? {};
    const years = (cashFlow.index as number[]) ?? [];
    const data = cashFlow.data ?? {};

    const cashFlowFromOperations = this.asNumberArray(
      data['Cash Flow from Operations']
    );
    const netCashFromOperating = this.asNumberArray(
      data['Net Cash Generated from Operating Activities']
    );
    const netCashUsedInvesting = this.asNumberArray(
      data['Net Cash Used in Investing Activities']
    );
    const netCashUsedFinancing = this.asNumberArray(
      data['Net Cash Used in Financing Activities']
    );
    const netCashFlowPeriod = this.asNumberArray(
      data['Net Cash Flow for the Period']
    );
    const beginningCash = this.asNumberArray(
      data['Cash and Cash Equivalents at the Beginning of the Period']
    );
    const endingCash = this.asNumberArray(
      data['Cash and Cash Equivalents at the End of the Period']
    );
    const netIncreaseDecrease = this.asNumberArray(
      data['Net Increase/Decrease in Cash']
    );

    return years.map((year, idx) => ({
      index: idx,
      year,
      cashFlowFromOperations: cashFlowFromOperations[idx] ?? 0,
      netCashFromOperating: netCashFromOperating[idx] ?? 0,
      netCashUsedInvesting: netCashUsedInvesting[idx] ?? 0,
      netCashUsedFinancing: netCashUsedFinancing[idx] ?? 0,
      netCashFlowPeriod: netCashFlowPeriod[idx] ?? 0,
      beginningCash: beginningCash[idx] ?? 0,
      endingCash: endingCash[idx] ?? 0,
      netIncreaseDecrease: netIncreaseDecrease[idx] ?? 0,
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
