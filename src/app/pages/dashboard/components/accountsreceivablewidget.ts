import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { PharmaModelService } from '../../services/pharma-model.service';

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
        <p class="text-sm">
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
            <div class="col-span-12 md:col-span-2">
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
            <div class="col-span-2">
              <p-button label="Add Year" severity="success" variant="outlined" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
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
  yearOptions: number[] = [];

  constructor(
    private fb: FormBuilder,
    private pharmaModelService: PharmaModelService
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [new Date().getFullYear()],
      daysInYear: [365],
      arDays: [0],
      prepaidDays: [0],
      otherAssetDays: [0],
    });
  }

  ngOnInit(): void {
    this.yearOptions = this.pharmaModelService.getYearOptions();
    // this.newRowForm.patchValue({
    //   year: this.yearOptions[0] ?? new Date().getFullYear(),
    // });
    const rows = this.buildRowsFromInput();
    this.form.setControl(
      'rows',
      this.fb.array(rows.map((r) => this.createRow(r)))
    );
    this.rows.valueChanges.subscribe(() => this.syncToModel());
    this.syncToModel();
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
    const input = this.pharmaModelService.getInputSnapshot();
    const wc = input.working_capital?.days ?? {};
    const arDays = (wc.accounts_receivable as number[]) ?? [];
    const prepaidDays = (wc.prepaid_expenses as number[]) ?? [];
    const otherAssetDays = (wc.other_assets as number[]) ?? [];
    const calendarDays = input.working_capital?.calendar_days ?? [];
    const inputYears = input.years ?? [];
    if (
      arDays.length === 0 &&
      prepaidDays.length === 0 &&
      otherAssetDays.length === 0 &&
      calendarDays.length === 0 &&
      inputYears.length === 0
    ) {
      return [];
    }
    const years = inputYears.length ? inputYears : this.yearOptions;
    const fallbackYear = years[0] ?? new Date().getFullYear();

    const maxLen = Math.max(
      arDays.length, 
      prepaidDays.length, 
      otherAssetDays.length, 
      calendarDays.length, 
      years.length
    );
    const rows: ReceivableRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        year: years[i] ?? fallbackYear,
        daysInYear: calendarDays[i] ?? 365,
        arDays: arDays[i] ?? 0,
        prepaidDays: prepaidDays[i] ?? 0,
        otherAssetDays: otherAssetDays[i] ?? 0,
      });
    }
    return rows;
  }

  private createRow(values: Partial<ReceivableRow>): FormGroup {
    const fallbackYear = this.yearOptions[0] ?? new Date().getFullYear();
    return this.fb.group({
      year: [values.year ?? fallbackYear],
      daysInYear: [values.daysInYear ?? 365],
      arDays: [values.arDays ?? 0],
      prepaidDays: [values.prepaidDays ?? 0],
      otherAssetDays: [values.otherAssetDays ?? 0],
    });
  }

  private syncToModel(): void {
    const years = this.pharmaModelService.getInputSnapshot().years ?? this.yearOptions;
    const arDays: number[] = [];
    const prepaidDays: number[] = [];
    const otherAssetDays: number[] = [];
    const calendarDays: number[] = [];

    years.forEach((year: number, idx: number) => {
      const match = this.rows.controls.find(
        (group) => Number(group.get('year')?.value) === Number(year)
      );
      arDays[idx] = Number(match?.get('arDays')?.value ?? 0);
      prepaidDays[idx] = Number(match?.get('prepaidDays')?.value ?? 0);
      otherAssetDays[idx] = Number(match?.get('otherAssetDays')?.value ?? 0);
      calendarDays[idx] = Number(match?.get('daysInYear')?.value ?? 365);
    });

    const current = this.pharmaModelService.getInputSnapshot();
    this.pharmaModelService.patchInput({
      working_capital: {
        ...(current.working_capital ?? {}),
        days: {
          ...(current.working_capital?.days ?? {}),
          accounts_receivable: arDays,
          prepaid_expenses: prepaidDays,
          other_assets: otherAssetDays,
        },
        calendar_days: calendarDays,
      },
    });
  }
}
