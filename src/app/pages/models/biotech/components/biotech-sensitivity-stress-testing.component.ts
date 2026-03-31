import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { Subject, finalize, forkJoin, take, takeUntil } from 'rxjs';
import {
  BiotechModelService,
  BiotechScenarioPayload,
} from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface SensitivityRow {
  index: number;
  driver: string;
  change: number;
  rnpv: number;
  delta: number;
}

interface StressRow {
  index: number;
  scenario: string;
  rnpv: number;
  ebitdaImpact: number;
}

interface SensitivityCase {
  driver: string;
  change: number;
  scenario: BiotechScenarioPayload;
}

interface StressCase {
  name: string;
  scenario: BiotechScenarioPayload;
}

interface ScenarioEngineRow {
  scenario: string;
  rnpv: number;
  ebitdaValue: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-sensitivity-stress-testing',
  imports: [CommonModule, FormsModule, TableModule, FieldsetModule, SliderModule],
  template: `
    <p-fieldset
      legend="Sensitivity &amp; stress testing"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-5">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Pricing pressure swing</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ pricingPressureSwing | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0</span>
              <span class="text-red-400">{{ pricingPressureSwing | number: '1.2-2' }}</span>
              <span>0.5</span>
            </div>
            <p-slider
              [min]="0"
              [max]="0.5"
              [step]="0.01"
              [disabled]="isLoading"
              [(ngModel)]="pricingPressureSwing"
              (onSlideEnd)="onSwingChanged()"
              class="w-full"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Manufacturing cost swing</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ manufacturingCostSwing | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0</span>
              <span class="text-red-400">{{ manufacturingCostSwing | number: '1.2-2' }}</span>
              <span>0.5</span>
            </div>
            <p-slider
              [min]="0"
              [max]="0.5"
              [step]="0.01"
              [disabled]="isLoading"
              [(ngModel)]="manufacturingCostSwing"
              (onSlideEnd)="onSwingChanged()"
              class="w-full"
            ></p-slider>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Clinical success swing</div>
            <!-- <div class="text-xs text-red-400 font-semibold text-center">
              {{ clinicalSuccessSwing | number: '1.2-2' }}
            </div> -->
            <div class="flex items-center justify-between text-xs text-surface-400">
              <span>0</span>
              <span class="text-red-400">{{ clinicalSuccessSwing | number: '1.2-2' }}</span>
              <span>0.5</span>
            </div>
            <p-slider
              [min]="0"
              [max]="0.5"
              [step]="0.01"
              [disabled]="isLoading"
              [(ngModel)]="clinicalSuccessSwing"
              (onSlideEnd)="onSwingChanged()"
              class="w-full"
            ></p-slider>
          </div>
        </div>

        @if (isLoading) {
          <div class="rounded-lg bg-surface-900 px-4 py-3 text-sm text-surface-300">
            Computing sensitivity and stress test scenarios...
          </div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }

        <div class="overflow-auto rounded">
          <p-table
            [value]="sensitivityRows"
            showGridlines
            responsiveLayout="scroll"
            [scrollable]="true"
            scrollHeight="320px"
            [size]="'small'"
            class="text-sm"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="w-8"></th>
                <th>Driver</th>
                <th>Change</th>
                <th class="text-right">rNPV</th>
                <th class="text-right">Delta vs base</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="text-right">{{ row.index }}</td>
                <td class="font-semibold">{{ row.driver }}</td>
                <td>{{ formatSignedPercent(row.change) }}</td>
                <td class="text-right">{{ formatNumber(row.rnpv) }}</td>
                <td class="text-right">{{ formatSignedNumber(row.delta) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-sm font-semibold">Scenario stress testing</div>
        <div class="overflow-auto rounded">
          <p-table
            [value]="stressRows"
            showGridlines
            responsiveLayout="scroll"
            [scrollable]="true"
            scrollHeight="220px"
            [size]="'small'"
            class="text-sm"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="w-8"></th>
                <th>Scenario</th>
                <th class="text-right">rNPV</th>
                <th class="text-right">EBITDA impact</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="text-right">{{ row.index }}</td>
                <td class="font-semibold">{{ row.scenario }}</td>
                <td class="text-right">{{ formatNumber(row.rnpv) }}</td>
                <td class="text-right">{{ formatSignedNumber(row.ebitdaImpact) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechSensitivityStressTestingComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private latestOutput: any = null;
  private pendingRefresh = false;
  private baseRnpv = 0;

  pricingPressureSwing = 0.15;
  manufacturingCostSwing = 0.2;
  clinicalSuccessSwing = 0.1;

  sensitivityRows: SensitivityRow[] = [];
  stressRows: StressRow[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.latestOutput = this.biotechModelService.getOutputSnapshot() ?? {};
    this.refreshAnalysis();

    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => {
        this.latestOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
        this.refreshAnalysis();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSwingChanged(): void {
    this.refreshAnalysis();
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  formatSignedNumber(value: number): string {
    const formatted = formatNumberEnglish(value);
    if (value > 0) return `+${formatted}`;
    if (value < 0) return formatted;
    return '+0';
  }

  formatSignedPercent(value: number): string {
    const pct = `${Math.abs(value * 100).toFixed(0)}%`;
    if (value > 0) return `+${pct}`;
    if (value < 0) return `-${pct}`;
    return '+0%';
  }

  private refreshAnalysis(): void {
    if (this.isLoading) {
      this.pendingRefresh = true;
      return;
    }
    this.errorMessage = '';
    this.baseRnpv = Number(this.latestOutput?.rnpv ?? 0);
    this.isLoading = true;

    const sensitivityCases = this.buildSensitivityCases();
    const stressCases = this.buildStressCases();

    forkJoin({
      sensitivity: this.biotechModelService.runScenarioAnalysis(
        sensitivityCases.map((item) => item.scenario),
        0
      ),
      stress: this.biotechModelService.runScenarioAnalysis(
        stressCases.map((item) => item.scenario),
        0
      ),
    })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          if (this.pendingRefresh) {
            this.pendingRefresh = false;
            this.refreshAnalysis();
          }
        })
      )
      .subscribe({
        next: ({ sensitivity, stress }) => {
          this.sensitivityRows = this.resolveSensitivityRows(sensitivity, sensitivityCases);
          this.stressRows = this.resolveStressRows(stress, stressCases);
        },
        error: (err: Error) => {
          this.errorMessage =
            err?.message || 'Unable to compute sensitivity and stress testing.';
          this.sensitivityRows = [];
          this.stressRows = [];
        },
      });
  }

  private buildSensitivityCases(): SensitivityCase[] {
    const drivers: Array<{
      driver: string;
      delta: number;
      type: 'revenue' | 'cost' | 'productivity';
    }> = [
      {
        driver: 'Pricing pressure',
        delta: Number(this.pricingPressureSwing),
        type: 'revenue',
      },
      {
        driver: 'Manufacturing costs',
        delta: Number(this.manufacturingCostSwing),
        type: 'cost',
      },
      {
        driver: 'Clinical success',
        delta: Number(this.clinicalSuccessSwing),
        type: 'productivity',
      },
    ];

    const cases: SensitivityCase[] = [];
    for (const driver of drivers) {
      for (const change of [-driver.delta, 0, driver.delta]) {
        let revenueMultiplier = 1.0;
        let costMultiplier = 1.0;
        if (driver.type === 'revenue') {
          revenueMultiplier = 1.0 + change;
        } else if (driver.type === 'cost') {
          costMultiplier = 1.0 + change;
        } else {
          revenueMultiplier = 1.0 + change;
          costMultiplier = Math.max(0.1, 1.0 - change / 2);
        }

        const signedPct = `${change >= 0 ? '+' : ''}${Math.round(change * 100)}%`;
        cases.push({
          driver: driver.driver,
          change,
          scenario: {
            name: `${driver.driver} ${signedPct}`,
            revenue_multiplier: revenueMultiplier,
            cost_multiplier: costMultiplier,
            discount_rate_shift: 0.0,
            success_prob_multiplier: 1.0,
            launch_delay_years: 0,
            stage_slippage_years: {},
          },
        });
      }
    }
    return cases;
  }

  private buildStressCases(): StressCase[] {
    return [
      {
        name: 'Regulatory delay',
        scenario: {
          name: 'Regulatory delay',
          revenue_multiplier: 0.7,
          cost_multiplier: 1.2,
          discount_rate_shift: 0.03,
          success_prob_multiplier: 0.9,
          launch_delay_years: 0,
          stage_slippage_years: {},
        },
      },
      {
        name: 'Trial failure',
        scenario: {
          name: 'Trial failure',
          revenue_multiplier: 0.6,
          cost_multiplier: 1.3,
          discount_rate_shift: 0.04,
          success_prob_multiplier: 0.75,
          launch_delay_years: 0,
          stage_slippage_years: {},
        },
      },
      {
        name: 'Pricing squeeze',
        scenario: {
          name: 'Pricing squeeze',
          revenue_multiplier: 0.5,
          cost_multiplier: 1.05,
          discount_rate_shift: 0.02,
          success_prob_multiplier: 0.95,
          launch_delay_years: 0,
          stage_slippage_years: {},
        },
      },
    ];
  }

  private resolveSensitivityRows(payload: any, cases: SensitivityCase[]): SensitivityRow[] {
    const parsed = this.parseScenarioRows(payload);
    const byScenarioName = new Map<string, ScenarioEngineRow>();
    parsed.forEach((row) => byScenarioName.set(row.scenario, row));

    const baseByDriver = new Map<string, number>();
    cases.forEach((item) => {
      if (item.change === 0) {
        const baseRow = byScenarioName.get(item.scenario.name);
        baseByDriver.set(item.driver, baseRow?.rnpv ?? this.baseRnpv);
      }
    });

    return cases.map((item, index) => {
      const row = byScenarioName.get(item.scenario.name);
      const base = baseByDriver.get(item.driver) ?? this.baseRnpv;
      const rnpv = row?.rnpv ?? base;
      return {
        index,
        driver: item.driver,
        change: item.change,
        rnpv,
        delta: rnpv - base,
      };
    });
  }

  private resolveStressRows(payload: any, cases: StressCase[]): StressRow[] {
    const parsed = this.parseScenarioRows(payload);
    const byScenarioName = new Map<string, ScenarioEngineRow>();
    parsed.forEach((row) => byScenarioName.set(row.scenario, row));
    const baseEbitda = byScenarioName.get('Base')?.ebitdaValue ?? 0;

    return cases.map((item, index) => {
      const row = byScenarioName.get(item.name);
      const rnpv = row?.rnpv ?? this.baseRnpv;
      const ebitdaValue = row?.ebitdaValue ?? baseEbitda;
      return {
        index,
        scenario: item.name,
        rnpv,
        ebitdaImpact: ebitdaValue - baseEbitda,
      };
    });
  }

  private parseScenarioRows(payload: any): ScenarioEngineRow[] {
    return this.tablePayloadToRows(payload)
      .map((entry) => ({
        scenario: String(entry['scenario'] ?? entry['Scenario'] ?? ''),
        rnpv: this.toNumber(entry['rnpv'], 0),
        ebitdaValue: this.toNumber(entry['ebitda_value'], 0),
      }))
      .filter((row) => Boolean(row.scenario));
  }

  private toNumber(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  private tablePayloadToRows(payload: any): Array<Record<string, unknown>> {
    if (!payload || typeof payload !== 'object') {
      return [];
    }
    const data = payload?.data;
    if (!data || typeof data !== 'object') {
      return [];
    }
    const columns = Object.keys(data);
    if (!columns.length) {
      return [];
    }
    const rowCount = Math.max(
      0,
      ...columns.map((column) =>
        Array.isArray((data as Record<string, unknown[]>)[column])
          ? (data as Record<string, unknown[]>)[column].length
          : 0
      )
    );
    const rows: Array<Record<string, unknown>> = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row: Record<string, unknown> = {};
      for (const column of columns) {
        const values = (data as Record<string, unknown[]>)[column];
        row[column] = Array.isArray(values) ? values[rowIndex] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }
}


