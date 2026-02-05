import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PharmaModelService } from '../../services/pharma-model.service';
import { formatNumberCompact, formatNumberEnglish } from '@/utils/number-format';

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
export class ScenarioAnalysisWidget implements OnInit {
  lineType: ChartType = 'line';
  years: number[] = [];
  scenarioConfigs: ScenarioDatasetConfig[] = [];
  netRevenueData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  netIncomeData: ChartConfiguration['data'] = { labels: [], datasets: [] };

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

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const scenarios = output?.scenario_results ?? {};
    const colors = ['#7ed0ff', '#8ddca4', '#ff9aa2', '#fbbf24'];
    const scenarioKeys = Object.keys(scenarios);

    this.scenarioConfigs = scenarioKeys.map((label, idx) => ({
      label,
      color: colors[idx % colors.length],
      multiplier: 1,
    }));

    const baseScenario = scenarios[scenarioKeys[0]] ?? {};
    this.years = (baseScenario.index as number[]) ?? [];

    this.netRevenueData = {
      labels: this.years,
      datasets: this.scenarioConfigs.map((cfg) => ({
        label: cfg.label,
        data: this.asNumberArray(scenarios[cfg.label]?.data?.['Net Revenue']),
        borderColor: cfg.color,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.25,
        pointRadius: 0,
      })),
    };

    this.netIncomeData = {
      labels: this.years,
      datasets: this.scenarioConfigs.map((cfg) => ({
        label: cfg.label,
        data: this.asNumberArray(scenarios[cfg.label]?.data?.['Net Income']),
        borderColor: cfg.color,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.25,
        pointRadius: 0,
      })),
    };
  }

  private formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
