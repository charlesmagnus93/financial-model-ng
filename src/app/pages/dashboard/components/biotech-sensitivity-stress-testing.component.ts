import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../services/biotech-model.service';

interface SensitivityRow {
  driver: string;
  change: number;
  rnpv: number;
  delta: number;
}

interface StressRow {
  scenario: string;
  rnpv: number;
  ebitdaImpact: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-sensitivity-stress-testing',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset
      legend="Sensitivity &amp; stress testing"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <div class="text-sm text-surface-400">Sensitivity drivers</div>
          <p-table
            [value]="sensitivityRows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="300px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Driver</th>
                <th>Change</th>
                <th>rNPV</th>
                <th>Delta vs base</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.driver }}</td>
                <td>{{ formatPercent(row.change) }}</td>
                <td>{{ formatNumber(row.rnpv) }}</td>
                <td>{{ formatNumber(row.delta) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="flex flex-col gap-4">
          <div class="text-sm text-surface-400">Scenario stress testing</div>
          <p-table
            [value]="stressRows"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [tableStyle]="{ 'min-width': '900px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Scenario</th>
                <th>rNPV</th>
                <th>EBITDA impact</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.scenario }}</td>
                <td>{{ formatNumber(row.rnpv) }}</td>
                <td>{{ formatNumber(row.ebitdaImpact) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechSensitivityStressTestingComponent implements OnInit {
  sensitivityRows: SensitivityRow[] = [];
  stressRows: StressRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const baseRnpv = Number(output?.rnpv ?? 0);
    const consolidated = output?.consolidated ?? {};
    const data = consolidated.data ?? {};
    const ebitda = this.asNumberArray(data['ebitda']);

    const totalEbitda = ebitda.reduce((sum, value) => sum + (value ?? 0), 0);

    this.sensitivityRows = this.buildSensitivityRows(baseRnpv);
    this.stressRows = this.buildStressRows(baseRnpv, totalEbitda);
  }

  private buildSensitivityRows(baseRnpv: number): SensitivityRow[] {
    const drivers = [
      { driver: 'Revenue', change: -0.1 },
      { driver: 'Revenue', change: 0.0 },
      { driver: 'Revenue', change: 0.1 },
      { driver: 'EBITDA margin', change: -0.1 },
      { driver: 'EBITDA margin', change: 0.0 },
      { driver: 'EBITDA margin', change: 0.1 },
      { driver: 'R&D spend', change: -0.1 },
      { driver: 'R&D spend', change: 0.0 },
      { driver: 'R&D spend', change: 0.1 },
    ];

    return drivers.map((entry) => {
      const rnpv = baseRnpv * (1 + entry.change);
      return {
        driver: entry.driver,
        change: entry.change,
        rnpv,
        delta: rnpv - baseRnpv,
      };
    });
  }

  private buildStressRows(baseRnpv: number, totalEbitda: number): StressRow[] {
    return [
      {
        scenario: 'Downside launch delay',
        rnpv: baseRnpv * 0.85,
        ebitdaImpact: totalEbitda * -0.18,
      },
      {
        scenario: 'Cost overrun',
        rnpv: baseRnpv * 0.9,
        ebitdaImpact: totalEbitda * -0.12,
      },
      {
        scenario: 'Upside adoption',
        rnpv: baseRnpv * 1.08,
        ebitdaImpact: totalEbitda * 0.1,
      },
    ];
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
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
}
