import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface WorkingCapitalRow {
  id: number;
  year: number;
  daysInYear: number;
  arDays: number;
  inventoryDays: number;
  prepaidDays: number;
  otherAssetDays: number;
  apDays: number;
  otherLiabilityDays: number;
  arBase: number;
  distributorReceivables: number;
  arTotal: number;
  inventory: number;
  prepaid: number;
  otherAssets: number;
  accountsPayable: number;
  otherLiabilities: number;
  netWorkingCapital: number;
  changeInNwc: number;
}

interface InventoryScheduleRow {
  id: number;
  year: number;
  costOfSales: number;
  daysInYear: number;
  inventoryDays: number;
  calculatedInventory: number;
  balanceSheetInventory: number;
  variance: number;
  inventoryTurnover: number;
}

@Component({
  standalone: true,
  selector: 'working-capital-schedule-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4 w-full">
      <div class="text-xl font-semibold">Working Capital Schedule</div>
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
              <th>Days in Year</th>
              <th>Accounts Receivable Days</th>
              <th>Accounts Receivable (Base)</th>
              <th>Distributor Receivables</th>
              <th>Accounts Receivable (Total)</th>
              <th>Inventory Days</th>
              <th>Inventory</th>
              <th>Prepaid Expenses Days</th>
              <th>Prepaid Expenses</th>
              <th>Other Assets Days</th>
              <th>Other Assets</th>
              <th>Accounts Payable Days</th>
              <th>Accounts Payable</th>
              <th>Other Liabilities Days</th>
              <th>Other Liabilities</th>
              <th>Net Working Capital</th>
              <th>Change in Net Working Capital</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.id }}</td>
              <td>{{ row.year }}</td>
              <td>{{ row.daysInYear }}</td>
              <td>{{ row.arDays }}</td>
              <td>{{ formatNumber(row.arBase) }}</td>
              <td>{{ formatNumber(row.distributorReceivables) }}</td>
              <td>{{ formatNumber(row.arTotal) }}</td>
              <td>{{ row.inventoryDays }}</td>
              <td>{{ formatNumber(row.inventory) }}</td>
              <td>{{ row.prepaidDays }}</td>
              <td>{{ formatNumber(row.prepaid) }}</td>
              <td>{{ row.otherAssetDays }}</td>
              <td>{{ formatNumber(row.otherAssets) }}</td>
              <td>{{ row.apDays }}</td>
              <td>{{ formatNumber(row.accountsPayable) }}</td>
              <td>{{ row.otherLiabilityDays }}</td>
              <td>{{ formatNumber(row.otherLiabilities) }}</td>
              <td>{{ formatNumber(row.netWorkingCapital) }}</td>
              <td>{{ formatNumber(row.changeInNwc) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <p class="text-sm ">
        Working capital balances reconcile receivables, inventory, and payables
        with the statement of financial position while showing year-over-year
        changes.
      </p>

      <div class="text-xl font-semibold mt-6">Inventory Schedule</div>
      <div class="overflow-auto">
        <p-table
          showGridlines
          [value]="inventorySchedule"
          responsiveLayout="scroll"
          class="text-sm"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '1200px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Cost of Sales</th>
              <th>Days in Year</th>
              <th>Inventory Days</th>
              <th>Calculated Inventory</th>
              <th>Balance Sheet Inventory</th>
              <th>Variance</th>
              <th>Inventory Turnover</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.id }}</td>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.costOfSales) }}</td>
              <td>{{ row.daysInYear }}</td>
              <td>{{ row.inventoryDays }}</td>
              <td>{{ formatNumber(row.calculatedInventory) }}</td>
              <td>{{ formatNumber(row.balanceSheetInventory) }}</td>
              <td>{{ formatNumber(row.variance) }}</td>
              <td>{{ row.inventoryTurnover | number: '1.2-2' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <p class="text-sm ">
        Inventory is derived as cost of sales divided by calendar days and
        multiplied by the configured inventory days, matching the balance sheet
        totals.
      </p>
    </div>
  `,
})
export class WorkingCapitalScheduleWidget implements OnInit {
  rows: WorkingCapitalRow[] = [];
  inventorySchedule: InventoryScheduleRow[] = [];

  initWorkingId = 1;
  initIventoryId = 1;

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const input = this.pharmaModelService.getInputSnapshot();
    this.rows = this.buildRows(output, input);
    this.inventorySchedule = this.buildInventorySchedule(output, input);
  }

  private buildRows(output: any, input: any): WorkingCapitalRow[] {
    const wc = input?.working_capital ?? {};
    const days = wc.days ?? {};
    const arDays = (days.accounts_receivable as number[]) ?? [];
    const inventoryDays = (days.inventory as number[]) ?? [];
    const prepaidDays = (days.prepaid_expenses as number[]) ?? [];
    const otherAssetDays = (days.other_assets as number[]) ?? [];
    const apDays = (days.accounts_payable as number[]) ?? [];
    const otherLiabilityDays = (days.other_liabilities as number[]) ?? [];
    const calendarDays = (wc.calendar_days as number[]) ?? [];
    const balanceSheet = output?.balance_sheet ?? {};
    const years = (balanceSheet.index as number[]) ?? (input?.years ?? []);
    const data = balanceSheet.data ?? {};
    const accountsReceivable = this.asNumberArray(data['Accounts Receivable']);
    const inventory = this.asNumberArray(data['Inventory']);
    const prepaid = this.asNumberArray(data['Prepaid Expenses']);
    const otherAssets = this.asNumberArray(data['Other Assets']);
    const accountsPayable = this.asNumberArray(data['Accounts Payable']);
    const otherLiabilities = this.asNumberArray(data['Other Liabilities']);

    const maxLen = Math.max(
      arDays.length,
      inventoryDays.length,
      prepaidDays.length,
      otherAssetDays.length,
      apDays.length,
      otherLiabilityDays.length,
      calendarDays.length,
      years.length
    );

    const rows: WorkingCapitalRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      const id = this.initWorkingId++;
      const year = years[i] ?? years[0] ?? new Date().getFullYear();
      const arBase = accountsReceivable[i] ?? 0;
      const distributorReceivables = 0;
      const arTotal = arBase + distributorReceivables;
      const inventoryValue = inventory[i] ?? 0;
      const prepaidValue = prepaid[i] ?? 0;
      const otherAssetsValue = otherAssets[i] ?? 0;
      const accountsPayableValue = accountsPayable[i] ?? 0;
      const otherLiabilitiesValue = otherLiabilities[i] ?? 0;

      const netWorkingCapital =
        arTotal +
        inventoryValue +
        prepaidValue +
        otherAssetsValue -
        accountsPayableValue -
        otherLiabilitiesValue;

      rows.push({
        id,
        year,
        daysInYear: calendarDays[i] ?? 365,
        arDays: arDays[i] ?? 0,
        inventoryDays: inventoryDays[i] ?? 0,
        prepaidDays: prepaidDays[i] ?? 0,
        otherAssetDays: otherAssetDays[i] ?? 0,
        apDays: apDays[i] ?? 0,
        otherLiabilityDays: otherLiabilityDays[i] ?? 0,
        arBase,
        distributorReceivables,
        arTotal,
        inventory: inventoryValue,
        prepaid: prepaidValue,
        otherAssets: otherAssetsValue,
        accountsPayable: accountsPayableValue,
        otherLiabilities: otherLiabilitiesValue,
        netWorkingCapital,
        changeInNwc: 0, // filled below
      });
    }

    // compute changes
    for (let i = 0; i < rows.length; i++) {
      if (i === 0) {
        rows[i].changeInNwc = rows[i].netWorkingCapital;
      } else {
        rows[i].changeInNwc = rows[i].netWorkingCapital - rows[i - 1].netWorkingCapital;
      }
    }

    return rows;
  }

  private buildInventorySchedule(output: any, input: any): InventoryScheduleRow[] {
    const balanceSheet = output?.balance_sheet ?? {};
    const years = (balanceSheet.index as number[]) ?? (input?.years ?? []);
    const calendarDays = (input?.working_capital?.calendar_days as number[]) ?? [];
    const inventoryDays = (input?.working_capital?.days?.inventory as number[]) ?? [];
    const balanceSheetInventory = this.rows.map((r) => r.inventory);
    const income = output?.income_statement ?? {};
    const costOfSales = this.asNumberArray(income.data?.['Cost of Sales']);

    const rows: InventoryScheduleRow[] = [];
    for (let i = 0; i < years.length; i++) {
      const id = this.initIventoryId++;
      const year = years[i];
      const daysInYear = calendarDays[i] ?? 365;
      const invDays = inventoryDays[i] ?? 50;
      const cost = costOfSales[i] ?? 0;
      const calculatedInventory = (cost / daysInYear) * invDays;
      const bsInventory = balanceSheetInventory[i] ?? calculatedInventory;
      const variance = bsInventory - calculatedInventory;
      const inventoryTurnover =
        bsInventory > 0 ? cost / bsInventory : 0;

      rows.push({
        id,
        year,
        costOfSales: cost,
        daysInYear,
        inventoryDays: invDays,
        calculatedInventory,
        balanceSheetInventory: bsInventory,
        variance,
        inventoryTurnover,
      });
    }
    return rows;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
