import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface MarginRow {
  year: number;
  grossMargin: number;
  ebitdaMargin: number;
  nopatMargin: number;
  rdIntensity: number;
  capexIntensity: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-margin-intensity',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="text-xl font-semibold">Margin &amp; intensity analysis</div>
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
              <th>Gross margin</th>
              <th>EBITDA margin</th>
              <th>NOPAT margin</th>
              <th>R&amp;D intensity</th>
              <th>Capex intensity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatPercent(row.grossMargin) }}</td>
              <td>{{ formatPercent(row.ebitdaMargin) }}</td>
              <td>{{ formatPercent(row.nopatMargin) }}</td>
              <td>{{ formatPercent(row.rdIntensity) }}</td>
              <td>{{ formatPercent(row.capexIntensity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechMarginIntensityComponent implements OnInit {
  rows: MarginRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const revenue = this.asNumberArray(data['revenue']);
    const cogs = this.asNumberArray(data['cogs']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const nopat = this.asNumberArray(data['nopat']);
    const rdExpense = this.asNumberArray(data['rd_expense_pnl']);
    const capexCash = this.asNumberArray(data['capex_cash']);

    this.rows = years.map((year, idx) => {
      const rev = revenue[idx] ?? 0;
      const safeRev = rev === 0 ? 0 : rev;
      const grossMargin = safeRev ? (rev + (cogs[idx] ?? 0)) / safeRev : 0;
      const ebitdaMargin = safeRev ? (ebitda[idx] ?? 0) / safeRev : 0;
      const nopatMargin = safeRev ? (nopat[idx] ?? 0) / safeRev : 0;
      const rdIntensity = safeRev ? Math.abs(rdExpense[idx] ?? 0) / safeRev : 0;
      const capexIntensity = safeRev ? Math.abs(capexCash[idx] ?? 0) / safeRev : 0;

      return {
        year,
        grossMargin,
        ebitdaMargin,
        nopatMargin,
        rdIntensity,
        capexIntensity,
      };
    });
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }
}
