import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-general-assumptions-fieldset',
  imports: [
    CommonModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  template: `
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
          <p-inputnumber
            formControlName="taxRate"
            [min]="0"
            [max]="1"
            [step]="0.01"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
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
            inputStyleClass="w-full"
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
          <p-inputnumber
            formControlName="workingCapitalPct"
            [min]="0"
            [max]="1"
            [step]="0.01"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
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
    this.biotechModelService.patchInput({
      generalAssumptions: { ...value },
    });
  }

  private syncGeneralAssumptions(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.model_config;
    if (!stored) {
      return;
    }
    this.generalForm.patchValue(
      {
        firstForecastYear: stored.first_year ?? 0,
        numberOfYears: stored.n_years?? 0,
        taxRate: stored.taxRate ?? 0,
        workingCapitalPct: stored.working_capital_pct_sales ?? 0,
        inflationAssumption: stored.inflationAssumption ?? 0.02,
        reportingFxPair: stored.reportingFxPair ?? 'USD/EUR',
        currency: stored.currency ?? '',
      },
      { emitEvent: false }
    );
  }
}
