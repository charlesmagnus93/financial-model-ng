import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-what-if-goal-seek',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    SliderModule,
    InputNumberModule,
    ButtonModule,
  ],
  template: `
    <p-fieldset
      legend="What-if analysis &amp; goal seek"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-5">
        <div class="grid gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Revenue multiplier</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0.5x</span>
              <span>{{ formatNumber(revenueMultiplier) }}x</span>
              <span>2.0x</span>
            </div>
            <p-slider
              [(ngModel)]="revenueMultiplier"
              [min]="0.5"
              [max]="2"
              [step]="0.01"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Cost multiplier</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0.5x</span>
              <span>{{ formatNumber(costMultiplier) }}x</span>
              <span>2.0x</span>
            </div>
            <p-slider
              [(ngModel)]="costMultiplier"
              [min]="0.5"
              [max]="2"
              [step]="0.01"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Discount shift</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.10</span>
              <span>{{ formatPercent(discountShift) }}</span>
              <span>0.10</span>
            </div>
            <p-slider
              [(ngModel)]="discountShift"
              [min]="-0.1"
              [max]="0.1"
              [step]="0.005"
            ></p-slider>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Evaluate what-if case"
            [outlined]="true"
            (onClick)="evaluateWhatIfCase()"
          ></p-button>
        </div>

        <div
          *ngIf="whatIfRnpv !== null"
          class="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-500"
        >
          What-if rNPV: {{ formatWithGrouping(whatIfRnpv) }}
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Target rNPV for goal seek</div>
          <p-inputnumber
            [(ngModel)]="targetRnpv"
            [min]="0"
            (ngModelChange)="changeTargetRnpv()"
            [showButtons]="true"
            [useGrouping]="true"
            inputStyleClass="w-full"
          />
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Solve revenue multiplier"
            [outlined]="true"
            (onClick)="solveRevenueMultiplier()"
          ></p-button>
        </div>

        <div
          *ngIf="goalSeekMessage"
          class="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-500"
        >
          {{ goalSeekMessage }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechWhatIfGoalSeekComponent implements OnInit {
  revenueMultiplier = 1.0;
  costMultiplier = 1.0;
  discountShift = 0.0;
  targetRnpv = 0;
  baseRnpv = 0;
  whatIfRnpv: number | null = null;
  goalSeekMessage = '';

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    this.baseRnpv = Number(output?.rnpv ?? 0);
    this.targetRnpv = this.baseRnpv;
  }

  formatPercent(value: number): string {
    return value.toFixed(2);
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(2);
  }

  formatWithGrouping(value: number): string {
    const rounded = Math.round(value);
    return Number.isFinite(rounded) ? rounded.toLocaleString('en-US') : '0';
  }

  evaluateWhatIfCase(): void {
    const revenueFactor = this.revenueMultiplier;
    const costFactor = this.costMultiplier || 1;
    const discountFactor = 1 - this.discountShift;
    this.whatIfRnpv = this.baseRnpv * (revenueFactor / costFactor) * discountFactor;
  }

  solveRevenueMultiplier(): void {
    if (!Number.isFinite(this.baseRnpv) || this.baseRnpv === 0) {
      this.goalSeekMessage = 'Base rNPV is not available to solve the goal.';
      return;
    }

    const costFactor = this.costMultiplier || 1;
    const discountFactor = 1 - this.discountShift;
    const safeDiscount = discountFactor === 0 ? 1 : discountFactor;
    const target = Number(this.targetRnpv ?? 0);
    const rawMultiplier = (target / this.baseRnpv) * (costFactor / safeDiscount);

    this.revenueMultiplier = Number.isFinite(rawMultiplier) ? rawMultiplier : 1;
    const achieved =
      this.baseRnpv * (this.revenueMultiplier / costFactor) * safeDiscount;

    this.goalSeekMessage = `Revenue multiplier ${this.revenueMultiplier.toFixed(2)} approximates the goal (achieved rNPV ${this.formatWithGrouping(achieved)}).`;
  }

  changeTargetRnpv() {
    this.goalSeekMessage = '';
  }
}
