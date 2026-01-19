import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface FundsRow {
  item: string;
  amount: number;
}

interface IncrementHelper {
  column: 'amount';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-uses-sources-funds-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset
      legend="Uses and sources of funds"
      [toggleable]="true"
      class="w-full"
    >
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div class="text-sm font-semibold">Uses</div>
          <div class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-12 lg:col-span-9 flex flex-col gap-2">
              <label class="text-xs font-semibold">Select row</label>
              <p-select
                [options]="usesRowOptions"
                [(ngModel)]="usesSelectedIndex"
                (ngModelChange)="syncUsesSelectedRow()"
                optionLabel="label"
                optionValue="value"
                placeholder="Select item"
                [showClear]="false"
                class="w-full"
              ></p-select>
            </div>
            <div class="col-span-12 lg:col-span-3">
              <p-button
                label="Remove row"
                severity="danger"
                [outlined]="true"
                (onClick)="removeUsesRow()"
                [disabled]="usesRows.length <= 1"
                fluid
              ></p-button>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-6 rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="text-xs text-surface-600 font-semibold">
                  {{ usesIsCreating ? 'Add a new row' : 'Edit selected row' }}
                </div>
                <p-button
                  label="New row"
                  size="small"
                  [outlined]="true"
                  (onClick)="startNewUsesRow()"
                ></p-button>
              </div>
              <form [formGroup]="usesForm" class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Item</label>
                <input pInputText formControlName="item" class="w-full" />
                <label class="text-xs font-semibold">Amount</label>
                <p-inputnumber
                  formControlName="amount"
                  [showButtons]="true"
                  [min]="0"
                  inputStyleClass="w-full"
                />
                <p-button
                  [label]="usesIsCreating ? 'Add row' : 'Save changes'"
                  size="small"
                  [outlined]="true"
                  (onClick)="saveUsesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-6 flex flex-col gap-3">
              <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
                <div class="text-xs font-semibold">Yearly Increment Helper</div>
                <label class="text-xs font-semibold">Column</label>
                <p-select
                  [options]="amountColumnOptions"
                  [(ngModel)]="usesHelper.column"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                ></p-select>
                <label class="text-xs font-semibold">Increment per year</label>
                <p-inputnumber
                  [(ngModel)]="usesHelper.incrementPerYear"
                  [showButtons]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Years to apply</label>
                <p-inputnumber
                  [(ngModel)]="usesHelper.yearsToApply"
                  [showButtons]="true"
                  [min]="1"
                  [useGrouping]="false"
                  inputStyleClass="w-full"
                />
                <div class="text-xs text-surface-500">
                  Current value: {{ usesCurrentAmount | number: '1.0-0' }}
                </div>
                <p-button
                  label="Apply increment"
                  size="small"
                  [outlined]="true"
                  (onClick)="applyUsesIncrement()"
                  fluid
                ></p-button>
              </div>
            </div>
          </div>
          <div class="overflow-auto rounded">
            <p-table [value]="usesRows" showGridlines class="text-sm">
              <ng-template #header>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                </tr>
              </ng-template>
              <ng-template #body let-row>
                <tr>
                  <td>{{ row.item }}</td>
                  <td>{{ row.amount | number: '1.0-0' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
          <div class="text-xs text-surface-600">Total uses</div>
          <div class="text-2xl font-semibold">
            {{ totalUses | number: '1.0-0' }}
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div class="text-sm font-semibold">Sources</div>
          <div class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-12 lg:col-span-9 flex flex-col gap-2">
              <label class="text-xs font-semibold">Select row</label>
              <p-select
                [options]="sourcesRowOptions"
                [(ngModel)]="sourcesSelectedIndex"
                (ngModelChange)="syncSourcesSelectedRow()"
                optionLabel="label"
                optionValue="value"
                placeholder="Select item"
                [showClear]="false"
                class="w-full"
              ></p-select>
            </div>
            <div class="col-span-12 lg:col-span-3">
              <p-button
                label="Remove row"
                severity="danger"
                [outlined]="true"
                (onClick)="removeSourcesRow()"
                [disabled]="sourcesRows.length <= 1"
                fluid
              ></p-button>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-6 rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="text-xs text-surface-600 font-semibold">
                  {{ sourcesIsCreating ? 'Add a new row' : 'Edit selected row' }}
                </div>
                <p-button
                  label="New row"
                  size="small"
                  [outlined]="true"
                  (onClick)="startNewSourcesRow()"
                ></p-button>
              </div>
              <form [formGroup]="sourcesForm" class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Item</label>
                <input pInputText formControlName="item" class="w-full" />
                <label class="text-xs font-semibold">Amount</label>
                <p-inputnumber
                  formControlName="amount"
                  [showButtons]="true"
                  [min]="0"
                  inputStyleClass="w-full"
                />
                <p-button
                  [label]="sourcesIsCreating ? 'Add row' : 'Save changes'"
                  size="small"
                  [outlined]="true"
                  (onClick)="saveSourcesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-6 flex flex-col gap-3">
              <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
                <div class="text-xs font-semibold">Yearly Increment Helper</div>
                <label class="text-xs font-semibold">Column</label>
                <p-select
                  [options]="amountColumnOptions"
                  [(ngModel)]="sourcesHelper.column"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                ></p-select>
                <label class="text-xs font-semibold">Increment per year</label>
                <p-inputnumber
                  [(ngModel)]="sourcesHelper.incrementPerYear"
                  [showButtons]="true"
                  inputStyleClass="w-full"
                />
                <label class="text-xs font-semibold">Years to apply</label>
                <p-inputnumber
                  [(ngModel)]="sourcesHelper.yearsToApply"
                  [showButtons]="true"
                  [min]="1"
                  [useGrouping]="false"
                  inputStyleClass="w-full"
                />
                <div class="text-xs text-surface-500">
                  Current value: {{ sourcesCurrentAmount | number: '1.0-0' }}
                </div>
                <p-button
                  label="Apply increment"
                  size="small"
                  [outlined]="true"
                  (onClick)="applySourcesIncrement()"
                  fluid
                ></p-button>
              </div>
            </div>
          </div>
          <div class="overflow-auto rounded">
            <p-table [value]="sourcesRows" showGridlines class="text-sm">
              <ng-template #header>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                </tr>
              </ng-template>
              <ng-template #body let-row>
                <tr>
                  <td>{{ row.item }}</td>
                  <td>{{ row.amount | number: '1.0-0' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
          <div class="text-xs text-surface-600">Total sources</div>
          <div class="text-2xl font-semibold">
            {{ totalSources | number: '1.0-0' }}
          </div>
        </div>
      </div>

      <div class="mt-4 rounded bg-blue-300 text-blue-600 p-3 text-xs">
        Funding gap (sources - uses): {{ fundingGap | number: '1.0-0' }}
      </div>
    </p-fieldset>
  `,
})
export class BiotechUsesSourcesFundsAssumptionsFieldsetComponent implements OnInit {
  usesRows: FundsRow[] = [];
  sourcesRows: FundsRow[] = [];
  usesSelectedIndex = 0;
  sourcesSelectedIndex = 0;
  usesIsCreating = false;
  sourcesIsCreating = false;
  usesForm: FormGroup;
  sourcesForm: FormGroup;
  usesHelper: IncrementHelper = { column: 'amount', incrementPerYear: 1, yearsToApply: 1 };
  sourcesHelper: IncrementHelper = { column: 'amount', incrementPerYear: 1, yearsToApply: 1 };

  amountColumnOptions = [{ label: 'Amount', value: 'amount' }];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.usesForm = this.formBuilder.group({
      item: [''],
      amount: [0],
    });
    this.sourcesForm = this.formBuilder.group({
      item: [''],
      amount: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
  }

  get usesRowOptions() {
    return this.usesRows.map((row, index) => ({
      label: row.item,
      value: index,
    }));
  }

  get sourcesRowOptions() {
    return this.sourcesRows.map((row, index) => ({
      label: row.item,
      value: index,
    }));
  }

  get totalUses(): number {
    return this.usesRows.reduce((sum, row) => sum + (row.amount || 0), 0);
  }

  get totalSources(): number {
    return this.sourcesRows.reduce((sum, row) => sum + (row.amount || 0), 0);
  }

  get fundingGap(): number {
    return this.totalSources - this.totalUses;
  }

  get usesCurrentAmount(): number {
    const row = this.usesRows[this.usesSelectedIndex];
    return row?.amount ?? 0;
  }

  get sourcesCurrentAmount(): number {
    const row = this.sourcesRows[this.sourcesSelectedIndex];
    return row?.amount ?? 0;
  }

  syncUsesSelectedRow(): void {
    const row = this.usesRows[this.usesSelectedIndex];
    if (row) {
      this.usesIsCreating = false;
      this.usesForm.reset({ ...row });
    }
  }

  syncSourcesSelectedRow(): void {
    const row = this.sourcesRows[this.sourcesSelectedIndex];
    if (row) {
      this.sourcesIsCreating = false;
      this.sourcesForm.reset({ ...row });
    }
  }

  startNewUsesRow(): void {
    this.usesIsCreating = true;
    this.usesForm.reset({ item: 'New use', amount: 0 });
  }

  startNewSourcesRow(): void {
    this.sourcesIsCreating = true;
    this.sourcesForm.reset({ item: 'New source', amount: 0 });
  }

  saveUsesRow(): void {
    const value = this.usesForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    let nextRows = [...this.usesRows];
    if (this.usesIsCreating) {
      nextRows = [...nextRows, normalized];
      this.usesSelectedIndex = nextRows.length - 1;
      this.usesIsCreating = false;
    } else if (nextRows[this.usesSelectedIndex]) {
      nextRows[this.usesSelectedIndex] = normalized;
    }
    this.usesRows = nextRows;
    this.usesForm.reset({ ...normalized });
    this.persist();
  }

  saveSourcesRow(): void {
    const value = this.sourcesForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    let nextRows = [...this.sourcesRows];
    if (this.sourcesIsCreating) {
      nextRows = [...nextRows, normalized];
      this.sourcesSelectedIndex = nextRows.length - 1;
      this.sourcesIsCreating = false;
    } else if (nextRows[this.sourcesSelectedIndex]) {
      nextRows[this.sourcesSelectedIndex] = normalized;
    }
    this.sourcesRows = nextRows;
    this.sourcesForm.reset({ ...normalized });
    this.persist();
  }

  removeUsesRow(): void {
    if (this.usesRows.length <= 1) {
      return;
    }
    this.usesRows = this.usesRows.filter((_, index) => index !== this.usesSelectedIndex);
    this.usesSelectedIndex = 0;
    this.syncUsesSelectedRow();
    this.persist();
  }

  removeSourcesRow(): void {
    if (this.sourcesRows.length <= 1) {
      return;
    }
    this.sourcesRows = this.sourcesRows.filter((_, index) => index !== this.sourcesSelectedIndex);
    this.sourcesSelectedIndex = 0;
    this.syncSourcesSelectedRow();
    this.persist();
  }

  applyUsesIncrement(): void {
    const increment = Number(this.usesHelper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.usesHelper.yearsToApply || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = this.usesSelectedIndex + i;
      if (!this.usesRows[idx]) {
        break;
      }
      this.usesRows[idx] = {
        ...this.usesRows[idx],
        amount: (this.usesRows[idx].amount || 0) + increment,
      };
    }
    this.syncUsesSelectedRow();
    this.persist();
  }

  applySourcesIncrement(): void {
    const increment = Number(this.sourcesHelper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.sourcesHelper.yearsToApply || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = this.sourcesSelectedIndex + i;
      if (!this.sourcesRows[idx]) {
        break;
      }
      this.sourcesRows[idx] = {
        ...this.sourcesRows[idx],
        amount: (this.sourcesRows[idx].amount || 0) + increment,
      };
    }
    this.syncSourcesSelectedRow();
    this.persist();
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      usesSourcesFundsAssumptions: {
        uses: this.usesRows.map((row) => ({ ...row })),
        sources: this.sourcesRows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.usesSourcesFundsAssumptions;
    const uses = stored?.uses;
    const sources = stored?.sources;
    if (Array.isArray(uses) && uses.length) {
      this.usesRows = uses.map((row: any) => ({
        item: String(row?.item ?? ''),
        amount: Number(row?.amount ?? 0),
      }));
    }
    if (Array.isArray(sources) && sources.length) {
      this.sourcesRows = sources.map((row: any) => ({
        item: String(row?.item ?? ''),
        amount: Number(row?.amount ?? 0),
      }));
    }
    this.usesSelectedIndex = 0;
    this.sourcesSelectedIndex = 0;
    this.syncUsesSelectedRow();
    this.syncSourcesSelectedRow();
  }
}

