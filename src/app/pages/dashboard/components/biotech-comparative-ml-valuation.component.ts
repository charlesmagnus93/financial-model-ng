import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BiotechModelService } from '../../services/biotech-model.service';
import biotechOutput from '../../../../../biotech_output.json';

interface ClusterRow {
  product: string;
  cluster: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-comparative-ml-valuation',
  imports: [CommonModule, FieldsetModule, TableModule, NgChartsModule],
  template: `
    <p-fieldset
      legend="Comparative &amp; ML-based valuation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="overflow-auto">
          <p-table
            [value]="clusterRows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="220px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Cluster</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td class="font-semibold">{{ row.product }}</td>
                <td class="text-right">{{ row.cluster }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="h-64 md:h-[20rem]">
          <canvas
            baseChart
            [type]="chartType"
            [data]="chartData"
            [options]="chartOptions"
          ></canvas>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechComparativeMlValuationComponent implements OnInit {
  clusterRows: ClusterRow[] = [];
  chartType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => this.formatNumber(Number(ctx.parsed.y ?? 0)),
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
      line: { tension: 0.2, borderWidth: 2 },
      point: { radius: 0 },
    },
  };

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.normalizeOutput(this.biotechModelService.getOutputSnapshot());
    const perProduct = output?.per_product ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const consolidatedRevenue = this.asNumberArray(consolidated.data?.['revenue']);

    const products = Object.keys(perProduct);
    this.clusterRows = products.map((product, idx) => ({
      product,
      cluster: idx % 3,
    }));

    const totalProductRevenue = products.reduce((sum, product) => {
      const revenue = this.sumNumbers(perProduct[product]?.data?.['revenue']);
      return sum + revenue;
    }, 0);
    const totalRevenue = this.sumNumbers(consolidatedRevenue);
    const impliedRevenue = totalRevenue - totalProductRevenue;
    this.clusterRows.push({
      product: 'Vaccine Sales (Implied)',
      cluster: this.clusterRows.length % 3,
    });

    const series = years.map((year, idx) => {
      const value = consolidatedRevenue[idx] ?? 0;
      const base = value / 1_000_000;
      const adjustment = impliedRevenue ? impliedRevenue / (years.length * 1_000_000) : 0;
      return base + adjustment;
    });

    this.chartData = {
      labels: years,
      datasets: [
        {
          data: series,
          borderColor: '#93c5fd',
          backgroundColor: 'transparent',
        },
      ],
    };
  }

  private sumNumbers(values: unknown): number {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, v) => sum + Number(v ?? 0), 0);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private normalizeOutput(rawOutput: unknown): any {
    const fallback = biotechOutput as any;
    const output = rawOutput && typeof rawOutput === 'object' ? (rawOutput as any) : {};
    return {
      ...fallback,
      ...output,
    };
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}`;
    return value.toFixed(0);
  }
}
