import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface DebtScheduleRow {
  year: number;
  debtDrawdowns: number;
}

interface DebtIncrementHelper {
  column: 'year' | 'debtDrawdowns';
  startRow: number;
  yearsToApply: number;
  incrementPerYear: number;
  compound: boolean;
}

interface FundingBreakdownRow {
  component: string;
  amount: number;
}

@Component({
  standalone: true,
  selector: 'biotech-debt-schedule-inputs-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    CheckboxModule,
    InputNumberModule,
    TableModule,
  ],
  template: `
    <p-fieldset legend="Debt schedule inputs" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold">Debt interest rate</label>
          <p-inputnumber
            [(ngModel)]="debtInterestRate"
            (ngModelChange)="persist()"
            [showButtons]="true"
            [min]="0"
            [step]="0.01"
            [minFractionDigits]="3"
            [maxFractionDigits]="4"
            inputStyleClass="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold">Select row</label>
          <p-select
            [options]="rowOptions"
            [(ngModel)]="selectedIndex"
            (ngModelChange)="syncSelectedRow()"
            optionLabel="label"
            optionValue="value"
            [showClear]="false"
            class="w-full"
          ></p-select>
        </div>

        <div class="grid grid-cols-12 gap-1">
          <div class="col-span-12 md:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-3">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="editForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">Year</label>
              <p-inputnumber
                formControlName="year"
                [showButtons]="true"
                [useGrouping]="false"
                [min]="0"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Debt drawdowns</label>
              <p-inputnumber
                formControlName="debtDrawdowns"
                [showButtons]="true"
                [min]="0"
                inputStyleClass="w-full"
              />
              <p-button
                label="Save changes"
                size="small"
                [outlined]="true"
                (onClick)="saveRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 md:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-3">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">Year</label>
              <p-inputnumber
                formControlName="year"
                [showButtons]="true"
                [useGrouping]="false"
                [min]="0"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Debt drawdowns</label>
              <p-inputnumber
                formControlName="debtDrawdowns"
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
            </form>
          </div>

          <div class="col-span-12 md:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-3">
            <p-button
              label="Remove row"
              severity="danger"
              [outlined]="true"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              fluid
            ></p-button>
          </div>

          <div class="col-span-12 md:col-span-3 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs font-semibold">Yearly Increment Helper</div>
            <p class="text-xs text-surface-500">
              Apply a fixed change or % growth from a start year onward. "Increment per year" is
              the step size (or growth rate when compounding). "Years to apply" controls how many
              consecutive rows are updated.
            </p>
            <label class="text-xs font-semibold">Column</label>
            <p-select
              [options]="helperColumnOptions"
              [(ngModel)]="helper.column"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            ></p-select>
            <label class="text-xs font-semibold">Start row</label>
            <p-inputnumber
              [(ngModel)]="helper.startRow"
              [showButtons]="true"
              [min]="0"
              [useGrouping]="false"
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
            <label class="text-xs font-semibold">Increment per year</label>
            <p-inputnumber
              [(ngModel)]="helper.incrementPerYear"
              [showButtons]="true"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
            <div class="flex items-center gap-2 mt-1">
              <p-checkbox [(ngModel)]="helper.compound" binary></p-checkbox>
              <label class="text-xs font-semibold">Compound annually (apply % growth)</label>
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

        <div class="overflow-auto rounded">
          <p-table [value]="rows" showGridlines [scrollable]="true" scrollHeight="200px" class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th>Year</th>
                <th>Debt drawdowns</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.year }}</td>
                <td>{{ row.debtDrawdowns | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <p class="text-xs text-surface-500">
          Edit debt drawdowns; repayments and interest are calculated from the rate.
        </p>

        <div class="mt-1">
          <div class="text-xs text-surface-600">Funding required vs uses</div>
          <div class="text-2xl font-semibold">{{ fundingRequiredGap | number: '1.0-0' }}</div>
        </div>

        <div class="overflow-auto rounded">
          <p-table [value]="fundingBreakdownRows" showGridlines class="text-sm" [size]="'small'">
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
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechDebtScheduleInputsFieldsetComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  rows: DebtScheduleRow[] = [];
  selectedIndex = 0;
  debtInterestRate = 0;
  fundingRequired = 0;
  cashBurn = 0;
  workingCapitalDraw = 0;
  usesTotal = 0;

  editForm: FormGroup;
  newForm: FormGroup;

  helper: DebtIncrementHelper = {
    column: 'year',
    startRow: 0,
    yearsToApply: 1,
    incrementPerYear: 1,
    compound: false,
  };

  helperColumnOptions = [
    { label: 'Year', value: 'year' },
    { label: 'Debt drawdowns', value: 'debtDrawdowns' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      year: [0],
      debtDrawdowns: [0],
    });
    this.newForm = this.formBuilder.group({
      year: [0],
      debtDrawdowns: [0],
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

  get rowOptions() {
    return this.rows.map((row, index) => ({
      label: String(row.year),
      value: index,
    }));
  }

  get fundingRequiredGap(): number {
    return this.fundingRequired - this.usesTotal;
  }

  get fundingBreakdownRows(): FundingBreakdownRow[] {
    return [
      { component: 'Uses total', amount: this.usesTotal },
      { component: 'Cash burn (FCFF <0)', amount: this.cashBurn },
      { component: 'Working capital draw', amount: this.workingCapitalDraw },
      { component: 'Funding required', amount: this.fundingRequired },
    ];
  }

  syncSelectedRow(): void {
    const row = this.rows[this.selectedIndex];
    if (!row) {
      return;
    }
    this.editForm.reset({
      year: Number(row.year ?? 0),
      debtDrawdowns: Number(row.debtDrawdowns ?? 0),
    });
  }

  saveRow(): void {
    const value = this.editForm.getRawValue();
    const normalized: DebtScheduleRow = {
      year: Number(value.year ?? 0),
      debtDrawdowns: Number(value.debtDrawdowns ?? 0),
    };
    const nextRows = [...this.rows];
    if (nextRows[this.selectedIndex]) {
      nextRows[this.selectedIndex] = normalized;
    } else {
      nextRows.push(normalized);
      this.selectedIndex = nextRows.length - 1;
    }
    this.rows = nextRows.sort((a, b) => a.year - b.year);
    this.syncSelectedRow();
    this.persist();
  }

  addRow(): void {
    const value = this.newForm.getRawValue();
    const normalized: DebtScheduleRow = {
      year: Number(value.year ?? 0),
      debtDrawdowns: Number(value.debtDrawdowns ?? 0),
    };
    this.rows = [...this.rows, normalized].sort((a, b) => a.year - b.year);
    this.selectedIndex = Math.max(0, this.rows.length - 1);
    this.syncSelectedRow();
    this.resetNewForm();
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((_, index) => index !== this.selectedIndex);
    this.selectedIndex = 0;
    this.syncSelectedRow();
    this.resetNewForm();
    this.persist();
  }

  applyIncrement(): void {
    const increment = Number(this.helper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const start = Math.max(0, Math.floor(this.helper.startRow || 0));

    for (let i = 0; i < years; i += 1) {
      const idx = start + i;
      if (!this.rows[idx]) {
        break;
      }

      if (this.helper.column === 'year') {
        this.rows[idx] = {
          ...this.rows[idx],
          year: Math.max(0, Math.floor(Number(this.rows[idx].year || 0) + increment)),
        };
        continue;
      }

      const current = Number(this.rows[idx].debtDrawdowns || 0);
      const nextValue = this.helper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      this.rows[idx] = {
        ...this.rows[idx],
        debtDrawdowns: nextValue,
      };
    }

    this.rows = [...this.rows].sort((a, b) => a.year - b.year);
    this.syncSelectedRow();
    this.persist();
  }

  persist(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const currentFunding = snapshot?.funding_assumptions ?? {};
    this.biotechModelService.patchInput({
      debt_interest_rate: Number(this.debtInterestRate ?? 0),
      debt_schedule: this.rows.map((row) => ({
        Year: Number(row.year ?? 0),
        'Debt drawdowns': Number(row.debtDrawdowns ?? 0),
      })),
      funding_assumptions: {
        ...currentFunding,
        debt_schedule_helper: { ...this.helper },
      },
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot() ?? {};

    const schedule = Array.isArray(stored?.debt_schedule) ? stored.debt_schedule : [];
    this.rows = schedule.map((row: any) => ({
      year: Number(row?.Year ?? 0),
      debtDrawdowns: Number(row?.['Debt drawdowns'] ?? 0),
    }));
    if (!this.rows.length) {
      this.rows = [{ year: new Date().getFullYear(), debtDrawdowns: 0 }];
    }

    this.debtInterestRate = Number(stored?.debt_interest_rate ?? 0);
    const uses = Array.isArray(stored?.uses) ? stored.uses : [];
    this.usesTotal = uses.reduce(
      (sum: number, row: any) => sum + Number(row?.Amount ?? 0),
      0
    );
    this.fundingRequired = Number(stored?.funding_required ?? 0);
    this.cashBurn = Number(stored?.funding_required_breakdown?.cash_burn ?? 0);
    this.workingCapitalDraw = Number(
      stored?.funding_required_breakdown?.working_capital_draw ?? 0
    );

    const helper = stored?.funding_assumptions?.debt_schedule_helper;
    this.helper = {
      column: helper?.column === 'debtDrawdowns' ? 'debtDrawdowns' : 'year',
      startRow: Math.max(0, Number(helper?.startRow ?? 0)),
      yearsToApply: Math.max(1, Number(helper?.yearsToApply ?? 1)),
      incrementPerYear: Number(helper?.incrementPerYear ?? 1),
      compound: Boolean(helper?.compound ?? false),
    };

    this.selectedIndex = Math.min(
      Math.max(0, this.selectedIndex),
      Math.max(0, this.rows.length - 1)
    );
    this.syncSelectedRow();
    this.resetNewForm();
  }

  private resetNewForm(): void {
    const last = this.rows[this.rows.length - 1];
    const nextYear = last ? Number(last.year ?? 0) + 1 : new Date().getFullYear();
    this.newForm.reset({
      year: nextYear,
      debtDrawdowns: 0,
    });
  }
}
