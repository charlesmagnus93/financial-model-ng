import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { BiotechModelService } from '../../services/biotech-model.service';

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

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Scenario rNPV</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioRnpv) }}</div>
            <div class="flex items-center gap-2 text-xs text-emerald-300">
              <span class="rounded-full bg-emerald-500/15 px-2 py-0.5">
                {{ formatDelta(scenarioRnpvDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Scenario EBITDA</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioEbitdaTotal) }}</div>
            <div class="flex items-center gap-2 text-xs text-emerald-300">
              <span class="rounded-full bg-emerald-500/15 px-2 py-0.5">
                {{ formatDelta(scenarioEbitdaDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">Revenue delta</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioRevenueDelta) }}</div>
            <div class="flex items-center gap-2 text-xs text-emerald-300">
              <span class="rounded-full bg-emerald-500/15 px-2 py-0.5">
                {{ formatDelta(scenarioRevenueDelta) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400 font-semibold">FCFF delta</div>
            <div class="text-2xl font-semibold">{{ formatNumber(scenarioFcffDelta) }}</div>
            <div class="flex items-center gap-2 text-xs text-emerald-300">
              <span class="rounded-full bg-emerald-500/15 px-2 py-0.5">
                {{ formatDelta(scenarioFcffDelta) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
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
        </div>
      </div>


      <div class="flex flex-col gap-4">
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
            <!-- <div class="flex items-center gap-2">
              <p-button label="-" [outlined]="true" [size]="'small'" (onClick)="nudgeTarget(-1)"></p-button>
              <p-button label="+" [outlined]="true" [size]="'small'" (onClick)="nudgeTarget(1)"></p-button>
            </div> -->
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
      </div>
    </div>
  `,
})
export class BiotechDashboardComponent implements OnInit {
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

  trendChartType: ChartType = 'line';
  trendChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  trendChartOptions: ChartConfiguration['options'] = {
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
          callback: (v) => this.formatNumber(Number(v)),
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
          callback: (v) => this.formatNumber(Number(v)),
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
          callback: (v) => this.formatNumber(Number(v)),
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
    const output = this.biotechModelService.getOutputSnapshot();
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const revenue = this.asNumberArray(data['revenue']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const fcffAfterWc = this.asNumberArray(data['fcff_after_wc']);

    this.rnpv = Number(output?.rnpv ?? 0);
    this.targetRnpv = this.rnpv;
    this.peakRevenue = revenue.reduce((max, value) => Math.max(max, value ?? 0), 0);
    this.totalFcffAfterWc = this.total(fcffAfterWc);
    this.avgEbitdaMargin = this.calculateAverageMargin(revenue, ebitda);
    this.baseYears = years;
    this.baseRevenue = revenue;
    this.baseEbitda = ebitda;
    this.baseFcff = fcffAfterWc;
    this.baseRevenueTotal = this.total(revenue);
    this.baseEbitdaTotal = this.total(ebitda);
    this.baseFcffTotal = this.total(fcffAfterWc);

    this.trendChartData = {
      labels: years,
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
      labels: years,
      datasets: [
        {
          data: fcffAfterWc,
          backgroundColor: '#93c5fd',
          borderRadius: 4,
        },
      ],
    };
    this.applyPreset('base');
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

  formatDeltaValue(value: number): string {
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${this.formatNumber(Math.abs(value))}`;
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
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
    } else if (preset === 'upside') {
      this.scenarioName = 'Upside';
      this.revenueMultiplier = 1.2;
      this.costMultiplier = 0.95;
      this.discountRateShift = -0.02;
      this.successProbMultiplier = 1.1;
    } else if (preset === 'downside') {
      this.scenarioName = 'Downside';
      this.revenueMultiplier = 0.85;
      this.costMultiplier = 1.1;
      this.discountRateShift = 0.03;
      this.successProbMultiplier = 0.85;
    } else {
      this.scenarioName = 'Trial failure';
      this.revenueMultiplier = 0.3;
      this.costMultiplier = 1.3;
      this.discountRateShift = 0.05;
      this.successProbMultiplier = 0.4;
    }
    this.recalculateScenario();
  }

  recalculateScenario(): void {
    if (!this.baseYears.length) return;
    const revenueFactor = this.revenueMultiplier;
    const costFactor = this.costMultiplier || 1;
    const profitFactor = revenueFactor / costFactor;
    const discountFactor = Math.max(0.5, 1 - this.discountRateShift);

    this.scenarioRevenue = this.baseRevenue.map((value) => value * revenueFactor);
    this.scenarioEbitda = this.baseEbitda.map((value) => value * profitFactor);
    this.scenarioFcff = this.baseFcff.map((value) => value * profitFactor);

    const scenarioRevenueTotal = this.total(this.scenarioRevenue);
    const scenarioEbitdaTotal = this.total(this.scenarioEbitda);
    const scenarioFcffTotal = this.total(this.scenarioFcff);

    this.scenarioRnpv =
      this.rnpv * revenueFactor * this.successProbMultiplier * discountFactor;
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
