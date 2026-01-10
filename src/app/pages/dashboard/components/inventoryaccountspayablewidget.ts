import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import inputData from '../../../../../input.json';

interface InventoryAccountsPayableRow {
  inventoryYear: number;
  year: number;
  daysInYear: number;
  inventoryDays: number;
  accountsPayableDays: number;
}

@Component({
  standalone: true,
  selector: 'inventory-accounts-payable-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    FluidModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">
          Inventory & Accounts Payable Input Table
        </div>
        <p class="text-sm">
          Select which inventory year to edit using the dropdowns below.
          Additional years remain available in the model and can be chosen from
          the selectors.
        </p>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-3">Inventory year</div>
                <div class="col-span-2">Year</div>
                <div class="col-span-2">Days In Year</div>
                <div class="col-span-2">Inventory Days</div>
                <div class="col-span-2">Accounts Payable Days</div>
                <div class="col-span-1">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <select
                    class="p-inputtext w-full col-span-3"
                    formControlName="inventoryYear"
                  >
                    @for (y of yearOptions; track y) {
                    <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <select class="p-inputtext w-full col-span-2" formControlName="year">
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
                  />
                  <p-inputnumber
                    formControlName="inventoryDays"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="accountsPayableDays"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <div class="col-span-1 text-right">
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
          <div class="text-lg font-semibold mb-3">
            Add inventory assumption
          </div>
          <form
            [formGroup]="newRowForm"
            class="grid grid-cols-12 gap-3 items-end"
          >
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">Year</div>
              <select class="p-inputtext w-full" formControlName="year">
                @for (y of yearOptions; track y) {
                <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="col-span-12 md:col-span-3">
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
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">Inventory Days (new)</div>
              <p-inputnumber
                formControlName="inventoryDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">
                Accounts Payable Days (new)
              </div>
              <p-inputnumber
                formControlName="accountsPayableDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button
                label="Add Year"
                icon="pi pi-plus"
                severity="success"
                variant="outlined"
                (click)="addRowFromForm()"
              ></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class InventoryAccountsPayableWidget implements OnInit {
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
      inventoryDays: [0],
      accountsPayableDays: [0],
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
    this.rows.push(
      this.createRow({
        inventoryYear: value.year,
        year: value.year,
        daysInYear: value.daysInYear,
        inventoryDays: value.inventoryDays,
        accountsPayableDays: value.accountsPayableDays,
      })
    );
    this.newRowForm.reset({
      year: this.yearOptions[0] ?? new Date().getFullYear(),
      daysInYear: 365,
      inventoryDays: 0,
      accountsPayableDays: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): InventoryAccountsPayableRow[] {
    const wc = inputData.working_capital ?? {};
    const days = wc.days ?? {};
    const inventoryDays = (days.inventory as number[]) ?? [];
    const accountsPayableDays = (days.accounts_payable as number[]) ?? [];
    const calendarDays = (wc.calendar_days as number[]) ?? [];
    const years = this.yearOptions;
    const fallbackYear = years[0] ?? new Date().getFullYear();
    const maxLen = Math.max(
      inventoryDays.length,
      accountsPayableDays.length,
      calendarDays.length,
      years.length
    );
    const rows: InventoryAccountsPayableRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        inventoryYear: years[i] ?? fallbackYear,
        year: years[i] ?? fallbackYear,
        daysInYear: calendarDays[i] ?? 365,
        inventoryDays: inventoryDays[i] ?? 0,
        accountsPayableDays: accountsPayableDays[i] ?? 0,
      });
    }
    return rows;
  }

  private createRow(values: Partial<InventoryAccountsPayableRow>): FormGroup {
    const fallbackYear = this.yearOptions[0] ?? new Date().getFullYear();
    return this.fb.group({
      inventoryYear: [values.inventoryYear ?? values.year ?? fallbackYear],
      year: [values.year ?? values.inventoryYear ?? fallbackYear],
      daysInYear: [values.daysInYear ?? 365],
      inventoryDays: [values.inventoryDays ?? 0],
      accountsPayableDays: [values.accountsPayableDays ?? 0],
    });
  }
}
