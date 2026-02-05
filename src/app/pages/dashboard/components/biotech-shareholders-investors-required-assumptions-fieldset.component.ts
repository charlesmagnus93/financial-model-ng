import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
  equityValue: number;
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
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
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
                <label class="text-xs font-semibold">Equity value (rNPV)</label>
                <p-inputnumber
                  formControlName="equityValue"
                  [showButtons]="true"
                  [min]="0"
                  inputStyleClass="w-full"
                />
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
              <label class="text-xs font-semibold">Equity value (rNPV)</label>
              <p-inputnumber
                formControlName="equityValue"
                [showButtons]="true"
                [min]="0"
                inputStyleClass="w-full"
              />
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
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                formControlName="column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                formControlName="incrementPerYear"
                [showButtons]="true"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="4"
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
          <p-table [value]="rowsArray.value" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th>Shareholder</th>
                <th>Ownership %</th>
                <th>Investment</th>
                <th>Equity value (rNPV)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.ownershipPct | number: '1.2-2' }}</td>
                <td>{{ row.investment | number: '1.0-0' }}</td>
                <td>{{ row.equityValue | number: '1.0-0' }}</td>
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
  implements OnInit
{
  form: FormGroup;
  selectedRowControl: FormControl<number | null>;

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
        incrementPerYear: 0.01,
        yearsToApply: 1,
      }),
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
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

  get helperCurrentValue(): number {
    const row = this.selectedRowForm?.value as ShareholderRow | undefined;
    if (!row) {
      return 0;
    }
    const helper = this.helperForm.value as IncrementHelper;
    return helper.column === 'ownershipPct' ? row.ownershipPct : row.investment;
  }

  get rowOptions() {
    return this.rowsArray.controls.map((row, index) => ({
      label: row.value.name,
      value: index,
    }));
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
    for (let i = 0; i < years; i += 1) {
      const idx = this.selectedRowIndex + i;
      const row = this.rowsArray.at(idx) as FormGroup | undefined;
      if (!row) {
        break;
      }
      if (helper.column === 'ownershipPct') {
        const current = Number(row.value.ownershipPct || 0);
        row.patchValue({ ownershipPct: current + increment }, { emitEvent: false });
      } else {
        const current = Number(row.value.investment || 0);
        row.patchValue({ investment: current + increment }, { emitEvent: false });
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
    const rows = this.rowsArray.value as ShareholderRow[];
    this.biotechModelService.patchInput({
      shareholders: rows.map((row) => ({
        Shareholder: row.name,
        'Ownership %': row.ownershipPct,
        Investment: row.investment,
        'Equity value (rNPV)': row.equityValue,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.shareholders;
    if (Array.isArray(stored) && stored.length) {
      this.rowsArray.clear();
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
      this.selectedRowIndex = 0;
    }
  }
}
