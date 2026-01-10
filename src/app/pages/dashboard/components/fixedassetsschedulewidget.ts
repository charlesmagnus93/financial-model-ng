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

interface FixedAssetRow {
  assetType: string;
  method: string;
  year: number;
  acquisition: number;
  assetLife: number;
  netBookPrevYear: number;
  depreciationRate: number;
  totalAssetCost: number;
  totalDepreciation: number;
  cumulativeDepreciation: number;
  netBookValue: number;
}

@Component({
  standalone: true,
  selector: 'fixed-assets-schedule-widget',
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
        <div class="text-xl font-semibold">Fixed Assets Schedule</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1500px]">
              <div
                class="grid gap-2 text-xs font-semibold pb-2"
                style="grid-template-columns: 2fr 1.3fr repeat(9, 1fr) auto;"
              >
                <div>Asset Type</div>
                <div>Method</div>
                <div>Year</div>
                <div>Acquisition</div>
                <div>Asset Life</div>
                <div>Net Book Value (prev year)</div>
                <div>Depreciation Rate</div>
                <div>Total Asset cost</div>
                <div>Total Depreciation</div>
                <div>Cumulative Depreciation</div>
                <div>Net Book Value</div>
                <div>Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid gap-2 items-center"
                  style="grid-template-columns: 2fr 1.3fr repeat(9, 1fr) auto;"
                >
                  <select
                    class="p-inputtext w-full"
                    formControlName="assetType"
                  >
                    @for (type of assetTypeOptions; track type) {
                    <option [value]="type">{{ type }}</option>
                    }
                  </select>
                  <select class="p-inputtext w-full" formControlName="method">
                    @for (m of methodOptions; track m.value) {
                    <option [value]="m.value">{{ m.label }}</option>
                    }
                  </select>
                  <select class="p-inputtext w-full" formControlName="year">
                    @for (y of yearOptions; track y) {
                    <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <p-inputnumber
                    formControlName="acquisition"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="assetLife"
                    mode="decimal"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="netBookPrevYear"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="depreciationRate"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="totalAssetCost"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="totalDepreciation"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="cumulativeDepreciation"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    formControlName="netBookValue"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.1"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <div class="text-right">
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
          <div class="text-lg font-semibold mb-3">Add asset</div>
          <form
            [formGroup]="newRowForm"
            class="grid grid-cols-12 gap-3 items-end"
          >
            <div class="col-span-4">
              <div class="text-sm font-semibold mb-1">Asset Type</div>
              <select class="p-inputtext w-full" formControlName="assetType">
                <option value="">Add new...</option>
                @for (type of assetTypeOptions; track type) {
                <option [value]="type">{{ type }}</option>
                }
                <option value="custom">Custom</option>
              </select>
            </div>
            <div class="col-span-4">
              <div class="text-sm font-semibold mb-1">Asset Type (custom)</div>
              <input
                type="text"
                class="p-inputtext w-full"
                formControlName="assetTypeCustom"
                placeholder="Enter asset type"
              />
            </div>
            <div class="col-span-4">
              <div class="text-sm font-semibold mb-1">Depreciation Method</div>
              <select class="p-inputtext w-full" formControlName="method">
                @for (m of methodOptions; track m.value) {
                <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <div class="col-span-2">
              <div class="text-sm font-semibold mb-1">Year</div>
              <select class="p-inputtext w-full" formControlName="year">
                @for (y of yearOptions; track y) {
                <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">Acquisition</div>
              <p-inputnumber
                formControlName="acquisition"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">
                Opening Net Book Value
              </div>
              <p-inputnumber
                formControlName="netBookPrevYear"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-1">
              <div class="text-sm font-semibold mb-1">Asset Life (years)</div>
              <p-inputnumber
                formControlName="assetLife"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-3">
              <div class="text-sm font-semibold mb-1">Depreciation Rate</div>
              <p-inputnumber
                formControlName="depreciationRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button
                label="Add"
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
export class FixedAssetsScheduleWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  yearOptions: number[] = inputData.years ?? [];
  assetTypeOptions: string[] = [];
  methodOptions = [
    { value: 'straight_line', label: 'Straight Line' },
    { value: 'reducing_balance', label: 'Reducing Balance' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      assetType: [''],
      assetTypeCustom: [''],
      method: [this.methodOptions[0].value],
      year: [this.yearOptions[0] ?? new Date().getFullYear()],
      acquisition: [0],
      assetLife: [0],
      netBookPrevYear: [0],
      depreciationRate: [0],
    });
  }

  ngOnInit(): void {
    this.assetTypeOptions = this.buildAssetTypeOptions();
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
    const assetType =
      value.assetType === 'custom'
        ? value.assetTypeCustom?.trim() || 'Custom Asset'
        : value.assetType || 'New Asset';

    this.rows.push(
      this.createRow({
        assetType,
        method: value.method,
        year: value.year,
        acquisition: value.acquisition,
        assetLife: value.assetLife,
        netBookPrevYear: value.netBookPrevYear,
        depreciationRate: value.depreciationRate,
        totalAssetCost: value.acquisition,
        totalDepreciation: 0,
        cumulativeDepreciation: 0,
        netBookValue: 0,
      })
    );

    if (assetType && !this.assetTypeOptions.includes(assetType)) {
      this.assetTypeOptions = [...this.assetTypeOptions, assetType];
    }

    this.newRowForm.reset({
      assetType: '',
      assetTypeCustom: '',
      method: this.methodOptions[0].value,
      year: this.yearOptions[0] ?? new Date().getFullYear(),
      acquisition: 0,
      assetLife: 0,
      netBookPrevYear: 0,
      depreciationRate: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): FixedAssetRow[] {
    const depreciationRows = (inputData.depreciation?.rows as any[]) ?? [];
    return depreciationRows.map((row) => ({
      assetType: row.asset_type ?? 'Asset',
      method: row.method ?? this.methodOptions[0].value,
      year: row.year ?? this.yearOptions[0] ?? new Date().getFullYear(),
      acquisition: row.acquisition ?? 0,
      assetLife: row.asset_life ?? 0,
      netBookPrevYear: row.opening_net_book ?? 0,
      depreciationRate: row.depreciation_rate ?? 0,
      totalAssetCost: row.acquisition ?? 0,
      totalDepreciation: 0,
      cumulativeDepreciation: row.opening_cumulative ?? 0,
      netBookValue: 0,
    }));
  }

  private createRow(values: Partial<FixedAssetRow>): FormGroup {
    return this.fb.group({
      assetType: [values.assetType ?? 'Asset'],
      method: [values.method ?? this.methodOptions[0].value],
      year: [values.year ?? this.yearOptions[0] ?? new Date().getFullYear()],
      acquisition: [values.acquisition ?? 0],
      assetLife: [values.assetLife ?? 0],
      netBookPrevYear: [values.netBookPrevYear ?? 0],
      depreciationRate: [values.depreciationRate ?? 0],
      totalAssetCost: [values.totalAssetCost ?? 0],
      totalDepreciation: [values.totalDepreciation ?? 0],
      cumulativeDepreciation: [values.cumulativeDepreciation ?? 0],
      netBookValue: [values.netBookValue ?? 0],
    });
  }

  private buildAssetTypeOptions(): string[] {
    const depreciationRows = (inputData.depreciation?.rows as any[]) ?? [];
    const set = new Set<string>();
    depreciationRows.forEach((row) => {
      if (row.asset_type) {
        set.add(row.asset_type);
      }
    });
    return Array.from(set);
  }
}
