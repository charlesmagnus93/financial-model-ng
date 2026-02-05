import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface TornadoRow {
  driver: string;
  change: number;
  rnpv: number;
  delta: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-tornado-diagnostics',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset
      legend="Tornado &amp; spider diagnostics"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <p-table
          [value]="rows"
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
              <th>Delta</th>
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
    </p-fieldset>
  `,
})
export class BiotechTornadoDiagnosticsComponent implements OnInit {
  rows: TornadoRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    const baseRnpv = Number(output?.rnpv ?? 0);
    const drivers = [
      { driver: 'Revenue', change: -0.2 },
      { driver: 'Revenue', change: 0.2 },
      { driver: 'COGS', change: -0.2 },
      { driver: 'COGS', change: 0.2 },
      { driver: 'Discount rate', change: -0.2 },
      { driver: 'Discount rate', change: 0.2 },
      { driver: 'Success probability', change: -0.2 },
      { driver: 'Success probability', change: 0.2 },
    ];

    this.rows = drivers.map((entry) => {
      const rnpv = baseRnpv * (1 + entry.change);
      return {
        driver: entry.driver,
        change: entry.change,
        rnpv,
        delta: rnpv - baseRnpv,
      };
    });
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(0)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }
}
