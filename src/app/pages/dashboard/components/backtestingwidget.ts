import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PharmaModelService } from '../../services/pharma-model.service';

@Component({
  standalone: true,
  selector: 'backtesting-widget',
  imports: [CommonModule, TableModule],
  template: `
    <div class="card w-full flex flex-col gap-4">
      <div class="text-2xl font-semibold">Backtesting</div>
      <p class="text-sm text-surface-400">{{ interpretation }}</p>

      <div class="overflow-auto">
        <p-table [value]="rows" showGridlines responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              @for (col of columns; track col) {
                <th>{{ col }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (col of columns; track col) {
                <td>{{ row[col] }}</td>
              }
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BacktestingWidget implements OnInit {
  rows: Array<Record<string, any>> = [];
  columns: string[] = [];
  interpretation = '';

  constructor(private pharmaModelService: PharmaModelService) {}

  ngOnInit(): void {
    const output = this.pharmaModelService.getOutputSnapshot();
    const result = output?.scenario_tool_results?.backtesting ?? {};
    this.rows = result.rows ?? [];
    this.columns = this.rows.length ? Object.keys(this.rows[0]) : [];
    this.interpretation = result.interpretation ?? '';
  }
}
