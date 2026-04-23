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
  selector: 'app-cassava-results-performance-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, SelectModule, TableModule],
  template: `
    @if (!bundle) {
      <div class="rounded border border-surface-200 px-4 py-5 text-sm text-surface-500">
        Run the cassava model to display performance statements.
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
          [legend]="selectedPeriod === 'annual' ? 'Income Statement (Annual)' : 'Income Statement (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (incomeStatementRows.length && incomeStatementColumns.length) {
            <p-table
              [value]="incomeStatementRows"
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
                  @for (column of incomeStatementColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of incomeStatementColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No income statement data returned.</div>
          }
        </p-fieldset>

        <p-fieldset
          [legend]="selectedPeriod === 'annual' ? 'Income Ratios (Annual)' : 'Income Ratios (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (incomeRatiosRows.length && incomeRatiosColumns.length) {
            <p-table
              [value]="incomeRatiosRows"
              showGridlines
              responsiveLayout="scroll"
              [scrollable]="true"
              scrollHeight="280px"
              [size]="'small'"
              class="text-sm"
              [tableStyle]="{ 'min-width': '52rem' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of incomeRatiosColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of incomeRatiosColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No income ratio data returned.</div>
          }
        </p-fieldset>

        <p-fieldset legend="Staff Department Summary" [toggleable]="true" class="w-full">
          @if (staffRows.length && staffColumns.length) {
            <p-table
              [value]="staffRows"
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
                  @for (column of staffColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of staffColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No staff summary data returned.</div>
          }
        </p-fieldset>
      </div>
    }
  `,
})
export class CassavaResultsPerformanceSectionComponent implements OnInit, OnDestroy {
  private outputSub?: Subscription;

  bundle: CassavaBundleResponse | null = null;
  selectedPeriod: 'annual' | 'monthly' = 'annual';
  readonly periodOptions: PeriodOption[] = [
    { label: 'Annual', value: 'annual' },
    { label: 'Monthly', value: 'monthly' },
  ];

  incomeStatementColumns: string[] = [];
  incomeStatementRows: Array<Record<string, unknown>> = [];
  incomeRatiosColumns: string[] = [];
  incomeRatiosRows: Array<Record<string, unknown>> = [];
  staffColumns: string[] = [];
  staffRows: Array<Record<string, unknown>> = [];

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
    const statementKey =
      this.selectedPeriod === 'monthly'
        ? 'income_statement_monthly'
        : 'income_statement_annual';
    const ratiosKey =
      this.selectedPeriod === 'monthly'
        ? 'income_ratios_monthly'
        : 'income_ratios_annual';

    const statements = resolveCassavaTable(
      this.bundle?.[statementKey] as CassavaTablePayload | undefined,
    );
    this.incomeStatementColumns = statements.columns;
    this.incomeStatementRows = statements.rows;

    const ratios = resolveCassavaTable(
      this.bundle?.[ratiosKey] as CassavaTablePayload | undefined,
    );
    this.incomeRatiosColumns = ratios.columns;
    this.incomeRatiosRows = ratios.rows;

    const staff = resolveCassavaTable(
      this.bundle?.['staff_department_summary'] as CassavaTablePayload | undefined,
    );
    this.staffColumns = staff.columns;
    this.staffRows = staff.rows;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
