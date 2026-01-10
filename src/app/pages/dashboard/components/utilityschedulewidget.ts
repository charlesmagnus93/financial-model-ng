import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import inputData from '../../../../../input.json';

interface UtilityRow {
  year: number;
  electricityPerDay: number;
  electricityRate: number;
  electricityDays: number;
  waterPerDay: number;
  waterRate: number;
  waterDays: number;
  steamPerHour: number;
  steamRate: number;
  steamDays: number;
  steamHours: number;
}

@Component({
  standalone: true,
  selector: 'utility-schedule-widget',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, ButtonModule, FluidModule],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">Utility Schedule</div>
        <p class="text-sm">
          Adjust electricity, water, and steam usage assumptions for each projection year. Use the plus/minus controls to tweak values or add a new year below.
        </p>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-1">Year</div>
                <div class="col-span-1">Electricity/day</div>
                <div class="col-span-1">Price/kWh</div>
                <div class="col-span-1">Electricity operating days</div>
                <div class="col-span-1">Water/day</div>
                <div class="col-span-1">Price/m³</div>
                <div class="col-span-1">Water operating days</div>
                <div class="col-span-1">Steam/hour</div>
                <div class="col-span-1">Price/steam hour</div>
                <div class="col-span-1">Steam operating days</div>
                <div class="col-span-1">Steam operating hours</div>
                <div class="col-span-1">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <select class="p-inputtext w-full col-span-1" formControlName="year">
                    @for (y of yearOptions; track y) {
                      <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <p-inputnumber
                      formControlName="electricityPerDay"
                      mode="decimal"
                      class="col-span-1"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="electricityRate"
                      mode="decimal"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.01"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="electricityDays"
                      mode="decimal"
                      [minFractionDigits]="0"
                      [maxFractionDigits]="0"
                      [step]="1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="waterPerDay"
                      mode="decimal"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="waterRate"
                      mode="decimal"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.01"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="waterDays"
                      mode="decimal"
                      [minFractionDigits]="0"
                      [maxFractionDigits]="0"
                      [step]="1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="steamPerHour"
                      mode="decimal"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="steamRate"
                      mode="decimal"
                      [minFractionDigits]="4"
                      [maxFractionDigits]="4"
                      [step]="0.01"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    
                      <!-- [style]="{ width: '3rem' }"
                      buttonLayout="horizontal"
                      [inputStyle]="{ width: '3rem' }" -->
                    <p-inputnumber
                      formControlName="steamDays"
                      mode="decimal"
                      [minFractionDigits]="0"
                      [maxFractionDigits]="0"
                      [step]="1"
                      [showButtons]="true"
                      inputStyleClass="w-full text-center"
                    />
                    <p-inputnumber
                      formControlName="steamHours"
                      mode="decimal"
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
          <div class="text-lg font-semibold mb-3">Add utility schedule row</div>
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
              <div class="text-sm font-semibold mb-1">Electricity per day</div>
              <p-inputnumber
                formControlName="electricityPerDay"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Price per kWh</div>
              <p-inputnumber
                formControlName="electricityRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Electricity operating days</div>
              <p-inputnumber
                formControlName="electricityDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Water per day</div>
              <p-inputnumber
                formControlName="waterPerDay"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Price per cubic meter</div>
              <p-inputnumber
                formControlName="waterRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Water operating days</div>
              <p-inputnumber
                formControlName="waterDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Steam per hour</div>
              <p-inputnumber
                formControlName="steamPerHour"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Price per steam hour</div>
              <p-inputnumber
                formControlName="steamRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Steam operating days</div>
              <p-inputnumber
                formControlName="steamDays"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <div class="text-sm font-semibold mb-1">Steam operating hours</div>
              <p-inputnumber
                formControlName="steamHours"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-2">
              <p-button  severity="success" variant="outlined" label="Add" icon="pi pi-plus" (click)="addRowFromForm()"></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class UtilityScheduleWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = inputData.years ?? [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [this.yearOptions[0] ?? new Date().getFullYear()],
      electricityPerDay: [0],
      electricityRate: [0],
      electricityDays: [0],
      waterPerDay: [0],
      waterRate: [0],
      waterDays: [0],
      steamPerHour: [0],
      steamRate: [0],
      steamDays: [0],
      steamHours: [0],
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
      electricityPerDay: 0,
      electricityRate: 0,
      electricityDays: 0,
      waterPerDay: 0,
      waterRate: 0,
      waterDays: 0,
      steamPerHour: 0,
      steamRate: 0,
      steamDays: 0,
      steamHours: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): UtilityRow[] {
    const utilities = inputData.utility_costs?.years ?? [];
    const years = this.yearOptions;
    return utilities.map((u: any, idx: number) => ({
      year: years[idx] ?? years[0] ?? new Date().getFullYear(),
      electricityPerDay: u.electricity_per_day ?? 0,
      electricityRate: u.electricity_rate ?? 0,
      electricityDays: u.electricity_days ?? 0,
      waterPerDay: u.water_per_day ?? 0,
      waterRate: u.water_rate ?? 0,
      waterDays: u.water_days ?? 0,
      steamPerHour: u.steam_per_hour ?? 0,
      steamRate: u.steam_rate ?? 0,
      steamDays: u.steam_days ?? 0,
      steamHours: u.steam_hours ?? 0,
    }));
  }

  private createRow(values: Partial<UtilityRow>): FormGroup {
    return this.fb.group({
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      electricityPerDay: [values.electricityPerDay ?? 0],
      electricityRate: [values.electricityRate ?? 0],
      electricityDays: [values.electricityDays ?? 0],
      waterPerDay: [values.waterPerDay ?? 0],
      waterRate: [values.waterRate ?? 0],
      waterDays: [values.waterDays ?? 0],
      steamPerHour: [values.steamPerHour ?? 0],
      steamRate: [values.steamRate ?? 0],
      steamDays: [values.steamDays ?? 0],
      steamHours: [values.steamHours ?? 0],
    });
  }
}
