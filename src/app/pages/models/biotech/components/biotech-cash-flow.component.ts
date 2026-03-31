import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';
import { Subject, takeUntil } from 'rxjs';

interface CashFlowRow {
  index: number;
  ebit: number;
  materials: number;
  labor: number;
  overhead: number;
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
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset legend="Statement of Cash Flows" [toggleable]="true" class="w-full">
      <div class="overflow-auto rounded" [style]="{ width: '76vw' }">
        <p-table
          [value]="rows"
          showGridlines
          class="text-sm"
          [scrollable]="true"
          scrollHeight="200px"
          [size]="'small'"
        >
          <ng-template #header>
            <tr>
              <th>index</th>
              <th class="text-right">EBIT</th>
              <th class="text-right">Materials</th>
              <th class="text-right">Labor</th>
              <th class="text-right">Overhead</th>
              <th style="min-width:100px" class="text-right">Cash taxes paid</th>
              <th style="min-width:190px" class="text-right">Depreciation &amp; amortization</th>
              <th style="min-width:120px" class="text-right">Receivables change</th>
              <th style="min-width:130px" class="text-right">Inventory change</th>
              <th style="min-width:130px" class="text-right">Payables change</th>
              <th style="min-width:180px" class="text-right">Working capital change</th>
              <th style="min-width:180px" class="text-right">Net cash from operations</th>
              <th style="min-width:150px" class="text-right">Capital expenditure</th>
              <th style="min-width:150px" class="text-right">R&amp;D capitalization</th>
              <th style="min-width:180px" class="text-right">Net cash from investing</th>
              <th style="min-width:130px" class="text-right">Equity issuance</th>
              <th style="min-width:130px" class="text-right">Debt drawdowns</th>
              <th style="min-width:130px" class="text-right">Debt repayments</th>
              <th style="min-width:130px" class="text-right">Interest paid</th>
              <th style="min-width:160px" class="text-right">Net cash from financing</th>
              <th style="min-width:150px" class="text-right">Net change in cash</th>
              <th style="min-width:150px" class="text-right">Beginning cash balance</th>
              <th style="min-width:150px"class="text-right">Ending cash balance</th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr>
              <td>{{ row.index }}</td>
              <td class="text-right">{{ formatNumber(row.ebit) }}</td>
              <td class="text-right">{{ formatNumber(row.materials) }}</td>
              <td class="text-right">{{ formatNumber(row.labor) }}</td>
              <td class="text-right">{{ formatNumber(row.overhead) }}</td>
              <td class="text-right">{{ formatNumber(row.cashTaxesPaid) }}</td>
              <td class="text-right">{{ formatNumber(row.depreciationAmortization) }}</td>
              <td class="text-right">{{ formatNumber(row.receivablesChange) }}</td>
              <td class="text-right">{{ formatNumber(row.inventoryChange) }}</td>
              <td class="text-right">{{ formatNumber(row.payablesChange) }}</td>
              <td class="text-right">{{ formatNumber(row.workingCapitalChange) }}</td>
              <td class="text-right">{{ formatNumber(row.cashFromOperations) }}</td>
              <td class="text-right">{{ formatNumber(row.capitalExpenditure) }}</td>
              <td class="text-right">{{ formatNumber(row.rdCapitalization) }}</td>
              <td class="text-right">{{ formatNumber(row.cashFromInvesting) }}</td>
              <td class="text-right">{{ formatNumber(row.equityIssuance) }}</td>
              <td class="text-right">{{ formatNumber(row.debtDrawdowns) }}</td>
              <td class="text-right">{{ formatNumber(row.debtRepayments) }}</td>
              <td class="text-right">{{ formatNumber(row.interestPaid) }}</td>
              <td class="text-right">{{ formatNumber(row.cashFromFinancing) }}</td>
              <td class="text-right">{{ formatNumber(row.netChangeInCash) }}</td>
              <td class="text-right">{{ formatNumber(row.beginningCashBalance) }}</td>
              <td class="text-right">{{ formatNumber(row.endingCashBalance) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fieldset>
  `,
})
export class BiotechCashFlowComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  rows: CashFlowRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private updateFromOutput(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (resolvedOutput as any)?.consolidated ?? {};
    const yearsRaw = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};

    const ebitRaw = this.pickSeries(data, ['ebit']);
    const materialsRaw = this.pickSeries(data, ['materials', 'materials_cost', 'material']);
    const laborRaw = this.pickSeries(data, ['labor', 'labour', 'labor_cost', 'labour_cost']);
    const overheadRaw = this.pickSeries(data, ['overhead', 'overheads', 'overhead_cost']);
    const cashTaxesPaidRaw = this.pickSeries(data, ['tax', 'cash_taxes', 'taxes']);
    const depreciationAmortizationRaw = this.pickSeries(data, [
      'da',
      'depreciation_amortization',
      'depreciation_and_amortization',
      'depreciation',
    ]);
    const receivablesChangeRaw = this.pickSeries(data, ['receivables_change', 'ar_change']);
    const inventoryChangeRaw = this.pickSeries(data, ['inventory_change']);
    const payablesChangeRaw = this.pickSeries(data, ['payables_change', 'ap_change']);
    const workingCapitalChangeRaw = this.pickSeries(data, ['delta_wc', 'working_capital_change']);
    const capexCashRaw = this.pickSeries(data, ['capex_cash', 'capex']);
    const rdCapAddRaw = this.pickSeries(data, ['rd_cap_add', 'rd_capitalized']);
    const equityIssuanceRaw = this.pickSeries(data, ['equity_issuance']);
    const debtDrawdownsRaw = this.pickSeries(data, ['debt_drawdowns']);
    const debtRepaymentsRaw = this.pickSeries(data, ['debt_repayments']);
    const interestPaidRaw = this.pickSeries(data, ['interest_paid']);
    const cashFromOperationsRaw = this.pickSeries(data, ['cash_from_operations', 'cfo']);
    const cashFromInvestingRaw = this.pickSeries(data, ['cash_from_investing', 'cfi']);
    const cashFromFinancingRaw = this.pickSeries(data, ['cash_from_financing', 'cff']);
    const netChangeInCashRaw = this.pickSeries(data, ['net_change_in_cash', 'net_cash_change']);
    const beginningCashBalanceRaw = this.pickSeries(data, [
      'beginning_cash_balance',
      'opening_cash',
      'cash_beginning',
    ]);
    const endingCashBalanceRaw = this.pickSeries(data, [
      'ending_cash_balance',
      'closing_cash',
      'cash_ending',
    ]);

    const requiredLength = Math.max(
      yearsRaw.length,
      ebitRaw.length,
      materialsRaw.length,
      laborRaw.length,
      overheadRaw.length,
      cashTaxesPaidRaw.length,
      depreciationAmortizationRaw.length,
      receivablesChangeRaw.length,
      inventoryChangeRaw.length,
      payablesChangeRaw.length,
      workingCapitalChangeRaw.length,
      capexCashRaw.length,
      rdCapAddRaw.length,
      equityIssuanceRaw.length,
      debtDrawdownsRaw.length,
      debtRepaymentsRaw.length,
      interestPaidRaw.length,
      cashFromOperationsRaw.length,
      cashFromInvestingRaw.length,
      cashFromFinancingRaw.length,
      netChangeInCashRaw.length,
      beginningCashBalanceRaw.length,
      endingCashBalanceRaw.length
    );

    const labels = this.buildLabels(yearsRaw, requiredLength);
    const ebit = this.normalizeSeriesLength(ebitRaw, requiredLength);
    const materials = this.normalizeSeriesLength(materialsRaw, requiredLength);
    const labor = this.normalizeSeriesLength(laborRaw, requiredLength);
    const overhead = this.normalizeSeriesLength(overheadRaw, requiredLength);
    const cashTaxesPaid = this.normalizeSeriesLength(cashTaxesPaidRaw, requiredLength);
    const depreciationAmortization = this.normalizeSeriesLength(
      depreciationAmortizationRaw,
      requiredLength
    );
    const receivablesChange = this.normalizeSeriesLength(receivablesChangeRaw, requiredLength);
    const inventoryChange = this.normalizeSeriesLength(inventoryChangeRaw, requiredLength);
    const payablesChange = this.normalizeSeriesLength(payablesChangeRaw, requiredLength);
    const capexCash = this.normalizeSeriesLength(capexCashRaw, requiredLength);
    const rdCapAdd = this.normalizeSeriesLength(rdCapAddRaw, requiredLength);
    const equityIssuance = this.normalizeSeriesLength(equityIssuanceRaw, requiredLength);
    const debtDrawdowns = this.normalizeSeriesLength(debtDrawdownsRaw, requiredLength);
    const debtRepayments = this.normalizeSeriesLength(debtRepaymentsRaw, requiredLength);
    const interestPaid = this.normalizeSeriesLength(interestPaidRaw, requiredLength);
    const cashFromOperationsInput = this.normalizeSeriesLength(
      cashFromOperationsRaw,
      requiredLength
    );
    const cashFromInvestingInput = this.normalizeSeriesLength(cashFromInvestingRaw, requiredLength);
    const cashFromFinancingInput = this.normalizeSeriesLength(cashFromFinancingRaw, requiredLength);
    const netChangeInCashInput = this.normalizeSeriesLength(netChangeInCashRaw, requiredLength);
    const beginningCashBalanceInput = this.normalizeSeriesLength(
      beginningCashBalanceRaw,
      requiredLength
    );
    const endingCashBalanceInput = this.normalizeSeriesLength(endingCashBalanceRaw, requiredLength);

    let workingCapitalChange = this.normalizeSeriesLength(workingCapitalChangeRaw, requiredLength);
    const hasWorkingCapitalInput = workingCapitalChangeRaw.length > 0;
    if (!hasWorkingCapitalInput && requiredLength > 0) {
      workingCapitalChange = Array.from({ length: requiredLength }, (_, idx) => {
        return (
          (receivablesChange[idx] ?? 0) +
          (inventoryChange[idx] ?? 0) +
          (payablesChange[idx] ?? 0)
        );
      });
    }

    const hasOpsInput = cashFromOperationsRaw.length > 0;
    const hasInvestingInput = cashFromInvestingRaw.length > 0;
    const hasFinancingInput = cashFromFinancingRaw.length > 0;
    const hasNetChangeInput = netChangeInCashRaw.length > 0;
    const hasBeginningInput = beginningCashBalanceRaw.length > 0;
    const hasEndingInput = endingCashBalanceRaw.length > 0;

    let runningCash = 0;
    this.rows = labels.map((index, idx) => {
      const opsDerived =
        (ebit[idx] ?? 0) +
        (cashTaxesPaid[idx] ?? 0) +
        (depreciationAmortization[idx] ?? 0) +
        (workingCapitalChange[idx] ?? 0);
      const investingDerived = (capexCash[idx] ?? 0) + (rdCapAdd[idx] ?? 0);
      const financingDerived =
        (equityIssuance[idx] ?? 0) +
        (debtDrawdowns[idx] ?? 0) +
        (debtRepayments[idx] ?? 0) +
        (interestPaid[idx] ?? 0);

      const cashFromOperations = hasOpsInput
        ? (cashFromOperationsInput[idx] ?? opsDerived)
        : opsDerived;
      const cashFromInvesting = hasInvestingInput
        ? (cashFromInvestingInput[idx] ?? investingDerived)
        : investingDerived;
      const cashFromFinancing = hasFinancingInput
        ? (cashFromFinancingInput[idx] ?? financingDerived)
        : financingDerived;
      const netChangeDerived = cashFromOperations + cashFromInvesting + cashFromFinancing;
      const netChangeInCash = hasNetChangeInput
        ? (netChangeInCashInput[idx] ?? netChangeDerived)
        : netChangeDerived;

      const beginningCashBalance = hasBeginningInput
        ? (beginningCashBalanceInput[idx] ?? runningCash)
        : runningCash;
      const endingCashBalance = hasEndingInput
        ? (endingCashBalanceInput[idx] ?? beginningCashBalance + netChangeInCash)
        : beginningCashBalance + netChangeInCash;
      runningCash = endingCashBalance;

      return {
        index,
        ebit: ebit[idx] ?? 0,
        materials: materials[idx] ?? 0,
        labor: labor[idx] ?? 0,
        overhead: overhead[idx] ?? 0,
        cashTaxesPaid: cashTaxesPaid[idx] ?? 0,
        depreciationAmortization: depreciationAmortization[idx] ?? 0,
        receivablesChange: receivablesChange[idx] ?? 0,
        inventoryChange: inventoryChange[idx] ?? 0,
        payablesChange: payablesChange[idx] ?? 0,
        workingCapitalChange: workingCapitalChange[idx] ?? 0,
        cashFromOperations,
        capitalExpenditure: capexCash[idx] ?? 0,
        rdCapitalization: rdCapAdd[idx] ?? 0,
        cashFromInvesting,
        equityIssuance: equityIssuance[idx] ?? 0,
        debtDrawdowns: debtDrawdowns[idx] ?? 0,
        debtRepayments: debtRepayments[idx] ?? 0,
        interestPaid: interestPaid[idx] ?? 0,
        cashFromFinancing,
        netChangeInCash,
        beginningCashBalance,
        endingCashBalance,
      };
    });
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private pickSeries(data: Record<string, unknown>, keys: string[]): number[] {
    for (const key of keys) {
      const series = this.asNumberArray(data[key]);
      if (series.length) {
        return series;
      }
    }
    return [];
  }

  private buildLabels(years: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (years.length >= requiredLength) {
      return years.slice(0, requiredLength);
    }
    if (years.length > 0) {
      const labels = [...years];
      let nextYear = labels[labels.length - 1] ?? 0;
      while (labels.length < requiredLength) {
        nextYear += 1;
        labels.push(nextYear);
      }
      return labels;
    }
    return Array.from({ length: requiredLength }, (_, index) => index + 1);
  }

  private normalizeSeriesLength(values: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const normalized = [...values];
    while (normalized.length < requiredLength) {
      normalized.push(0);
    }
    return normalized;
  }

}

