import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import inputData from '../../../../../input.json';

interface ReceivableRow {
  year: number;
  daysInYear: number;
  arDays: number;
  prepaidDays: number;
  otherAssetDays: number;
}

@Component({
  standalone: true,
  selector: 'accounts-receivable-widget',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, ButtonModule, FluidModule],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">Accounts Receivable Input Table</div>
        <p class="text-sm text-surface-300">
          Select which receivable year to edit using the dropdowns below. Additional years remain available in the model and can be chosen from the selectors.
        </p>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-3">Year</div>
                <div class="col-span-2">Days In Year</div>
                <div class="col-span-2">Accounts Receivable Days</div>
                <div class="col-span-2">Prepaid Expense Days</div>
                <div class="col-span-2">Other Asset Days</div>
                <div class="col-span-1">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <select class="p-inputtext w-full col-span-3" formControlName="year">
                    @for (y of yearOptions; track y) {
                      <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <p-inputnumber
                    formControlName="daysInYear"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  /><p-inputnumber
                    formControlName="arDays"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="prepaidDays"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="otherAssetDays"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <div class="col-span-1">
                    <p-button
                      label="Remove"
                      variant="outlined"
                      severity="danger"
                      (click)="removeRow(i)"
                    />
                  </div>
                </div>
                }
              </div>
            </div>
          </div>
        </form>

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">Add accounts receivable assumption</div>
          <form [formGroup]="newRowForm" class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">Year</div>
              <select class="p-inputtext w-full" formControlName="year">
                @for (y of yearOptions; track y) {
                  <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Days in Year (new)</div>
              <p-inputnumber
                formControlName="daysInYear"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Accounts Receivable Days (new)</div>
              <p-inputnumber
                formControlName="arDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Prepaid Expense Days (new)</div>
              <p-inputnumber
                formControlName="prepaidDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Other Asset Days (new)</div>
              <p-inputnumber
                formControlName="otherAssetDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button label="Add Year" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class AccountsReceivableWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = inputData.years ?? [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [this.yearOptions[0] ?? new Date().getFullYear()],
      daysInYear: [365],
      arDays: [0],
      prepaidDays: [0],
      otherAssetDays: [0],
    });
  }

  ngOnInit(): void {
    const rows = this.buildRowsFromInput();
    this.form.setControl(
      'rows',
      this.fb.array(rows.map((r) => this.createRow(r)))
    );
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    this.rows.push(this.createRow(value));
    this.newRowForm.reset({
      year: this.yearOptions[0] ?? new Date().getFullYear(),
      daysInYear: 365,
      arDays: 0,
      prepaidDays: 0,
      otherAssetDays: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): ReceivableRow[] {
    const wc = inputData.working_capital?.days ?? {};
    const arDays = (wc.accounts_receivable as number[]) ?? [];
    const prepaidDays = (wc.prepaid_expenses as number[]) ?? [];
    const otherAssetDays = (wc.other_assets as number[]) ?? [];
    const calendarDays = inputData.working_capital?.calendar_days ?? [];
    const years = this.yearOptions;

    const maxLen = Math.max(arDays.length, prepaidDays.length, otherAssetDays.length, calendarDays.length, years.length);
    const rows: ReceivableRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        year: years[i] ?? years[0] ?? new Date().getFullYear(),
        daysInYear: calendarDays[i] ?? 365,
        arDays: arDays[i] ?? 0,
        prepaidDays: prepaidDays[i] ?? 0,
        otherAssetDays: otherAssetDays[i] ?? 0,
      });
    }
    return rows;
  }

  private createRow(values: Partial<ReceivableRow>): FormGroup {
    return this.fb.group({
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      daysInYear: [values.daysInYear ?? 365],
      arDays: [values.arDays ?? 0],
      prepaidDays: [values.prepaidDays ?? 0],
      otherAssetDays: [values.otherAssetDays ?? 0],
    });
  }
}
