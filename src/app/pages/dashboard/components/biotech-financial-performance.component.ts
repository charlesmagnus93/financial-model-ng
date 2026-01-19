import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface PerformanceRow {
  year: number;
  revenue: number;
  cogs: number;
  salesMarketing: number;
  gna: number;
  royalty: number;
  rdExpense: number;
  ebitda: number;
  ebit: number;
  tax: number;
  nopat: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-financial-performance',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="text-xl font-semibold">Statement of Financial Performance</div>
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Year</th>
              <th>Revenue</th>
              <th>COGS</th>
              <th>Sales &amp; Marketing</th>
              <th>G&amp;A</th>
              <th>Royalty</th>
              <th>R&amp;D expense</th>
              <th>EBITDA</th>
              <th>EBIT</th>
              <th>Tax</th>
              <th>NOPAT</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.revenue) }}</td>
              <td>{{ formatNumber(row.cogs) }}</td>
              <td>{{ formatNumber(row.salesMarketing) }}</td>
              <td>{{ formatNumber(row.gna) }}</td>
              <td>{{ formatNumber(row.royalty) }}</td>
              <td>{{ formatNumber(row.rdExpense) }}</td>
              <td>{{ formatNumber(row.ebitda) }}</td>
              <td>{{ formatNumber(row.ebit) }}</td>
              <td>{{ formatNumber(row.tax) }}</td>
              <td>{{ formatNumber(row.nopat) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechFinancialPerformanceComponent implements OnInit {
  rows: PerformanceRow[] = [];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const revenue = this.asNumberArray(data['revenue']);
    const cogs = this.asNumberArray(data['cogs']);
    const salesMarketing = this.asNumberArray(data['sales_marketing']);
    const gna = this.asNumberArray(data['gna']);
    const royalty = this.asNumberArray(data['royalty']);
    const rdExpense = this.asNumberArray(data['rd_expense_pnl']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const ebit = this.asNumberArray(data['ebit']);
    const tax = this.asNumberArray(data['tax']);
    const nopat = this.asNumberArray(data['nopat']);

    this.rows = years.map((year, idx) => ({
      year,
      revenue: revenue[idx] ?? 0,
      cogs: cogs[idx] ?? 0,
      salesMarketing: salesMarketing[idx] ?? 0,
      gna: gna[idx] ?? 0,
      royalty: royalty[idx] ?? 0,
      rdExpense: rdExpense[idx] ?? 0,
      ebitda: ebitda[idx] ?? 0,
      ebit: ebit[idx] ?? 0,
      tax: tax[idx] ?? 0,
      nopat: nopat[idx] ?? 0,
    }));
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
