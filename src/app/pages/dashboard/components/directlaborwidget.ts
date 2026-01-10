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
import inputData from '../../../../../input.json';
import { FluidModule } from 'primeng/fluid';

interface LaborRow {
  role: string;
  annualCost: number;
}

@Component({
  standalone: true,
  selector: 'direct-labor-widget',
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
        <div class="text-xl font-semibold">Direct Labour Structure</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[1100px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-6">Role</div>
                <div class="col-span-3">Annual Cost</div>
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
                    formControlName="role"
                    class="col-span-6 p-inputtext"
                    placeholder="Role"
                  />
                  <p-inputnumber
                    class="col-span-3"
                    formControlName="annualCost"
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

        <div class="border-t border-surface-800 pt-4">
          <div class="text-lg font-semibold mb-3">Add direct labour role</div>
          <form
            [formGroup]="newRowForm"
            class="grid grid-cols-12 gap-3 items-end"
          >
            <div class="col-span-12 md:col-span-5">
              <div class="text-sm font-semibold mb-1">Role</div>
              <input
                type="text"
                class="p-inputtext w-full"
                formControlName="role"
                placeholder="Role name"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Annual Cost</div>
              <p-inputnumber
                formControlName="annualCost"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.1"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-3">
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
export class DirectLaborWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      role: [''],
      annualCost: [0],
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
    this.newRowForm.reset({ role: '', annualCost: 0 });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private buildRowsFromInput(): LaborRow[] {
    const direct = (inputData.labor?.direct ?? {}) as Record<string, number>;
    return Object.keys(direct).map((role) => ({
      role,
      annualCost: direct[role] ?? 0,
    }));
  }

  private createRow(values: Partial<LaborRow>): FormGroup {
    return this.fb.group({
      role: [values.role ?? ''],
      annualCost: [values.annualCost ?? 0],
    });
  }
}
