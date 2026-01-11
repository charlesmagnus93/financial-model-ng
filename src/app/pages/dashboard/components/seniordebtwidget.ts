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
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';

interface SeniorDebtRow {
  year: number;
  duration: number;
  amount: number;
}

interface AmortizationRow {
  year: number;
  interestPayment: number;
  principalPayment: number;
  remaining: number;
}

@Component({
  standalone: true,
  selector: 'senior-debt-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    FluidModule,
    TableModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">Senior Debt</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[900px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-4">Year</div>
                <div class="col-span-4">Duration</div>
                <div class="col-span-3">Senior Debt Amount</div>
                <div class="col-span-1">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <select class="p-inputtext w-full col-span-4" formControlName="year">
                    @for (y of yearOptions; track y) {
                    <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <p-inputnumber
                    formControlName="duration"
                    mode="decimal"
                    class="col-span-4"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="amount"
                    mode="decimal"
                    class="col-span-3"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
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

        <div>
          <div class="text-lg font-semibold mb-2">
            Senior Debt Amortisation Schedule
          </div>
          <div class="overflow-auto">
            <p-table
              [value]="amortization"
              responsiveLayout="scroll"
              class="text-sm"
            >
              <ng-template pTemplate="header">
                <tr class="text-left text-surface-300">
                  <th class="px-2 py-2">#</th>
                  <th class="px-2 py-2">Year</th>
                  <th class="px-2 py-2">Interest Payment</th>
                  <th class="px-2 py-2">Principal Payment</th>
                  <th class="px-2 py-2">Remaining Senior Debt</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
                <tr class="border-t border-surface-800">
                  <td class="px-2 py-2">{{ rowIndex }}</td>
                  <td class="px-2 py-2">{{ row.year }}</td>
                  <td class="px-2 py-2">{{ row.interestPayment }}</td>
                  <td class="px-2 py-2">{{ row.principalPayment }}</td>
                  <td class="px-2 py-2">{{ row.remaining }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">Add senior debt</div>
          <form
            [formGroup]="newRowForm"
            class="grid grid-cols-12 gap-3 items-end"
          >
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">Year</div>
              <select class="p-inputtext w-full" formControlName="year">
                @for (y of yearOptions; track y) {
                <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">Duration</div>
              <p-inputnumber
                formControlName="duration"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">Senior Debt Amount</div>
              <p-inputnumber
                formControlName="amount"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-3">
              <p-button label="Add" severity="success" variant="outlined" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class SeniorDebtWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = [];
  seniorDebtRate = 0;

  constructor(
    private fb: FormBuilder,
    private pharmaModelService: PharmaModelService
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [new Date().getFullYear()],
      duration: [1],
      amount: [0],
    });
  }

  ngOnInit(): void {
    const input = this.pharmaModelService.getInputSnapshot();
    this.yearOptions = this.pharmaModelService.getYearOptions();
    this.seniorDebtRate = input.financing?.senior_debt_interest ?? 0;
    this.newRowForm.patchValue({
      year: this.yearOptions[0] ?? new Date().getFullYear(),
    });
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

  get amortization(): AmortizationRow[] {
    const rows = (this.form.getRawValue().rows as SeniorDebtRow[]) ?? [];
    const schedule: AmortizationRow[] = [];
    rows.forEach((r) => {
      const principalPerYear = r.duration > 0 ? r.amount / r.duration : 0;
      for (let i = 0; i < r.duration; i++) {
        const year = (r.year ?? 0) + i;
        const opening = r.amount - principalPerYear * i;
        const interestPayment = opening * this.seniorDebtRate;
        const remaining = Math.max(r.amount - principalPerYear * (i + 1), 0);
        schedule.push({
          year,
          interestPayment,
          principalPayment: principalPerYear,
          remaining,
        });
      }
    });
    return schedule;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    this.rows.push(this.createRow(value));
    this.newRowForm.reset({
      year: this.yearOptions[0] ?? new Date().getFullYear(),
      duration: 1,
      amount: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): SeniorDebtRow[] {
    const input = this.pharmaModelService.getInputSnapshot();
    const seniorDebt = (input.financing?.senior_debt as any[]) ?? [];
    return seniorDebt.map((row) => ({
      year: row.year ?? this.yearOptions[0] ?? new Date().getFullYear(),
      duration: row.duration ?? 1,
      amount: row.amount ?? 0,
    }));
  }

  private createRow(values: Partial<SeniorDebtRow>): FormGroup {
    return this.fb.group({
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      duration: [values.duration ?? 1],
      amount: [values.amount ?? 0],
    });
  }

  private syncToModel(): void {
    const rows = (this.form.getRawValue().rows as SeniorDebtRow[]) ?? [];
    const mapped = rows.map((row) => ({
      year: row.year,
      amount: row.amount,
      duration: row.duration,
      outstanding: row.amount,
    }));
    const current = this.pharmaModelService.getInputSnapshot();
    this.pharmaModelService.patchInput({
      financing: {
        ...(current.financing ?? {}),
        senior_debt: mapped,
      },
    });
  }
}
