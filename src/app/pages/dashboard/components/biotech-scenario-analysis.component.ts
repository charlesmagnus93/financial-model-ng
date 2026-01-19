import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { BiotechModelService } from '../../services/biotech-model.service';

interface ScenarioRow {
  scenario: string;
  discountRate: number;
  rnpv: number;
  ebitdaYear: number;
  ebitdaValue: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-scenario-analysis',
  imports: [CommonModule, FormsModule, TableModule, SliderModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">Scenario analysis</div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Revenue multiplier</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>0.25</span>
            <span>{{ revenueMultiplier.toFixed(2) }}</span>
            <span>2.50</span>
          </div>
          <p-slider
            [(ngModel)]="revenueMultiplier"
            [min]="0.25"
            [max]="2.5"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Cost multiplier</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>0.50</span>
            <span>{{ costMultiplier.toFixed(2) }}</span>
            <span>2.00</span>
          </div>
          <p-slider
            [(ngModel)]="costMultiplier"
            [min]="0.5"
            [max]="2"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Discount rate shift</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>-0.05</span>
            <span>{{ discountShift.toFixed(2) }}</span>
            <span>0.10</span>
          </div>
          <p-slider
            [(ngModel)]="discountShift"
            [min]="-0.05"
            [max]="0.1"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Success prob multiplier</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>0.50</span>
            <span>{{ successProbMultiplier.toFixed(2) }}</span>
            <span>1.50</span>
          </div>
          <p-slider
            [(ngModel)]="successProbMultiplier"
            [min]="0.5"
            [max]="1.5"
            [step]="0.1"
          ></p-slider>
        </div>
      </div>

      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '900px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Scenario</th>
              <th>Discount rate</th>
              <th>rNPV</th>
              <th>EBITDA year</th>
              <th>EBITDA value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.scenario }}</td>
              <td>{{ row.discountRate.toFixed(3) }}</td>
              <td>{{ formatNumber(row.rnpv) }}</td>
              <td>{{ row.ebitdaYear }}</td>
              <!-- <td>{{ formatNumber(row.ebitdaValue) }}</td> -->
              <td>{{ row.ebitdaValue }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechScenarioAnalysisComponent implements OnInit {
  revenueMultiplier = 1.0;
  costMultiplier = 1.0;
  discountShift = 0.0;
  successProbMultiplier = 1.0;
  rows: ScenarioRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const baseRnpv = Number(output?.rnpv ?? 0);
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const ebitda = this.asNumberArray(data['ebitda']);
    const firstYear = years[0] ?? new Date().getFullYear();
    const firstEbitda = ebitda[0] ?? 0;

    this.rows = [
      {
        scenario: 'Base',
        discountRate: 0.1,
        rnpv: baseRnpv,
        ebitdaYear: firstYear,
        ebitdaValue: firstEbitda,
      },
      {
        scenario: 'Custom scenario',
        discountRate: 0.1 + this.discountShift,
        rnpv: baseRnpv,
        ebitdaYear: firstYear,
        ebitdaValue: firstEbitda,
      },
    ];
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
