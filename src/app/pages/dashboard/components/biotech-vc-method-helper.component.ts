import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';
import { take } from 'rxjs';

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
    ButtonModule,
  ],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">VC method helper</div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Exit year</div>
          <p-inputnumber
            [(ngModel)]="exitYear"
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
            <span>0%</span>
            <span>{{ formatPercent(targetIrr) }}</span>
            <span>60%</span>
          </div>
          <p-slider
            [(ngModel)]="targetIrr"
            [min]="0"
            [max]="0.6"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Investor ownership at exit</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>5%</span>
            <span>{{ formatPercent(investorOwnership) }}</span>
            <span>100%</span>
          </div>
          <p-slider
            [(ngModel)]="investorOwnership"
            [min]="0.05"
            [max]="1"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">New money ($)</div>
          <p-inputnumber
            [(ngModel)]="newMoney"
            [min]="0"
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
          <span>{{ exitMultiple.toFixed(2) }}x</span>
          <span>25x</span>
        </div>
        <p-slider
          [(ngModel)]="exitMultiple"
          [min]="2"
          [max]="25"
          [step]="0.25"
        ></p-slider>
      </div>

      <div class="flex items-center gap-3">
        <p-button
          label="Run VC method"
          [outlined]="true"
          [loading]="isRunning"
          [disabled]="isRunning"
          (onClick)="runVcMethod()"
        ></p-button>
      </div>

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
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.metric }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechVcMethodHelperComponent implements OnInit {
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
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = output?.consolidated ?? {};
    const years = this.asNumberArray(consolidated?.index);
    if (years.length) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      this.exitYearMin = minYear;
      this.exitYearMax = maxYear;
      this.exitYear = Math.min(maxYear, minYear + 5);
    }
    this.runVcMethod();
  }

  runVcMethod(): void {
    if (this.isRunning) {
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
      .pipe(take(1))
      .subscribe({
        next: (results) => {
          this.rows = this.mapRows(results);
          this.isRunning = false;
        },
        error: (err: Error) => {
          this.errorMessage =
            err?.message || 'Unable to run VC method with current assumptions.';
          this.rows = [];
          this.isRunning = false;
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
