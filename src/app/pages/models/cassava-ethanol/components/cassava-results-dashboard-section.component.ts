import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  CassavaBundleResponse,
  CassavaModelService,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  metricsToRows,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface DashboardTableSection {
  key: string;
  label: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  minWidth: string;
  scrollHeight: string;
}

@Component({
  selector: 'app-cassava-results-dashboard-section',
  standalone: true,
  imports: [CommonModule, FieldsetModule, TableModule, NgChartsModule],
  template: `
    @if (!bundle) {
      <div class="rounded border border-surface-200 px-4 py-5 text-sm text-surface-500">
        Run the cassava model to display dashboard results.
      </div>
    } @else {
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">Scenario: {{ scenarioLabel }}</h2>

        <div class="card">
          <div class="text-lg font-semibold mb-3">Key Metrics</div>
          @if (metricRows.length && metricColumns.length) {
            <p-table
              [value]="metricRows"
              showGridlines
              responsiveLayout="scroll"
              [scrollable]="true"
              scrollHeight="320px"
              [size]="'small'"
              class="text-sm"
              [tableStyle]="{ 'min-width': '36rem' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  @for (column of metricColumns; track column) {
                    <th>{{ column }}</th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of metricColumns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="column === 'Value'">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-sm text-surface-500">No key metrics returned.</div>
          }

          <div class="text-lg font-semibold mb-3 mt-10">Annual Revenue</div>
          @if (revenueChartData.datasets.length) {
            <div class="h-96">
              <canvas
                baseChart
                [type]="revenueChartType"
                [data]="revenueChartData"
                [options]="revenueChartOptions"
                class="w-full h-full"
              ></canvas>
            </div>
          } @else {
            <div class="text-sm text-surface-500">
              No annual revenue series available.
            </div>
          }
        </div>


        @for (section of tableSections; track section.key) {
          <p-fieldset [legend]="section.label" [toggleable]="true" class="w-full">
            @if (section.rows.length && section.columns.length) {
              <p-table
                [value]="section.rows"
                showGridlines
                responsiveLayout="scroll"
                [scrollable]="true"
                [scrollHeight]="section.scrollHeight"
                [size]="'small'"
                class="text-sm"
                [tableStyle]="{ 'min-width': section.minWidth }"
              >
                <ng-template pTemplate="header">
                  <tr>
                    @for (column of section.columns; track column) {
                      <th>{{ column }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                <tr>
                  @for (column of section.columns; track column) {
                    <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                      {{ formatCell(row[column], column) }}
                    </td>
                  }
                </tr>
              </ng-template>
              </p-table>
            } @else {
              <div class="text-sm text-surface-500">No rows available for {{ section.label }}.</div>
            }
          </p-fieldset>
        }
      </div>
    }
  `,
})
export class CassavaResultsDashboardSectionComponent implements OnInit, OnDestroy {
  private outputSub?: Subscription;
  private readonly linePalette = [
    '#60A5FA',
    '#34D399',
    '#F59E0B',
    '#F472B6',
    '#A78BFA',
    '#22D3EE',
  ];
  private readonly tableConfig = [
    {
      key: 'production_annual',
      label: 'Production Annual',
      minWidth: '44rem',
      scrollHeight: '240px',
    },
    {
      key: 'expense_breakdown_annual',
      label: 'Expense Breakdown (Annual)',
      minWidth: '44rem',
      scrollHeight: '240px',
    },
    {
      key: 'break_even',
      label: 'Break-even',
      minWidth: '52rem',
      scrollHeight: '260px',
    },
    {
      key: 'payback',
      label: 'Payback',
      minWidth: '44rem',
      scrollHeight: '260px',
    },
  ];

  bundle: CassavaBundleResponse | null = null;
  scenario = '-';
  scenarioLabel = '-';
  metricColumns = ['Metric', 'Value'];
  metricRows: Array<Record<string, unknown>> = [];
  tableSections: DashboardTableSection[] = [];

  revenueChartType: 'line' = 'line';
  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${this.formatCell(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
        },
        title: {
          display: true,
          text: 'Period',
          color: '#cbd5e1',
        },
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
      },
      y: {
        ticks: {
          color: '#cbd5e1',
          callback: (value) => this.formatCell(value),
        },
        title: {
          display: true,
          text: 'Value',
          color: '#cbd5e1',
        },
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
      },
    },
    elements: {
      line: { tension: 0.28, borderWidth: 2 },
      point: { radius: 0, hoverRadius: 4 },
    },
  };

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.outputSub = this.cassavaModelService.output$.subscribe((output) => {
      this.applySnapshot(output);
    });
    this.applySnapshot(this.cassavaModelService.getOutputSnapshot());
  }

  ngOnDestroy(): void {
    this.outputSub?.unsubscribe();
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  private applySnapshot(output: CassavaBundleResponse | null): void {
    this.bundle = output ? this.deepClone(output) : null;
    this.scenario = String(this.bundle?.scenario ?? '-');
    this.scenarioLabel = this.humanizeScenario(this.scenario);
    this.metricRows = metricsToRows(this.bundle?.metrics).map((item) => ({
      Metric: item.metric,
      Value: item.value,
    }));
    this.updateRevenueChart();
    this.updateTableSections();
  }

  private updateRevenueChart(): void {
    const payload = this.bundle?.['revenue_annual'] as
      | CassavaTablePayload
      | undefined;
    if (!payload || !payload.data || Array.isArray(payload.data)) {
      this.revenueChartData = { labels: [], datasets: [] };
      return;
    }

    const data = payload.data as Record<string, unknown>;
    const keys = Object.keys(data).filter((key) =>
      this.seriesHasNumericData(data[key]),
    );
    if (!keys.length) {
      this.revenueChartData = { labels: [], datasets: [] };
      return;
    }

    const indexLabels = Array.isArray(payload.index)
      ? payload.index.map((value) => String(value))
      : [];
    const maxSeriesLength = keys.reduce((currentMax, key) => {
      const series = this.toNumericSeries(data[key]);
      return Math.max(currentMax, series.length);
    }, 0);
    const totalLength = Math.max(indexLabels.length, maxSeriesLength);
    const labels =
      indexLabels.length >= totalLength
        ? indexLabels.slice(0, totalLength)
        : Array.from({ length: totalLength }, (_unused, index) =>
            indexLabels[index] ?? String(index + 1),
          );

    const datasets = keys.map((key, index) => {
      const color = this.linePalette[index % this.linePalette.length];
      const series = this.normalizeSeriesLength(
        this.toNumericSeries(data[key]),
        totalLength,
      );
      return {
        label: this.humanizeLabel(key),
        data: series,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    });

    this.revenueChartData = { labels, datasets };
  }

  private updateTableSections(): void {
    this.tableSections = this.tableConfig.map((config) => {
      const table = resolveCassavaTable(
        this.bundle?.[config.key] as CassavaTablePayload | undefined,
      );
      return {
        key: config.key,
        label: config.label,
        columns: table.columns,
        rows: table.rows,
        minWidth: config.minWidth,
        scrollHeight: config.scrollHeight,
      };
    });
  }

  private seriesHasNumericData(values: unknown): boolean {
    return this.toNumericSeries(values).some((value) => value !== null);
  }

  private toNumericSeries(values: unknown): Array<number | null> {
    if (!Array.isArray(values)) {
      return [];
    }
    return values.map((value) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
      return null;
    });
  }

  private normalizeSeriesLength(
    values: Array<number | null>,
    requiredLength: number,
  ): Array<number | null> {
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const padded = [...values];
    while (padded.length < requiredLength) {
      padded.push(null);
    }
    return padded;
  }

  private humanizeLabel(value: string): string {
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private humanizeScenario(value: string): string {
    if (!value || value === '-') {
      return '-';
    }
    return this.humanizeLabel(value);
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
