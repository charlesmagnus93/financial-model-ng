import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface ShareholderRow {
  name: string;
  ownershipPct: number;
  investment: number;
}

interface IncrementHelper {
  column: 'ownershipPct' | 'investment';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-shareholders-investors-required-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset legend="Shareholders / Investors" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold">Select row</label>
          <p-select
            [options]="rowOptions"
            [(ngModel)]="selectedRowIndex"
            (ngModelChange)="syncSelectedRow()"
            optionLabel="label"
            optionValue="value"
            placeholder="Select shareholder"
            [showClear]="false"
            class="w-full"
          ></p-select>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <label class="text-xs font-semibold">Shareholder</label>
            <input
              pInputText
              [(ngModel)]="selectedRow.name"
              (ngModelChange)="saveSelectedRow()"
              class="w-full"
            />
            <label class="text-xs font-semibold">Ownership %</label>
            <p-inputnumber
              [(ngModel)]="selectedRow.ownershipPct"
              (ngModelChange)="saveSelectedRow()"
              [showButtons]="true"
              [min]="0"
              [max]="1"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="4"
              inputStyleClass="w-full"
            />
            <label class="text-xs font-semibold">Investment</label>
            <p-inputnumber
              [(ngModel)]="selectedRow.investment"
              (ngModelChange)="saveSelectedRow()"
              [showButtons]="true"
              [min]="0"
              inputStyleClass="w-full"
            />
            <p-button
              label="Save changes"
              size="small"
              [outlined]="true"
              (onClick)="saveSelectedRow()"
              fluid
            ></p-button>
          </div>

          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <label class="text-xs font-semibold">Shareholder</label>
            <input
              pInputText
              [(ngModel)]="newRow.name"
              class="w-full"
            />
            <label class="text-xs font-semibold">Ownership %</label>
            <p-inputnumber
              [(ngModel)]="newRow.ownershipPct"
              [showButtons]="true"
              [min]="0"
              [max]="1"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="4"
              inputStyleClass="w-full"
            />
            <label class="text-xs font-semibold">Investment</label>
            <p-inputnumber
              [(ngModel)]="newRow.investment"
              [showButtons]="true"
              [min]="0"
              inputStyleClass="w-full"
            />
            <p-button
              label="Add row"
              size="small"
              [outlined]="true"
              (onClick)="addRow()"
              fluid
            ></p-button>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
            <p-button
              label="Remove row"
              size="small"
              [outlined]="true"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
            ></p-button>
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                [(ngModel)]="helper.column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerYear"
                [showButtons]="true"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="4"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Years to apply</label>
              <p-inputnumber
                [(ngModel)]="helper.yearsToApply"
                [showButtons]="true"
                [min]="1"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <div class="text-xs text-surface-400">
                Current value: {{ helperCurrentValue | number: '1.2-2' }}
              </div>
              <p-button
                label="Apply increment"
                size="small"
                [outlined]="true"
                (onClick)="applyIncrement()"
                fluid
              ></p-button>
            </div>
          </div>
        </div>

        <div class="overflow-auto rounded">
          <p-table [value]="rows" showGridlines class="text-sm">
            <ng-template #header>
              <tr>
                <th>Shareholder</th>
                <th>Ownership %</th>
                <th>Investment</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.ownershipPct | number: '1.2-2' }}</td>
                <td>{{ row.investment | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-xs text-surface-600">Total ownership reported</div>
        <div class="text-2xl font-semibold">
          {{ totalOwnership | percent: '1.0-0' }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechShareholdersInvestorsRequiredAssumptionsFieldsetComponent
  implements OnInit
{
  rows: ShareholderRow[] = [];
  selectedRowIndex = 0;
  selectedRow: ShareholderRow = {
    name: '',
    ownershipPct: 0,
    investment: 0,
  };
  newRow: ShareholderRow = {
    name: '',
    ownershipPct: 0,
    investment: 0,
  };
  helper: IncrementHelper = {
    column: 'ownershipPct',
    incrementPerYear: 0.01,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Ownership %', value: 'ownershipPct' },
    { label: 'Investment', value: 'investment' },
  ];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  get rowOptions() {
    return this.rows.map((row, index) => ({
      label: row.name,
      value: index,
    }));
  }

  get totalOwnership(): number {
    return this.rows.reduce((sum, row) => sum + (row.ownershipPct || 0), 0);
  }

  get helperCurrentValue(): number {
    const row = this.rows[this.selectedRowIndex];
    if (!row) {
      return 0;
    }
    return this.helper.column === 'ownershipPct'
      ? row.ownershipPct
      : row.investment;
  }

  syncSelectedRow(): void {
    const row = this.rows[this.selectedRowIndex];
    if (row) {
      this.selectedRow = { ...row };
    }
  }

  saveSelectedRow(): void {
    const row = this.rows[this.selectedRowIndex];
    if (!row) {
      return;
    }
    row.name = this.selectedRow.name;
    row.ownershipPct = this.selectedRow.ownershipPct;
    row.investment = this.selectedRow.investment;
    this.persist();
  }

  addRow(): void {
    this.rows = [...this.rows, { ...this.newRow }];
    this.selectedRowIndex = this.rows.length - 1;
    this.syncSelectedRow();
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((_, index) => index !== this.selectedRowIndex);
    this.selectedRowIndex = 0;
    this.syncSelectedRow();
    this.persist();
  }

  applyIncrement(): void {
    const increment = Number(this.helper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = this.selectedRowIndex + i;
      if (!this.rows[idx]) {
        break;
      }
      const row = { ...this.rows[idx] };
      if (this.helper.column === 'ownershipPct') {
        row.ownershipPct = Number(row.ownershipPct || 0) + increment;
      } else {
        row.investment = Number(row.investment || 0) + increment;
      }
      this.rows[idx] = row;
    }
    this.syncSelectedRow();
    this.persist();
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      shareholdersInvestorsAssumptions: {
        rows: this.rows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()
        ?.shareholdersInvestorsAssumptions?.rows;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        name: String(row?.name ?? ''),
        ownershipPct: Number(row?.ownershipPct ?? 0),
        investment: Number(row?.investment ?? 0),
      }));
      this.selectedRowIndex = 0;
      this.syncSelectedRow();
    }
  }
}

