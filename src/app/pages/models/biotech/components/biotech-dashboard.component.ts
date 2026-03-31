import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import {
  BiotechDiagnosticsResponse,
  BiotechModelService,
  BiotechScenarioPayload,
  BiotechScenarioPreset,
  BiotechWhatIfShockPayload,
  TablePayload,
} from '../../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';
import { Subject, catchError, finalize, forkJoin, of, take, takeUntil } from 'rxjs';

interface ComparableMultipleRow {
  peer: string;
  multiple: number;
  metric: string;
}

interface ScenarioSummaryRow {
  scenario: string;
  discountRate: string;
  rnpv: string;
  ebitdaYear: number;
  ebitdaValue: string;
}

interface ScenarioComponentDeltaRow {
  component: string;
  base: number;
  scenario: number;
  delta: number;
}

interface TornadoRow {
  driver: string;
  change: string;
  rnpv: number;
  delta: number;
}

type ScenarioPresetKey = 'base' | 'upside' | 'downside' | 'trial';

interface ScenarioPresetConfig {
  name: string;
  revenueMultiplier: number;
  costMultiplier: number;
  discountRateShift: number;
  successProbMultiplier: number;
  launchDelayYears: number;
  stageSlippageYears: Record<string, number>;
}

interface ScenarioEngineRow {
  scenario: string;
  discountRate: number;
  rnpv: number;
  ebitdaYear: number;
  ebitdaValue: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    InputTextModule,
    ButtonModule,
    SliderModule,
    CardModule,
    TableModule,
    InputNumberModule,
    FieldsetModule,
  ],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <div class="text-xl font-semibold">Dashboard &amp; scenarios</div>
        <div class="text-sm text-surface-400 font-semibold">Dashboard snapshot</div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Portfolio rNPV</div>
          <div class="text-2xl font-semibold">{{ formatCurrency(rnpv) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Peak revenue</div>
          <div class="text-2xl font-semibold">{{ formatNumber(peakRevenue) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Avg EBITDA margin</div>
          <div class="text-2xl font-semibold">{{ formatPercent(avgEbitdaMargin) }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Total FCFF after WC</div>
          <div class="text-2xl font-semibold">{{ formatNumber(totalFcffAfterWc) }}</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="h-72 md:h-[22rem]">
          <canvas
            baseChart
            [type]="trendChartType"
            [data]="trendChartData"
            [options]="trendChartOptions"
          ></canvas>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="fcffChartType"
            [data]="fcffChartData"
            [options]="fcffChartOptions"
          ></canvas>
        </div>
      </div>

      <p-fieldset
        legend="Comparable multiples (EV/EBITDA or EV/Sales)"
        [toggleable]="true"
        class="w-full"
      >
        <div class="flex flex-col gap-4">
          <div class="overflow-auto rounded">
            <p-table
              [value]="comparableMultipleRows"
              showGridlines
              [scrollable]="true"
              [size]="'small'"
              class="text-xs"
              [tableStyle]="{ 'min-width': '700px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Peer</th>
                  <th class="text-right">Multiple</th>
                  <th>Metric</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.peer }}</td>
                  <td class="text-right">{{ row.multiple | number: '1.1-1' }}</td>
                  <td>{{ row.metric }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="text-sm font-semibold">
            Implied EV range (using last-year {{ comparableBaseMetricLabel }}
            {{ formatNumber(comparableBaseMetricValue) }}):
            {{ formatNumber(comparableImpliedEvLow) }} -
            {{ formatNumber(comparableImpliedEvHigh) }}
          </div>

          <div class="text-xs text-surface-500">
            Median multiple: {{ comparableMedianMultiple | number: '1.1-1' }}x
          </div>
        </div>
      </p-fieldset>


      <div class="flex flex-col gap-4">
        <div class="text-lg font-semibold">Scenario analysis</div>

        <div class="grid gap-4 lg:grid-cols-2">
          <div class="flex flex-col gap-3">
            <div class="text-sm text-surface-300 font-semibold">Scenario presets</div>
            <div class="flex flex-wrap gap-3">
              <p-button
                label="Base"
                [outlined]="activePreset !== 'base'"
                [size]="'small'"
                (onClick)="applyPreset('base')"
              ></p-button>
              <p-button
                label="Upside"
                [outlined]="activePreset !== 'upside'"
                [size]="'small'"
                (onClick)="applyPreset('upside')"
              ></p-button>
              <p-button
                label="Downside"
                [outlined]="activePreset !== 'downside'"
                [size]="'small'"
                (onClick)="applyPreset('downside')"
              ></p-button>
              <p-button
                label="Trial failure"
                [outlined]="activePreset !== 'trial'"
                [size]="'small'"
                (onClick)="applyPreset('trial')"
              ></p-button>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm text-surface-300 font-semibold">Scenario name</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="scenarioName"
              (ngModelChange)="onScenarioNameChange()"
            />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Revenue multiplier</span>
              <span class="text-red-400">{{ formatRatio(revenueMultiplier) }}</span>
            </div>
            <p-slider
              [(ngModel)]="revenueMultiplier"
              [min]="0.25"
              [max]="2.5"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="scheduleScenarioRefresh()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Cost multiplier</span>
              <span class="text-red-400">{{ formatRatio(costMultiplier) }}</span>
            </div>
            <p-slider
              [(ngModel)]="costMultiplier"
              [min]="0.5"
              [max]="2"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="scheduleScenarioRefresh()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Discount rate shift</span>
              <span class="text-red-400">{{ formatRatio(discountRateShift) }}</span>
            </div>
            <p-slider
              [(ngModel)]="discountRateShift"
              [min]="-0.05"
              [max]="0.1"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="scheduleScenarioRefresh()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Success prob multiplier</span>
              <span class="text-red-400">{{ formatRatio(successProbMultiplier) }}</span>
            </div>
            <p-slider
              [(ngModel)]="successProbMultiplier"
              [min]="0.5"
              [max]="1.5"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="scheduleScenarioRefresh()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Launch delay (years)</span>
              <span class="text-red-400">{{ launchDelayYears }}</span>
            </div>
            <p-slider
              [(ngModel)]="launchDelayYears"
              [min]="0"
              [max]="5"
              [step]="1"
              styleClass="w-full"
              (onChange)="scheduleScenarioRefresh()"
            ></p-slider>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Stage slippage (years)</div>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
                <span>Phase II delay</span>
                <span class="text-red-400">{{ phaseIiDelayYears }}</span>
              </div>
              <p-slider
                [(ngModel)]="phaseIiDelayYears"
                [min]="0"
                [max]="3"
                [step]="1"
                styleClass="w-full"
                (onChange)="scheduleScenarioRefresh()"
              ></p-slider>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
                <span>Phase III delay</span>
                <span class="text-red-400">{{ phaseIiiDelayYears }}</span>
              </div>
              <p-slider
                [(ngModel)]="phaseIiiDelayYears"
                [min]="0"
                [max]="3"
                [step]="1"
                styleClass="w-full"
                (onChange)="scheduleScenarioRefresh()"
              ></p-slider>
            </div>
          </div>
        </div>

        @if (scenarioErrorMessage) {
          <div
            class="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
          >
            {{ scenarioErrorMessage }}
          </div>
        }

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Scenario rNPV</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioRnpv) }}</div>
            <div class="flex items-center gap-2 text-xs">
              <span
                class="rounded-full px-2 py-0.5"
                [ngClass]="getDeltaBadgeClass(scenarioRnpvDelta)"
              >
                {{ formatDelta(scenarioRnpvDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Scenario EBITDA</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioEbitdaTotal) }}</div>
            <div class="flex items-center gap-2 text-xs">
              <span
                class="rounded-full px-2 py-0.5"
                [ngClass]="getDeltaBadgeClass(scenarioEbitdaDelta)"
              >
                {{ formatDelta(scenarioEbitdaDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Revenue delta</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioRevenueTotal) }}</div>
            <div class="flex items-center gap-2 text-xs">
              <span
                class="rounded-full px-2 py-0.5"
                [ngClass]="getDeltaBadgeClass(scenarioRevenueDelta)"
              >
                {{ formatDelta(scenarioRevenueDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">FCFF delta</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioFcffTotal) }}</div>
            <div class="flex items-center gap-2 text-xs">
              <span
                class="rounded-full px-2 py-0.5"
                [ngClass]="getDeltaBadgeClass(scenarioFcffDelta)"
              >
                {{ formatDelta(scenarioFcffDelta) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario deltas by component</div>
          <div class="overflow-auto rounded">
            <p-table
              [value]="scenarioComponentRows"
              showGridlines
              [scrollable]="true"
              [size]="'small'"
              class="text-xs"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th class="w-8">#</th>
                  <th>Component</th>
                  <th class="text-right">Base</th>
                  <th class="text-right">Scenario</th>
                  <th class="text-right">Delta</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td>{{ i }}</td>
                  <td>{{ row.component }}</td>
                  <td class="text-right">{{ formatNumber(row.base) }}</td>
                  <td class="text-right">{{ formatNumber(row.scenario) }}</td>
                  <td
                    class="text-right font-semibold"
                    [ngClass]="row.delta < 0 ? 'text-red-300' : 'text-emerald-300'"
                  >
                    {{ formatDelta(row.delta) }}
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario overlay vs base</div>
          <div>
            <div class="flex items-center justify-between text-xs text-surface-500">
              <span>{{ scenarioOverlayStartYear }}</span>
              <span>{{ scenarioOverlayEndYear }}</span>
            </div>
            <div class="mt-3 h-56">
              <canvas
                baseChart
                [type]="scenarioChartType"
                [data]="scenarioChartData"
                [options]="scenarioChartOptions"
              ></canvas>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario result</div>
          <div class="overflow-auto rounded">
            <p-table
              [value]="scenarioRows"
              showGridlines
              [scrollable]="true"
              [size]="'small'"
              class="text-xs"
              [tableStyle]="{ 'min-width': '980px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th class="w-8">Year</th>
                  <th>scenario</th>
                  <th class="text-right">discount_rate</th>
                  <th class="text-right">rnpv</th>
                  <th class="text-right">ebitda_year</th>
                  <th class="text-right">ebitda_value</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td>{{ i }}</td>
                  <td>{{ row.scenario }}</td>
                  <td class="text-right">{{ row.discountRate }}</td>
                  <td class="text-right">{{ row.rnpv }}</td>
                  <td class="text-right">{{ row.ebitdaYear }}</td>
                  <td class="text-right">{{ row.ebitdaValue }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Multi-scenario comparison</div>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="flex items-center">
              <p-button
                label="Add to comparison"
                [outlined]="true"
                [size]="'small'"
                [disabled]="!scenarioRows.length"
                (onClick)="addToComparison()"
              ></p-button>
            </div>
            <div class="flex items-center md:justify-self-start">
              <p-button
                label="Clear comparison"
                [outlined]="true"
                [size]="'small'"
                [disabled]="!showComparisonTable"
                (onClick)="clearComparison()"
              ></p-button>
            </div>
          </div>
          <div class="text-xs text-surface-500">
            Add scenarios to compare multiple cases side-by-side.
          </div>

          @if (showComparisonTable) {
            <div class="overflow-auto rounded">
              <p-table
                [value]="comparisonRows"
                showGridlines
                [scrollable]="true"
                [size]="'small'"
                class="text-xs"
                [tableStyle]="{ 'min-width': '980px' }"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th class="w-8">Year</th>
                    <th>scenario</th>
                    <th class="text-right">discount_rate</th>
                    <th class="text-right">rnpv</th>
                    <th class="text-right">ebitda_year</th>
                    <th class="text-right">ebitda_value</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row let-i="rowIndex">
                  <tr>
                    <td>{{ i }}</td>
                    <td>{{ row.scenario }}</td>
                    <td class="text-right">{{ row.discountRate }}</td>
                    <td class="text-right">{{ row.rnpv }}</td>
                    <td class="text-right">{{ row.ebitdaYear }}</td>
                    <td class="text-right">{{ row.ebitdaValue }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          }
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario sensitivity extensions</div>
          <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div class="flex flex-col gap-2">
              <label class="text-xs text-surface-400 font-semibold">Target rNPV</label>
              <div class="flex items-center gap-2 rounded py-1">
                <div class="min-w-0 flex-1">
                  <p-inputNumber
                    [(ngModel)]="targetRnpv"
                    mode="decimal"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    [useGrouping]="true"
                    fluid
                  ></p-inputNumber>
                </div>
                <p-button
                  label="-"
                  [text]="true"
                  [size]="'small'"
                  [disabled]="isSolvingGoalSeek"
                  (onClick)="nudgeTarget(-1)"
                ></p-button>
                <p-button
                  label="+"
                  [text]="true"
                  [size]="'small'"
                  [disabled]="isSolvingGoalSeek"
                  (onClick)="nudgeTarget(1)"
                ></p-button>
              </div>
            </div>

            <p-button
              label="Solve revenue multiplier"
              [outlined]="true"
              [loading]="isSolvingGoalSeek"
              [disabled]="targetRnpv <= 0 || isSolvingGoalSeek"
              (onClick)="solveRevenueMultiplier()"
            ></p-button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <p-button
              label="Run scenario diagnostics"
              [outlined]="true"
              [loading]="isRunningDiagnostics"
              [disabled]="isRunningDiagnostics"
              (onClick)="runScenarioDiagnostics()"
            ></p-button>
          </div>

          @if (goalSeekMessage) {
            <div class="text-xs text-surface-400">{{ goalSeekMessage }}</div>
          }
          @if (diagnosticsMessage) {
            <div class="text-xs text-surface-400">{{ diagnosticsMessage }}</div>
          }

          <div class="text-xs text-surface-500">
            Tip: Upload a Prophet-ready dataframe (ds, y) and plug it into ForecastScenarioBridge
            for richer scenarios.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BiotechDashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private isPresetInitialized = false;
  private scenarioRefreshHandle: ReturnType<typeof setTimeout> | null = null;
  private isRefreshingScenario = false;
  private pendingScenarioRefresh = false;
  private baseConsolidatedTable: TablePayload | null = null;
  private scenarioPresetMap: Record<ScenarioPresetKey, ScenarioPresetConfig> =
    this.getDefaultScenarioPresetMap();
  rnpv = 0;
  peakRevenue = 0;
  avgEbitdaMargin = 0;
  totalFcffAfterWc = 0;
  scenarioName = 'Custom scenario';
  activePreset: 'base' | 'upside' | 'downside' | 'trial' = 'base';
  revenueMultiplier = 1;
  costMultiplier = 1;
  discountRateShift = 0;
  successProbMultiplier = 1;
  launchDelayYears = 0;
  phaseIiDelayYears = 0;
  phaseIiiDelayYears = 0;
  scenarioRnpv = 0;
  scenarioEbitdaTotal = 0;
  scenarioRevenueTotal = 0;
  scenarioFcffTotal = 0;
  scenarioRevenueDelta = 0;
  scenarioFcffDelta = 0;
  scenarioRnpvDelta = 0;
  scenarioEbitdaDelta = 0;
  scenarioRows: ScenarioSummaryRow[] = [];
  comparisonRows: ScenarioSummaryRow[] = [];
  scenarioComponentRows: ScenarioComponentDeltaRow[] = [];
  showComparisonTable = false;
  tornadoRows: TornadoRow[] = [];
  targetRnpv = 0;
  goalSeekMessage = '';
  scenarioOverlayStartYear = 0;
  scenarioOverlayEndYear = 0;
  baseYears: number[] = [];
  baseRevenue: number[] = [];
  baseEbitda: number[] = [];
  baseFcff: number[] = [];
  scenarioRevenue: number[] = [];
  scenarioEbitda: number[] = [];
  scenarioFcff: number[] = [];
  baseRevenueTotal = 0;
  baseEbitdaTotal = 0;
  baseFcffTotal = 0;
  baseRdCashBurnTotal = 0;
  baseCapexCashTotal = 0;
  baseWorkingCapitalNeedTotal = 0;
  baseEquityRequiredTotal = 0;
  comparableMultipleRows: ComparableMultipleRow[] = this.getDefaultComparableRows();
  comparableBaseMetricLabel = 'EBITDA';
  comparableBaseMetricValue = 0;
  comparableImpliedEvLow = 0;
  comparableImpliedEvHigh = 0;
  comparableMedianMultiple = 0;
  scenarioErrorMessage = '';
  diagnosticsMessage = '';
  isSolvingGoalSeek = false;
  isRunningDiagnostics = false;

  trendChartType: ChartType = 'line';
  trendChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  trendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          padding: 12,
          generateLabels: (chart) => {
            const labels =
              Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return labels.map((item) => {
              const datasetIndex =
                typeof item.datasetIndex === 'number' ? item.datasetIndex : -1;
              const dataset =
                datasetIndex >= 0 ? chart.data.datasets[datasetIndex] : undefined;
              const legendColor = this.resolveLegendColor(
                dataset?.borderColor,
                dataset?.backgroundColor
              );
              return {
                ...item,
                fillStyle: legendColor,
                strokeStyle: legendColor,
                lineWidth: 2,
                pointStyle: 'circle',
              };
            });
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 0 },
    },
  };

  fcffChartType: ChartType = 'bar';
  fcffChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  fcffChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `FCFF after WC: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  scenarioChartType: ChartType = 'line';
  scenarioChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  scenarioChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          padding: 12,
          generateLabels: (chart) => {
            const labels =
              Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return labels.map((item) => {
              const datasetIndex =
                typeof item.datasetIndex === 'number' ? item.datasetIndex : -1;
              const dataset =
                datasetIndex >= 0 ? chart.data.datasets[datasetIndex] : undefined;
              const legendColor = this.resolveLegendColor(
                dataset?.borderColor,
                dataset?.backgroundColor
              );
              return {
                ...item,
                fillStyle: legendColor,
                strokeStyle: legendColor,
                lineWidth: 2,
                pointStyle: 'circle',
              };
            });
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (v) => formatNumberCompact(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.25, borderWidth: 2 },
      point: { radius: 0 },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.loadScenarioPresets();
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateDashboardFromOutput(output));
  }

  ngOnDestroy(): void {
    if (this.scenarioRefreshHandle) {
      clearTimeout(this.scenarioRefreshHandle);
      this.scenarioRefreshHandle = null;
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDefaultScenarioPresetMap(): Record<ScenarioPresetKey, ScenarioPresetConfig> {
    return {
      base: {
        name: 'Base',
        revenueMultiplier: 1.0,
        costMultiplier: 1.0,
        discountRateShift: 0.0,
        successProbMultiplier: 1.0,
        launchDelayYears: 0,
        stageSlippageYears: {},
      },
      upside: {
        name: 'Upside',
        revenueMultiplier: 1.2,
        costMultiplier: 0.9,
        discountRateShift: -0.01,
        successProbMultiplier: 1.1,
        launchDelayYears: 0,
        stageSlippageYears: {},
      },
      downside: {
        name: 'Downside',
        revenueMultiplier: 0.8,
        costMultiplier: 1.1,
        discountRateShift: 0.01,
        successProbMultiplier: 0.9,
        launchDelayYears: 1,
        stageSlippageYears: {},
      },
      trial: {
        name: 'Trial failure',
        revenueMultiplier: 0.6,
        costMultiplier: 1.3,
        discountRateShift: 0.03,
        successProbMultiplier: 0.75,
        launchDelayYears: 2,
        stageSlippageYears: {},
      },
    };
  }

  private loadScenarioPresets(): void {
    this.biotechModelService
      .getScenarioPresets()
      .pipe(take(1))
      .subscribe({
        next: (presets) => {
          if (!Array.isArray(presets) || !presets.length) {
            return;
          }
          const nextMap = { ...this.scenarioPresetMap };
          for (const preset of presets) {
            const key = this.toPresetKey(preset?.name);
            if (!key) {
              continue;
            }
            nextMap[key] = this.toScenarioPresetConfig(preset);
          }
          this.scenarioPresetMap = nextMap;
        },
        error: () => {
          // Keep local defaults when presets endpoint is unavailable.
        },
      });
  }

  private toPresetKey(name: string | null | undefined): ScenarioPresetKey | null {
    const normalized = String(name ?? '')
      .trim()
      .toLowerCase();
    if (normalized === 'base') return 'base';
    if (normalized === 'upside') return 'upside';
    if (normalized === 'downside') return 'downside';
    if (normalized === 'trial failure' || normalized === 'trial') return 'trial';
    return null;
  }

  private toScenarioPresetConfig(preset: BiotechScenarioPreset): ScenarioPresetConfig {
    const stageSlippage = preset?.stage_slippage_years ?? {};
    return {
      name: String(preset?.name ?? 'Preset'),
      revenueMultiplier: Number(preset?.revenue_multiplier ?? 1),
      costMultiplier: Number(preset?.cost_multiplier ?? 1),
      discountRateShift: Number(preset?.discount_rate_shift ?? 0),
      successProbMultiplier: Number(preset?.success_prob_multiplier ?? 1),
      launchDelayYears: Number(preset?.launch_delay_years ?? 0),
      stageSlippageYears:
        stageSlippage && typeof stageSlippage === 'object'
          ? Object.keys(stageSlippage).reduce((acc, key) => {
              const value = Number((stageSlippage as Record<string, unknown>)[key] ?? 0);
              acc[key] = Number.isFinite(value) ? value : 0;
              return acc;
            }, {} as Record<string, number>)
          : {},
    };
  }

  private updateDashboardFromOutput(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = resolvedOutput?.consolidated ?? {};
    this.baseConsolidatedTable = consolidated as TablePayload;
    const years = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};
    const revenueRaw = this.asNumberArray(data['revenue']);
    const ebitdaRaw = this.asNumberArray(data['ebitda']);
    const fcffAfterWcRaw = this.asNumberArray(data['fcff_after_wc']);
    const fcffFallback = this.asNumberArray(data['fcff']);
    const rdCashRaw = this.pickFirstSeries(data, ['rd_cash', 'rd_spend', 'rd_expense']);
    const capexCashRaw = this.pickFirstSeries(data, ['capex_cash', 'capex']);
    const workingCapitalRaw = this.pickFirstSeries(data, [
      'delta_wc',
      'working_capital_change',
      'working_capital_draw',
    ]);
    const fcffSource = fcffAfterWcRaw.length ? fcffAfterWcRaw : fcffFallback;

    const maxLength = Math.max(
      years.length,
      revenueRaw.length,
      ebitdaRaw.length,
      fcffSource.length,
      rdCashRaw.length,
      capexCashRaw.length,
      workingCapitalRaw.length
    );
    const labels = this.buildChartLabels(years, maxLength);
    const revenue = this.normalizeSeriesLength(revenueRaw, maxLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, maxLength);
    const fcffAfterWc = this.normalizeSeriesLength(fcffSource, maxLength);
    const rdCash = this.normalizeSeriesLength(rdCashRaw, maxLength);
    const capexCash = this.normalizeSeriesLength(capexCashRaw, maxLength);
    const workingCapitalChange = this.normalizeSeriesLength(
      workingCapitalRaw,
      maxLength
    );

    this.rnpv = Number(resolvedOutput?.rnpv ?? 0);
    this.targetRnpv = this.rnpv;
    this.peakRevenue = revenue.reduce((max, value) => Math.max(max, value ?? 0), 0);
    this.totalFcffAfterWc = this.total(fcffAfterWc);
    this.avgEbitdaMargin = this.calculateAverageMargin(revenue, ebitda);
    this.baseYears = labels;
    this.baseRevenue = revenue;
    this.baseEbitda = ebitda;
    this.baseFcff = fcffAfterWc;
    this.baseRevenueTotal = this.total(revenue);
    this.baseEbitdaTotal = this.total(ebitda);
    this.baseFcffTotal = this.total(fcffAfterWc);
    this.baseRdCashBurnTotal = this.sumNegated(rdCash);
    this.baseCapexCashTotal = this.sumNegated(capexCash);
    this.baseWorkingCapitalNeedTotal = this.sumNegativeAsPositive(workingCapitalChange);
    this.baseEquityRequiredTotal = this.computeFundingRequired(
      fcffAfterWc,
      workingCapitalChange
    );
    this.updateComparableMultiples(resolvedOutput, revenue, ebitda);

    this.trendChartData = {
      labels,
      datasets: [
        {
          label: 'revenue',
          data: revenue,
          borderColor: '#f3a4a7',
          backgroundColor: 'rgba(243, 164, 167, 0.6)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'ebitda',
          data: ebitda,
          borderColor: '#9ed4ff',
          backgroundColor: 'rgba(158, 212, 255, 0.55)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'fcff_after_wc',
          data: fcffAfterWc,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.55)',
          fill: true,
          pointRadius: 0,
        },
      ],
    };

    this.fcffChartData = {
      labels,
      datasets: [
        {
          data: fcffAfterWc,
          backgroundColor: '#93c5fd',
          borderRadius: 4,
        },
      ],
    };

    if (!this.isPresetInitialized) {
      this.applyPreset('base');
      this.isPresetInitialized = true;
    } else {
      this.scheduleScenarioRefresh(0);
    }
    this.buildTornadoRows();
  }

  private calculateAverageMargin(revenue: number[], ebitda: number[]): number {
    let revenueTotal = 0;
    let ebitdaTotal = 0;
    revenue.forEach((value, idx) => {
      if ((value ?? 0) <= 0) return;
      revenueTotal += value ?? 0;
      ebitdaTotal += ebitda[idx] ?? 0;
    });
    if (!revenueTotal) return 0;
    return ebitdaTotal / revenueTotal;
  }

  formatCurrency(value: number): string {
    return `${this.formatNumber(value)} USD`;
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatRatio(value: number): string {
    return value.toFixed(2);
  }

  formatDelta(value: number): string {
    if (value === 0) return '+0';
    const sign = value > 0 ? '+' : '-';
    return `${sign}${this.formatNumber(Math.abs(value))}`;
  }

  getDeltaBadgeClass(value: number): Record<string, boolean> {
    return value < 0
      ? { 'bg-red-500/15': true, 'text-red-300': true }
      : { 'bg-emerald-500/15': true, 'text-emerald-300': true };
  }

  formatDeltaValue(value: number): string {
    const sign = value >= 0 ? '+' : '-';
    // return `${sign}${this.formatNumber(Math.abs(value))}`;
    return `${sign}${Math.abs(value)}`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private pickFirstSeries(
    data: Record<string, unknown>,
    keys: string[]
  ): number[] {
    for (const key of keys) {
      const values = this.asNumberArray(data[key]);
      if (values.length) {
        return values;
      }
    }
    return [];
  }

  private sumNegated(values: number[]): number {
    return values.reduce((sum, value) => sum - (value ?? 0), 0);
  }

  private sumNegativeAsPositive(values: number[]): number {
    return values.reduce((sum, value) => sum + Math.max(0, -(value ?? 0)), 0);
  }

  private resolveUsesTotal(): number {
    const input = this.biotechModelService.getInputSnapshot() ?? {};
    const uses = Array.isArray(input?.uses) ? input.uses : [];
    const totalFromRows = uses.reduce((sum: number, row: unknown) => {
      if (!row || typeof row !== 'object') {
        return sum;
      }
      const item = row as Record<string, unknown>;
      const amount = Number(item['Amount'] ?? item['amount'] ?? 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    if (totalFromRows > 0) {
      return totalFromRows;
    }

    const fallback = Number(input?.funding_required ?? 0);
    return Number.isFinite(fallback) ? Math.max(0, fallback) : 0;
  }

  private computeFundingRequired(
    fcffAfterWcSeries: number[],
    deltaWcSeries: number[]
  ): number {
    return (
      this.resolveUsesTotal() +
      this.sumNegativeAsPositive(fcffAfterWcSeries) +
      this.sumNegativeAsPositive(deltaWcSeries)
    );
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private buildChartLabels(years: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (years.length >= requiredLength) {
      return years.slice(0, requiredLength);
    }
    if (years.length > 0) {
      const labels = [...years];
      let nextYear = labels[labels.length - 1] ?? 0;
      while (labels.length < requiredLength) {
        nextYear += 1;
        labels.push(nextYear);
      }
      return labels;
    }
    return Array.from({ length: requiredLength }, (_, index) => index + 1);
  }

  private normalizeSeriesLength(values: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const normalized = [...values];
    while (normalized.length < requiredLength) {
      normalized.push(0);
    }
    return normalized;
  }

  private shiftSeries(values: number[], shiftYears: number): number[] {
    const shift = Math.max(0, Math.floor(shiftYears || 0));
    if (!shift) {
      return [...values];
    }
    const padded = [...Array.from({ length: shift }, () => 0), ...values];
    return padded.slice(0, values.length);
  }

  private resolveLegendColor(primary: unknown, fallback: unknown): string {
    const pickColor = (value: unknown): string | null => {
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
      if (Array.isArray(value) && value.length) {
        const first = value[0];
        if (typeof first === 'string' && first.trim()) {
          return first;
        }
      }
      return null;
    };

    return (
      pickColor(primary) ??
      pickColor(fallback) ??
      '#94a3b8'
    );
  }

  private updateComparableMultiples(
    output: any,
    revenueSeries: number[],
    ebitdaSeries: number[]
  ): void {
    const extractedRows = this.extractComparableRows(output);
    this.comparableMultipleRows = extractedRows.length
      ? extractedRows
      : this.getDefaultComparableRows();

    const metrics = this.comparableMultipleRows.map((row) =>
      String(row.metric ?? '').toUpperCase()
    );
    const useSalesMetric = metrics.length > 0 && metrics.every((metric) => metric.includes('SALES'));
    this.comparableBaseMetricLabel = useSalesMetric ? 'Revenue' : 'EBITDA';

    const sourceSeries = useSalesMetric ? revenueSeries : ebitdaSeries;
    this.comparableBaseMetricValue = this.getLastSeriesValue(sourceSeries);

    const multiples = this.comparableMultipleRows
      .map((row) => Number(row.multiple))
      .filter((value) => Number.isFinite(value));

    if (!multiples.length) {
      this.comparableMedianMultiple = 0;
      this.comparableImpliedEvLow = 0;
      this.comparableImpliedEvHigh = 0;
      return;
    }

    const minMultiple = Math.min(...multiples);
    const maxMultiple = Math.max(...multiples);
    const medianMultiple = this.getMedian(multiples);
    const baseValue = this.comparableBaseMetricValue;

    this.comparableMedianMultiple = medianMultiple;
    this.comparableImpliedEvLow = baseValue * minMultiple;
    this.comparableImpliedEvHigh = baseValue * maxMultiple;
  }

  private extractComparableRows(output: any): ComparableMultipleRow[] {
    const candidates = [
      output?.comparable_multiples,
      output?.comparables,
      output?.valuation?.comparable_multiples,
      output?.valuation?.comparables,
    ];

    for (const candidate of candidates) {
      const rows = this.normalizeComparableRows(candidate);
      if (rows.length) {
        return rows;
      }
    }

    return [];
  }

  private normalizeComparableRows(payload: any): ComparableMultipleRow[] {
    if (!payload) {
      return [];
    }

    if (Array.isArray(payload)) {
      return payload
        .map((row, index) => this.normalizeComparableRow(row, index))
        .filter(
          (row: ComparableMultipleRow | null): row is ComparableMultipleRow =>
            row !== null
        );
    }

    if (payload && typeof payload === 'object') {
      const rowsPayload = Array.isArray(payload?.rows)
        ? payload.rows
        : Array.isArray(payload?.values)
          ? payload.values
          : null;

      if (rowsPayload) {
        return rowsPayload
          .map((row: any, index: number) => this.normalizeComparableRow(row, index))
          .filter(
            (row: ComparableMultipleRow | null): row is ComparableMultipleRow =>
              row !== null
          );
      }

      const tableRows = this.tablePayloadToRows(payload);
      if (tableRows.length) {
        return tableRows
          .map((row, index) => this.normalizeComparableRow(row, index))
          .filter(
            (row: ComparableMultipleRow | null): row is ComparableMultipleRow =>
              row !== null
          );
      }
    }

    return [];
  }

  private normalizeComparableRow(
    row: any,
    index: number
  ): ComparableMultipleRow | null {
    if (!row || typeof row !== 'object') {
      return null;
    }

    const peer = String(
      row?.peer ?? row?.Peer ?? row?.company ?? row?.name ?? `Peer ${index + 1}`
    ).trim();

    const multiple = Number(
      row?.multiple ??
      row?.Multiple ??
      row?.['EV/EBITDA'] ??
      row?.['EV/Sales'] ??
      row?.value
    );

    if (!peer || !Number.isFinite(multiple)) {
      return null;
    }

    const explicitMetric = String(
      row?.metric ?? row?.Metric ?? row?.multiple_type ?? row?.type ?? ''
    ).trim();
    const metric =
      explicitMetric ||
      (row?.['EV/Sales'] !== undefined ? 'EV/Sales' : 'EV/EBITDA');

    return {
      peer,
      multiple,
      metric,
    };
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

  private getMedian(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  private getLastSeriesValue(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    for (let idx = values.length - 1; idx >= 0; idx -= 1) {
      const value = Number(values[idx] ?? 0);
      if (Number.isFinite(value)) {
        return value;
      }
    }
    return 0;
  }

  private getDefaultComparableRows(): ComparableMultipleRow[] {
    return [
      { peer: 'Peer A', multiple: 8, metric: 'EV/EBITDA' },
      { peer: 'Peer B', multiple: 10, metric: 'EV/EBITDA' },
      { peer: 'Peer C', multiple: 12, metric: 'EV/EBITDA' },
    ];
  }

  private sumPerProductSeries(
    perProduct: Record<string, any>,
    key: string,
    length: number
  ): number[] {
    const totals = Array.from({ length }, () => 0);
    Object.values(perProduct).forEach((series: any) => {
      const data = series?.data ?? {};
      const values = this.asNumberArray(data[key]);
      values.forEach((value, idx) => {
        if (idx < totals.length) totals[idx] += value ?? 0;
      });
    });
    return totals;
  }

  private findPeak(values: number[], years: number[]): { year: number; value: number } {
    if (!values.length) return { year: years[0] ?? 0, value: 0 };
    let maxValue = values[0] ?? 0;
    let maxIndex = 0;
    values.forEach((value, idx) => {
      if ((value ?? 0) > maxValue) {
        maxValue = value ?? 0;
        maxIndex = idx;
      }
    });
    return { year: years[maxIndex] ?? 0, value: maxValue };
  }

  private total(values: number[]): number {
    return values.reduce((sum, value) => sum + (value ?? 0), 0);
  }

  private buildTornadoRows(): void {
    const base = this.rnpv;
    const changes = [
      { driver: 'Revenue', change: '-20%', factor: 0.8 },
      { driver: 'Revenue', change: '+20%', factor: 1.2 },
      { driver: 'COGS', change: '-20%', factor: 1.12 },
      { driver: 'COGS', change: '+20%', factor: 0.88 },
      { driver: 'Discount rate', change: '-20%', factor: 1.2 },
      { driver: 'Discount rate', change: '+20%', factor: 0.8 },
      { driver: 'Success probability', change: '-20%', factor: 0.8 },
      { driver: 'Success probability', change: '+20%', factor: 1.2 },
    ];
    this.tornadoRows = changes.map((row) => {
      const rnpv = base * row.factor;
      return {
        driver: row.driver,
        change: row.change,
        rnpv,
        delta: rnpv - base,
      };
    });
  }

  nudgeTarget(direction: number): void {
    const step = Math.max(1, Math.round(this.targetRnpv * 0.01));
    this.targetRnpv = Math.max(0, (this.targetRnpv || 0) + direction * step);
  }

  solveRevenueMultiplier(): void {
    const target = Number(this.targetRnpv ?? 0);
    if (!Number.isFinite(target) || target <= 0 || this.isSolvingGoalSeek) {
      return;
    }
    this.isSolvingGoalSeek = true;
    this.goalSeekMessage = '';
    this.biotechModelService
      .runGoalSeek(target)
      .pipe(
        take(1),
        finalize(() => {
          this.isSolvingGoalSeek = false;
        })
      )
      .subscribe({
        next: (response) => {
          const solvedMultiplier = Number(response?.revenue_multiplier ?? this.revenueMultiplier);
          if (Number.isFinite(solvedMultiplier)) {
            this.revenueMultiplier = Math.min(2.5, Math.max(0.25, solvedMultiplier));
          }
          this.scheduleScenarioRefresh(0);
          const achievedRnpv = Number(response?.achieved_rnpv ?? this.scenarioRnpv);
          this.goalSeekMessage = `Revenue multiplier ${this.formatRatio(
            this.revenueMultiplier
          )} solved in ${Number(response?.iterations ?? 0)} iterations (achieved rNPV ${this.formatNumber(
            achievedRnpv
          )}).`;
        },
        error: (error) => {
          this.goalSeekMessage = this.extractApiErrorMessage(
            error,
            'Unable to solve revenue multiplier.'
          );
        },
      });
  }

  runScenarioDiagnostics(): void {
    if (this.isRunningDiagnostics) {
      return;
    }
    this.isRunningDiagnostics = true;
    this.diagnosticsMessage = '';
    this.biotechModelService
      .runDiagnostics()
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningDiagnostics = false;
        })
      )
      .subscribe({
        next: (response: BiotechDiagnosticsResponse) => {
          const baseRnpv = Number(response?.base_rnpv ?? this.rnpv);
          const tornadoCount = this.countTableRows(response?.tornado);
          const spiderCount = this.countTableRows(response?.spider);
          this.diagnosticsMessage = `Diagnostics complete. Base rNPV ${this.formatNumber(
            baseRnpv
          )}; tornado rows ${tornadoCount}; spider rows ${spiderCount}.`;
        },
        error: (error) => {
          this.diagnosticsMessage = this.extractApiErrorMessage(
            error,
            'Unable to run scenario diagnostics.'
          );
        },
      });
  }

  onScenarioNameChange(): void {
    this.activePreset = 'base';
    this.scheduleScenarioRefresh();
  }

  applyPreset(preset: 'base' | 'upside' | 'downside' | 'trial'): void {
    this.activePreset = preset;
    const config = this.scenarioPresetMap[preset];
    if (!config) {
      return;
    }
    this.scenarioName = config.name;
    this.revenueMultiplier = Number(config.revenueMultiplier ?? 1);
    this.costMultiplier = Number(config.costMultiplier ?? 1);
    this.discountRateShift = Number(config.discountRateShift ?? 0);
    this.successProbMultiplier = Number(config.successProbMultiplier ?? 1);
    this.launchDelayYears = Number(config.launchDelayYears ?? 0);
    this.phaseIiDelayYears = Number(config.stageSlippageYears?.['Phase II'] ?? 0);
    this.phaseIiiDelayYears = Number(config.stageSlippageYears?.['Phase III'] ?? 0);
    this.scheduleScenarioRefresh(0);
  }

  recalculateScenario(): void {
    this.scheduleScenarioRefresh(0);
  }

  scheduleScenarioRefresh(delayMs = 250): void {
    if (this.scenarioRefreshHandle) {
      clearTimeout(this.scenarioRefreshHandle);
      this.scenarioRefreshHandle = null;
    }
    this.scenarioRefreshHandle = setTimeout(() => {
      this.scenarioRefreshHandle = null;
      this.refreshScenarioFromBackend();
    }, Math.max(0, delayMs));
  }

  private refreshScenarioFromBackend(): void {
    if (!this.baseConsolidatedTable) {
      return;
    }
    if (this.isRefreshingScenario) {
      this.pendingScenarioRefresh = true;
      return;
    }

    const payload = this.buildScenarioPayload();
    this.isRefreshingScenario = true;
    this.scenarioErrorMessage = '';

    forkJoin({
      whatIf: this.biotechModelService.runWhatIf(this.buildWhatIfShockPayload(payload)),
      scenarios: this.biotechModelService.runScenarioAnalysis([payload], 0).pipe(
        catchError((error) => {
          this.scenarioErrorMessage = this.extractApiErrorMessage(
            error,
            'Scenario summary unavailable, but what-if metrics are updated.'
          );
          return of(null);
        })
      ),
    })
      .pipe(
        take(1),
        finalize(() => {
          this.isRefreshingScenario = false;
          if (this.pendingScenarioRefresh) {
            this.pendingScenarioRefresh = false;
            this.scheduleScenarioRefresh(0);
          }
        })
      )
      .subscribe({
        next: ({ whatIf, scenarios }) => {
          this.applyScenarioResult(payload, whatIf, scenarios);
        },
        error: (error) => {
          this.scenarioErrorMessage = this.extractApiErrorMessage(
            error,
            'Unable to compute dynamic scenario analysis.'
          );
        },
      });
  }

  private buildScenarioPayload(): BiotechScenarioPayload {
    return {
      name: String(this.scenarioName || 'Custom scenario'),
      revenue_multiplier: Number(this.revenueMultiplier ?? 1),
      cost_multiplier: Number(this.costMultiplier ?? 1),
      discount_rate_shift: Number(this.discountRateShift ?? 0),
      success_prob_multiplier: Number(this.successProbMultiplier ?? 1),
      launch_delay_years: Math.max(0, Math.round(Number(this.launchDelayYears ?? 0))),
      stage_slippage_years: {
        'Phase II': Math.max(0, Math.round(Number(this.phaseIiDelayYears ?? 0))),
        'Phase III': Math.max(0, Math.round(Number(this.phaseIiiDelayYears ?? 0))),
      },
    };
  }

  private buildWhatIfShockPayload(
    payload: BiotechScenarioPayload
  ): BiotechWhatIfShockPayload {
    return {
      revenue_multiplier: payload.revenue_multiplier,
      cost_multiplier: payload.cost_multiplier,
      discount_shift: payload.discount_rate_shift,
      success_prob_multiplier: payload.success_prob_multiplier,
      launch_delay_years: payload.launch_delay_years,
      stage_slippage_years: payload.stage_slippage_years,
    };
  }

  private applyScenarioResult(
    payload: BiotechScenarioPayload,
    whatIfResponse: any,
    scenarioTable: TablePayload | null
  ): void {
    const baseData = this.tableData(this.baseConsolidatedTable);
    const scenarioConsolidated = whatIfResponse?.consolidated as TablePayload | null;
    const scenarioData = this.tableData(scenarioConsolidated);

    const scenarioYears = this.asNumberArray(scenarioConsolidated?.index);
    const scenarioRevenueRaw = this.pickFirstSeries(scenarioData, ['revenue']);
    const scenarioEbitdaRaw = this.pickFirstSeries(scenarioData, ['ebitda']);
    const scenarioFcffRaw = this.pickFirstSeries(scenarioData, ['fcff_after_wc', 'fcff']);

    const requiredLength = Math.max(
      this.baseYears.length,
      scenarioYears.length,
      scenarioRevenueRaw.length,
      scenarioEbitdaRaw.length,
      scenarioFcffRaw.length
    );
    const labels = this.baseYears.length
      ? this.buildChartLabels(this.baseYears, requiredLength)
      : this.buildChartLabels(scenarioYears, requiredLength);

    const baseRevenueSeries = this.normalizeSeriesLength(this.baseRevenue, requiredLength);
    const baseEbitdaSeries = this.normalizeSeriesLength(this.baseEbitda, requiredLength);
    const baseFcffSeries = this.normalizeSeriesLength(this.baseFcff, requiredLength);
    this.scenarioRevenue = this.normalizeSeriesLength(scenarioRevenueRaw, requiredLength);
    this.scenarioEbitda = this.normalizeSeriesLength(scenarioEbitdaRaw, requiredLength);
    this.scenarioFcff = this.normalizeSeriesLength(scenarioFcffRaw, requiredLength);

    const scenarioRevenueTotal = this.total(this.scenarioRevenue);
    const scenarioEbitdaTotal = this.total(this.scenarioEbitda);
    const scenarioFcffTotal = this.total(this.scenarioFcff);

    const baseRdCash = this.sumNegated(this.pickFirstSeries(baseData, ['rd_cash']));
    const scenarioRdCash = this.sumNegated(this.pickFirstSeries(scenarioData, ['rd_cash']));
    const baseCapexCash = this.sumNegated(this.pickFirstSeries(baseData, ['capex_cash', 'capex']));
    const scenarioCapexCash = this.sumNegated(
      this.pickFirstSeries(scenarioData, ['capex_cash', 'capex'])
    );
    const baseFcffForFunding = this.pickFirstSeries(baseData, ['fcff_after_wc', 'fcff']);
    const scenarioFcffForFunding = this.pickFirstSeries(scenarioData, ['fcff_after_wc', 'fcff']);
    const baseDeltaWc = this.pickFirstSeries(baseData, ['delta_wc']);
    const scenarioDeltaWc = this.pickFirstSeries(scenarioData, ['delta_wc']);
    const baseEquityRequired = this.computeFundingRequired(baseFcffForFunding, baseDeltaWc);
    const scenarioEquityRequired = this.computeFundingRequired(
      scenarioFcffForFunding,
      scenarioDeltaWc
    );

    this.baseRdCashBurnTotal = baseRdCash;
    this.baseCapexCashTotal = baseCapexCash;
    this.baseEquityRequiredTotal = baseEquityRequired;

    this.scenarioRnpv = Number(whatIfResponse?.rnpv ?? 0);
    this.scenarioRevenueTotal = scenarioRevenueTotal;
    this.scenarioEbitdaTotal = scenarioEbitdaTotal;
    this.scenarioFcffTotal = scenarioFcffTotal;
    this.scenarioRevenueDelta = scenarioRevenueTotal - this.baseRevenueTotal;
    this.scenarioFcffDelta = scenarioFcffTotal - this.baseFcffTotal;
    this.scenarioRnpvDelta = this.scenarioRnpv - this.rnpv;
    this.scenarioEbitdaDelta = scenarioEbitdaTotal - this.baseEbitdaTotal;

    this.scenarioComponentRows = [
      {
        component: 'Revenue',
        base: this.baseRevenueTotal,
        scenario: scenarioRevenueTotal,
        delta: scenarioRevenueTotal - this.baseRevenueTotal,
      },
      {
        component: 'R&D cash burn',
        base: baseRdCash,
        scenario: scenarioRdCash,
        delta: scenarioRdCash - baseRdCash,
      },
      {
        component: 'CAPEX cash',
        base: baseCapexCash,
        scenario: scenarioCapexCash,
        delta: scenarioCapexCash - baseCapexCash,
      },
      {
        component: 'Equity required (uses + burn + WC)',
        base: baseEquityRequired,
        scenario: scenarioEquityRequired,
        delta: scenarioEquityRequired - baseEquityRequired,
      },
    ];

    this.scenarioOverlayStartYear = labels[0] ?? 0;
    this.scenarioOverlayEndYear = labels[labels.length - 1] ?? 0;
    this.scenarioChartData = {
      labels,
      datasets: [
        {
          label: 'Base EBITDA',
          data: baseEbitdaSeries,
          borderColor: '#7dd3fc',
          backgroundColor: 'transparent',
        },
        {
          label: 'Base FCFF',
          data: baseFcffSeries,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
        },
        {
          label: 'Base revenue',
          data: baseRevenueSeries,
          borderColor: '#f3a4a7',
          backgroundColor: 'transparent',
        },
        {
          label: 'Scenario EBITDA',
          data: this.scenarioEbitda,
          borderColor: '#f87171',
          backgroundColor: 'transparent',
          borderDash: [6, 4],
        },
        {
          label: 'Scenario FCFF',
          data: this.scenarioFcff,
          borderColor: '#34d399',
          backgroundColor: 'transparent',
          borderDash: [6, 4],
        },
        {
          label: 'Scenario revenue',
          data: this.scenarioRevenue,
          borderColor: '#2dd4bf',
          backgroundColor: 'transparent',
          borderDash: [6, 4],
        },
      ],
    };

    const parsedScenarioRows = scenarioTable ? this.parseScenarioEngineRows(scenarioTable) : [];
    const selectedScenario = parsedScenarioRows.find(
      (row) =>
        this.normalizeScenarioName(row.scenario) ===
        this.normalizeScenarioName(payload.name)
    );
    const baseScenarioFromApi = parsedScenarioRows.find(
      (row) => this.normalizeScenarioName(row.scenario) === 'base'
    );
    const baseFallback = this.findPeak(baseEbitdaSeries, labels);
    const scenarioFallback = this.findPeak(this.scenarioEbitda, labels);
    const baseDiscountRate = this.resolveBaseDiscountRate();
    const scenarioEngineRow: ScenarioEngineRow =
      selectedScenario ?? {
        scenario: payload.name,
        discountRate: baseDiscountRate + Number(payload.discount_rate_shift ?? 0),
        rnpv: this.scenarioRnpv,
        ebitdaYear: scenarioFallback.year,
        ebitdaValue: scenarioFallback.value,
      };
    const baseEngineRow: ScenarioEngineRow =
      baseScenarioFromApi ?? {
        scenario: 'Base',
        discountRate: baseDiscountRate,
        rnpv: this.rnpv,
        ebitdaYear: baseFallback.year,
        ebitdaValue: baseFallback.value,
      };

    this.scenarioRows = [
      this.toScenarioSummaryRow(baseEngineRow),
      this.toScenarioSummaryRow(scenarioEngineRow),
    ];
    if (this.showComparisonTable) {
      this.comparisonRows = [...this.scenarioRows];
    }
  }

  private tableData(payload: TablePayload | null | undefined): Record<string, unknown> {
    const data = payload?.data;
    if (!data || typeof data !== 'object') {
      return {};
    }
    return data as Record<string, unknown>;
  }

  private countTableRows(payload: TablePayload | null | undefined): number {
    if (!payload) {
      return 0;
    }
    if (Array.isArray(payload.index)) {
      return payload.index.length;
    }
    const data = payload.data;
    if (!data || typeof data !== 'object') {
      return 0;
    }
    const firstColumn = Object.values(data)[0];
    return Array.isArray(firstColumn) ? firstColumn.length : 0;
  }

  private resolveBaseDiscountRate(): number {
    const input = this.biotechModelService.getInputSnapshot() ?? {};
    const discountRate = Number(input?.model_config?.discount_rate ?? 0.1);
    return Number.isFinite(discountRate) ? discountRate : 0.1;
  }

  private parseScenarioEngineRows(payload: TablePayload): ScenarioEngineRow[] {
    return this.tablePayloadToRows(payload)
      .map((entry) => ({
        scenario: String(entry['scenario'] ?? entry['Scenario'] ?? '').trim(),
        discountRate: Number(
          entry['discount_rate'] ?? entry['discountRate'] ?? this.resolveBaseDiscountRate()
        ),
        rnpv: Number(entry['rnpv'] ?? entry['rNPV'] ?? 0),
        ebitdaYear: Number(entry['ebitda_year'] ?? entry['ebitdaYear'] ?? 0),
        ebitdaValue: Number(entry['ebitda_value'] ?? entry['ebitdaValue'] ?? 0),
      }))
      .filter((row) => Boolean(row.scenario));
  }

  private extractApiErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const err = error as { message?: unknown; error?: unknown };
      if (err.error && typeof err.error === 'object') {
        const body = err.error as { detail?: unknown; message?: unknown };
        if (typeof body.detail === 'string' && body.detail.trim()) {
          return body.detail;
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return body.message;
        }
      }
      if (typeof err.message === 'string' && err.message.trim()) {
        return err.message;
      }
    }
    return fallback;
  }

  private toScenarioSummaryRow(row: ScenarioEngineRow): ScenarioSummaryRow {
    return {
      scenario: row.scenario,
      discountRate: Number(row.discountRate ?? 0).toFixed(6),
      rnpv: this.formatNumber(Number(row.rnpv ?? 0)),
      ebitdaYear: Number(row.ebitdaYear ?? 0),
      ebitdaValue: this.formatNumber(Number(row.ebitdaValue ?? 0)),
    };
  }

  private normalizeScenarioName(value: string): string {
    return String(value ?? '')
      .trim()
      .toLowerCase();
  }

  addToComparison(): void {
    this.comparisonRows = [...this.scenarioRows];
    this.showComparisonTable = true;
  }

  clearComparison(): void {
    this.showComparisonTable = false;
    this.comparisonRows = [];
  }

}

