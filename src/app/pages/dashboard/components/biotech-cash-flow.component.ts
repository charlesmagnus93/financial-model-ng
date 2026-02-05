import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';
import biotechOutput from '../../../../../biotech_output.json';

interface CashFlowRow {
  year: number;
  ebit: number;
  cashTaxesPaid: number;
  depreciationAmortization: number;
  receivablesChange: number;
  inventoryChange: number;
  payablesChange: number;
  workingCapitalChange: number;
  cashFromOperations: number;
  capitalExpenditure: number;
  rdCapitalization: number;
  cashFromInvesting: number;
  equityIssuance: number;
  debtDrawdowns: number;
  debtRepayments: number;
  interestPaid: number;
  cashFromFinancing: number;
  netChangeInCash: number;
  beginningCashBalance: number;
  endingCashBalance: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-cash-flow',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="text-xl font-semibold">Statement of Cash Flows</div>
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
        [scrollable]="true"
        scrollHeight="300px"
        [size]="'small'"
        [tableStyle]="{ 'min-width': '2600px' }"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Year</th>
            <th>EBIT</th>
            <th>Cash taxes paid</th>
            <th>Depreciation &amp; amortization</th>
            <th>Receivables change</th>
            <th>Inventory change</th>
            <th>Payables change</th>
            <th>Working capital change</th>
            <th>Cash from operations</th>
            <th>Capital expenditure</th>
            <th>R&amp;D capitalization</th>
            <th>Cash from investing</th>
            <th>Equity issuance</th>
            <th>Debt drawdowns</th>
            <th>Debt repayments</th>
            <th>Interest paid</th>
            <th>Cash from financing</th>
            <th>Net change in cash</th>
            <th>Beginning cash balance</th>
            <th>Ending cash balance</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.year }}</td>
            <td>{{ formatNumber(row.ebit) }}</td>
            <td>{{ formatNumber(row.cashTaxesPaid) }}</td>
            <td>{{ formatNumber(row.depreciationAmortization) }}</td>
            <td>{{ formatNumber(row.receivablesChange) }}</td>
            <td>{{ formatNumber(row.inventoryChange) }}</td>
            <td>{{ formatNumber(row.payablesChange) }}</td>
            <td>{{ formatNumber(row.workingCapitalChange) }}</td>
            <td>{{ formatNumber(row.cashFromOperations) }}</td>
            <td>{{ formatNumber(row.capitalExpenditure) }}</td>
            <td>{{ formatNumber(row.rdCapitalization) }}</td>
            <td>{{ formatNumber(row.cashFromInvesting) }}</td>
            <td>{{ formatNumber(row.equityIssuance) }}</td>
            <td>{{ formatNumber(row.debtDrawdowns) }}</td>
            <td>{{ formatNumber(row.debtRepayments) }}</td>
            <td>{{ formatNumber(row.interestPaid) }}</td>
            <td>{{ formatNumber(row.cashFromFinancing) }}</td>
            <td>{{ formatNumber(row.netChangeInCash) }}</td>
            <td>{{ formatNumber(row.beginningCashBalance) }}</td>
            <td>{{ formatNumber(row.endingCashBalance) }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
  `,
})
export class BiotechCashFlowComponent implements OnInit {
  rows: CashFlowRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.normalizeOutput(this.biotechModelService.getOutputSnapshot());
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const ebit = this.asNumberArray(data['ebit']);
    const cashTaxesPaid = this.asNumberArray(data['tax']);
    const depreciationAmortization = this.asNumberArray(data['da']);
    const receivablesChange = this.asNumberArray(data['receivables_change']);
    const inventoryChange = this.asNumberArray(data['inventory_change']);
    const payablesChange = this.asNumberArray(data['payables_change']);
    let workingCapitalChange = this.asNumberArray(data['delta_wc']);
    const capexCash = this.asNumberArray(data['capex_cash']);
    const rdCapAdd = this.asNumberArray(data['rd_cap_add']);
    const equityIssuance = this.asNumberArray(data['equity_issuance']);
    const debtDrawdowns = this.asNumberArray(data['debt_drawdowns']);
    const debtRepayments = this.asNumberArray(data['debt_repayments']);
    const interestPaid = this.asNumberArray(data['interest_paid']);

    if (!workingCapitalChange.length && years.length) {
      workingCapitalChange = years.map((_, idx) =>
        (receivablesChange[idx] ?? 0) +
        (inventoryChange[idx] ?? 0) +
        (payablesChange[idx] ?? 0)
      );
    }

    let runningCash = 0;
    this.rows = years.map((year, idx) => {
      const ops =
        (ebit[idx] ?? 0) +
        (cashTaxesPaid[idx] ?? 0) +
        (depreciationAmortization[idx] ?? 0) +
        (workingCapitalChange[idx] ?? 0);
      const investing = (capexCash[idx] ?? 0) + (rdCapAdd[idx] ?? 0);
      const financing =
        (equityIssuance[idx] ?? 0) +
        (debtDrawdowns[idx] ?? 0) +
        (debtRepayments[idx] ?? 0) +
        (interestPaid[idx] ?? 0);
      const netChange = ops + investing + financing;
      const beginningCashBalance = runningCash;
      const endingCashBalance = beginningCashBalance + netChange;
      runningCash = endingCashBalance;

      return {
        year,
        ebit: ebit[idx] ?? 0,
        cashTaxesPaid: cashTaxesPaid[idx] ?? 0,
        depreciationAmortization: depreciationAmortization[idx] ?? 0,
        receivablesChange: receivablesChange[idx] ?? 0,
        inventoryChange: inventoryChange[idx] ?? 0,
        payablesChange: payablesChange[idx] ?? 0,
        workingCapitalChange: workingCapitalChange[idx] ?? 0,
        cashFromOperations: ops,
        capitalExpenditure: capexCash[idx] ?? 0,
        rdCapitalization: rdCapAdd[idx] ?? 0,
        cashFromInvesting: investing,
        equityIssuance: equityIssuance[idx] ?? 0,
        debtDrawdowns: debtDrawdowns[idx] ?? 0,
        debtRepayments: debtRepayments[idx] ?? 0,
        interestPaid: interestPaid[idx] ?? 0,
        cashFromFinancing: financing,
        netChangeInCash: netChange,
        beginningCashBalance,
        endingCashBalance,
      };
    });
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private normalizeOutput(rawOutput: unknown): any {
    const fallback = biotechOutput as any;
    const output = rawOutput && typeof rawOutput === 'object' ? (rawOutput as any) : {};
    const consolidated = this.normalizeConsolidated(
      output.consolidated ?? {},
      fallback.consolidated ?? {}
    );
    return {
      ...fallback,
      ...output,
      consolidated,
    };
  }

  private normalizeConsolidated(source: any, fallback: any): any {
    const index = this.asNumberArray(source?.index ?? fallback?.index ?? []);
    const data = this.normalizeConsolidatedData(
      source?.data ?? {},
      fallback?.data ?? {},
      index.length
    );
    return {
      ...fallback,
      ...source,
      index,
      data,
    };
  }

  private normalizeConsolidatedData(
    source: any,
    fallback: any,
    yearsLength: number
  ): any {
    const aliases: Record<string, string[]> = {
      ebit: ['ebit', 'EBIT'],
      tax: ['tax', 'Tax', 'cash_taxes_paid'],
      da: ['da', 'depreciation', 'depreciation_amortization', 'D&A'],
      delta_wc: ['delta_wc', 'deltaWc', 'working_capital_change'],
      receivables_change: ['receivables_change', 'receivablesChange'],
      inventory_change: ['inventory_change', 'inventoryChange'],
      payables_change: ['payables_change', 'payablesChange'],
      capex_cash: ['capex_cash', 'capexCash', 'capital_expenditure'],
      rd_cap_add: ['rd_cap_add', 'rdCapAdd', 'rd_capitalization'],
      equity_issuance: ['equity_issuance', 'equityIssuance'],
      debt_drawdowns: ['debt_drawdowns', 'debtDrawdowns'],
      debt_repayments: ['debt_repayments', 'debtRepayments'],
      interest_paid: ['interest_paid', 'interestPaid'],
    };

    const keys = Object.keys(aliases);
    const result: Record<string, number[]> = {};
    keys.forEach((key) => {
      const candidates = aliases[key] ?? [key];
      const match = candidates.find((candidate) => Array.isArray(source?.[candidate]));
      const values = match ? source[match] : fallback?.[key];
      result[key] = this.normalizeSeries(values, yearsLength);
    });

    return result;
  }

  private normalizeSeries(values: unknown, yearsLength: number): number[] {
    const series = this.asNumberArray(values);
    if (!yearsLength) return series;
    if (series.length >= yearsLength) return series.slice(0, yearsLength);
    return [...series, ...Array.from({ length: yearsLength - series.length }, () => 0)];
  }
}
