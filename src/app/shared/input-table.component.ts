import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

type ColumnType = 'text' | 'number';

export interface InputColumn {
  key: string;
  label: string;
  type?: ColumnType;
  placeholder?: string;
  step?: number;
}

@Component({
  standalone: true,
  selector: 'app-input-table',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <p-button size="small" icon="pi pi-plus" label="Add row" (onClick)="addRow()"></p-button>
      </div>

      <div class="overflow-auto">
        <table class="w-full border-collapse">
          <thead class="bg-surface-100">
            <tr>
              <th *ngFor="let col of columns" class="text-left px-3 py-2 text-sm font-semibold">{{ col.label }}</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody [formGroup]="form">
            <ng-container formArrayName="rows">
              <tr *ngFor="let row of rows.controls; let i = index" [formGroupName]="i" class="border-b">
                <td *ngFor="let col of columns" class="px-3 py-2">
                  <input
                    *ngIf="col.type === 'text' || !col.type"
                    pInputText
                    class="w-full"
                    [placeholder]="col.placeholder || col.label"
                    [formControlName]="col.key"
                  />
                  <p-inputnumber
                    *ngIf="col.type === 'number'"
                    [formControlName]="col.key"
                    [step]="col.step || 1"
                    [inputStyle]="{ width: '100%' }"
                  ></p-inputnumber>
                </td>
                <td class="px-3 py-2 text-right">
                  <p-button icon="pi pi-trash" severity="danger" text (onClick)="removeRow(i)"></p-button>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class InputTableComponent {
  @Input() title = 'Inputs';
  @Input() columns: InputColumn[] = [];

  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
    this.addRow();
  }
  
  
  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  addRow(): void {
    const group: FormGroup = this.fb.group({});
    this.columns.forEach((col) => {
      group.addControl(col.key, new FormControl(col.type === 'number' ? null : ''));
    });
    this.rows.push(group);
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  getValue(): any[] {
    return this.rows.value;
  }
}
