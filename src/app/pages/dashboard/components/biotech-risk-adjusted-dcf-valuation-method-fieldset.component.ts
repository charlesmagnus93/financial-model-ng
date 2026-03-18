import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { BiotechModelService } from '../../services/biotech-model.service';

interface RiskAdjustedDcfAssumptions {
  discountRate: number;
  terminalMultiple: number;
  additionalRiskPremium: number;
}

@Component({
  standalone: true,
  selector: 'biotech-risk-adjusted-dcf-valuation-method-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    SliderModule,
    InputNumberModule,
  ],
  template: `
    <p-fieldset
      legend="Risk-adjusted DCF valuation method - assumptions"
      [toggleable]="true"
      class="w-full"
    >
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
          <label class="text-xs font-semibold">Discount rate</label>
          <div class="text-center text-xs font-semibold text-primary -mb-1">
            {{ assumptions.discountRate | number: '1.2-2' }}
          </div>
          <!-- <p-slider
            [(ngModel)]="assumptions.discountRate"
            (ngModelChange)="updateAssumptions()"
            [min]="0.02"
            [max]="0.3"
            [step]="0.01"
          ></p-slider> -->
          <p-inputnumber
            [(ngModel)]="assumptions.discountRate"
            [min]="this.discountRateMin"
            [max]="this.discountRateMax"
            [step]="this.discountRateStep"
            [showButtons]="true"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            inputStyleClass="w-full"
          />
          <span class="text-xs text-surface-500 mt-3">
            Discount rate + premium governs the rNPV and terminal value.
          </span>
        </div>

        <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
          <label class="text-xs font-semibold">Terminal EV/EBITDA multiple</label>
          <div class="text-center text-xs font-semibold text-primary -mb-1">
            {{ assumptions.terminalMultiple | number: '1.2-2' }}
          </div>
          <!-- <p-slider
            [(ngModel)]="assumptions.terminalMultiple"
            (ngModelChange)="updateAssumptions()"
            [min]="2"
            [max]="30"
            [step]="0.01"
          ></p-slider> -->
          <p-inputnumber
            [(ngModel)]="assumptions.terminalMultiple"
            [min]="this.terminalMultipleMin"
            [max]="this.terminalMultipleMax"
            [step]="this.terminalMultipleStep"
            [showButtons]="true"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            inputStyleClass="w-full"
          />
        </div>

        <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
          <label class="text-xs font-semibold">Additional risk premium</label>
          <div class="" style="padding-top: 17px;">
            <p-inputnumber
              [(ngModel)]="assumptions.additionalRiskPremium"
              (ngModelChange)="updateAssumptions()"
              [showButtons]="true"
              [min]="0"
              [max]="0.5"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="4"
              inputStyleClass="w-full"
              fluid
            />
          </div>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRiskAdjustedDcfValuationMethodFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  discountRateMin = 0.02;
  discountRateMax = 30;
  discountRateStep = 0.01;
  
  terminalMultipleMin = 2;
  terminalMultipleMax = 30;
  terminalMultipleStep = 0.01;

  assumptions: RiskAdjustedDcfAssumptions = {
    discountRate: 0.02,
    terminalMultiple: 2.0,
    additionalRiskPremium: 0,
  };

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateAssumptions(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const currentConfig = snapshot?.model_config ?? {};
    const currentRisk = snapshot?.risk_adjusted_dcf ?? {};

    this.biotechModelService.patchInput({
      model_config: {
        ...currentConfig,
        discount_rate: Number(this.assumptions.discountRate ?? 0),
        ev_ebitda_multiple: Number(this.assumptions.terminalMultiple ?? 0),
      },
      risk_adjusted_dcf: {
        ...currentRisk,
        discount_rate: Number(this.assumptions.discountRate ?? 0),
        ev_ebitda_multiple: Number(this.assumptions.terminalMultiple ?? 0),
        risk_buffer: Number(this.assumptions.additionalRiskPremium ?? 0),
      },
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const storedRisk = snapshot?.risk_adjusted_dcf ?? {};
    const storedConfig = snapshot?.model_config ?? {};

    this.assumptions = {
      discountRate: Number(
        storedRisk.discount_rate ?? storedConfig.discount_rate ?? 0
      ),
      terminalMultiple: Number(
        storedRisk.ev_ebitda_multiple ?? storedConfig.ev_ebitda_multiple ?? 0
      ),
      additionalRiskPremium: Number(storedRisk.risk_buffer ?? 0),
    };
  }
}

