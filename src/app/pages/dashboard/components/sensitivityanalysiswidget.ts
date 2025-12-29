import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

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
export class SensitivityAnalysisWidget {
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

  charts: SensitivityChart[] = [
    {
      key: 'discount-rate',
      title: 'Sensitivity: Discount Rate',
      subtitle: 'NPV and IRR movement against discount rate scenarios.',
      data: this.buildChartData(
        this.getVariable('discount_rate', [0.08, 0.1, 0.12]),
        { baseNpv: -2_400_000, npvSlope: 5_000_000, baseIrr: 7, irrSlope: 65 }
      ),
    },
    {
      key: 'raw-material',
      title: 'Sensitivity: Raw Material Cost',
      subtitle: 'Impact of raw material cost inflation on project return.',
      data: this.buildChartData(
        this.getVariable('raw_material_cost', [0.9, 1.0, 1.1]),
        { baseNpv: -1_050_000, npvSlope: -800_000, baseIrr: 9, irrSlope: -45 }
      ),
    },
    {
      key: 'tablet-price',
      title: 'Sensitivity: Tablet Price',
      subtitle: 'Pricing power stress across NPV and IRR.',
      data: this.buildChartData(
        this.getVariable('tablet_price', [0.9, 1.0, 1.1]),
        { baseNpv: -320_000, npvSlope: -150_000, baseIrr: 8, irrSlope: -22 }
      ),
    },
  ];

  private getVariable(key: string, fallback: number[]): number[] {
    const variables = (inputData.sensitivity?.variables as Record<string, number[]>) ?? {};
    return variables[key] ?? fallback;
  }

  private buildChartData(
    multipliers: number[],
    config: { baseNpv: number; npvSlope: number; baseIrr: number; irrSlope: number }
  ): ChartConfiguration['data'] {
    const labels = multipliers.map((m) => Number(m.toFixed(3)));
    const midpoint = multipliers[Math.floor(multipliers.length / 2)] ?? multipliers[0] ?? 1;
    const npvSeries = multipliers.map((m) => config.baseNpv + (m - midpoint) * config.npvSlope);
    const irrSeries = multipliers.map((m) => config.baseIrr + (m - midpoint) * config.irrSlope);

    return {
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
    };
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(2)}k`;
    return value.toFixed(2);
  }
}
