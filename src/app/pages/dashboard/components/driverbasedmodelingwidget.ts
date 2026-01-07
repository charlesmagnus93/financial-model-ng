import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
  standalone: true,
  selector: 'driver-based-modeling-widget',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, FluidModule],
  template: `
    <p-fluid class="flex">
      <div class="card w-full flex flex-col gap-4">
        <div class="text-2xl font-semibold">Driver-based Modeling</div>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <div formArrayName="variables" class="flex flex-col gap-3">
            @for (variable of variables.controls; track variable; let i = $index) {
              <div class="flex items-center gap-3">
                <input
                  pInputText
                  class="flex-1"
                  [formControlName]="i"
                  placeholder="Variable name"
                />
                <p-button
                  label="Remove"
                  severity="danger"
                  variant="outlined"
                  size="small"
                  (click)="removeVariable(i)"
                />
              </div>
            }
          </div>
        </form>

        <div class="border border-surface-800 rounded p-4 flex flex-col gap-3">
          <div class="text-sm font-semibold">Variable</div>
          <input
            pInputText
            [formControl]="newVariableControl"
            placeholder="Variable name"
            class="w-full"
          />
          <div>
            <p-button label="Add Variable" (click)="addVariable()" />
          </div>
        </div>
      </div>
    </p-fluid>
  `,
})
export class DriverBasedModelingWidget {
  form: FormGroup;
  newVariableControl;

  get variables(): FormArray {
    return this.form.get('variables') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      variables: this.fb.array([
        new FormControl('EBITDA'),
        new FormControl('EBIT'),
      ]),
    });

    this.newVariableControl = new FormControl('');
  }

  addVariable(): void {
    const value = (this.newVariableControl.value ?? '').trim();
    if (!value) return;
    this.variables.push(new FormControl(value));
    this.newVariableControl.reset();
  }

  removeVariable(index: number): void {
    if (index >= 0 && index < this.variables.length) {
      this.variables.removeAt(index);
    }
  }
}
