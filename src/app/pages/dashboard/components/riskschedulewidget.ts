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

interface RiskRow {
  year: number;
  inherent: number;
  climate: number;
  political: number;
}

@Component({
  standalone: true,
  selector: 'risk-schedule-widget',
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
        <div class="text-xl font-semibold">Risk Schedule</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-3">Year</div>
                <div class="col-span-3">Inherent Risk</div>
                <div class="col-span-3">Climate Risk</div>
                <div class="col-span-2">Political Risk</div>
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
                    formControlName="inherent"
                    mode="decimal"
                    class="col-span-3"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.0001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="climate"
                    mode="decimal"
                    class="col-span-3"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.0001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="political"
                    mode="decimal"
                    class="col-span-2"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.0001"
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
          <div class="text-lg font-semibold mb-3">Add risk entry</div>
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
              <div class="text-sm font-semibold mb-1">Inherent Risk</div>
              <p-inputnumber
                formControlName="inherent"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">Climate Risk</div>
              <p-inputnumber
                formControlName="climate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-3">
              <div class="text-sm font-semibold mb-1">Political Risk</div>
              <p-inputnumber
                formControlName="political"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button label="Add" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class RiskScheduleWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = inputData.years ?? [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [this.yearOptions[0] ?? new Date().getFullYear()],
      inherent: [0],
      climate: [0],
      political: [0],
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
      inherent: 0,
      climate: 0,
      political: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): RiskRow[] {
    const base = inputData.risk ?? {};
    const inherent = (base.inherent as number[]) ?? [];
    const climate = (base.climate as number[]) ?? [];
    const political = (base.political as number[]) ?? [];
    const years = this.yearOptions;
    const maxLen = Math.max(inherent.length, climate.length, political.length, years.length);
    const rows: RiskRow[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        year: years[i] ?? years[0] ?? new Date().getFullYear(),
        inherent: inherent[i] ?? 0,
        climate: climate[i] ?? 0,
        political: political[i] ?? 0,
      });
    }
    return rows;
  }

  private createRow(values: Partial<RiskRow>): FormGroup {
    return this.fb.group({
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      inherent: [values.inherent ?? 0],
      climate: [values.climate ?? 0],
      political: [values.political ?? 0],
    });
  }
}
