import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

interface ScenarioForm {
  name: FormControl<string>;
  inflationSeries: FormControl<string>;
  interestSeries: FormControl<string>;
  removable: FormControl<boolean>;
}

@Component({
  standalone: true,
  selector: 'scenario-configuration-widget',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    ButtonModule,
    FluidModule,
  ],
  template: `
    <p-fluid class="flex">
      <div class="card w-full flex flex-col gap-4">
        <div class="text-2xl font-semibold">Scenario / IFs Configuration</div>

        <p-accordion [multiple]="true" [activeIndex]="[0]">
          @for (scenario of scenarios.controls; track scenario; let i = $index) {
            <p-accordionTab [header]="'Scenario: ' + (scenario.value.name || 'untitled')">
              <div [formGroup]="scenario" class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                  <div class="text-sm font-semibold">Scenario Name</div>
                  <input
                    pInputText
                    formControlName="name"
                    placeholder="Scenario name"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <div class="text-sm font-semibold">Inflation Series</div>
                  <textarea
                    pInputTextarea
                    formControlName="inflationSeries"
                    rows="3"
                    class="w-full"
                    placeholder="Comma-separated values e.g. 0.04, 0.041, 0.042"
                  ></textarea>
                </div>

                <div class="flex flex-col gap-1">
                  <div class="text-sm font-semibold">Interest Series</div>
                  <textarea
                    pInputTextarea
                    formControlName="interestSeries"
                    rows="3"
                    class="w-full"
                    placeholder="Comma-separated values e.g. 0.125, 0.125, 0.125"
                  ></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <p-checkbox
                    binary
                    formControlName="removable"
                    inputId="removable-{{ i }}"
                  ></p-checkbox>
                  <label [for]="'removable-' + i" class="text-sm">Remove scenario</label>
                  <p-button
                    label="Remove"
                    severity="danger"
                    variant="outlined"
                    size="small"
                    (click)="removeScenario(i)"
                    [disabled]="!scenario.value.removable"
                  ></p-button>
                </div>
              </div>
            </p-accordionTab>
          }
        </p-accordion>

        <div class="border border-surface-800 rounded p-4 flex flex-col gap-3">
          <div class="text-lg font-semibold">Add Scenario</div>
          <form [formGroup]="newScenarioForm" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <div class="text-sm font-semibold">Scenario Name</div>
              <input
                pInputText
                formControlName="name"
                placeholder="Scenario name"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-sm font-semibold">Inflation Series</div>
              <textarea
                pInputTextarea
                formControlName="inflationSeries"
                rows="2"
                class="w-full"
                placeholder="Comma-separated values"
              ></textarea>
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-sm font-semibold">Interest Series</div>
              <textarea
                pInputTextarea
                formControlName="interestSeries"
                rows="2"
                class="w-full"
                placeholder="Comma-separated values"
              ></textarea>
            </div>
            <div class="flex justify-start">
              <p-button label="Add Scenario" (click)="addScenario()" />
            </div>
          </form>
        </div>
      </div>
    </p-fluid>
  `,
})
export class ScenarioConfigurationWidget {
  form: FormGroup;
  newScenarioForm: FormGroup;

  get scenarios(): FormArray<FormGroup<ScenarioForm>> {
    return this.form.get('scenarios') as FormArray<FormGroup<ScenarioForm>>;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      scenarios: this.fb.array<FormGroup<ScenarioForm>>([
        this.buildScenario('base', baseSampleInflation, baseSampleInterest, false),
        this.buildScenario('best', bestSampleInflation, bestSampleInterest, true),
        this.buildScenario('worst', worstSampleInflation, worstSampleInterest, true),
      ]),
    });

    this.newScenarioForm = this.fb.group({
      name: [''],
      inflationSeries: [''],
      interestSeries: [''],
    });
  }

  addScenario(): void {
    const { name, inflationSeries, interestSeries } = this.newScenarioForm.value;
    if (!name?.trim()) return;
    this.scenarios.push(
      this.buildScenario(name.trim(), inflationSeries ?? '', interestSeries ?? '', true)
    );
    this.newScenarioForm.reset();
  }

  removeScenario(index: number): void {
    const scenario = this.scenarios.at(index);
    if (scenario && scenario.value.removable) {
      this.scenarios.removeAt(index);
    }
  }

  private buildScenario(
    name: string,
    inflationSeries: string,
    interestSeries: string,
    removable: boolean
  ): FormGroup {
    return this.fb.group({
      name: new FormControl<string>(name),
      inflationSeries: new FormControl<string>(inflationSeries),
      interestSeries: new FormControl<string>(interestSeries),
      removable: new FormControl<boolean>(removable),
    });
  }
}

const baseSampleInflation =
  '0.0400, 0.0400, 0.0410, 0.0420, 0.0430, 0.0440, 0.0440, 0.0450, 0.0450, 0.0450';
const baseSampleInterest =
  '0.1250, 0.1250, 0.1250, 0.1250, 0.1250, 0.1250, 0.1250, 0.1250, 0.1250, 0.1250';

const bestSampleInflation =
  '0.0384, 0.0380, 0.0380, 0.0380, 0.0380, 0.0380, 0.0380, 0.0380, 0.0380, 0.0380';
const bestSampleInterest =
  '0.1000, 0.1000, 0.1000, 0.1000, 0.1000, 0.1000, 0.1000, 0.1000, 0.1000, 0.1000';

const worstSampleInflation =
  '0.0620, 0.0620, 0.0620, 0.0620, 0.0620, 0.0620, 0.0660, 0.0660, 0.0660, 0.0660';
const worstSampleInterest =
  '0.1350, 0.1350, 0.1350, 0.1350, 0.1350, 0.1350, 0.1350, 0.1350, 0.1350, 0.1350';
