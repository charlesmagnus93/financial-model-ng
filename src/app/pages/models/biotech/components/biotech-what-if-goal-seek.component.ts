import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';

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
            <div class="text-sm font-semibold">Revenue multiplier</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ revenueMultiplier | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.4</span>
              <span class="text-red-400">{{ revenueMultiplier | number: '1.2-2' }}</span>
              <span>2.0</span>
            </div>
            <p-slider
              [(ngModel)]="revenueMultiplier"
              [min]="0.4"
              [max]="2.0"
              [step]="0.01"
              [disabled]="isEvaluatingWhatIf || isSolvingGoalSeek"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Cost multiplier</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ costMultiplier | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.5</span>
              <span class="text-red-400">{{ costMultiplier | number: '1.2-2' }}</span>
              <span>2.5</span>
            </div>
            <p-slider
              [(ngModel)]="costMultiplier"
              [min]="0.5"
              [max]="2.5"
              [step]="0.01"
              [disabled]="isEvaluatingWhatIf || isSolvingGoalSeek"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Discount shift</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ discountShift | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>-0.05</span>
              <span class="text-red-400">{{ discountShift | number: '1.2-2' }}</span>
              <span>0.1</span>
            </div>
            <p-slider
              [(ngModel)]="discountShift"
              [min]="-0.05"
              [max]="0.1"
              [step]="0.005"
              [disabled]="isEvaluatingWhatIf || isSolvingGoalSeek"
            ></p-slider>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Evaluate what-if case"
            [outlined]="true"
            [loading]="isEvaluatingWhatIf"
            [disabled]="isEvaluatingWhatIf || isSolvingGoalSeek"
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
          <div class="text-sm font-semibold">Target rNPV for goal seek</div>
          <p-inputnumber
            [(ngModel)]="targetRnpv"
            (ngModelChange)="onTargetRnpvChanged($event)"
            [showButtons]="true"
            [useGrouping]="true"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            [disabled]="isSolvingGoalSeek || isEvaluatingWhatIf"
            inputStyleClass="w-full"
          />
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Solve revenue multiplier"
            [outlined]="true"
            [loading]="isSolvingGoalSeek"
            [disabled]="isSolvingGoalSeek || isEvaluatingWhatIf"
            (onClick)="solveRevenueMultiplier()"
          ></p-button>
        </div>

        <div
          *ngIf="goalSeekMessage"
          class="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-500"
        >
          {{ goalSeekMessage }}
        </div>

        <div
          *ngIf="errorMessage"
          class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500"
        >
          {{ errorMessage }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechWhatIfGoalSeekComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private hasManualTargetRnpv = false;

  revenueMultiplier = 1.0;
  costMultiplier = 1.0;
  discountShift = 0.0;
  targetRnpv = 0;
  baseRnpv = 0;
  whatIfRnpv: number | null = null;
  goalSeekMessage = '';
  isEvaluatingWhatIf = false;
  isSolvingGoalSeek = false;
  errorMessage = '';

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncBaseRnpv(this.biotechModelService.getOutputSnapshot(), true);

    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => {
        this.syncBaseRnpv(output ?? this.biotechModelService.getOutputSnapshot(), false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatWithGrouping(value: number): string {
    const rounded = Math.round(value);
    return Number.isFinite(rounded) ? rounded.toLocaleString('en-US') : '0';
  }

  evaluateWhatIfCase(): void {
    if (this.isEvaluatingWhatIf) {
      return;
    }
    this.errorMessage = '';
    this.goalSeekMessage = '';
    this.isEvaluatingWhatIf = true;

    this.revenueMultiplier = this.clampNumber(this.revenueMultiplier, 0.4, 2.0);
    this.costMultiplier = this.clampNumber(this.costMultiplier, 0.5, 2.5);
    this.discountShift = this.clampNumber(this.discountShift, -0.05, 0.1);

    this.biotechModelService
      .runWhatIf({
        revenue_multiplier: this.revenueMultiplier,
        cost_multiplier: this.costMultiplier,
        discount_shift: this.discountShift,
        success_prob_multiplier: 1.0,
        launch_delay_years: 0,
        stage_slippage_years: {},
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isEvaluatingWhatIf = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.whatIfRnpv = this.toNumber(response?.rnpv, 0);
        },
        error: (err: unknown) => {
          this.errorMessage = this.resolveErrorMessage(err, 'What-if API call failed.');
        },
      });
  }

  solveRevenueMultiplier(): void {
    if (this.isSolvingGoalSeek) {
      return;
    }
    this.errorMessage = '';
    this.goalSeekMessage = '';
    this.isSolvingGoalSeek = true;

    this.biotechModelService
      .runGoalSeek(this.toNumber(this.targetRnpv, 0), 1e-3, 20)
      .pipe(
        take(1),
        finalize(() => {
          this.isSolvingGoalSeek = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.revenueMultiplier = this.clampNumber(
            this.toNumber(response?.revenue_multiplier, 1),
            0.4,
            2.0
          );
          const achieved = this.toNumber(response?.achieved_rnpv, 0);
          this.goalSeekMessage = `Revenue multiplier ${this.revenueMultiplier.toFixed(2)} approximates the goal (achieved rNPV ${this.formatWithGrouping(achieved)}).`;
        },
        error: (err: unknown) => {
          this.errorMessage = this.resolveErrorMessage(err, 'Goal-seek API call failed.');
        },
      });
  }

  onTargetRnpvChanged(value: number | null): void {
    this.hasManualTargetRnpv = true;
    this.targetRnpv = this.toNumber(value, 0);
    this.goalSeekMessage = '';
    this.errorMessage = '';
  }

  private syncBaseRnpv(output: any, forceTargetReset: boolean): void {
    this.baseRnpv = this.toNumber(output?.rnpv, 0);
    if (forceTargetReset || !this.hasManualTargetRnpv) {
      this.targetRnpv = this.baseRnpv;
    }
  }

  private toNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  private clampNumber(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, this.toNumber(value, min)));
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const maybeError = error as { message?: string; error?: unknown };
      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
      if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
        return maybeError.error;
      }
      if (maybeError.error && typeof maybeError.error === 'object') {
        const inner = maybeError.error as { detail?: string; message?: string };
        if (typeof inner.detail === 'string' && inner.detail.trim()) {
          return inner.detail;
        }
        if (typeof inner.message === 'string' && inner.message.trim()) {
          return inner.message;
        }
      }
    }
    return fallback;
  }
}

