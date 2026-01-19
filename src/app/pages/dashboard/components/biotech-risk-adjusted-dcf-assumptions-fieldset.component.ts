import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-risk-adjusted-dcf-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    InputNumberModule,
    SliderModule,
  ],
  template: `
    <p-fieldset
      legend="Risk-adjusted DCF valuation method - assumptions"
      [toggleable]="true"
      class="w-full"
    >
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
          <label class="text-xs font-semibold">Discount rate</label>
          <p-slider
            [(ngModel)]="assumptions.discountRate"
            (ngModelChange)="updateAssumptions()"
            [min]="0"
            [max]="0.3"
            [step]="0.1"
          ></p-slider>
          <p-inputnumber
            [(ngModel)]="assumptions.discountRate"
            (ngModelChange)="updateAssumptions()"
            [min]="0"
            [max]="0.3"
            [step]="0.1"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            inputStyleClass="w-full"
          />
          <span class="text-xs text-surface-500">
            Discount rate + premium governs the rNPV and terminal value.
          </span>
        </div>
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
          <label class="text-xs font-semibold">Terminal EV/EBITDA multiple</label>
          <p-slider
            [(ngModel)]="assumptions.terminalMultiple"
            (ngModelChange)="updateAssumptions()"
            [min]="0"
            [max]="30"
            [step]="0.01"
          ></p-slider>
          <p-inputnumber
            [(ngModel)]="assumptions.terminalMultiple"
            (ngModelChange)="updateAssumptions()"
            [min]="0"
            [max]="30"
            [step]="0.01"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            inputStyleClass="w-full"
          />
        </div>
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
          <label class="text-xs font-semibold">Additional risk premium</label>
          <p-inputnumber
            [(ngModel)]="assumptions.additionalRiskPremium"
            (ngModelChange)="updateAssumptions()"
            [min]="0"
            [max]="0.5"
            [step]="0.01"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            inputStyleClass="w-full"
          />
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRiskAdjustedDcfAssumptionsFieldsetComponent
  implements OnInit
{
  assumptions = {
    discountRate: 0,
    terminalMultiple: 0,
    additionalRiskPremium: 0,
  };

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  updateAssumptions(): void {
    this.biotechModelService.patchInput({
      riskAdjustedDcfAssumptions: { ...this.assumptions },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()?.riskAdjustedDcfAssumptions;
    if (stored) {
      this.assumptions = { ...this.assumptions, ...stored };
    }
  }
}
