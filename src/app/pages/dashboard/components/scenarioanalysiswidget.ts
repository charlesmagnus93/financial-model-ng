import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import inputData from '../../../../../input.json';

interface ScenarioDatasetConfig {
  label: string;
  color: string;
  multiplier: number;
}

@Component({
  standalone: true,
  selector: 'scenario-analysis-widget',
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="flex items-center gap-2">
        <div class="text-2xl font-semibold">Scenario / IFs Analysis</div>
        <i class="pi pi-link text-surface-400 text-xs"></i>
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">Scenario Net Revenue</div>
          <div class="h-72 md:h-80">
            <canvas
              baseChart
              [type]="lineType"
              [data]="netRevenueData"
              [options]="chartOptions"
            ></canvas>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-lg font-semibold">Scenario Net Income</div>
          <div class="h-72 md:h-80">
            <canvas
              baseChart
              [type]="lineType"
              [data]="netIncomeData"
              [options]="chartOptions"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ScenarioAnalysisWidget {
  lineType: ChartType = 'line';

  years = (inputData.years as number[]) ?? [];

  scenarioConfigs: ScenarioDatasetConfig[] = [
    { label: 'base', color: '#7ed0ff', multiplier: 1 },
    { label: 'best', color: '#8ddca4', multiplier: 1.08 },
    { label: 'worst', color: '#ff9aa2', multiplier: 0.94 },
  ];

  netRevenueData: ChartConfiguration['data'] = {
    labels: this.years,
    datasets: this.scenarioConfigs.map((cfg) => ({
      label: cfg.label,
      data: this.buildSeries(2_800_000, 23_000_000, cfg.multiplier),
      borderColor: cfg.color,
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.25,
      pointRadius: 0,
    })),
  };

  netIncomeData: ChartConfiguration['data'] = {
    labels: this.years,
    datasets: this.scenarioConfigs.map((cfg) => ({
      label: cfg.label,
      data: this.buildSeries(900_000, 9_000_000, cfg.multiplier * 0.95),
      borderColor: cfg.color,
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.25,
      pointRadius: 0,
    })),
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#e2e8f0', usePointStyle: true, padding: 16 },
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
        title: { display: true, text: 'Year', color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Net Revenue', color: '#cbd5e1' },
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

  private buildSeries(start: number, end: number, scenarioMultiplier: number): number[] {
    const count = this.years.length || 1;
    if (count <= 1) return [start * scenarioMultiplier];
    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, idx) =>
      (start + step * idx) * scenarioMultiplier
    );
  }

  private formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }
}
