import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
  CassavaModelService,
  CassavaSensitivityResultPayload,
  CassavaSensitivityScenarioPayload,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface SensitivityScenarioRow {
  name: string;
  parameter: string;
  delta: number | null;
}

@Component({
  selector: 'app-cassava-results-sentivity-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      @if (successMessage) {
        <div class="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ errorMessage }}
        </div>
      }

      <p-fieldset legend="Sensitivity Analysis" [toggleable]="true" class="w-full">
        <form class="mb-4 grid grid-cols-12 gap-4" (ngSubmit)="saveScenario()">
          <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Name</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="nameValue"
              name="scenario_name"
              placeholder="Ex: Corporate tax +1pp"
            />
          </div>

          <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Parameter</label>
            <input
              pInputText
              class="w-full"
              [(ngModel)]="parameterValue"
              name="scenario_parameter"
              placeholder="Ex: Corporate tax rate"
            />
          </div>

          <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label class="text-xs text-surface-500">Delta</label>
            <p-inputnumber
              [showButtons]="true"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="4"
              [useGrouping]="false"
              [(ngModel)]="deltaValue"
              name="scenario_delta"
              inputStyleClass="w-full"
            ></p-inputnumber>
          </div>

          <div
            class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-12]="!isEditing"
            [class.lg:col-span-6]="isEditing"
          >
            <p-button
              fluid
              type="submit"
              severity="success"
              variant="outlined"
              [label]="isEditing ? 'Edit' : 'Add'"
              [icon]="isEditing ? 'pi pi-check' : 'pi pi-plus'"
              class="w-full"
              [disabled]="isRunning"
            ></p-button>
          </div>

          @if (isEditing) {
            <div class="col-span-12 flex flex-col gap-2 lg:col-span-6">
              <p-button
                fluid
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                [outlined]="true"
                [disabled]="isRunning"
                (onClick)="cancelEdit()"
              ></p-button>
            </div>
          }
        </form>

        @if (formErrorMessage) {
          <div class="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {{ formErrorMessage }}
          </div>
        }

        <div class="mb-3">
          <p-button
            label="Run Sensitivity"
            icon="pi pi-play"
            [outlined]="true"
            [loading]="isRunning"
            [disabled]="isRunning || !hasValidScenarioRows()"
            (onClick)="runSensitivity()"
          ></p-button>
        </div>

        <p-table
          [value]="scenarioRows"
          [scrollable]="true"
          scrollHeight="280px"
          responsiveLayout="scroll"
          [tableStyle]="{ 'min-width': '64rem' }"
          showGridlines
          [size]="'small'"
          class="text-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>name</th>
              <th>parameter</th>
              <th>delta</th>
              <th class="w-28 text-right">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
            <tr>
              <td>{{ row.name }}</td>
              <td>{{ row.parameter }}</td>
              <td class="text-right">{{ formatCell(row.delta, 'Delta') }}</td>
              <td class="text-right">
                <div class="flex justify-end gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    severity="secondary"
                    size="small"
                    [text]="true"
                    [disabled]="isRunning"
                    (onClick)="onEditRow(row, rowIndex)"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    [text]="true"
                    [disabled]="isRunning"
                    (onClick)="removeRow(rowIndex)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center text-sm text-surface-500">
                {{
                  isLoadingDefaults
                    ? 'Loading sensitivity scenarios...'
                    : 'Sensitivity scenarios are empty.'
                }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-fieldset>

      <h3 class="text-2xl font-semibold">Sensitivity Results</h3>
      @if (resultsRows.length && resultsColumns.length) {
        <p-table
          [value]="resultsRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="280px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '72rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of resultsColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of resultsColumns; track column) {
                <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-500">
          {{
            isRunning
              ? 'Running sensitivity analysis...'
              : 'Sensitivity Results is empty.'
          }}
        </div>
      }

      <h3 class="text-2xl font-semibold">Tornado Drivers</h3>
      @if (tornadoRows.length && tornadoColumns.length) {
        <p-table
          [value]="tornadoRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="280px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '72rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of tornadoColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of tornadoColumns; track column) {
                <td class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-500">
          {{
            isRunning
              ? 'Computing tornado drivers...'
              : 'Tornado Drivers is empty.'
          }}
        </div>
      }
    </div>
  `,
})
export class CassavaResultsSentivitySectionComponent implements OnInit {
  isLoadingDefaults = false;
  isRunning = false;

  successMessage = '';
  errorMessage = '';
  formErrorMessage = '';

  nameValue = '';
  parameterValue = '';
  deltaValue: number | null = null;
  editingRowIndex: number | null = null;

  scenarioRows: SensitivityScenarioRow[] = [];
  resultsColumns: string[] = [];
  resultsRows: Array<Record<string, unknown>> = [];
  tornadoColumns: string[] = [];
  tornadoRows: Array<Record<string, unknown>> = [];

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.loadDefaults();
  }

  get isEditing(): boolean {
    return this.editingRowIndex !== null;
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  saveScenario(): void {
    const name = String(this.nameValue ?? '').trim();
    const parameter = String(this.parameterValue ?? '').trim();
    const delta = this.toFiniteNumber(this.deltaValue);

    if (!name) {
      this.formErrorMessage = 'Name is required.';
      return;
    }
    if (!parameter) {
      this.formErrorMessage = 'Parameter is required.';
      return;
    }
    if (delta === null) {
      this.formErrorMessage = 'Delta is required.';
      return;
    }

    this.formErrorMessage = '';
    this.setIdleMessages();

    const nextRow: SensitivityScenarioRow = { name, parameter, delta };
    if (
      this.editingRowIndex !== null &&
      this.editingRowIndex >= 0 &&
      this.editingRowIndex < this.scenarioRows.length
    ) {
      const next = [...this.scenarioRows];
      next[this.editingRowIndex] = nextRow;
      this.scenarioRows = next;
    } else {
      this.scenarioRows = [...this.scenarioRows, nextRow];
    }
    this.resetForm();
  }

  onEditRow(row: SensitivityScenarioRow, index: number): void {
    this.editingRowIndex = index;
    this.nameValue = String(row.name ?? '');
    this.parameterValue = String(row.parameter ?? '');
    this.deltaValue = this.toFiniteNumber(row.delta);
    this.formErrorMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  removeRow(index: number): void {
    if (index < 0 || index >= this.scenarioRows.length) {
      return;
    }
    const next = [...this.scenarioRows];
    next.splice(index, 1);
    this.scenarioRows = next;

    if (this.editingRowIndex === index) {
      this.resetForm();
      return;
    }
    if (this.editingRowIndex !== null && this.editingRowIndex > index) {
      this.editingRowIndex -= 1;
    }
  }

  hasValidScenarioRows(): boolean {
    return this.toPayloadRows().length > 0;
  }

  runSensitivity(): void {
    if (this.isRunning) {
      return;
    }

    const scenarios = this.toPayloadRows();
    if (!scenarios.length) {
      this.setError('Please provide at least one valid scenario before running.');
      return;
    }

    this.setIdleMessages();
    this.isRunning = true;

    this.cassavaModelService
      .runSensitivity(scenarios)
      .pipe(
        take(1),
        finalize(() => {
          this.isRunning = false;
        }),
      )
      .subscribe({
        next: (result) => {
          this.applySensitivityResult(result);
          this.setSuccess('Sensitivity analysis completed.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Sensitivity analysis failed.'),
          );
        },
      });
  }

  private loadDefaults(): void {
    if (this.isLoadingDefaults) {
      return;
    }

    this.isLoadingDefaults = true;
    this.cassavaModelService
      .getSensitivityDefaults()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingDefaults = false;
        }),
      )
      .subscribe({
        next: (defaults) => {
          const mapped = this.mapDefaultsToRows(defaults);
          this.scenarioRows = mapped.length ? mapped : this.fallbackRows();
        },
        error: () => {
          this.scenarioRows = this.fallbackRows();
        },
      });
  }

  private applySensitivityResult(result: CassavaSensitivityResultPayload): void {
    const results = resolveCassavaTable(
      result?.results as CassavaTablePayload | undefined,
      'Case',
    );
    this.resultsColumns = results.columns;
    this.resultsRows = results.rows;

    const tornado = resolveCassavaTable(
      result?.tornado as CassavaTablePayload | undefined,
      'Driver',
    );
    this.tornadoColumns = tornado.columns;
    this.tornadoRows = tornado.rows;
  }

  private mapDefaultsToRows(
    defaults: CassavaSensitivityScenarioPayload[],
  ): SensitivityScenarioRow[] {
    if (!Array.isArray(defaults)) {
      return [];
    }

    const rows: SensitivityScenarioRow[] = [];
    for (const item of defaults) {
      const name = String(item?.name ?? '').trim();
      const parameter = String(item?.parameter ?? '').trim();
      const delta = this.toFiniteNumber(item?.delta);
      if (!name || !parameter || delta === null) {
        continue;
      }
      rows.push({
        name,
        parameter,
        delta,
      });
    }
    return rows;
  }

  private fallbackRows(): SensitivityScenarioRow[] {
    return [
      {
        name: 'Corporate tax +1pp',
        parameter: 'Corporate tax rate',
        delta: 0.01,
      },
      {
        name: 'Corporate tax -1pp',
        parameter: 'Corporate tax rate',
        delta: -0.01,
      },
      {
        name: 'Discount rate +1pp',
        parameter: 'Discount rate',
        delta: 0.01,
      },
      {
        name: 'Discount rate -1pp',
        parameter: 'Discount rate',
        delta: -0.01,
      },
    ];
  }

  private toPayloadRows(): CassavaSensitivityScenarioPayload[] {
    return this.scenarioRows
      .map((row) => {
        const name = String(row.name ?? '').trim();
        const parameter = String(row.parameter ?? '').trim();
        const delta = this.toFiniteNumber(row.delta);
        if (!name || !parameter || delta === null) {
          return null;
        }
        return {
          name,
          parameter,
          delta,
        };
      })
      .filter((row): row is CassavaSensitivityScenarioPayload => !!row);
  }

  private resetForm(): void {
    this.editingRowIndex = null;
    this.nameValue = '';
    this.parameterValue = '';
    this.deltaValue = null;
    this.formErrorMessage = '';
  }

  private toFiniteNumber(value: unknown): number | null {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return numeric;
  }

  private setIdleMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const maybeError = error as { message?: string; error?: unknown };
      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
      if (maybeError.error && typeof maybeError.error === 'object') {
        const body = maybeError.error as { detail?: string; message?: string };
        if (typeof body.detail === 'string' && body.detail.trim()) {
          return body.detail;
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return body.message;
        }
      }
    }
    return fallback;
  }
}
