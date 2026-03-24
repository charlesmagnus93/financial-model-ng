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
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';
import { Subject, takeUntil } from 'rxjs';

interface ComparableMultipleRow {
  peer: string;
  multiple: number;
  metric: string;
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
              [min]="0"
              [max]="2"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="recalculateScenario()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Cost multiplier</span>
              <span class="text-red-400">{{ formatRatio(costMultiplier) }}</span>
            </div>
            <p-slider
              [(ngModel)]="costMultiplier"
              [min]="0"
              [max]="2"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="recalculateScenario()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Discount rate shift</span>
              <span class="text-red-400">{{ formatRatio(discountRateShift) }}</span>
            </div>
            <p-slider
              [(ngModel)]="discountRateShift"
              [min]="-0.1"
              [max]="0.1"
              [step]="0.001"
              styleClass="w-full"
              (onChange)="recalculateScenario()"
            ></p-slider>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-surface-400 font-semibold">
              <span>Success prob multiplier</span>
              <span class="text-red-400">{{ formatRatio(successProbMultiplier) }}</span>
            </div>
            <p-slider
              [(ngModel)]="successProbMultiplier"
              [min]="0"
              [max]="2"
              [step]="0.01"
              styleClass="w-full"
              (onChange)="recalculateScenario()"
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
              [max]="10"
              [step]="1"
              styleClass="w-full"
              (onChange)="recalculateScenario()"
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
                (onChange)="recalculateScenario()"
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
                (onChange)="recalculateScenario()"
              ></p-slider>
            </div>
          </div>
        </div>

        <!-- <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioRevenueDelta) }}</div>
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
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioFcffDelta) }}</div>
            <div class="flex items-center gap-2 text-xs">
              <span
                class="rounded-full px-2 py-0.5"
                [ngClass]="getDeltaBadgeClass(scenarioFcffDelta)"
              >
                {{ formatDelta(scenarioFcffDelta) }}
              </span>
            </div>
          </div>
        </div> -->

        <!-- <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario overlay vs base</div>
          <div class="">
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
            <div class="mt-4 flex flex-wrap gap-4 text-xs text-surface-400">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-sky-400"></span>
                <span>Base EBITDA</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-blue-400"></span>
                <span>Base FCFF</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-pink-400"></span>
                <span>Base revenue</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-red-400"></span>
                <span>Scenario EBITDA</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Scenario FCFF</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-teal-400"></span>
                <span>Scenario revenue</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm text-surface-300 font-semibold">Scenario result</div>
          <div class="overflow-auto rounded">
            <p-table
              showGridlines
              [value]="scenarioRows"
              [scrollable]="true"
              scrollHeight="240px"
              [size]="'small'"
              class="text-xs"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>scenario</th>
                  <th class="text-right">discount_rate</th>
                  <th class="text-right">rnpv</th>
                  <th class="text-right">ebitda_year</th>
                  <th class="text-right">ebitda_value</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
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
          <div class="flex justify-between flex-wrap items-center gap-3">
            <p-button
              label="Add to comparison"
              [outlined]="true"
              [size]="'small'"
              (onClick)="addToComparison()"
            ></p-button>
            <p-button
              label="Clear comparison"
              [outlined]="true"
              [size]="'small'"
              (onClick)="clearComparison()"
            ></p-button>
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
                scrollHeight="220px"
                [size]="'small'"
                class="text-xs"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th class="w-8">#</th>
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
        </div> -->
      </div>


      <!-- <div class="flex flex-col gap-4">
        <div class="text-lg font-semibold">Tornado sensitivity (interactive)</div>

        <div class="overflow-auto rounded">
          <p-table
            [value]="tornadoRows"
            [scrollable]="true"
            showGridlines
            scrollHeight="260px"
            [size]="'small'"
            class="text-xs"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="w-8">#</th>
                <th>Driver</th>
                <th>Change</th>
                <th class="text-right">rNPV</th>
                <th class="text-right">Delta</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td>{{ row.driver }}</td>
                <td>{{ row.change }}</td>
                <td class="text-right">{{ formatNumber(row.rnpv) }}</td>
                <td class="text-right">{{ formatDeltaValue(row.delta) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-300 font-semibold">Goal seek (scenario)</div>
          <label class="text-xs text-surface-400 font-semibold">Target rNPV</label>
          <div class="flex items-center gap-3">
            <p-inputnumber
              [(ngModel)]="targetRnpv"
              [useGrouping]="true"
              [showButtons]="true"
              step="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
              styleClass="flex-1"
            ></p-inputnumber>
          </div>
          <p-button
            label="Solve revenue multiplier"
            [outlined]="true"
            [size]="'small'"
            class="self-start"
            (onClick)="solveRevenueMultiplier()"
          ></p-button>
            @if (goalSeekMessage) {
              <div class="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-green-500">
                {{ goalSeekMessage }}
              </div>
            }
          <div class="text-xs text-surface-500">
            Tip: Upload a Prophet-ready dataframe (ds, y) and plug it into ForecastScenarioBridge for richer scenarios.
          </div>
        </div>
      </div> -->
    </div>
  `,
})
export class BiotechDashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private isPresetInitialized = false;
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
  scenarioRevenueDelta = 0;
  scenarioFcffDelta = 0;
  scenarioRnpvDelta = 0;
  scenarioEbitdaDelta = 0;
  scenarioRows: Array<{
    scenario: string;
    discountRate: string;
    rnpv: string;
    ebitdaYear: number;
    ebitdaValue: string;
  }> = [];
  comparisonRows: Array<{
    scenario: string;
    discountRate: string;
    rnpv: string;
    ebitdaYear: number;
    ebitdaValue: string;
  }> = [];
  showComparisonTable = false;
  tornadoRows: Array<{ driver: string; change: string; rnpv: number; delta: number }> = [];
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
  comparableMultipleRows: ComparableMultipleRow[] = this.getDefaultComparableRows();
  comparableBaseMetricLabel = 'EBITDA';
  comparableBaseMetricValue = 0;
  comparableImpliedEvLow = 0;
  comparableImpliedEvHigh = 0;
  comparableMedianMultiple = 0;

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
        labels: { color: '#cbd5e1', usePointStyle: true, padding: 12 },
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
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateDashboardFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDashboardFromOutput(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = resolvedOutput?.consolidated ?? {};
    const years = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};
    const revenueRaw = this.asNumberArray(data['revenue']);
    const ebitdaRaw = this.asNumberArray(data['ebitda']);
    const fcffAfterWcRaw = this.asNumberArray(data['fcff_after_wc']);
    const fcffFallback = this.asNumberArray(data['fcff']);
    const fcffSource = fcffAfterWcRaw.length ? fcffAfterWcRaw : fcffFallback;

    const maxLength = Math.max(
      years.length,
      revenueRaw.length,
      ebitdaRaw.length,
      fcffSource.length
    );
    const labels = this.buildChartLabels(years, maxLength);
    const revenue = this.normalizeSeriesLength(revenueRaw, maxLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, maxLength);
    const fcffAfterWc = this.normalizeSeriesLength(fcffSource, maxLength);

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
      this.recalculateScenario();
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
    if (!this.baseRevenueTotal) return;
    const base = this.rnpv || 1;
    const ratio = this.targetRnpv / base;
    this.revenueMultiplier = Math.max(0, Math.min(2, ratio));
    this.recalculateScenario();
    this.goalSeekMessage = `Revenue multiplier ${this.formatRatio(
      this.revenueMultiplier
    )} approximates the goal (achieved rNPV ${this.formatNumber(this.scenarioRnpv)}).`;
  }

  onScenarioNameChange(): void {
    this.activePreset = 'base';
    this.recalculateScenario();
  }

  applyPreset(preset: 'base' | 'upside' | 'downside' | 'trial'): void {
    this.activePreset = preset;
    if (preset === 'base') {
      this.scenarioName = 'Base';
      this.revenueMultiplier = 1;
      this.costMultiplier = 1;
      this.discountRateShift = 0;
      this.successProbMultiplier = 1;
      this.launchDelayYears = 0;
      this.phaseIiDelayYears = 0;
      this.phaseIiiDelayYears = 0;
    } else if (preset === 'upside') {
      this.scenarioName = 'Upside';
      this.revenueMultiplier = 1.2;
      this.costMultiplier = 0.95;
      this.discountRateShift = -0.02;
      this.successProbMultiplier = 1.1;
      this.launchDelayYears = 0;
      this.phaseIiDelayYears = 0;
      this.phaseIiiDelayYears = 0;
    } else if (preset === 'downside') {
      this.scenarioName = 'Downside';
      this.revenueMultiplier = 0.85;
      this.costMultiplier = 1.1;
      this.discountRateShift = 0.03;
      this.successProbMultiplier = 0.85;
      this.launchDelayYears = 1;
      this.phaseIiDelayYears = 1;
      this.phaseIiiDelayYears = 1;
    } else {
      this.scenarioName = 'Trial failure';
      this.revenueMultiplier = 0.3;
      this.costMultiplier = 1.3;
      this.discountRateShift = 0.05;
      this.successProbMultiplier = 0.4;
      this.launchDelayYears = 2;
      this.phaseIiDelayYears = 2;
      this.phaseIiiDelayYears = 3;
    }
    this.recalculateScenario();
  }

  recalculateScenario(): void {
    if (!this.baseYears.length) return;
    const revenueFactor = this.revenueMultiplier;
    const costFactor = this.costMultiplier || 1;
    const profitFactor = revenueFactor / costFactor;
    const discountFactor = Math.max(0.5, 1 - this.discountRateShift);
    const launchDelay = Math.max(0, Math.round(this.launchDelayYears || 0));
    const phaseIiDelay = Math.max(0, Math.round(this.phaseIiDelayYears || 0));
    const phaseIiiDelay = Math.max(0, Math.round(this.phaseIiiDelayYears || 0));
    const totalDelayYears = launchDelay + phaseIiDelay + phaseIiiDelay;
    const launchPenalty = Math.max(0.25, 1 - launchDelay * 0.03);
    const stageSlippagePenalty = Math.max(0.25, 1 - (phaseIiDelay + phaseIiiDelay) * 0.05);
    const scenarioScale = launchPenalty * stageSlippagePenalty;

    const delayedRevenue = this.shiftSeries(this.baseRevenue, totalDelayYears);
    const delayedEbitda = this.shiftSeries(this.baseEbitda, totalDelayYears);
    const delayedFcff = this.shiftSeries(this.baseFcff, totalDelayYears);

    this.scenarioRevenue = delayedRevenue.map(
      (value) => value * revenueFactor * stageSlippagePenalty
    );
    this.scenarioEbitda = delayedEbitda.map(
      (value) => value * profitFactor * scenarioScale
    );
    this.scenarioFcff = delayedFcff.map(
      (value) => value * profitFactor * scenarioScale
    );

    const scenarioRevenueTotal = this.total(this.scenarioRevenue);
    const scenarioEbitdaTotal = this.total(this.scenarioEbitda);
    const scenarioFcffTotal = this.total(this.scenarioFcff);

    const delayDiscount = Math.pow(
      1 + Math.max(0, 0.1 + this.discountRateShift),
      totalDelayYears
    );
    this.scenarioRnpv =
      (this.rnpv *
        revenueFactor *
        this.successProbMultiplier *
        discountFactor *
        scenarioScale) /
      Math.max(1, delayDiscount);
    this.scenarioEbitdaTotal = scenarioEbitdaTotal;
    this.scenarioRevenueDelta = scenarioRevenueTotal - this.baseRevenueTotal;
    this.scenarioFcffDelta = scenarioFcffTotal - this.baseFcffTotal;
    this.scenarioRnpvDelta = this.scenarioRnpv - this.rnpv;
    this.scenarioEbitdaDelta = scenarioEbitdaTotal - this.baseEbitdaTotal;

    this.scenarioOverlayStartYear = this.baseYears[0] ?? 0;
    this.scenarioOverlayEndYear =
      this.baseYears[this.baseYears.length - 1] ?? 0;
    this.scenarioChartData = {
      labels: this.baseYears,
      datasets: [
        {
          label: 'Base EBITDA',
          data: this.baseEbitda,
          borderColor: '#7dd3fc',
          backgroundColor: 'transparent',
        },
        {
          label: 'Base FCFF',
          data: this.baseFcff,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
        },
        {
          label: 'Base revenue',
          data: this.baseRevenue,
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

    const baseEbitdaPeak = this.findPeak(this.baseEbitda, this.baseYears);
    const scenarioEbitdaPeak = this.findPeak(this.scenarioEbitda, this.baseYears);
    this.scenarioRows = [
      {
        scenario: 'Base',
        discountRate: this.formatRatio(0.1),
        rnpv: this.formatNumber(this.rnpv),
        ebitdaYear: baseEbitdaPeak.year,
        ebitdaValue: this.formatNumber(baseEbitdaPeak.value),
      },
      {
        scenario: this.scenarioName,
        discountRate: this.formatRatio(0.1 + this.discountRateShift),
        rnpv: this.formatNumber(this.scenarioRnpv),
        ebitdaYear: scenarioEbitdaPeak.year,
        ebitdaValue: this.formatNumber(scenarioEbitdaPeak.value),
      },
    ];
    if (this.showComparisonTable) {
      this.comparisonRows = [...this.scenarioRows];
    }
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
