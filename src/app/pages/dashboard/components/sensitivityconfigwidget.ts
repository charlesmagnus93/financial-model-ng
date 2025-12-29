import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

interface SensitivityVariable {
  name: string;
  multipliers: number[];
}

@Component({
  standalone: true,
  selector: 'sensitivity-config-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FluidModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">Sensitivity Analysis Configuration</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div class="overflow-auto">
            <div class="min-w-[900px]">
              <div class="grid grid-cols-12 gap-2 text-xs font-semibold pb-2">
                <div class="col-span-6">Variable</div>
                <div class="col-span-5">Multipliers</div>
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
                      formControlName="name"
                      class="col-span-6 p-inputtext"
                      placeholder="Variable"
                    />
                    <input
                      pInputText
                      formControlName="multipliersText"
                      class="col-span-5 p-inputtext"
                      placeholder="0.90, 1.00, 1.10"
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
          <div class="text-lg font-semibold mb-3">Add sensitivity variable</div>
          <form
            [formGroup]="newRowForm"
            class="grid grid-cols-12 gap-3 items-end"
          >
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm font-semibold mb-1">Variable Name</div>
              <input
                pInputText
                type="text"
                class="p-inputtext w-full"
                formControlName="name"
                placeholder="e.g., tablet_price"
              />
            </div>
            <div class="col-span-12 md:col-span-5">
              <div class="text-sm font-semibold mb-1">Multipliers</div>
              <input
                pInputText
                type="text"
                class="p-inputtext w-full"
                formControlName="multipliersText"
                placeholder="e.g., 0.90, 1.00, 1.10"
              />
            </div>
            <div class="col-span-12 md:col-span-1 text-right">
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
export class SensitivityConfigWidget implements OnInit {
  form: FormGroup;
  newRowForm: FormGroup;

  private defaults: SensitivityVariable[] = [
    { name: 'tablet_price', multipliers: [0.9, 1, 1.1] },
    { name: 'raw_material_cost', multipliers: [0.9, 1, 1.1] },
    { name: 'discount_rate', multipliers: [0.08, 0.1, 0.12] },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.newRowForm = this.fb.group({
      name: [''],
      multipliersText: [''],
    });
  }

  ngOnInit(): void {
    const rows = this.defaults.map((d) =>
      this.createRow({
        name: d.name,
        multipliersText: this.formatMultipliers(d.multipliers),
      })
    );
    this.form.setControl('rows', this.fb.array(rows));
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRowFromForm(): void {
    const value = this.newRowForm.getRawValue();
    const name = (value.name ?? '').trim();
    const multipliersText = (value.multipliersText ?? '').trim();
    if (!name || !multipliersText) return;

    this.rows.push(this.createRow({ name, multipliersText }));
    this.newRowForm.reset({ name: '', multipliersText: '' });
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  private createRow(values: Partial<SensitivityVariable & { multipliersText: string }>): FormGroup {
    return this.fb.group({
      name: [values.name ?? ''],
      multipliersText:
        values.multipliersText ??
        (values.multipliers ? this.formatMultipliers(values.multipliers) : ''),
    });
  }

  private formatMultipliers(values: number[]): string {
    return values.map((v) => v.toFixed(4)).join(', ');
  }
}
