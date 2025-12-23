import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import inputData from '../../../../../input.json';

interface CoreAssumptionRow {
  description: string;
  productionCost: number;
  sellingPrice: number;
  freightCost: number;
  markup: number;
  productionUnits: number;
  maxCapacity: number;
  totalRevenue: number;
  totalCost: number;
}

@Component({
  standalone: true,
  selector: 'core-assumption-widget',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FluidModule,
    InputNumberModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-6 w-full fp-10">
        <div class="font-semibold text-xl">Core Assumptions</div>
        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-1">Description</div>
                <div class="col-span-1">Production Cost</div>
                <div class="col-span-1">Selling Price</div>
                <div class="col-span-1">Freight Cost</div>
                <div class="col-span-1">Markup</div>
                <div class="col-span-2">Total Production Units</div>
                <div class="col-span-2">Max Capacity</div>
                <div class="col-span-1">Total Revenue</div>
                <div class="col-span-1">Total Cost</div>
                <div class="col-span-1 text-right">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                <div
                  *ngFor="let row of rows.controls; let i = index"
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-1 items-center"
                >
                  <input
                    pInputText
                    formControlName="description"
                    class="col-span-1 p-inputtext"
                    placeholder="Description"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="productionCost"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="sellingPrice"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="freightCost"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.001"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="markup"
                    mode="decimal"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    [step]="0.01"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-2"
                    formControlName="productionUnits"
                    mode="decimal"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1000"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-2"
                    formControlName="maxCapacity"
                    mode="decimal"
                    [minFractionDigits]="0"
                    [maxFractionDigits]="0"
                    [step]="1000"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="totalRevenue"
                    mode="decimal"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="4"
                    [showButtons]="false"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-1"
                    formControlName="totalCost"
                    mode="decimal"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="4"
                    [showButtons]="false"
                    inputStyleClass="w-full text-center"
                  />
                  <div class="col-span-1">
                    <p-button label="Remove" variant="outlined" severity="danger" (click)="removeRow(i)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="border-t border-surface-800 pt-4">
          <div class="font-semibold text-lg mb-3">Add a core assumption</div>
          <form [formGroup]="newRowForm" class="grid grid-cols-12 gap-3">
            <div class="col-span-12">
              <input
                pInputText
                formControlName="description"
                class="p-inputtext w-full"
                placeholder="Description"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">Production Cost</div>
              <p-inputnumber
                formControlName="productionCost"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">Selling Price</div>
              <p-inputnumber
                formControlName="sellingPrice"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">Freight Cost</div>
              <p-inputnumber
                formControlName="freightCost"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">Markup</div>
              <p-inputnumber
                formControlName="markup"
                mode="decimal"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                [step]="0.01"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">
                Total Production Units
              </div>
              <p-inputnumber
                formControlName="productionUnits"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1000"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <div class="font-semibold text-sm mb-1">Max Capacity</div>
              <p-inputnumber
                formControlName="maxCapacity"
                mode="decimal"
                [minFractionDigits]="0"
                [maxFractionDigits]="0"
                [step]="1000"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12">
              <p-button
                label="Add"
                icon="pi pi-plus"
                (click)="addRowFromForm()"
              ></p-button>
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class AssumptionCoreWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      description: [''],
      productionCost: [0],
      sellingPrice: [0],
      freightCost: [0],
      markup: [0],
      productionUnits: [0],
      maxCapacity: [0],
    });
  }

  ngOnInit(): void {
    this.populateFromJson();
    this.rows.valueChanges.subscribe(() => this.recalculateRows());
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    this.rows.push(
      this.createRow({
        ...value,
        totalRevenue: value.sellingPrice * value.productionUnits,
        totalCost:
          (value.productionCost + value.freightCost) * value.productionUnits,
      })
    );
    this.newRowForm.reset({
      description: '',
      productionCost: 0,
      sellingPrice: 0,
      freightCost: 0,
      markup: 0,
      productionUnits: 0,
      maxCapacity: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private populateFromJson(): void {
    const rows = this.buildRowsFromInput();
    const rowGroups = rows.map((row) => this.createRow(row));
    this.form.setControl('rows', this.fb.array(rowGroups));
    this.recalculateRows();
  }

  private buildRowsFromInput(): CoreAssumptionRow[] {
    const products = Object.keys(inputData.unit_costs || {});

    return products.map((product) => {
      const unitCosts =
        (inputData.unit_costs as Record<string, any>)[product] || {};
      const productionCost = unitCosts.production ?? 0;
      const sellingPrice = unitCosts.price ?? 0;
      const freightCost = unitCosts.freight ?? 0;
      const markup = (inputData.markup as Record<string, number>)[product] ?? 0;
      const productionUnits =
        (inputData.total_production_units as Record<string, number>)[product] ??
        0;
      const maxCapacity = Number(
        (inputData.production_capacity as Record<string, string | number>)[
          product
        ] ?? 0
      );

      return {
        description: product,
        productionCost,
        sellingPrice,
        freightCost,
        markup,
        productionUnits,
        maxCapacity,
        totalRevenue: sellingPrice * productionUnits,
        totalCost: (productionCost + freightCost) * productionUnits,
      };
    });
  }

  private createRow(values?: Partial<CoreAssumptionRow>): FormGroup {
    return this.fb.group({
      description: [values?.description ?? ''],
      productionCost: [values?.productionCost ?? 0],
      sellingPrice: [values?.sellingPrice ?? 0],
      freightCost: [values?.freightCost ?? 0],
      markup: [values?.markup ?? 0],
      productionUnits: [values?.productionUnits ?? 0],
      maxCapacity: [values?.maxCapacity ?? 0],
      totalRevenue: [{ value: values?.totalRevenue ?? 0, disabled: true }],
      totalCost: [{ value: values?.totalCost ?? 0, disabled: true }],
    });
  }

  private recalculateRows(): void {
    this.rows.controls.forEach((group) => {
      const productionCost = this.asNumber(group.get('productionCost')?.value);
      const sellingPrice = this.asNumber(group.get('sellingPrice')?.value);
      const freightCost = this.asNumber(group.get('freightCost')?.value);
      const productionUnits = this.asNumber(
        group.get('productionUnits')?.value
      );

      group
        .get('totalRevenue')
        ?.setValue(sellingPrice * productionUnits, { emitEvent: false });
      group
        .get('totalCost')
        ?.setValue((productionCost + freightCost) * productionUnits, {
          emitEvent: false,
        });
    });
  }

  private asNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
}
