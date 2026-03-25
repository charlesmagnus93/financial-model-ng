import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';
import { finalize, Subject, take, takeUntil } from 'rxjs';

interface VcMetricRow {
  metric: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-biotech-vc-method-helper',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputNumberModule,
    SliderModule,
  ],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">VC method helper</div>

      @if (!hasValuationData) {
        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Configure the model and run a valuation before using VC analysis.
        </div>
      } @else {
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Exit year</div>
            <p-inputnumber
              [(ngModel)]="exitYear"
              (ngModelChange)="scheduleVcRun()"
              [useGrouping]="false"
              [min]="exitYearMin"
              [max]="exitYearMax"
              [showButtons]="true"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Target IRR</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>5%</span>
              <span class="text-red-400">{{ formatPercent(targetIrr) }}</span>
              <span>60%</span>
            </div>
            <p-slider
              [(ngModel)]="targetIrr"
              (ngModelChange)="scheduleVcRun()"
              [min]="0.05"
              [max]="0.6"
              [step]="0.01"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">Investor ownership at exit</div>
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>5%</span>
              <span class="text-red-400">{{ formatPercent(investorOwnership) }}</span>
              <span>90%</span>
            </div>
            <p-slider
              [(ngModel)]="investorOwnership"
              (ngModelChange)="scheduleVcRun()"
              [min]="0.05"
              [max]="0.9"
              [step]="0.01"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-surface-400">New money ($)</div>
            <p-inputnumber
              [(ngModel)]="newMoney"
              (ngModelChange)="scheduleVcRun()"
              [min]="1000000"
              [step]="5000000"
              [showButtons]="true"
              [useGrouping]="true"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Exit EV/EBITDA multiple</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>2x</span>
            <span class="text-red-400">{{ exitMultiple.toFixed(2) }}x</span>
            <span>25x</span>
          </div>
          <p-slider
            [(ngModel)]="exitMultiple"
            (ngModelChange)="scheduleVcRun()"
            [min]="2"
            [max]="25"
            [step]="0.25"
          ></p-slider>
        </div>

        @if (isRunning) {
          <div class="text-sm text-surface-400">Updating VC metrics...</div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }

        <div class="overflow-auto">
          <p-table
            [value]="rows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td>{{ row.metric }}</td>
                <td>{{ row.value }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }
    </div>
  `,
})
export class BiotechVcMethodHelperComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private hasInitializedControls = false;
  private runDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  private pendingRun = false;

  hasValuationData = false;
  exitYear = 2029;
  exitYearMin = 2024;
  exitYearMax = 2050;
  targetIrr = 0.3;
  investorOwnership = 0.25;
  newMoney = 50_000_000;
  exitMultiple = 8.0;
  rows: VcMetricRow[] = [];
  isRunning = false;
  errorMessage = '';

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromOutput(this.biotechModelService.getOutputSnapshot());
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.syncFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.runDebounceHandle) {
      clearTimeout(this.runDebounceHandle);
      this.runDebounceHandle = null;
    }
  }

  private syncFromOutput(output: any): void {
    const consolidated = output?.consolidated ?? {};
    const years = this.asNumberArray(consolidated?.index);
    if (!years.length) {
      this.hasValuationData = false;
      this.hasInitializedControls = false;
      this.rows = [];
      return;
    }

    this.hasValuationData = true;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    this.exitYearMin = minYear;
    this.exitYearMax = maxYear;

    const inputSnapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const firstYear = Number(
      inputSnapshot?.model_config?.first_year ??
      inputSnapshot?.generalAssumptions?.firstForecastYear ??
      minYear
    );
    const defaultExitYear = Math.min(
      maxYear,
      Number.isFinite(firstYear) ? Math.floor(firstYear) + 5 : minYear + 5
    );

    const defaultExitMultiple = Number(inputSnapshot?.model_config?.ev_ebitda_multiple ?? 8);

    if (!this.hasInitializedControls) {
      this.exitYear = Math.max(minYear, Math.min(maxYear, defaultExitYear));
      if (Number.isFinite(defaultExitMultiple) && defaultExitMultiple > 0) {
        this.exitMultiple = defaultExitMultiple;
      }
      this.hasInitializedControls = true;
      this.scheduleVcRun(0);
      return;
    }

    this.exitYear = Math.max(minYear, Math.min(maxYear, Number(this.exitYear)));
    this.scheduleVcRun(0);
  }

  scheduleVcRun(delayMs = 250): void {
    if (!this.hasValuationData) {
      return;
    }
    if (this.runDebounceHandle) {
      clearTimeout(this.runDebounceHandle);
    }
    this.runDebounceHandle = setTimeout(() => {
      this.runDebounceHandle = null;
      this.runVcMethod();
    }, delayMs);
  }

  runVcMethod(): void {
    if (!this.hasValuationData) {
      return;
    }
    if (this.isRunning) {
      this.pendingRun = true;
      return;
    }
    this.errorMessage = '';
    this.isRunning = true;
    this.biotechModelService
      .runVcMethod({
        exit_year: Number(this.exitYear),
        target_irr: Number(this.targetIrr),
        investor_ownership_at_exit: Number(this.investorOwnership),
        new_money: Number(this.newMoney),
        exit_multiple: Number(this.exitMultiple),
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunning = false;
          if (this.pendingRun) {
            this.pendingRun = false;
            this.runVcMethod();
          }
        })
      )
      .subscribe({
        next: (results) => {
          this.rows = this.mapRows(results);
        },
        error: (err: Error) => {
          this.errorMessage =
            err?.message || 'Unable to run VC method with current assumptions.';
          this.rows = [];
        },
      });
  }

  private mapRows(results: Record<string, number>): VcMetricRow[] {
    const entries = Object.entries(results ?? {});
    return entries.map(([metric, rawValue]) => {
      const numericValue = Number(rawValue ?? 0);
      const value = metric.toLowerCase().includes('irr')
        ? this.formatPercent(numericValue)
        : this.formatNumber(numericValue);
      return { metric, value };
    });
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

}
