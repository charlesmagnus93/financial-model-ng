import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FluidModule } from 'primeng/fluid';

interface Option {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'goal-seek-configuration-widget',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputNumberModule, FluidModule],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-semibold">Goal Seek Configuration</div>
        </div>

        <form [formGroup]="form" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Metric Source</div>
            <p-dropdown
              [options]="metricSourceOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="metricSource"
              (onChange)="onMetricSourceChange($event.value)"
              styleClass="w-full"
            ></p-dropdown>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Metric</div>
            <p-dropdown
              [options]="metricOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="metric"
              styleClass="w-full"
            ></p-dropdown>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Target Value</div>
            <p-inputnumber
              formControlName="targetValue"
              mode="decimal"
              [minFractionDigits]="0"
              [maxFractionDigits]="2"
              [step]="100"
              [showButtons]="true"
              inputStyleClass="w-full"
              buttonLayout="horizontal"
              decrementButtonClass="p-button-text"
              incrementButtonClass="p-button-text"
            ></p-inputnumber>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold text-surface-200">Year</div>
            <p-dropdown
              [options]="yearOptions"
              formControlName="year"
              styleClass="w-full"
            ></p-dropdown>
          </div>
        </form>
      </div>
    </p-fluid>
  `,
})
export class GoalSeekConfigurationWidget {
  form: FormGroup;

  metricSourceOptions: Option[] = [
    { label: 'Income Statement', value: 'income_statement' },
    { label: 'Summary', value: 'summary' },
    { label: 'Cash Flow', value: 'cash_flow' },
  ];

  metricsBySource: Record<string, Option[]> = {
    income_statement: [
      { label: 'Net Income', value: 'net_income' },
      { label: 'Gross Revenue', value: 'gross_revenue' },
      { label: 'Distributors Commission', value: 'distributords_commission' },
      { label: 'Net Revenue', value: 'net_revenue' },
      { label: 'Cost of Sales', value: 'cost_of_sales' },
      { label: 'Gross Profit', value: 'gross_profit' },
      { label: 'General & Admin', value: 'general_admin' },
      { label: 'EBITDA', value: 'ebitda' },
      { label: 'Total Depreciation Expense', value: 'total_depreciation_expense' },
      { label: 'EBIT', value: 'ebit' },
      { label: 'Interest', value: 'interest' },
      { label: 'EBT', value: 'ebt' },
      { label: 'Taxes', value: 'taxes' },
      { label: 'Gross Profit Margin', value: 'gross_profit_margin' },
      { label: 'EBITDA Margin', value: 'ebitda_margin' },
      { label: 'EBIT Margin', value: 'ebit_margin' },
      { label: 'Return on Equity', value: 'return_on_equity' },
    ],
    balance_sheet: [
      { label: 'Total Assets', value: 'total_assets' },
      { label: 'Total Liabilities', value: 'total_liabilities' },
      { label: 'Equity', value: 'equity' },
    ],
    cash_flow: [
      { label: 'Operating Cash Flow', value: 'operating_cash_flow' },
      { label: 'Free Cash Flow', value: 'free_cash_flow' },
      { label: 'Investing Cash Flow', value: 'investing_cash_flow' },
    ],
  };

  metricOptions: Option[] = this.metricsBySource[this.metricSourceOptions[0].value] ?? [];

  yearOptions = Array.from({ length: 15 }, (_, i) => ({
    label: `${2024 + i}`,
    value: 2024 + i,
  }));

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      metricSource: [this.metricSourceOptions[0].value],
      metric: [this.metricOptions[0]?.value ?? null],
      targetValue: [20000],
      year: [this.yearOptions[0].value],
    });
  }

  onMetricSourceChange(source: string): void {
    this.metricOptions = this.metricsBySource[source] ?? [];
    this.form.patchValue({
      metric: this.metricOptions[0]?.value ?? null,
    });
  }
}
