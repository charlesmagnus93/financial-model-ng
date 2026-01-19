import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface CashFlowRow {
  year: number;
  cashFromOperations: number;
  cashFromInvesting: number;
  cashFromFinancing: number;
  netChangeInCash: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-cash-flow',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-4">
      <div class="text-xl font-semibold">Statement of Cash Flows</div>
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '1200px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Year</th>
              <th>Cash from operations</th>
              <th>Cash from investing</th>
              <th>Cash from financing</th>
              <th>Net change in cash</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatNumber(row.cashFromOperations) }}</td>
              <td>{{ formatNumber(row.cashFromInvesting) }}</td>
              <td>{{ formatNumber(row.cashFromFinancing) }}</td>
              <td>{{ formatNumber(row.netChangeInCash) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechCashFlowComponent implements OnInit {
  rows: CashFlowRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const nopat = this.asNumberArray(data['nopat']);
    const da = this.asNumberArray(data['da']);
    const deltaWc = this.asNumberArray(data['delta_wc']);
    const capexCash = this.asNumberArray(data['capex_cash']);
    const rdCapAdd = this.asNumberArray(data['rd_cap_add']);

    this.rows = years.map((year, idx) => {
      const cashFromOperations = (nopat[idx] ?? 0) + (da[idx] ?? 0) - (deltaWc[idx] ?? 0);
      const cashFromInvesting = (capexCash[idx] ?? 0) + (rdCapAdd[idx] ?? 0);
      const cashFromFinancing = 0;
      const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;

      return {
        year,
        cashFromOperations,
        cashFromInvesting,
        cashFromFinancing,
        netChangeInCash,
      };
    });
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
