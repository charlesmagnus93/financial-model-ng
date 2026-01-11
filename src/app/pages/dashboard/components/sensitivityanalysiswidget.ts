import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';

interface SensitivityChart {
  key: string;
  title: string;
  subtitle: string;
  data: ChartConfiguration['data'];
}

@Component({
  standalone: true,
  selector: 'sensitivity-analysis-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div>
        <div class="text-2xl font-semibold">Key Analysis Dashboard</div>
        <div class="text-sm text-surface-400">Sensitivity Analysis</div>
      </div>

      <div class="flex flex-col gap-6">
        @for (chart of charts; track chart.key) {
        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">{{ chart.title }}</div>
          <div class="text-sm text-surface-400">{{ chart.subtitle }}</div>
          <div class="h-72 md:h-80 w-full">
            <canvas
              baseChart
              [type]="lineType"
              [data]="chart.data"
              [options]="chartOptions"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class SensitivityAnalysisWidget implements OnInit {
  lineType: ChartType = 'line';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
          usePointStyle: true,
          padding: 16,
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
        title: {
          display: true,
          text: 'Multiplier',
          color: '#cbd5e1',
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          color: '#cbd5e1',
        },
        ticks: {
          color: '#cbd5e1',
          callback: (v) => this.formatNumber(Number(v)),
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    elements: {
      line: { tension: 0.2, borderWidth: 2 },
      point: { radius: 3 },
    },
  };

  charts: SensitivityChart[] = [];

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const sensitivity = output?.sensitivity_results ?? {};
    const labelMap: Record<string, { title: string; subtitle: string }> = {
      discount_rate: {
        title: 'Sensitivity: Discount Rate',
        subtitle: 'NPV and IRR movement against discount rate scenarios.',
      },
      raw_material_cost: {
        title: 'Sensitivity: Raw Material Cost',
        subtitle: 'Impact of raw material cost inflation on project return.',
      },
      tablet_price: {
        title: 'Sensitivity: Tablet Price',
        subtitle: 'Pricing power stress across NPV and IRR.',
      },
    };

    this.charts = Object.keys(sensitivity).map((key) => {
      const table = sensitivity[key] ?? {};
      const multipliers = this.asNumberArray(table.data?.Multiplier);
      const npvSeries = this.asNumberArray(table.data?.NPV);
      const irrSeries = this.asNumberArray(table.data?.IRR);
      const labels = multipliers.map((m) => Number(m.toFixed(3)));
      const meta = labelMap[key] ?? {
        title: `Sensitivity: ${key}`,
        subtitle: 'Scenario response across NPV and IRR.',
      };

      return {
        key,
        title: meta.title,
        subtitle: meta.subtitle,
        data: {
          labels,
          datasets: [
            {
              label: 'NPV',
              data: npvSeries,
              borderColor: '#80d3ff',
              backgroundColor: 'rgba(128, 211, 255, 0.1)',
              fill: false,
              tension: 0.25,
            },
            {
              label: 'IRR',
              data: irrSeries,
              borderColor: '#8ddca4',
              backgroundColor: 'rgba(141, 220, 164, 0.1)',
              fill: false,
              tension: 0.25,
            },
          ],
        },
      };
    });
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(2)}k`;
    return value.toFixed(2);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
