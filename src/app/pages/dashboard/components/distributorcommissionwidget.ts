import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import inputData from '../../../../../input.json';

interface CommissionRow {
  year: number;
  product: string;
  commissionPct: number;
  revenueSharePct: number;
  paymentDays: number;
  estimatedRevenue: number;
  commissionImpact: number;
}

@Component({
  standalone: true,
  selector: 'distributor-commission-widget',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, ButtonModule],
  template: `
    <div class="card flex flex-col gap-4 w-full fp-10">
      <div class="text-xl font-semibold">Distributors Commission Input Table</div>
      <p class="text-sm ">
        Configure distributor commission assumptions for each product and year. Use the inputs to adjust values or remove rows inline.
      </p>

      <form [formGroup]="form" class="flex flex-col gap-4">
        <div formArrayName="rows" class="space-y-4">
          @for (row of rows.controls; track row; let i = $index) {
            <div [formGroupName]="i" class="grid grid-cols-12 gap-3 items-center">
              <div class="col-span-12 md:col-span-2">
                <div class="text-sm font-semibold mb-1">Year</div>
                <select class="p-inputtext w-full" formControlName="year">
                  @for (y of years; track y) {
                    <option [value]="y">{{ y }}</option>
                  }
                </select>
              </div>

              <div class="col-span-12 md:col-span-3">
                <div class="text-sm font-semibold mb-1">Product</div>
                <select class="p-inputtext w-full" formControlName="product">
                  @for (p of products; track p) {
                    <option [value]="p">{{ p }}</option>
                  }
                </select>
              </div>

              <div class="col-span-12 md:col-span-2">
                <div class="text-sm font-semibold mb-1">Commission (%)</div>
                <p-inputnumber
                  formControlName="commissionPct"
                  mode="decimal"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="2"
                  [step]="0.1"
                  [showButtons]="true"
                  inputStyleClass="w-full text-center"
                />
              </div>

              <div class="col-span-12 md:col-span-2">
                <div class="text-sm font-semibold mb-1">Revenue Share (%)</div>
                <p-inputnumber
                  formControlName="revenueSharePct"
                  mode="decimal"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="2"
                  [step]="0.1"
                  [showButtons]="true"
                  inputStyleClass="w-full text-center"
                />
              </div>

              <div class="col-span-12 md:col-span-2">
                <div class="text-sm font-semibold mb-1">Payment Days</div>
                <p-inputnumber
                  formControlName="paymentDays"
                  mode="decimal"
                  [minFractionDigits]="0"
                  [maxFractionDigits]="0"
                  [step]="5"
                  [showButtons]="true"
                  inputStyleClass="w-full text-center"
                />
              </div>

              <div class="col-span-12 md:col-span-1 text-right md:text-left mt-6">
                <p-button label="Remove" variant="outlined" severity="danger" (click)="removeRow(i)" />
              </div>

              <div class="col-span-12 text-sm">
                Estimated revenue for {{ row.get('product')?.value }} in {{ row.get('year')?.value }}:
                {{ row.get('estimatedRevenue')?.value | number:'1.0-2' }}. 
                Commission impact: {{ row.get('commissionImpact')?.value | number:'1.0-2' }}.
              </div>
            </div>
          }
        </div>
      </form>

      <div class="border-t border-surface-800 pt-4">
        <div class="text-lg font-semibold mb-3">Add distributor commission assumption</div>
        <form [formGroup]="newRowForm" class="grid grid-cols-12 gap-3">
          <div class="col-span-12 md:col-span-2">
            <div class="text-sm font-semibold mb-1">Year</div>
            <select class="p-inputtext w-full" formControlName="year">
              @for (y of years; track y) {
                <option [value]="y">{{ y }}</option>
              }
            </select>
          </div>
          <div class="col-span-12 md:col-span-3">
            <div class="text-sm font-semibold mb-1">Product</div>
            <select class="p-inputtext w-full" formControlName="product">
              @for (p of products; track p) {
                <option [value]="p">{{ p }}</option>
              }
            </select>
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="text-sm font-semibold mb-1">Commission (%)</div>
            <p-inputnumber
              formControlName="commissionPct"
              mode="decimal"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [step]="0.1"
              [showButtons]="true"
              inputStyleClass="w-full text-center"
            />
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="text-sm font-semibold mb-1">Revenue Share (%)</div>
            <p-inputnumber
              formControlName="revenueSharePct"
              mode="decimal"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [step]="0.1"
              [showButtons]="true"
              inputStyleClass="w-full text-center"
            />
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="text-sm font-semibold mb-1">Payment Days</div>
            <p-inputnumber
              formControlName="paymentDays"
              mode="decimal"
              [minFractionDigits]="0"
              [maxFractionDigits]="0"
              [step]="5"
              [showButtons]="true"
              inputStyleClass="w-full text-center"
            />
          </div>
          <div class="col-span-12 md:col-span-1 flex items-end">
            <button type="button" class="p-button p-button-primary w-full" (click)="addRowFromForm()">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class DistributorCommissionWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  years: number[] = inputData.years ?? [];
  products: string[] = Object.keys(inputData.unit_costs || {});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      year: [this.years[0] ?? new Date().getFullYear()],
      product: [this.products[0] ?? ''],
      commissionPct: [5],
      revenueSharePct: [100],
      paymentDays: [30],
    });
  }

  ngOnInit(): void {
    const seed = this.products.slice(0, 4).map((product, idx) =>
      this.createRow({
        year: this.years[idx] ?? this.years[0] ?? new Date().getFullYear(),
        product,
        commissionPct: 5,
        revenueSharePct: 100,
        paymentDays: 30,
      })
    );
    this.form.setControl('rows', this.fb.array(seed));
    this.rows.valueChanges.subscribe(() => this.recalculateRows());
    this.recalculateRows();
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    this.rows.push(this.createRow(value));
    this.recalculateRows();
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private createRow(values: Partial<CommissionRow>): FormGroup {
    const row = this.fb.group({
      year: [values.year ?? this.years[0] ?? new Date().getFullYear()],
      product: [values.product ?? this.products[0] ?? ''],
      commissionPct: [values.commissionPct ?? 0],
      revenueSharePct: [values.revenueSharePct ?? 0],
      paymentDays: [values.paymentDays ?? 30],
      estimatedRevenue: [{ value: 0, disabled: true }],
      commissionImpact: [{ value: 0, disabled: true }],
    });
    return row;
  }

  private recalculateRows(): void {
    this.rows.controls.forEach((group) => {
      const year = Number(group.get('year')?.value);
      const product = String(group.get('product')?.value);
      const commissionPct = Number(group.get('commissionPct')?.value) || 0;
      const revenueSharePct = Number(group.get('revenueSharePct')?.value) || 0;

      const estimatedRevenue = this.computeEstimatedRevenue(product, year) * (revenueSharePct / 100);
      const commissionImpact = estimatedRevenue * (commissionPct / 100);

      group.get('estimatedRevenue')?.setValue(estimatedRevenue, { emitEvent: false });
      group.get('commissionImpact')?.setValue(commissionImpact, { emitEvent: false });
    });
  }

  private computeEstimatedRevenue(product: string, year: number): number {
    const years = inputData.years ?? [];
    const idx = years.indexOf(year);
    if (idx === -1) {
      return 0;
    }
    const productionEstimate = (inputData.production_estimate as Record<string, number[]>)?.[product]?.[idx] ?? 0;
    const price = (inputData.unit_costs as Record<string, { price?: number }>)[product]?.price ?? 0;
    const totalUnits = (inputData.total_production_units as Record<string, number>)[product] ?? 0;

    // Use production estimate proportionally to total units to approximate annual revenue.
    const estimatedUnits = productionEstimate * (totalUnits / 100); // treat estimate as percentage if small
    return estimatedUnits * price;
  }
}
