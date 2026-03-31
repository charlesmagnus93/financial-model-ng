import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../../services/biotech-model.service';

interface FundsRow {
  item: string;
  amount: number;
}

interface FundingBreakdownRow {
  component: string;
  amount: number;
}

interface IncrementHelper {
  column: 'amount';
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

@Component({
  standalone: true,
  selector: 'biotech-uses-sources-funds-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
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
      <div class="flex items-center gap-2 mb-3">
        <p-checkbox
          [(ngModel)]="autoFundingRequired"
          (ngModelChange)="persist()"
          binary
        ></p-checkbox>
        <label class="text-xs font-semibold">
          Auto-calculate funding required from model outputs
        </label>
      </div>

      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div class="text-sm font-semibold">Uses</div>
          <div class="grid grid-cols-12 gap-3 items-end">
            <div class="col-span-12 flex flex-col gap-2">
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
          </div>
          <div class="grid grid-cols-12 gap-1">
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
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
                  label="Save changes"
                  size="small"
                  [outlined]="true"
                  (onClick)="saveUsesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
              <form [formGroup]="usesNewForm" class="flex flex-col gap-2">
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
                  label="Add row"
                  size="small"
                  [outlined]="true"
                  (onClick)="addUsesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
                <p-button
                  label="Remove row"
                  severity="danger"
                  [outlined]="true"
                  (onClick)="removeUsesRow()"
                  [disabled]="usesRows.length <= 1"
                  fluid
                ></p-button>
                <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
                  <div class="text-xs font-semibold">Yearly Increment Helper</div>
                  <p class="text-xs text-surface-500">
                    Apply a fixed change or % growth from a start year onward. "Increment per
                    year" is the step size (or growth rate when compounding). "Years to apply"
                    controls how many consecutive rows are updated.
                  </p>
                  <label class="text-xs font-semibold">Column</label>
                  <p-select
                    [options]="amountColumnOptions"
                    [(ngModel)]="usesHelper.column"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
                  <label class="text-xs font-semibold">Start row</label>
                  <p-inputnumber
                    [(ngModel)]="usesHelper.startRow"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
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
                  <label class="text-xs font-semibold">Increment per year</label>
                  <p-inputnumber
                    [(ngModel)]="usesHelper.incrementPerYear"
                    [showButtons]="true"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 mt-1">
                    <p-checkbox [(ngModel)]="usesHelper.compound" binary></p-checkbox>
                    <label class="text-xs font-semibold">
                      Compound annually (apply % growth)
                    </label>
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
          </div>
          <div class="overflow-auto rounded">
            <p-table [value]="usesRows" showGridlines class="text-sm" [size]="'small'">
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
            <div class="col-span-12 flex flex-col gap-2">
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
          </div>
          <div class="grid grid-cols-12 gap-1">
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
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
                  label="Save changes"
                  size="small"
                  [outlined]="true"
                  (onClick)="saveSourcesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
              <form [formGroup]="sourcesNewForm" class="flex flex-col gap-2">
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
                  label="Add row"
                  size="small"
                  [outlined]="true"
                  (onClick)="addSourcesRow()"
                  fluid
                ></p-button>
              </form>
            </div>
            <div class="col-span-12 md:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-3">
              <div class="col-span-12 md:col-span-6 flex flex-col gap-1">
                <p-button
                  label="Remove row"
                  severity="danger"
                  [outlined]="true"
                  (onClick)="removeSourcesRow()"
                  [disabled]="sourcesRows.length <= 1"
                  fluid
                ></p-button>
                <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
                  <div class="text-xs font-semibold">Yearly Increment Helper</div>
                  <p class="text-xs text-surface-500">
                    Apply a fixed change or % growth from a start year onward. "Increment per
                    year" is the step size (or growth rate when compounding). "Years to apply"
                    controls how many consecutive rows are updated.
                  </p>
                  <label class="text-xs font-semibold">Column</label>
                  <p-select
                    [options]="amountColumnOptions"
                    [(ngModel)]="sourcesHelper.column"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
                  <label class="text-xs font-semibold">Start row</label>
                  <p-inputnumber
                    [(ngModel)]="sourcesHelper.startRow"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
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
                  <label class="text-xs font-semibold">Increment per year</label>
                  <p-inputnumber
                    [(ngModel)]="sourcesHelper.incrementPerYear"
                    [showButtons]="true"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 mt-1">
                    <p-checkbox [(ngModel)]="sourcesHelper.compound" binary></p-checkbox>
                    <label class="text-xs font-semibold">
                      Compound annually (apply % growth)
                    </label>
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
          </div>
          <div class="overflow-auto rounded">
            <p-table [value]="sourcesRows" showGridlines class="text-sm" [size]="'small'">
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
      <!-- <div class="mt-4">
        <div class="text-xs text-surface-600">Funding required vs uses</div>
        <div class="text-2xl font-semibold">
          {{ fundingRequiredGap | number: '1.0-0' }}
        </div>
      </div>
      @if (fundingRequiredMismatch) {
        <div class="mt-3 rounded bg-amber-400/20 text-amber-300 p-3 text-xs">
          Funding required does not match total uses.
        </div>
      }

      <div class="mt-4 overflow-auto rounded">
        <p-table
          [value]="fundingBreakdownRows"
          showGridlines
          class="text-sm"
          [size]="'small'"
        >
          <ng-template #header>
            <tr>
              <th>Component</th>
              <th>Amount</th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr>
              <td>{{ row.component }}</td>
              <td>{{ row.amount | number: '1.0-0' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div> -->
    </p-fieldset>
  `,
})
export class BiotechUsesSourcesFundsFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  usesRows: FundsRow[] = [];
  sourcesRows: FundsRow[] = [];
  usesSelectedIndex = 0;
  sourcesSelectedIndex = 0;
  usesForm: FormGroup;
  usesNewForm: FormGroup;
  sourcesForm: FormGroup;
  sourcesNewForm: FormGroup;
  usesHelper: IncrementHelper = {
    column: 'amount',
    startRow: 0,
    incrementPerYear: 1,
    yearsToApply: 1,
    compound: false,
  };
  sourcesHelper: IncrementHelper = {
    column: 'amount',
    startRow: 0,
    incrementPerYear: 1,
    yearsToApply: 1,
    compound: false,
  };
  autoFundingRequired = false;
  fundingRequired = 0;
  cashBurn = 0;
  workingCapitalDraw = 0;

  amountColumnOptions = [{ label: 'Amount', value: 'amount' }];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.usesForm = this.formBuilder.group({
      item: [''],
      amount: [0],
    });
    this.usesNewForm = this.formBuilder.group({
      item: ['New use'],
      amount: [0],
    });
    this.sourcesForm = this.formBuilder.group({
      item: [''],
      amount: [0],
    });
    this.sourcesNewForm = this.formBuilder.group({
      item: ['New source'],
      amount: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  get fundingRequiredGap(): number {
    return this.fundingRequired - this.totalUses;
  }

  get fundingRequiredMismatch(): boolean {
    return Math.abs(this.fundingRequired - this.totalUses) > 0.01;
  }

  get fundingBreakdownRows(): FundingBreakdownRow[] {
    return [
      { component: 'Uses total', amount: this.totalUses },
      { component: 'Cash burn (FCFF <0)', amount: this.cashBurn },
      { component: 'Working capital draw', amount: this.workingCapitalDraw },
      { component: 'Funding required', amount: this.fundingRequired },
    ];
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
      this.usesForm.reset({ ...row });
    }
  }

  syncSourcesSelectedRow(): void {
    const row = this.sourcesRows[this.sourcesSelectedIndex];
    if (row) {
      this.sourcesForm.reset({ ...row });
    }
  }

  saveUsesRow(): void {
    const value = this.usesForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    let nextRows = [...this.usesRows];
    if (nextRows[this.usesSelectedIndex]) {
      nextRows[this.usesSelectedIndex] = normalized;
    } else {
      nextRows = [...nextRows, normalized];
      this.usesSelectedIndex = nextRows.length - 1;
    }
    this.usesRows = nextRows;
    this.usesForm.reset({ ...normalized });
    this.persist();
  }

  addUsesRow(): void {
    const value = this.usesNewForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    const nextRows = [...this.usesRows, normalized];
    this.usesRows = nextRows;
    this.usesSelectedIndex = nextRows.length - 1;
    this.syncUsesSelectedRow();
    this.resetUsesNewForm();
    this.persist();
  }

  saveSourcesRow(): void {
    const value = this.sourcesForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    let nextRows = [...this.sourcesRows];
    if (nextRows[this.sourcesSelectedIndex]) {
      nextRows[this.sourcesSelectedIndex] = normalized;
    } else {
      nextRows = [...nextRows, normalized];
      this.sourcesSelectedIndex = nextRows.length - 1;
    }
    this.sourcesRows = nextRows;
    this.sourcesForm.reset({ ...normalized });
    this.persist();
  }

  addSourcesRow(): void {
    const value = this.sourcesNewForm.getRawValue() as FundsRow;
    const normalized: FundsRow = {
      item: String(value.item ?? ''),
      amount: Number(value.amount ?? 0),
    };
    const nextRows = [...this.sourcesRows, normalized];
    this.sourcesRows = nextRows;
    this.sourcesSelectedIndex = nextRows.length - 1;
    this.syncSourcesSelectedRow();
    this.resetSourcesNewForm();
    this.persist();
  }

  removeUsesRow(): void {
    if (this.usesRows.length <= 1) {
      return;
    }
    this.usesRows = this.usesRows.filter((_, index) => index !== this.usesSelectedIndex);
    this.usesSelectedIndex = 0;
    this.syncUsesSelectedRow();
    this.resetUsesNewForm();
    this.persist();
  }

  removeSourcesRow(): void {
    if (this.sourcesRows.length <= 1) {
      return;
    }
    this.sourcesRows = this.sourcesRows.filter((_, index) => index !== this.sourcesSelectedIndex);
    this.sourcesSelectedIndex = 0;
    this.syncSourcesSelectedRow();
    this.resetSourcesNewForm();
    this.persist();
  }

  applyUsesIncrement(): void {
    const increment = Number(this.usesHelper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.usesHelper.yearsToApply || 0));
    const start = Math.max(0, Math.floor(this.usesHelper.startRow || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = start + i;
      if (!this.usesRows[idx]) {
        break;
      }
      const current = Number(this.usesRows[idx].amount || 0);
      const nextValue = this.usesHelper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      this.usesRows[idx] = {
        ...this.usesRows[idx],
        amount: nextValue,
      };
    }
    this.syncUsesSelectedRow();
    this.persist();
  }

  applySourcesIncrement(): void {
    const increment = Number(this.sourcesHelper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.sourcesHelper.yearsToApply || 0));
    const start = Math.max(0, Math.floor(this.sourcesHelper.startRow || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = start + i;
      if (!this.sourcesRows[idx]) {
        break;
      }
      const current = Number(this.sourcesRows[idx].amount || 0);
      const nextValue = this.sourcesHelper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      this.sourcesRows[idx] = {
        ...this.sourcesRows[idx],
        amount: nextValue,
      };
    }
    this.syncSourcesSelectedRow();
    this.persist();
  }

  persist(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const currentFunding = snapshot?.funding_assumptions ?? {};
    this.biotechModelService.patchInput({
      uses: this.usesRows.map((row) => ({
        Item: row.item,
        Amount: row.amount,
      })),
      sources: this.sourcesRows.map((row) => ({
        Item: row.item,
        Amount: row.amount,
      })),
      funding_required: Number(this.fundingRequired ?? 0),
      funding_assumptions: {
        ...currentFunding,
        auto_funding_required: Boolean(this.autoFundingRequired),
        uses_increment_helper: { ...this.usesHelper },
        sources_increment_helper: { ...this.sourcesHelper },
      },
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot() ?? {};
    const uses = stored?.uses;
    const sources = stored?.sources;
    if (Array.isArray(uses) && uses.length) {
      this.usesRows = uses.map((row: any) => ({
        item: String(row?.Item ?? ''),
        amount: Number(row?.Amount ?? 0),
      }));
    }
    if (Array.isArray(sources) && sources.length) {
      this.sourcesRows = sources.map((row: any) => ({
        item: String(row?.Item ?? ''),
        amount: Number(row?.Amount ?? 0),
      }));
    }
    this.autoFundingRequired = Boolean(
      stored?.funding_assumptions?.auto_funding_required ?? false
    );
    const usesHelper = stored?.funding_assumptions?.uses_increment_helper;
    const sourcesHelper = stored?.funding_assumptions?.sources_increment_helper;
    this.usesHelper = {
      column: 'amount',
      startRow: Number(usesHelper?.startRow ?? 0),
      incrementPerYear: Number(usesHelper?.incrementPerYear ?? 1),
      yearsToApply: Math.max(1, Number(usesHelper?.yearsToApply ?? 1)),
      compound: Boolean(usesHelper?.compound ?? false),
    };
    this.sourcesHelper = {
      column: 'amount',
      startRow: Number(sourcesHelper?.startRow ?? 0),
      incrementPerYear: Number(sourcesHelper?.incrementPerYear ?? 1),
      yearsToApply: Math.max(1, Number(sourcesHelper?.yearsToApply ?? 1)),
      compound: Boolean(sourcesHelper?.compound ?? false),
    };
    this.fundingRequired = Number(stored?.funding_required ?? 0);
    this.cashBurn = Number(stored?.funding_required_breakdown?.cash_burn ?? 0);
    this.workingCapitalDraw = Number(
      stored?.funding_required_breakdown?.working_capital_draw ?? 0
    );
    this.usesSelectedIndex = 0;
    this.sourcesSelectedIndex = 0;
    this.syncUsesSelectedRow();
    this.syncSourcesSelectedRow();
    this.resetUsesNewForm();
    this.resetSourcesNewForm();
  }

  private resetUsesNewForm(): void {
    this.usesNewForm.reset({ item: 'New use', amount: 0 });
  }

  private resetSourcesNewForm(): void {
    this.sourcesNewForm.reset({ item: 'New source', amount: 0 });
  }
}

