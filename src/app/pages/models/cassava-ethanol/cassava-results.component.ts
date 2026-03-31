import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {
  CassavaBundleResponse,
  CassavaModelService,
  CassavaTablePayload,
} from '../../services/cassava-model.service';

interface ResultsSection {
  key: string;
  label: string;
}

interface TableDescriptor {
  key: string;
  label: string;
}

@Component({
  selector: 'app-cassava-results',
  standalone: true,
  imports: [CommonModule, RouterModule, TabsModule, TableModule, ButtonModule],
  template: `
    @if (!output) {
      <div class="card flex flex-col gap-4">
        <div class="text-lg font-semibold">No cassava results yet</div>
        <div class="text-sm text-surface-500">
          Submit the cassava inputs to generate dashboards and financial statements.
        </div>
        <div>
          <p-button
            label="Go to Cassava Inputs"
            icon="pi pi-arrow-right"
            routerLink="/dashboard/cassava-ethanol-input-landing"
          ></p-button>
        </div>
      </div>
    } @else {
      <div class="flex flex-col gap-4">
        <div class="card flex flex-col gap-2">
          <div class="text-sm text-surface-500">Scenario</div>
          <div class="text-xl font-semibold">
            {{ output.scenario || 'FARM_ONLY' }}
          </div>
        </div>

        <p-tabs [(value)]="activeTab" class="w-full" scrollable>
          <p-tablist>
            @for (section of sections; track section.key) {
              <p-tab [value]="section.key" class="whitespace-nowrap">
                {{ section.label }}
              </p-tab>
            }
          </p-tablist>

          <p-tabpanels>
            <p-tabpanel value="dashboard">
              <div class="grid grid-cols-12 gap-4">
                @for (metric of metricEntries; track metric.key) {
                  <div class="col-span-12 md:col-span-6 xl:col-span-3">
                    <div class="card h-full flex flex-col gap-2">
                      <div class="text-xs text-surface-500">
                        {{ formatMetricLabel(metric.key) }}
                      </div>
                      <div class="text-lg font-semibold">{{ formatMetricValue(metric.value) }}</div>
                    </div>
                  </div>
                }
              </div>
              <div class="flex flex-col gap-4">
                @for (table of dashboardTables; track table.key) {
                  <div class="card">
                    <div class="text-sm font-semibold mb-3">{{ table.label }}</div>
                    <ng-container
                      [ngTemplateOutlet]="tableView"
                      [ngTemplateOutletContext]="{ key: table.key }"
                    ></ng-container>
                  </div>
                }
              </div>
            </p-tabpanel>

            <p-tabpanel value="performance">
              <div class="flex flex-col gap-4">
                @for (table of performanceTables; track table.key) {
                  <div class="card">
                    <div class="text-sm font-semibold mb-3">{{ table.label }}</div>
                    <ng-container
                      [ngTemplateOutlet]="tableView"
                      [ngTemplateOutletContext]="{ key: table.key }"
                    ></ng-container>
                  </div>
                }
              </div>
            </p-tabpanel>

            <p-tabpanel value="position">
              <div class="flex flex-col gap-4">
                @for (table of positionTables; track table.key) {
                  <div class="card">
                    <div class="text-sm font-semibold mb-3">{{ table.label }}</div>
                    <ng-container
                      [ngTemplateOutlet]="tableView"
                      [ngTemplateOutletContext]="{ key: table.key }"
                    ></ng-container>
                  </div>
                }
              </div>
            </p-tabpanel>

            <p-tabpanel value="cash-flow">
              <div class="flex flex-col gap-4">
                @for (table of cashFlowTables; track table.key) {
                  <div class="card">
                    <div class="text-sm font-semibold mb-3">{{ table.label }}</div>
                    <ng-container
                      [ngTemplateOutlet]="tableView"
                      [ngTemplateOutletContext]="{ key: table.key }"
                    ></ng-container>
                  </div>
                }
              </div>
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      </div>

      <ng-template #tableView let-key="key">
        @if (tableRowsMap[key].length) {
          <p-table
            [value]="tableRowsMap[key]"
            [tableStyle]="{ 'min-width': '60rem' }"
            responsiveLayout="scroll"
            stripedRows
          >
            <ng-template pTemplate="header">
              <tr>
                @for (column of tableColumnsMap[key]; track column) {
                  <th>{{ formatMetricLabel(column) }}</th>
                }
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                @for (column of tableColumnsMap[key]; track column) {
                  <td>{{ formatMetricValue(row[column]) }}</td>
                }
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <div class="text-sm text-surface-500">No data available.</div>
        }
      </ng-template>
    }
  `,
})
export class CassavaResultsComponent implements OnInit, OnDestroy {
  sections: ResultsSection[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'performance', label: 'Performance' },
    { key: 'position', label: 'Position' },
    { key: 'cash-flow', label: 'Cash Flow' },
  ];

  dashboardTables: TableDescriptor[] = [
    { key: 'revenue_annual', label: 'Revenue Annual' },
    { key: 'production_annual', label: 'Production Annual' },
    { key: 'expense_breakdown_annual', label: 'Expense Breakdown (Annual)' },
    { key: 'break_even', label: 'Break-even' },
    { key: 'payback', label: 'Payback' },
  ];

  performanceTables: TableDescriptor[] = [
    { key: 'income_statement_monthly', label: 'Income Statement (Monthly)' },
    { key: 'income_statement_annual', label: 'Income Statement (Annual)' },
    { key: 'income_ratios_monthly', label: 'Income Ratios (Monthly)' },
    { key: 'income_ratios_annual', label: 'Income Ratios (Annual)' },
    { key: 'staff_department_summary', label: 'Staff Department Summary' },
  ];

  positionTables: TableDescriptor[] = [
    { key: 'balance_sheet_monthly', label: 'Balance Sheet (Monthly)' },
    { key: 'balance_sheet_annual', label: 'Balance Sheet (Annual)' },
    { key: 'balance_ratios_monthly', label: 'Balance Ratios (Monthly)' },
    { key: 'balance_ratios_annual', label: 'Balance Ratios (Annual)' },
    { key: 'working_capital_annual', label: 'Working Capital (Annual)' },
  ];

  cashFlowTables: TableDescriptor[] = [
    { key: 'cash_flow_monthly', label: 'Cash Flow (Monthly)' },
    { key: 'cash_flow_annual', label: 'Cash Flow (Annual)' },
    { key: 'debt_schedule_monthly', label: 'Debt Schedule (Monthly)' },
    { key: 'debt_schedule_annual', label: 'Debt Schedule (Annual)' },
    { key: 'depreciation_summary', label: 'Depreciation Summary' },
  ];

  activeTab = 'dashboard';
  output: CassavaBundleResponse | null = null;
  metricEntries: Array<{ key: string; value: any }> = [];
  tableRowsMap: Record<string, Array<Record<string, unknown>>> = {};
  tableColumnsMap: Record<string, string[]> = {};

  private outputSub?: Subscription;

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.refreshFromOutput(this.cassavaModelService.getOutputSnapshot());
    this.outputSub = this.cassavaModelService.output$.subscribe((output) => {
      this.refreshFromOutput(output);
    });
  }

  ngOnDestroy(): void {
    this.outputSub?.unsubscribe();
  }

  formatMetricLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatMetricValue(value: unknown): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  }

  private refreshFromOutput(output: CassavaBundleResponse | null): void {
    this.output = output ?? null;
    this.metricEntries = Object.entries(this.output?.metrics ?? {}).map(
      ([key, value]) => ({ key, value }),
    );
    this.rebuildTableMaps();
  }

  private rebuildTableMaps(): void {
    this.tableRowsMap = {};
    this.tableColumnsMap = {};

    const tableKeys = this.getAllTableKeys();
    for (const key of tableKeys) {
      const payload = (this.output as any)?.[key] as CassavaTablePayload | undefined;
      const rows = this.tablePayloadToRows(payload);
      this.tableRowsMap[key] = rows;
      this.tableColumnsMap[key] = rows.length ? Object.keys(rows[0]) : [];
    }
  }

  private getAllTableKeys(): string[] {
    const groups = [
      this.dashboardTables,
      this.performanceTables,
      this.positionTables,
      this.cashFlowTables,
    ];
    const keys = new Set<string>();
    for (const group of groups) {
      for (const table of group) {
        keys.add(table.key);
      }
    }
    return Array.from(keys);
  }

  private tablePayloadToRows(
    payload?: CassavaTablePayload | null,
  ): Array<Record<string, unknown>> {
    if (!payload || payload.data === undefined || payload.data === null) {
      return [];
    }

    if (Array.isArray(payload.data)) {
      return payload.data
        .filter((row) => row && typeof row === 'object')
        .map((row) => ({ ...(row as Record<string, unknown>) }));
    }

    if (typeof payload.data !== 'object') {
      return [];
    }

    const columnData = payload.data as Record<string, unknown>;
    const columns = Object.keys(columnData);
    if (!columns.length) {
      return [];
    }

    const maxLength = columns.reduce((max, column) => {
      const values = columnData[column];
      return Array.isArray(values) ? Math.max(max, values.length) : max;
    }, 0);

    if (!maxLength) {
      return [];
    }

    const indexName =
      typeof payload.index_name === 'string' && payload.index_name.trim()
        ? payload.index_name
        : 'index';
    const indexValues = Array.isArray(payload.index) ? payload.index : [];

    const rows: Array<Record<string, unknown>> = [];
    for (let i = 0; i < maxLength; i += 1) {
      const row: Record<string, unknown> = {};
      if (i < indexValues.length) {
        row[indexName] = indexValues[i];
      }
      for (const column of columns) {
        const values = columnData[column];
        if (Array.isArray(values)) {
          row[column] = values[i];
        }
      }
      rows.push(row);
    }

    return rows;
  }
}
