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

interface MarketSizeRow {
  segment: string;
  value: number;
}

interface IncrementHelper {
  column: 'value';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-relevant-market-sizes-assumptions-fieldset',
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
    <p-fieldset
      legend="Relevant market sizes"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold">Select row</label>
          <p-select
            [options]="rowOptions"
            [(ngModel)]="selectedRowIndex"
            (ngModelChange)="syncSelectedRow()"
            optionLabel="label"
            optionValue="value"
            placeholder="Select segment"
            [showClear]="false"
            class="w-full"
          ></p-select>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <label class="text-xs font-semibold">Segment</label>
            <input
              pInputText
              [(ngModel)]="selectedRow.segment"
              (ngModelChange)="saveSelectedRow()"
              class="w-full"
            />
            <label class="text-xs font-semibold">Value</label>
            <p-inputnumber
              [(ngModel)]="selectedRow.value"
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
            <label class="text-xs font-semibold">Segment</label>
            <input
              pInputText
              [(ngModel)]="newRow.segment"
              class="w-full"
            />
            <label class="text-xs font-semibold">Value</label>
            <p-inputnumber
              [(ngModel)]="newRow.value"
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
                Current value: {{ selectedRow.value | number: '1.0-0' }}
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
                <th>Segment</th>
                <th>Value</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.segment }}</td>
                <td>{{ row.value | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRelevantMarketSizesAssumptionsFieldsetComponent
  implements OnInit
{
  rows: MarketSizeRow[] = [];
  selectedRowIndex = 0;
  selectedRow: MarketSizeRow = {
    segment: '',
    value: 0,
  };
  newRow: MarketSizeRow = {
    segment: '',
    value: 0,
  };
  helper: IncrementHelper = {
    column: 'value',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [{ label: 'Value', value: 'value' }];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  get rowOptions() {
    return this.rows.map((row, index) => ({
      label: row.segment,
      value: index,
    }));
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
    row.segment = this.selectedRow.segment;
    row.value = this.selectedRow.value;
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
      this.rows[idx] = {
        ...this.rows[idx],
        value: (this.rows[idx].value || 0) + increment,
      };
    }
    this.syncSelectedRow();
    this.persist();
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      relevantMarketSizesAssumptions: {
        rows: this.rows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()
        ?.relevantMarketSizesAssumptions?.rows;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        segment: String(row?.segment ?? ''),
        value: Number(row?.value ?? 0),
      }));
      this.selectedRowIndex = 0;
      this.syncSelectedRow();
    }
  }
}

