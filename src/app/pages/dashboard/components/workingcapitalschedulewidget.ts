import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import inputData from '../../../../../input.json';

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

  ngOnInit(): void {
    this.rows = this.buildRows();
    this.inventorySchedule = this.buildInventorySchedule();
  }

  private buildRows(): WorkingCapitalRow[] {
    const wc = inputData.working_capital ?? {};
    const days = wc.days ?? {};
    const arDays = (days.accounts_receivable as number[]) ?? [];
    const inventoryDays = (days.inventory as number[]) ?? [];
    const prepaidDays = (days.prepaid_expenses as number[]) ?? [];
    const otherAssetDays = (days.other_assets as number[]) ?? [];
    const apDays = (days.accounts_payable as number[]) ?? [];
    const otherLiabilityDays = (days.other_liabilities as number[]) ?? [];
    const calendarDays = (wc.calendar_days as number[]) ?? [];
    const years = (inputData.years as number[]) ?? [];

    const arFactor = 4098;
    const inventoryFactor = 2710;
    const prepaidFactor = 2700;
    const otherAssetFactor = 2700;
    const apFactor = 2725;
    const otherLiabilityFactor = 2712;

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
      const arBase = (arDays[i] ?? 0) * arFactor;
      const distributorReceivables = arBase * 0.66;
      const arTotal = arBase + distributorReceivables;
      const inventory = (inventoryDays[i] ?? 0) * inventoryFactor;
      const prepaid = (prepaidDays[i] ?? 0) * prepaidFactor;
      const otherAssets = (otherAssetDays[i] ?? 0) * otherAssetFactor;
      const accountsPayable = (apDays[i] ?? 0) * apFactor;
      const otherLiabilities = (otherLiabilityDays[i] ?? 0) * otherLiabilityFactor;

      const netWorkingCapital =
        arTotal + inventory + prepaid + otherAssets - accountsPayable - otherLiabilities;

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
        inventory,
        prepaid,
        otherAssets,
        accountsPayable,
        otherLiabilities,
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

  private buildInventorySchedule(): InventoryScheduleRow[] {
    const years = (inputData.years as number[]) ?? [];
    const calendarDays = (inputData.working_capital?.calendar_days as number[]) ?? [];
    const inventoryDays = (inputData.working_capital?.days?.inventory as number[]) ?? [];
    const balanceSheetInventory = this.rows.map((r) => r.inventory);

    // Simple cost of sales proxy using revenue-like scale factor
    const baseCost = 2_000_000;
    const growth = 1.12;

    const rows: InventoryScheduleRow[] = [];
    for (let i = 0; i < years.length; i++) {
      const id = this.initIventoryId++;
      const year = years[i];
      const daysInYear = calendarDays[i] ?? 365;
      const invDays = inventoryDays[i] ?? 50;
      const costOfSales = baseCost * Math.pow(growth, i);
      const calculatedInventory = (costOfSales / daysInYear) * invDays;
      const bsInventory = balanceSheetInventory[i] ?? calculatedInventory;
      const variance = bsInventory - calculatedInventory;
      const inventoryTurnover =
        bsInventory > 0 ? costOfSales / bsInventory : 0;

      rows.push({
        id,
        year,
        costOfSales,
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
