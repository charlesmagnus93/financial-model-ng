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

interface TaxRow {
  year: number;
  rate: number;
}

@Component({
  standalone: true,
  selector: 'tax-schedule-widget',
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
        <div class="text-xl font-semibold">Tax Schedule</div>

        <form [formGroup]="form" class="flex flex-col gap-4">
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Base tax rate</div>
              <p-inputnumber
                formControlName="baseRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Timing adjustment</div>
              <p-inputnumber
                formControlName="timingAdjustment"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
          </div>

          <div class="overflow-auto">
            <div class="min-w-[900px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-5">Year</div>
                <div class="col-span-5">Tax rate</div>
                <div class="col-span-2">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <select class="p-inputtext w-full col-span-5" formControlName="year">
                    @for (y of yearOptions; track y) {
                    <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <p-inputnumber
                    formControlName="rate"
                    mode="decimal"
                    class="col-span-5"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.0001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <div class="col-span-2 text-right">
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
          <div class="text-lg font-semibold mb-3">Add tax assumption</div>
          <form [formGroup]="newRowForm" class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Year</div>
              <select class="p-inputtext w-full" formControlName="year">
                @for (y of yearOptions; track y) {
                <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Tax rate</div>
              <p-inputnumber
                formControlName="rate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <p-button label="Add tax year" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class TaxScheduleWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = inputData.years ?? [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      baseRate: [0],
      timingAdjustment: [0],
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [this.yearOptions[0] ?? new Date().getFullYear()],
      rate: [0],
    });
  }

  ngOnInit(): void {
    const rows = this.buildRowsFromInput();
    this.form.patchValue({
      baseRate: inputData.tax?.rate ?? 0,
      timingAdjustment: inputData.tax?.timing_adjustment ?? 0,
    });
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
      rate: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): TaxRow[] {
    const schedule = (inputData.tax?.schedule as number[]) ?? [];
    const years = this.yearOptions;
    const maxLen = Math.max(schedule.length, years.length);
    const rows: TaxRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        year: years[i] ?? years[0] ?? new Date().getFullYear(),
        rate: schedule[i] ?? 0,
      });
    }
    return rows;
  }

  private createRow(values: Partial<TaxRow>): FormGroup {
    return this.fb.group({
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      rate: [values.rate ?? 0],
    });
  }
}
