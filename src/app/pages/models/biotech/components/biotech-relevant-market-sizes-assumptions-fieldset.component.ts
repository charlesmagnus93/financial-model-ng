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
import { BiotechModelService } from '../../../services/biotech-model.service';

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
      legend="Relevant market sizes"
      [toggleable]="true"
      class="w-full"
    >
      <form class="flex flex-col gap-4" [formGroup]="form">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [formControl]="selectedRowControl"
              optionLabel="label"
              optionValue="value"
              placeholder="Select segment"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <p-button
              label="Remove row"
              [severity]="'danger'"
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
                <label class="text-xs font-semibold">Segment</label>
                <input pInputText formControlName="segment" class="w-full" />
                <label class="text-xs font-semibold">Value</label>
                <p-inputnumber
                  formControlName="value"
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
              <label class="text-xs font-semibold">Segment</label>
              <input pInputText formControlName="segment" class="w-full" />
              <label class="text-xs font-semibold">Value</label>
              <p-inputnumber
                formControlName="value"
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
                Current value: {{ selectedRowValue | number: '1.0-0' }}
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
      </form>
    </p-fieldset>
  `,
})
export class BiotechRelevantMarketSizesAssumptionsFieldsetComponent
  implements OnInit
{
  form: FormGroup;
  selectedRowControl: FormControl<number | null>;

  helperColumnOptions = [{ label: 'Value', value: 'value' }];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder,
  ) {
    this.selectedRowControl = this.formBuilder.control(0);
    this.form = this.formBuilder.group({
      rows: this.formBuilder.array<FormGroup>([]),
      newRow: this.formBuilder.group({
        segment: '',
        value: 0,
      }),
      helper: this.formBuilder.group({
        column: 'value',
        incrementPerYear: 1,
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

  get selectedRowValue(): number {
    const row = this.selectedRowForm?.value as MarketSizeRow | undefined;
    return row?.value ?? 0;
  }

  get rowOptions() {
    return this.rowsArray.controls.map((row, index) => ({
      label: row.value.segment,
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
    const newRow = this.newRowForm.value as MarketSizeRow;
    this.rowsArray.push(this.createRowForm(newRow));
    this.selectedRowIndex = this.rowsArray.length - 1;
    this.newRowForm.reset({
      segment: '',
      value: 0,
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
      const current = Number(row.value.value || 0);
      row.patchValue({ value: current + increment }, { emitEvent: false });
    }
    this.persist();
  }

  private createRowForm(row: MarketSizeRow): FormGroup {
    return this.formBuilder.group({
      segment: row.segment,
      value: row.value,
    });
  }

  private persist(): void {
    const rows = this.rowsArray.value as MarketSizeRow[];
    this.biotechModelService.patchInput({
      market_sizes: rows.map((row) => ({
        Segment: row.segment,
        Value: row.value,
      })),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.market_sizes;
    if (Array.isArray(stored) && stored.length) {
      this.rowsArray.clear();
      stored.forEach((row: any) => {
        this.rowsArray.push(
          this.createRowForm({
            segment: String(row?.Segment ?? ''),
            value: Number(row?.Value ?? 0),
          }),
        );
      });
      this.selectedRowIndex = 0;
    }
  }
}

