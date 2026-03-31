import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { BiotechStartHereGuidedSetupFieldsetComponent } from './biotech-start-here-guided-setup-fieldset.component';
import { BiotechPipelineStageTemplatesFieldsetComponent } from './biotech-pipeline-stage-templates-fieldset.component';
import { BiotechStageToScheduleMappingFieldsetComponent } from './biotech-stage-to-schedule-mapping-fieldset.component';

@Component({
  standalone: true,
  selector: 'biotech-general-assumptions-fieldset',
  imports: [
    CommonModule,
    FieldsetModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    SliderModule,
    BiotechStartHereGuidedSetupFieldsetComponent,
    BiotechPipelineStageTemplatesFieldsetComponent,
    BiotechStageToScheduleMappingFieldsetComponent,
  ],
  template: `
    <biotech-start-here-guided-setup-fieldset></biotech-start-here-guided-setup-fieldset>
    <biotech-pipeline-stage-templates-fieldset></biotech-pipeline-stage-templates-fieldset>
    <biotech-stage-to-schedule-mapping-fieldset></biotech-stage-to-schedule-mapping-fieldset>

    <p-fieldset legend="General assumptions" [toggleable]="true" class="w-full">
      <form [formGroup]="generalForm" class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">First forecast year</label>
          <p-inputnumber
            formControlName="firstForecastYear"
            [showButtons]="true"
            [useGrouping]="false"
            inputStyleClass="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Tax rate</label>
          <!-- <p-slider
            formControlName="taxRate"
            [min]="this.taxRateMin"
            [max]="this.taxRateMax"
            [step]="this.taxRateStep"
            class="mt-2"
          ></p-slider> -->
          <p-inputnumber
            formControlName="taxRate"
            [min]="this.taxRateMin"
            [max]="this.taxRateMax"
            [step]="this.taxRateStep"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            [showButtons]="true"
            inputStyleClass="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Inflation assumption</label>
          <p-inputnumber
            formControlName="inflationAssumption"
            [min]="0"
            [max]="1"
            [step]="0.01"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            [showButtons]="true"
            inputStyleClass="w-full"
            mode="decimal"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Number of years</label>
          <p-inputnumber
            formControlName="numberOfYears"
            [showButtons]="true"
            [min]="1"
            [useGrouping]="false"
            inputStyleClass="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Working capital (% sales)</label>
          <!-- <p-slider
            formControlName="workingCapitalPct"
            [min]="0"
            [max]="1"
            [step]="0.01"
            class="mt-2"
          ></p-slider> -->
          <p-inputnumber
            formControlName="workingCapitalPct"
            [min]="this.workingCapitalPctMin"
            [max]="this.workingCapitalPctMax"
            [step]="this.workingCapitalPctStep"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            [showButtons]="true"
            inputStyleClass="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Reporting FX pair</label>
          <input pInputText formControlName="reportingFxPair" class="w-full" />
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-sm font-semibold">Currency</label>
          <input pInputText formControlName="currency" class="w-full" />
        </div>
        <div class="col-span-12 md:col-span-8 flex items-center gap-2">
          <p-checkbox formControlName="autoSyncVaccineSales" binary></p-checkbox>
          <label class="text-sm font-semibold">
            Rebuild Vaccine Sales table when assumptions change
          </label>
        </div>
      </form>
      <p class="mt-3 text-xs text-surface-400">
        Set the macro baseline for the consolidated forecast and disclosures.
      </p>
    </p-fieldset>
  `,
})
export class BiotechGeneralAssumptionsFieldsetComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  generalForm: FormGroup;
  taxRateMin = 0.0;
  taxRateMax = 0.35;
  taxRateStep = 0.01;

  workingCapitalPctMin = 0;
  workingCapitalPctMax = 1;
  workingCapitalPctStep = 0.01;

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.generalForm = this.formBuilder.group({
      firstForecastYear: [0],
      numberOfYears: [0],
      taxRate: [0],
      workingCapitalPct: [0],
      inflationAssumption: [0],
      reportingFxPair: [''],
      currency: [''],
      autoSyncVaccineSales: [false],
    });
  }

  ngOnInit(): void {
    this.syncGeneralAssumptions();
    this.generalForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateGeneralAssumptions());
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncGeneralAssumptions());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateGeneralAssumptions(): void {
    const value = this.generalForm.getRawValue();
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const currentConfig = snapshot?.model_config ?? {};
    const currentGeneral = snapshot?.general_assumptions ?? {};
    this.biotechModelService.patchInput({
      model_config: {
        ...currentConfig,
        first_year: Number(value.firstForecastYear ?? 0),
        n_years: Number(value.numberOfYears ?? 0),
        tax_rate: Number(value.taxRate ?? 0),
        working_capital_pct_sales: Number(value.workingCapitalPct ?? 0),
        inflation_rate: Number(value.inflationAssumption ?? 0),
        currency: String(value.currency ?? ''),
      },
      general_assumptions: {
        ...currentGeneral,
        inflation: Number(value.inflationAssumption ?? 0),
        base_fx: String(value.reportingFxPair ?? ''),
        auto_sync_vaccine_sales: Boolean(value.autoSyncVaccineSales),
      },
    });
  }

  private syncGeneralAssumptions(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const storedConfig = snapshot?.model_config ?? {};
    const storedGeneral = snapshot?.general_assumptions ?? {};
    this.generalForm.patchValue(
      {
        firstForecastYear: storedConfig.first_year ?? 0,
        numberOfYears: storedConfig.n_years ?? 0,
        taxRate: storedConfig.tax_rate ?? 0,
        workingCapitalPct: storedConfig.working_capital_pct_sales ?? 0,
        inflationAssumption:
          storedGeneral.inflation ?? storedConfig.inflation_rate ?? 0.02,
        reportingFxPair: storedGeneral.base_fx ?? 'USD/EUR',
        currency: storedConfig.currency ?? '',
        autoSyncVaccineSales: storedGeneral.auto_sync_vaccine_sales ?? false,
      },
      { emitEvent: false }
    );
  }
}

