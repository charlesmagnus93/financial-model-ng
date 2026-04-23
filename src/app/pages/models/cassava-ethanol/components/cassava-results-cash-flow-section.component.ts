import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import {
  CassavaBundleResponse,
  CassavaModelService,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface PeriodOption {
  label: string;
  value: 'annual' | 'monthly';
}

@Component({
  selector: 'app-cassava-results-cash-flow-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, SelectModule, TableModule],
  template: `
    @if (!bundle) {
      <div class="rounded border border-surface-200 px-4 py-5 text-sm text-surface-500">
        Run the cassava model to display cash flow statements.
      </div>
    } @else {
      <div class="flex flex-col gap-4">
        <!-- <p-fieldset legend="View Controls" [toggleable]="true" class="w-full"> -->
          <div class="w-full md:w-18rem">
            <label class="mb-2 block text-xs text-surface-500">Statement view</label>
            <p-select
              class="w-full"
              [options]="periodOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="selectedPeriod"
              (ngModelChange)="onPeriodChange()"
            ></p-select>
          </div>
        <!-- </p-fieldset> -->

        <p-fieldset
          [legend]="selectedPeriod === 'annual' ? 'Cash Flow (Annual)' : 'Cash Flow (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (cashFlowRows.length && cashFlowColumns.length) {
            <p-table
              [value]="cashFlowRows"
              showGridlines
              responsiveLayout="scroll"
              [scrollable]="true"
              scrollHeight="320px"
              [size]="'small'"
              class="text-sm"
              [tableStyle]="{ 'min-width': '64rem' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of cashFlowColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of cashFlowColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No cash flow data returned.</div>
          }
        </p-fieldset>

        <p-fieldset
          [legend]="selectedPeriod === 'annual' ? 'Debt Schedule (Annual)' : 'Debt Schedule (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (debtScheduleRows.length && debtScheduleColumns.length) {
            <p-table
              [value]="debtScheduleRows"
              showGridlines
              responsiveLayout="scroll"
              [scrollable]="true"
              scrollHeight="280px"
              [size]="'small'"
              class="text-sm"
              [tableStyle]="{ 'min-width': '56rem' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of debtScheduleColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of debtScheduleColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No debt schedule data returned.</div>
          }
        </p-fieldset>

        <p-fieldset legend="Depreciation Summary" [toggleable]="true" class="w-full">
          @if (depreciationRows.length && depreciationColumns.length) {
            <p-table
              [value]="depreciationRows"
              showGridlines
              responsiveLayout="scroll"
              [scrollable]="true"
              scrollHeight="240px"
              [size]="'small'"
              class="text-sm"
              [tableStyle]="{ 'min-width': '40rem' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of depreciationColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of depreciationColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No depreciation summary data returned.</div>
          }
        </p-fieldset>
      </div>
    }
  `,
})
export class CassavaResultsCashFlowSectionComponent implements OnInit, OnDestroy {
  private outputSub?: Subscription;

  bundle: CassavaBundleResponse | null = null;
  selectedPeriod: 'annual' | 'monthly' = 'annual';
  readonly periodOptions: PeriodOption[] = [
    { label: 'Annual', value: 'annual' },
    { label: 'Monthly', value: 'monthly' },
  ];

  cashFlowColumns: string[] = [];
  cashFlowRows: Array<Record<string, unknown>> = [];
  debtScheduleColumns: string[] = [];
  debtScheduleRows: Array<Record<string, unknown>> = [];
  depreciationColumns: string[] = [];
  depreciationRows: Array<Record<string, unknown>> = [];

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.outputSub = this.cassavaModelService.output$.subscribe((output) => {
      this.applySnapshot(output);
    });
    this.applySnapshot(this.cassavaModelService.getOutputSnapshot());
  }

  ngOnDestroy(): void {
    this.outputSub?.unsubscribe();
  }

  onPeriodChange(): void {
    this.applyTableSelections();
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  private applySnapshot(output: CassavaBundleResponse | null): void {
    this.bundle = output ? this.deepClone(output) : null;
    this.applyTableSelections();
  }

  private applyTableSelections(): void {
    const cashFlowKey =
      this.selectedPeriod === 'monthly'
        ? 'cash_flow_monthly'
        : 'cash_flow_annual';
    const debtKey =
      this.selectedPeriod === 'monthly'
        ? 'debt_schedule_monthly'
        : 'debt_schedule_annual';

    const cashFlow = resolveCassavaTable(
      this.bundle?.[cashFlowKey] as CassavaTablePayload | undefined,
    );
    this.cashFlowColumns = cashFlow.columns;
    this.cashFlowRows = cashFlow.rows;

    const debt = resolveCassavaTable(
      this.bundle?.[debtKey] as CassavaTablePayload | undefined,
    );
    this.debtScheduleColumns = debt.columns;
    this.debtScheduleRows = debt.rows;

    const depreciation = resolveCassavaTable(
      this.bundle?.['depreciation_summary'] as CassavaTablePayload | undefined,
    );
    this.depreciationColumns = depreciation.columns;
    this.depreciationRows = depreciation.rows;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
