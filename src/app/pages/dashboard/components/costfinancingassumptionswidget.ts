import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FluidModule } from 'primeng/fluid';
import inputData from '../../../../../input.json';

@Component({
  standalone: true,
  selector: 'cost-financing-assumptions-widget',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, FluidModule],
  template: `
    <p-fluid class="flex">
      <div class="card flex flex-col gap-4 w-full fp-10">
        <div class="text-xl font-semibold">Cost & Financing Assumptions</div>

        <form [formGroup]="form" class="flex flex-col gap-4">
          <div>
            <div class="text-sm font-semibold mb-1">Raw material cost per unit</div>
            <p-inputnumber
              formControlName="rawMaterialPerUnit"
              mode="decimal"
              [minFractionDigits]="4"
              [maxFractionDigits]="4"
              [step]="0.0001"
              [showButtons]="true"
              inputStyleClass="w-full text-center"
            />
          </div>

          <div>
            <div class="text-sm font-semibold mb-1">
              Annual raw material spend (comma separated, optional)
            </div>
            <textarea
              class="p-inputtext p-component w-full"
              rows="3"
              formControlName="annualRawMaterialSpend"
            ></textarea>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Initial investment</div>
              <p-inputnumber
                formControlName="initialInvestment"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Discount rate</div>
              <p-inputnumber
                formControlName="discountRate"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Share capital</div>
              <p-inputnumber
                formControlName="shareCapital"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Senior debt interest</div>
              <p-inputnumber
                formControlName="seniorDebtInterest"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Revolver interest</div>
              <p-inputnumber
                formControlName="revolverInterest"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="text-sm font-semibold mb-1">Cash interest</div>
              <p-inputnumber
                formControlName="cashInterest"
                mode="decimal"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                [step]="0.0001"
                [showButtons]="true"
                inputStyleClass="w-full text-center"
              />
            </div>
          </div>
        </form>
      </div>
    </p-fluid>
  `,
})
export class CostFinancingAssumptionsWidget implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rawMaterialPerUnit: [0],
      annualRawMaterialSpend: [''],
      initialInvestment: [0],
      discountRate: [0],
      shareCapital: [0],
      seniorDebtInterest: [0],
      revolverInterest: [0],
      cashInterest: [0],
    });
  }

  ngOnInit(): void {
    this.form.patchValue(this.buildDefaults());
  }

  private buildDefaults() {
    const raw = inputData.raw_material_cost ?? {};
    const financing = inputData.financing ?? {};
    const annualList = Array.isArray(raw.annual) ? raw.annual : [];
    return {
      rawMaterialPerUnit: raw.per_unit ?? 0,
      annualRawMaterialSpend:
        annualList.length > 0 ? annualList.join(', ') : '',
      initialInvestment: financing.initial_investment ?? 0,
      discountRate: financing.discount_rate ?? 0,
      shareCapital: financing.share_capital ?? 0,
      seniorDebtInterest: financing.senior_debt_interest ?? 0,
      revolverInterest: financing.revolver_interest ?? 0,
      cashInterest: financing.cash_interest ?? 0,
    };
  }
}
