import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';
import biotechOutput from '../../../../../biotech_output.json';

interface PositionRow {
  year: number;
  intangibles: number;
  propertyEquipment: number;
  workingCapital: number;
  totalAssets: number;
  retainedEarnings: number;
  paidInCapital: number;
  totalEquity: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-financial-position',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="text-xl font-semibold">Statement of Financial Position</div>
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Year</th>
              <th>Intangibles</th>
              <th>Property &amp; equipment</th>
              <th>Working capital</th>
              <th>Total assets</th>
              <th>Retained earnings</th>
              <th>Paid-in capital</th>
              <th>Total equity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.intangibles) }}</td>
              <td>{{ formatNumber(row.propertyEquipment) }}</td>
              <td>{{ formatNumber(row.workingCapital) }}</td>
              <td>{{ formatNumber(row.totalAssets) }}</td>
              <td>{{ formatNumber(row.retainedEarnings) }}</td>
              <td>{{ formatNumber(row.paidInCapital) }}</td>
              <td>{{ formatNumber(row.totalEquity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechFinancialPositionComponent implements OnInit {
  rows: PositionRow[] = [];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.normalizeOutput(this.biotechModelService.getOutputSnapshot());
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const rdCapAdd = this.asNumberArray(data['rd_cap_add']);
    const capexCash = this.asNumberArray(data['capex_cash']);
    const deltaWc = this.asNumberArray(data['delta_wc']);
    const nopat = this.asNumberArray(data['nopat']);

    const intangibles = this.buildCumulative(rdCapAdd, -1);
    const propertyEquipment = this.buildCumulative(capexCash, -1);
    const workingCapital = this.buildCumulative(deltaWc, -1);
    const retainedEarnings = this.buildCumulative(nopat, 1);

    this.rows = years.map((year, idx) => {
      const totalAssets =
        (intangibles[idx] ?? 0) +
        (propertyEquipment[idx] ?? 0) +
        (workingCapital[idx] ?? 0);
      const retained = retainedEarnings[idx] ?? 0;
      const paidInCapital = totalAssets - retained;

      return {
        year,
        intangibles: intangibles[idx] ?? 0,
        propertyEquipment: propertyEquipment[idx] ?? 0,
        workingCapital: workingCapital[idx] ?? 0,
        totalAssets,
        retainedEarnings: retained,
        paidInCapital,
        totalEquity: totalAssets,
      };
    });
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }

  private buildCumulative(values: number[], multiplier: number): number[] {
    let total = 0;
    return values.map((v) => {
      total += (v ?? 0) * multiplier;
      return total;
    });
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private normalizeOutput(rawOutput: unknown): any {
    const fallback = biotechOutput as any;
    const output = rawOutput && typeof rawOutput === 'object' ? (rawOutput as any) : {};
    const consolidated = this.normalizeConsolidated(
      output.consolidated ?? {},
      fallback.consolidated ?? {}
    );
    return {
      ...fallback,
      ...output,
      consolidated,
    };
  }

  private normalizeConsolidated(source: any, fallback: any): any {
    const index = this.asNumberArray(source?.index ?? fallback?.index ?? []);
    const data = this.normalizeConsolidatedData(source?.data ?? {}, fallback?.data ?? {});
    return {
      ...fallback,
      ...source,
      index,
      data,
    };
  }

  private normalizeConsolidatedData(source: any, fallback: any): any {
    const aliases: Record<string, string[]> = {
      rd_cap_add: ['rd_cap_add', 'rdCapAdd', 'R&D cap add'],
      capex_cash: ['capex_cash', 'capexCash', 'Capex cash'],
      delta_wc: ['delta_wc', 'deltaWc', 'Delta WC', 'Working capital'],
      nopat: ['nopat', 'NOPAT'],
    };

    const result: Record<string, number[]> = {};
    Object.keys(fallback ?? {}).forEach((key) => {
      const keys = aliases[key] ?? [key];
      const match = keys.find((candidate) => Array.isArray(source?.[candidate]));
      const values = match ? source[match] : fallback?.[key];
      result[key] = this.asNumberArray(values);
    });

    return result;
  }
}
