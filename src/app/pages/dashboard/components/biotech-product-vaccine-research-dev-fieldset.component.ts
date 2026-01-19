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

interface VaccineResearchRow {
  id: string;
  name: string;
  costAccounting: string;
  preGtmSpentUsd: number;
  preGtmRemainingUsd: number;
  postGtmAnnualCostUsd: number;
}

interface IncrementHelper {
  column: 'preGtmSpentUsd' | 'preGtmRemainingUsd' | 'postGtmAnnualCostUsd';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccine-research-dev-fieldset',
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
      legend="Vaccines research & development (R&D)"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-9 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [(ngModel)]="selectedRowId"
              (ngModelChange)="syncSelectedRow()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select vaccine"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-3 flex">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-8 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="text-xs text-surface-600 font-semibold">
                {{ isCreatingRow ? 'Add a new row' : 'Edit selected row' }}
              </div>
              <p-button
                label="New row"
                size="small"
                [outlined]="true"
                (onClick)="startNewRow()"
              ></p-button>
            </div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">ID_vaccine</label>
                  <input pInputText formControlName="id" class="w-full" />
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">Cost accounting (capitalisation)</label>
                  <input pInputText formControlName="costAccounting" class="w-full" />
                  <label class="text-xs font-semibold">Pre-GTM spent to date (USD)</label>
                  <p-inputnumber
                    formControlName="preGtmSpentUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Pre-GTM remaining (USD)</label>
                  <p-inputnumber
                    formControlName="preGtmRemainingUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Post-GTM annual cost (USD/year)</label>
                  <p-inputnumber
                    formControlName="postGtmAnnualCostUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">Pre-GTM total (USD)</label>
                  <p-inputnumber
                    [ngModel]="preGtmTotal(rowFormValue)"
                    [ngModelOptions]="{ standalone: true }"
                    [disabled]="false"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold d-">&nbsp;</label>
                  <p-button
                    [label]="isCreatingRow ? 'Add row' : 'Save changes'"
                    [outlined]="true"
                    (onClick)="saveRow()"
                    fluid
                  ></p-button>
                </div>
              </div>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
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
                [step]="1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
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
              <div class="text-xs text-surface-500">
                Current value: {{ currentHelperValue | number: '1.0-0' }}
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
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Cost accounting (capitalisation)</th>
                <th>Pre-GTM spent to date (USD)</th>
                <th>Pre-GTM remaining (USD)</th>
                <th>Post-GTM annual cost (USD/year)</th>
                <th>Pre-GTM total (USD)</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.costAccounting }}</td>
                <td>{{ row.preGtmSpentUsd | number: '1.0-0' }}</td>
                <td>{{ row.preGtmRemainingUsd | number: '1.0-0' }}</td>
                <td>{{ row.postGtmAnnualCostUsd | number: '1.0-0' }}</td>
                <td>{{ preGtmTotal(row) | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccineResearchDevFieldsetComponent implements OnInit {
  rows: VaccineResearchRow[] = [];
  selectedRowId = '';
  isCreatingRow = false;
  rowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'preGtmSpentUsd',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  helperColumnOptions = [
    { label: 'Pre-GTM spent to date (USD)', value: 'preGtmSpentUsd' },
    { label: 'Pre-GTM remaining (USD)', value: 'preGtmRemainingUsd' },
    { label: 'Post-GTM annual cost (USD/year)', value: 'postGtmAnnualCostUsd' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      costAccounting: [''],
      preGtmSpentUsd: [0],
      preGtmRemainingUsd: [0],
      postGtmAnnualCostUsd: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: row.name ? `${row.id} - ${row.name}` : row.id,
      value: row.id,
    }));
  }

  get currentHelperValue(): number {
    const row = this.getSelectedRow();
    if (!row) {
      return 0;
    }
    return Number(row[this.helper.column] ?? 0);
  }

  get rowFormValue(): VaccineResearchRow {
    return this.rowForm.getRawValue() as VaccineResearchRow;
  }

  preGtmTotal(row: VaccineResearchRow): number {
    return (row.preGtmSpentUsd || 0) + (row.preGtmRemainingUsd || 0);
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.isCreatingRow = false;
      this.rowForm.reset({ ...row });
    }
  }

  startNewRow(): void {
    const nextId = this.nextVaccineId();
    this.isCreatingRow = true;
    this.rowForm.reset({
      id: nextId,
      name: 'New vaccine',
      costAccounting: '50% capitalised',
      preGtmSpentUsd: 20000000,
      preGtmRemainingUsd: 10000000,
      postGtmAnnualCostUsd: 500000,
    });
  }

  saveRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineResearchRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      costAccounting: String(value.costAccounting ?? '').trim(),
      preGtmSpentUsd: Number(value.preGtmSpentUsd || 0),
      preGtmRemainingUsd: Number(value.preGtmRemainingUsd || 0),
      postGtmAnnualCostUsd: Number(value.postGtmAnnualCostUsd || 0),
    };
    let nextRows = [...this.rows];
    if (this.isCreatingRow) {
      const existingIndex = nextRows.findIndex((row) => row.id === sanitized.id);
      if (existingIndex >= 0) {
        nextRows[existingIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.selectedRowId = sanitized.id;
      this.isCreatingRow = false;
    } else {
      const selectedIndex = nextRows.findIndex((row) => row.id === this.selectedRowId);
      const duplicateIndex =
        sanitized.id === this.selectedRowId
          ? -1
          : nextRows.findIndex((row) => row.id === sanitized.id);
      if (duplicateIndex >= 0) {
        nextRows[duplicateIndex] = sanitized;
        if (selectedIndex >= 0 && selectedIndex !== duplicateIndex) {
          nextRows.splice(selectedIndex, 1);
        }
      } else if (selectedIndex >= 0) {
        nextRows[selectedIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.selectedRowId = sanitized.id;
    }
    this.rows = nextRows;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
    this.syncSelectedRow();
    this.persist();
  }

  applyIncrement(): void {
    const startRow = this.getSelectedRow();
    if (!startRow) {
      return;
    }
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    const startIndex = this.rows.findIndex((row) => row.id === startRow.id);
    if (startIndex === -1) {
      return;
    }
    const updated = [...this.rows];
    for (let i = 0; i < years; i += 1) {
      const idx = startIndex + i;
      if (!updated[idx]) {
        break;
      }
      const row = { ...updated[idx] };
      const key = this.helper.column;
      row[key] = Number(row[key] ?? 0) + increment;
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineResearchRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccineResearchDevAssumptions: {
        rows: this.rows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()?.vaccineResearchDevAssumptions?.rows;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.id ?? ''),
        name: String(row?.name ?? ''),
        costAccounting: String(row?.costAccounting ?? ''),
        preGtmSpentUsd: Number(row?.preGtmSpentUsd ?? 0),
        preGtmRemainingUsd: Number(row?.preGtmRemainingUsd ?? 0),
        postGtmAnnualCostUsd: Number(row?.postGtmAnnualCostUsd ?? 0),
      }));
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.syncSelectedRow();
    }
  }

  private nextVaccineId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /VAC-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return `VAC-${String(maxId + 1).padStart(3, '0')}`;
  }
}

