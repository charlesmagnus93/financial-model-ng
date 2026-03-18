import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { BiotechModelService } from '../../services/biotech-model.service';

interface ShareholderRow {
  name: string;
  ownershipPct: number;
  investment: number;
  equityValue: number;
}

interface IncrementHelper {
  column: 'ownershipPct' | 'investment';
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

@Component({
  standalone: true,
  selector: 'biotech-shareholders-investors-required-assumptions-fieldset',
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
    CheckboxModule,
  ],
  template: `
    <p-fieldset legend="Shareholders / Investors" [toggleable]="true" class="w-full">
      <form class="flex flex-col gap-4" [formGroup]="form">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [formControl]="selectedRowControl"
              optionLabel="label"
              optionValue="value"
              placeholder="Select shareholder"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>

          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <p-button
              label="Remove row"
              severity="danger"
              class="w-full"
              [outlined]="true"
              (onClick)="removeRow()"
              [disabled]="rowsArray.length <= 1"
              fluid
            ></p-button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <ng-container *ngIf="selectedRowForm as rowForm">
              <div [formGroup]="rowForm" class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Shareholder</label>
                <input pInputText formControlName="name" class="w-full" />
                <label class="text-xs font-semibold">Ownership %</label>
                <p-inputnumber
                  formControlName="ownershipPct"
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
                  formControlName="investment"
                  [showButtons]="true"
                  [min]="0"
                  inputStyleClass="w-full"
                />
                <!-- <label class="text-xs font-semibold">Equity value (rNPV)</label>
                <p-inputnumber
                  formControlName="equityValue"
                  [showButtons]="true"
                  [min]="0"
                  inputStyleClass="w-full"
                /> -->
              </div>
            </ng-container>
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
            <div [formGroup]="newRowForm" class="flex flex-col gap-2">
              <label class="text-xs font-semibold">Shareholder</label>
              <input pInputText formControlName="name" class="w-full" />
              <label class="text-xs font-semibold">Ownership %</label>
              <p-inputnumber
                formControlName="ownershipPct"
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
                formControlName="investment"
                [showButtons]="true"
                [min]="0"
                inputStyleClass="w-full"
              />
              <!-- <label class="text-xs font-semibold">Equity value (rNPV)</label>
              <p-inputnumber
                formControlName="equityValue"
                [showButtons]="true"
                [min]="0"
                inputStyleClass="w-full"
              /> -->
            </div>
            <p-button
              label="Add row"
              size="small"
              [outlined]="true"
              (onClick)="addRow()"
              fluid
            ></p-button>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2" [formGroup]="helperForm">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <p class="text-xs text-surface-500">
                Apply a fixed change or % growth from a start year onward. "Increment per year" is
                the step size (or growth rate when compounding). "Years to apply" controls how many
                consecutive rows are updated.
              </p>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                formControlName="column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Start row</label>
              <p-inputnumber
                formControlName="startRow"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Years to apply</label>
              <p-inputnumber
                formControlName="yearsToApply"
                [showButtons]="true"
                [min]="1"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                formControlName="incrementPerYear"
                [showButtons]="true"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <div class="flex items-center gap-2 mt-1">
                <p-checkbox formControlName="compound" binary></p-checkbox>
                <label class="text-xs font-semibold">
                  Compound annually (apply % growth)
                </label>
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
          <p-table
            [value]="rowsArray.value"
            showGridlines
            class="text-sm"
            [size]="'small'"
            [scrollable]="true"
            scrollHeight="140px"
            sortMode="single"
          >
            <ng-template #header>
              <tr>
                <th style="width: 3rem"></th>
                <th pSortableColumn="name">
                  <span class="inline-flex items-center gap-1">
                    <p-sortIcon field="name"></p-sortIcon>
                    <span>Shareholder</span>
                  </span>
                </th>
                <th pSortableColumn="ownershipPct">
                  <span class="inline-flex items-center gap-1">
                    <p-sortIcon field="ownershipPct"></p-sortIcon>
                    <span>Ownership %</span>
                  </span>
                </th>
                <th pSortableColumn="investment">
                  <span class="inline-flex items-center gap-1">
                    <p-sortIcon field="investment"></p-sortIcon>
                    <span>Investment</span>
                  </span>
                </th>
              </tr>
            </ng-template>
            <ng-template #body let-row let-rowIndex="rowIndex">
              <tr>
                <td class="text-right">{{ rowIndex }}</td>
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.ownershipPct | number: '1.2-2' }}</td>
                <td class="text-right">{{ row.investment | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-xs text-surface-600">Total ownership reported</div>
        <div class="text-2xl font-semibold">
          {{ totalOwnership | percent: '1.0-0' }}
        </div>
      </form>
    </p-fieldset>
  `,
})
export class BiotechShareholdersInvestorsRequiredAssumptionsFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  form: FormGroup;
  selectedRowControl: FormControl<number | null>;
  rowOptions: Array<{ label: string; value: number }> = [];

  helperColumnOptions = [
    { label: 'Ownership %', value: 'ownershipPct' },
    { label: 'Investment', value: 'investment' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder,
  ) {
    this.selectedRowControl = this.formBuilder.control(0);
    this.form = this.formBuilder.group({
      rows: this.formBuilder.array<FormGroup>([]),
      newRow: this.formBuilder.group({
        name: '',
        ownershipPct: 0,
        investment: 0,
        equityValue: 0,
      }),
      helper: this.formBuilder.group({
        column: 'ownershipPct',
        startRow: 0,
        yearsToApply: 1,
        incrementPerYear: 1,
        compound: false,
      }),
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
    this.rowsArray.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshRowOptions());
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get rowsArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get newRowForm(): FormGroup {
    return this.form.get('newRow') as FormGroup;
  }

  get helperForm(): FormGroup {
    return this.form.get('helper') as FormGroup;
  }

  get selectedRowIndex(): number {
    return this.selectedRowControl.value ?? 0;
  }

  set selectedRowIndex(value: number) {
    this.selectedRowControl.setValue(value);
  }

  get selectedRowForm(): FormGroup | null {
    return (this.rowsArray.at(this.selectedRowIndex) as FormGroup) ?? null;
  }

  get totalOwnership(): number {
    const rows = this.rowsArray.value as ShareholderRow[];
    return rows.reduce((sum, row) => sum + (row.ownershipPct || 0), 0);
  }

  saveSelectedRow(): void {
    if (!this.selectedRowForm) {
      return;
    }
    this.persist();
  }

  addRow(): void {
    const newRow = this.newRowForm.value as ShareholderRow;
    this.rowsArray.push(this.createRowForm(newRow));
    this.selectedRowIndex = this.rowsArray.length - 1;
    this.newRowForm.reset({
      name: '',
      ownershipPct: 0,
      investment: 0,
      equityValue: 0,
    });
    this.persist();
  }

  removeRow(): void {
    if (this.rowsArray.length <= 1) {
      return;
    }
    this.rowsArray.removeAt(this.selectedRowIndex);
    this.selectedRowIndex = 0;
    this.persist();
  }

  applyIncrement(): void {
    const helper = this.helperForm.value as IncrementHelper;
    const increment = Number(helper.incrementPerYear || 0);
    const years = Math.max(1, Math.floor(helper.yearsToApply || 0));
    const start = Math.max(0, Math.floor(helper.startRow || 0));
    for (let i = 0; i < years; i += 1) {
      const idx = start + i;
      const row = this.rowsArray.at(idx) as FormGroup | undefined;
      if (!row) {
        break;
      }
      if (helper.column === 'ownershipPct') {
        const current = Number(row.value.ownershipPct || 0);
        const nextValue = helper.compound
          ? current * (1 + increment / 100)
          : current + increment;
        row.patchValue(
          { ownershipPct: Math.min(1, Math.max(0, nextValue)) },
          { emitEvent: false }
        );
      } else {
        const current = Number(row.value.investment || 0);
        const nextValue = helper.compound
          ? current * (1 + increment / 100)
          : current + increment;
        row.patchValue(
          { investment: Math.max(0, nextValue) },
          { emitEvent: false }
        );
      }
    }
    this.persist();
  }

  private createRowForm(row: ShareholderRow): FormGroup {
    return this.formBuilder.group({
      name: row.name,
      ownershipPct: row.ownershipPct,
      investment: row.investment,
      equityValue: row.equityValue,
    });
  }

  private persist(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const currentFunding = snapshot?.funding_assumptions ?? {};
    const helper = this.helperForm.getRawValue() as IncrementHelper;
    const rows = this.rowsArray.value as ShareholderRow[];
    this.biotechModelService.patchInput({
      shareholders: rows.map((row) => ({
        Shareholder: row.name,
        'Ownership %': row.ownershipPct,
        Investment: row.investment,
        // 'Equity value (rNPV)': row.equityValue,
      })),
      funding_assumptions: {
        ...currentFunding,
        shareholders_increment_helper: {
          column: helper.column === 'investment' ? 'investment' : 'ownershipPct',
          startRow: Math.max(0, Number(helper.startRow ?? 0)),
          yearsToApply: Math.max(1, Number(helper.yearsToApply ?? 1)),
          incrementPerYear: Number(helper.incrementPerYear ?? 1),
          compound: Boolean(helper.compound ?? false),
        },
      },
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const stored = snapshot?.shareholders;
    const currentIndex = this.selectedRowIndex;

    this.rowsArray.clear();
    if (Array.isArray(stored) && stored.length) {
      stored.forEach((row: any) => {
        this.rowsArray.push(
          this.createRowForm({
            name: String(row?.Shareholder ?? ''),
            ownershipPct: Number(row?.['Ownership %'] ?? 0),
            investment: Number(row?.Investment ?? 0),
            equityValue: Number(row?.['Equity value (rNPV)'] ?? 0),
          }),
        );
      });
    } else {
      this.rowsArray.push(
        this.createRowForm({
          name: '',
          ownershipPct: 0,
          investment: 0,
          equityValue: 0,
        }),
      );
    }

    const helper = snapshot?.funding_assumptions?.shareholders_increment_helper;
    this.helperForm.patchValue(
      {
        column: helper?.column === 'investment' ? 'investment' : 'ownershipPct',
        startRow: Math.max(0, Number(helper?.startRow ?? 0)),
        yearsToApply: Math.max(1, Number(helper?.yearsToApply ?? 1)),
        incrementPerYear: Number(helper?.incrementPerYear ?? 1),
        compound: Boolean(helper?.compound ?? false),
      },
      { emitEvent: false }
    );

    this.selectedRowIndex = Math.min(
      Math.max(0, currentIndex),
      Math.max(0, this.rowsArray.length - 1)
    );
    this.refreshRowOptions();
  }

  private refreshRowOptions(): void {
    this.rowOptions = this.rowsArray.controls.map((row, index) => {
      const name = String(row?.value?.name ?? '').trim();
      return {
        label: name || `Shareholder ${index + 1}`,
        value: index,
      };
    });
  }
}
