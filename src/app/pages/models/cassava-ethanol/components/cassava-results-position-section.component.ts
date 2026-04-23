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
  selector: 'app-cassava-results-position-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, SelectModule, TableModule],
  template: `
    @if (!bundle) {
      <div class="rounded border border-surface-200 px-4 py-5 text-sm text-surface-500">
        Run the cassava model to display position statements.
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
          [legend]="selectedPeriod === 'annual' ? 'Balance Sheet (Annual)' : 'Balance Sheet (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (balanceSheetRows.length && balanceSheetColumns.length) {
            <p-table
              [value]="balanceSheetRows"
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
                  @for (column of balanceSheetColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of balanceSheetColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No balance sheet data returned.</div>
          }
        </p-fieldset>

        <p-fieldset
          [legend]="selectedPeriod === 'annual' ? 'Balance Ratios (Annual)' : 'Balance Ratios (Monthly)'"
          [toggleable]="true"
          class="w-full"
        >
          @if (balanceRatiosRows.length && balanceRatiosColumns.length) {
            <p-table
              [value]="balanceRatiosRows"
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
                  @for (column of balanceRatiosColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of balanceRatiosColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No balance ratio data returned.</div>
          }
        </p-fieldset>

        <p-fieldset legend="Working Capital (Annual)" [toggleable]="true" class="w-full">
          @if (workingCapitalRows.length && workingCapitalColumns.length) {
            <p-table
              [value]="workingCapitalRows"
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
                  @for (column of workingCapitalColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of workingCapitalColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No working capital data returned.</div>
          }
        </p-fieldset>
      </div>
    }
  `,
})
export class CassavaResultsPositionSectionComponent implements OnInit, OnDestroy {
  private outputSub?: Subscription;

  bundle: CassavaBundleResponse | null = null;
  selectedPeriod: 'annual' | 'monthly' = 'annual';
  readonly periodOptions: PeriodOption[] = [
    { label: 'Annual', value: 'annual' },
    { label: 'Monthly', value: 'monthly' },
  ];

  balanceSheetColumns: string[] = [];
  balanceSheetRows: Array<Record<string, unknown>> = [];
  balanceRatiosColumns: string[] = [];
  balanceRatiosRows: Array<Record<string, unknown>> = [];
  workingCapitalColumns: string[] = [];
  workingCapitalRows: Array<Record<string, unknown>> = [];

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
    const sheetKey =
      this.selectedPeriod === 'monthly'
        ? 'balance_sheet_monthly'
        : 'balance_sheet_annual';
    const ratiosKey =
      this.selectedPeriod === 'monthly'
        ? 'balance_ratios_monthly'
        : 'balance_ratios_annual';

    const sheet = resolveCassavaTable(
      this.bundle?.[sheetKey] as CassavaTablePayload | undefined,
    );
    this.balanceSheetColumns = sheet.columns;
    this.balanceSheetRows = sheet.rows;

    const ratios = resolveCassavaTable(
      this.bundle?.[ratiosKey] as CassavaTablePayload | undefined,
    );
    this.balanceRatiosColumns = ratios.columns;
    this.balanceRatiosRows = ratios.rows;

    const workingCapital = resolveCassavaTable(
      this.bundle?.['working_capital_annual'] as CassavaTablePayload | undefined,
    );
    this.workingCapitalColumns = workingCapital.columns;
    this.workingCapitalRows = workingCapital.rows;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
