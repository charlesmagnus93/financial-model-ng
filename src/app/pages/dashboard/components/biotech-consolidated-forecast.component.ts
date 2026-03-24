import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';

interface ConsolidatedRow {
  index: number;
  revenue: number;
  ebitda: number;
  fcffAfterWc: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-consolidated-forecast',
  imports: [CommonModule, TableModule, NgChartsModule, FieldsetModule],
  template: `
    <p-fieldset legend="Consolidated forecast" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="overflow-auto rounded">
          <p-table
            [value]="rows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="320px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>index</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">EBITDA</th>
                <th class="text-right">FCFF after WC</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.index }}</td>
                <td class="text-right">{{ formatNumber(row.revenue) }}</td>
                <td class="text-right">{{ formatNumber(row.ebitda) }}</td>
                <td class="text-right">{{ formatNumber(row.fcffAfterWc) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm font-semibold">Consolidated trend</div>
          <div class="h-80 md:h-[26rem]">
            <canvas
              baseChart
              [type]="lineType"
              [data]="chartData"
              [options]="chartOptions"
            ></canvas>
          </div>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechConsolidatedForecastComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  lineType: ChartType = 'line';
  rows: ConsolidatedRow[] = [];
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          padding: 16,
          generateLabels: (chart) => {
            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
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
      point: { radius: 2 },
    },
  };

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateFromOutput(output));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFromOutput(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (resolvedOutput as any)?.consolidated ?? {};
    const yearsRaw = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};
    const revenueRaw = this.asNumberArray(data['revenue']);
    const ebitdaRaw = this.asNumberArray(data['ebitda']);
    const fcffAfterWcRaw = this.asNumberArray(data['fcff_after_wc']);
    const fcffFallback = this.asNumberArray(data['fcff']);
    const fcffSource = fcffAfterWcRaw.length ? fcffAfterWcRaw : fcffFallback;

    const requiredLength = Math.max(
      yearsRaw.length,
      revenueRaw.length,
      ebitdaRaw.length,
      fcffSource.length
    );
    const labels = this.buildLabels(yearsRaw, requiredLength);
    const revenue = this.normalizeSeriesLength(revenueRaw, requiredLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, requiredLength);
    const fcffAfterWc = this.normalizeSeriesLength(fcffSource, requiredLength);

    this.rows = labels.map((year, idx) => ({
      index: year,
      revenue: revenue[idx] ?? 0,
      ebitda: ebitda[idx] ?? 0,
      fcffAfterWc: fcffAfterWc[idx] ?? 0,
    }));

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'EBITDA',
          data: ebitda,
          borderColor: '#7dd3fc',
          backgroundColor: 'transparent',
          pointRadius: 2,
          fill: false,
        },
        {
          label: 'FCFF after WC',
          data: fcffAfterWc,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          pointRadius: 2,
          fill: false,
        },
        {
          label: 'Revenue',
          data: revenue,
          borderColor: '#fca5a5',
          backgroundColor: 'transparent',
          pointRadius: 2,
          fill: false,
        },
      ],
    };
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private buildLabels(years: number[], requiredLength: number): number[] {
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

    return pickColor(primary) ?? pickColor(fallback) ?? '#94a3b8';
  }

}
