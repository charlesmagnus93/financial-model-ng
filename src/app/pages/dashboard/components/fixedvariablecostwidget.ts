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

interface FixedVariableRow {
  product: string;
  fixedCost: number;
  variableCost: number;
}

@Component({
  standalone: true,
  selector: 'fixed-variable-cost-widget',
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
          Fixed & Variable Costs Input Table
        </div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-4">Product</div>
                <div class="col-span-3">Fixed Cost</div>
                <div class="col-span-3">Variable Cost</div>
                <div class="col-span-1">Actions</div>
              </div>

              <div formArrayName="rows" class="space-y-3">
                @for (row of rows.controls; track row; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    pInputText
                    formControlName="product"
                    class="col-span-4 p-inputtext"
                    placeholder="Product"
                  />
                  <p-inputnumber
                    class="col-span-3"
                    formControlName="fixedCost"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="1000"
                    [showButtons]="true"
                    inputStyleClass="w-full text-center"
                  />
                  <p-inputnumber
                    class="col-span-3"
                    formControlName="variableCost"
                    mode="decimal"
                    [minFractionDigits]="4"
                    [maxFractionDigits]="4"
                    [step]="0.001"
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

        <!-- <form [formGroup]="form" class="flex flex-col gap-4">
          <div formArrayName="rows" class="space-y-3">
            @for (row of rows.controls; track row; let i = $index) {
            <div
              [formGroupName]="i"
              class="grid grid-cols-12 gap-3 items-center"
            >
              <div class="col-span-12 md:col-span-5">
                <div class="text-sm font-semibold mb-1">Product</div>
                <select class="p-inputtext w-full" formControlName="product">
                  @for (p of products; track p) {
                  <option [value]="p">{{ p }}</option>
                  }
                </select>
              </div>
              <div class="col-span-12 md:col-span-3">
                <div class="text-sm font-semibold mb-1">Fixed Cost</div>
                <p-inputnumber
                  formControlName="fixedCost"
                  mode="decimal"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="4"
                  [step]="1000"
                  [showButtons]="true"
                  inputStyleClass="w-full text-center"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <div class="text-sm font-semibold mb-1">Variable Cost</div>
                <p-inputnumber
                  formControlName="variableCost"
                  mode="decimal"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="4"
                  [step]="0.001"
                  [showButtons]="true"
                  inputStyleClass="w-full text-center"
                />
              </div>
              <div class="col-span-12 md:col-span-1 text-right md:text-left">
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
        </form> -->

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">
            Add Fixed & Variable Cost
          </div>
          <form [formGroup]="newRowForm" class="grid grid-cols-12 gap-3">
            <div class="col-span-12">
              <div class="text-sm font-semibold mb-1">Product</div>
              <select class="p-inputtext w-full" formControlName="product">
                <option value="">Add new...</option>
                @for (p of products; track p) {
                <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
            <div class="col-span-12">
              <div class="text-sm font-semibold mb-1">Product (custom)</div>
              <input
                type="text"
                class="p-inputtext w-full"
                formControlName="customProduct"
                placeholder="Enter custom product name"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Fixed Cost</div>
              <p-inputnumber
                formControlName="fixedCost"
                mode="decimal"
                [minFractionDigits]="2"
                [maxFractionDigits]="4"
                [step]="0.01"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Variable Cost</div>
              <p-inputnumber
                formControlName="variableCost"
                mode="decimal"
                [minFractionDigits]="2"
                [maxFractionDigits]="4"
                [step]="0.0001"
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
export class FixedVariableCostWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;
  products: string[] = Object.keys(inputData.unit_costs || {});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      product: [''],
      customProduct: [''],
      fixedCost: [0],
      variableCost: [0],
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
    const product =
      value.customProduct && value.customProduct.trim().length > 0
        ? value.customProduct.trim()
        : value.product;
    this.rows.push(
      this.createRow({
        product,
        fixedCost: value.fixedCost,
        variableCost: value.variableCost,
      })
    );
    this.newRowForm.reset({
      product: '',
      customProduct: '',
      fixedCost: 0,
      variableCost: 0,
    });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): FixedVariableRow[] {
    const rows = inputData.fixed_variable_costs?.rows ?? [];
    return rows.map((r: any) => ({
      product: r.product ?? '',
      fixedCost: r.fixed_cost ?? 0,
      variableCost: r.variable_cost ?? 0,
    }));
  }

  private createRow(values: Partial<FixedVariableRow>): FormGroup {
    return this.fb.group({
      product: [values.product ?? ''],
      fixedCost: [values.fixedCost ?? 0],
      variableCost: [values.variableCost ?? 0],
    });
  }
}
