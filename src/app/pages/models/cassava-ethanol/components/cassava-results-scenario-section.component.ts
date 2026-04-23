import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
  CassavaGoalSeekResultPayload,
  CassavaModelService,
  CassavaScenarioConfigPayload,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  metricsToRows,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface ScenarioEditorRow {
  name: string;
  overridesJson: string;
}

interface GoalSeekDisplayRow {
  metric: string;
  value: unknown;
}

@Component({
  selector: 'app-cassava-results-scenario-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

      <h3 class="text-2xl font-semibold">Scenario / IFs Analysis</h3>

      <div>
        <p-button
          label="Load Scenario Presets"
          [outlined]="true"
          [loading]="isLoadingPresets"
          [disabled]="isLoadingPresets || isRunningScenario"
          (onClick)="loadScenarioPresets()"
        ></p-button>
      </div>

      <form class="grid grid-cols-12 gap-4" (ngSubmit)="saveScenario()">
        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Name</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="nameValue"
            name="scenario_name"
            placeholder="Ex: Tax +1pp"
          />
        </div>

        <div class="col-span-12 md:col-span-8 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Overrides JSON</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="overridesJsonValue"
            name="scenario_overrides_json"
            placeholder='Ex: {"Corporate tax rate":0.01}'
          />
        </div>

        <div class="col-span-12 flex flex-col gap-2"
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
            [disabled]="isRunningScenario || isLoadingPresets"
          ></p-button>
        </div>

        @if (isEditing) {
          <div class="col-span-12 flex flex-col gap-2"
            [class.lg:col-span-6]="isEditing"
          >
            <p-button
              fluid
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              [outlined]="true"
              [disabled]="isRunningScenario || isLoadingPresets"
              (onClick)="cancelEdit()"
            ></p-button>
          </div>
        }
      </form>

      @if (formErrorMessage) {
        <div class="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {{ formErrorMessage }}
        </div>
      }

      <p-table
        [value]="scenarioRows"
        [scrollable]="true"
        scrollHeight="240px"
        responsiveLayout="scroll"
        [tableStyle]="{ 'min-width': '68rem' }"
        showGridlines
        [size]="'small'"
        class="text-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>name</th>
            <th>overrides_json</th>
            <th class="w-28 text-right">Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
          <tr>
            <td>{{ row.name }}</td>
            <td class="break-all">{{ row.overridesJson }}</td>
            <td class="text-right">
              <div class="flex justify-end gap-2">
                <p-button
                  icon="pi pi-pencil"
                  severity="secondary"
                  size="small"
                  [text]="true"
                  [disabled]="isRunningScenario || isLoadingPresets"
                  (onClick)="onEditRow(row, rowIndex)"
                ></p-button>
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  [text]="true"
                  [disabled]="isRunningScenario || isLoadingPresets"
                  (onClick)="removeRow(rowIndex)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="3" class="text-center text-sm text-surface-500">
              {{
                isLoadingPresets
                  ? 'Loading scenario presets...'
                  : 'Scenario list is empty.'
              }}
            </td>
          </tr>
        </ng-template>
      </p-table>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Goal-seek parameter</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="goalSeekParameter"
            name="goal_seek_parameter"
          />
        </div>

        <div class="col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Goal-seek metric</label>
          <input
            pInputText
            class="w-full"
            [(ngModel)]="goalSeekMetric"
            name="goal_seek_metric"
          />
        </div>

        <div class="col-span-4 flex flex-col gap-2">
          <label class="text-xs text-surface-500">Goal-seek target value</label>
          <p-inputnumber
            [showButtons]="true"
            [step]="1000"
            [minFractionDigits]="2"
            [maxFractionDigits]="4"
            [ngModel]="goalSeekTargetValue"
            (ngModelChange)="onGoalSeekTargetChange($event)"
            inputStyleClass="w-full"
          ></p-inputnumber>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-3">
        <p-button
          fluid
          label="Run Reverse Stress"
          [outlined]="true"
          [loading]="isRunningReverseStress"
          [disabled]="isRunningReverseStress || isRunningGoalSeek || isRunningScenario"
          (onClick)="runReverseStress()"
        ></p-button>

        <p-button
          fluid
          label="Run Goal Seek"
          [outlined]="true"
          [loading]="isRunningGoalSeek"
          [disabled]="isRunningGoalSeek || isRunningReverseStress || isRunningScenario"
          (onClick)="runGoalSeek()"
        ></p-button>

        <p-button
          fluid
          label="Run Scenario Comparison"
          [outlined]="true"
          [loading]="isRunningScenario"
          [disabled]="isRunningScenario || !hasValidScenarioRows()"
          (onClick)="runScenarioComparison()"
        ></p-button>
        
      </div>


      <h3 class="text-2xl font-semibold">Scenario Parameter Catalog</h3>
      @if (catalogRows.length && catalogColumns.length) {
        <p-table
          [value]="catalogRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="220px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '72rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of catalogColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of catalogColumns; track column) {
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
            isRunningScenario
              ? 'Loading scenario parameter catalog...'
              : 'Scenario Parameter Catalog is empty.'
          }}
        </div>
      }

      <h3 class="text-2xl font-semibold">Base Metrics</h3>
      @if (baseMetricsRows.length) {
        <p-table
          [value]="baseMetricsRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="260px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '40rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.metric }}</td>
              <td class="whitespace-nowrap text-right">
                {{ formatCell(row.value, row.metric) }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-500">
          {{
            isRunningScenario
              ? 'Loading base metrics...'
              : 'Base Metrics is empty.'
          }}
        </div>
      }

      <h3 class="text-2xl font-semibold">Scenario Comparison</h3>
      @if (comparisonRows.length && comparisonColumns.length) {
        <p-table
          [value]="comparisonRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="260px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '72rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of comparisonColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of comparisonColumns; track column) {
                <td style="min-width: 9rem;" class="whitespace-nowrap" [class.text-right]="isNumeric(row[column])">
                  {{ formatCell(row[column], column) }}
                </td>
              }
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="rounded border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-500">
          {{
            isRunningScenario
              ? 'Computing scenario comparison...'
              : 'Scenario Comparison is empty.'
          }}
        </div>
      }

      <h3 class="text-2xl font-semibold">Reverse Stress</h3>
      @if (reverseRows.length && reverseColumns.length) {
        <p-table
          [value]="reverseRows"
          showGridlines
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="240px"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '64rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              @for (column of reverseColumns; track column) {
                <th>{{ column }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (column of reverseColumns; track column) {
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
            isRunningReverseStress
              ? 'Running reverse stress...'
              : 'Reverse Stress is empty.'
          }}
        </div>
      }

      @if (goalSeekRows.length) {
        <h3 class="text-2xl font-semibold">Goal Seek Result</h3>
        <p-table
          [value]="goalSeekRows"
          showGridlines
          responsiveLayout="scroll"
          [size]="'small'"
          class="text-sm"
          [tableStyle]="{ 'min-width': '36rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.metric }}</td>
              <td class="text-right">{{ formatCell(row.value, row.metric) }}</td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
})
export class CassavaResultsScenarioSectionComponent {
  isLoadingPresets = false;
  isRunningScenario = false;
  isRunningReverseStress = false;
  isRunningGoalSeek = false;

  successMessage = '';
  errorMessage = '';
  formErrorMessage = '';

  scenarioRows: ScenarioEditorRow[] = [];
  nameValue = '';
  overridesJsonValue = '';
  editingRowIndex: number | null = null;

  goalSeekParameter = 'Corporate tax rate';
  goalSeekMetric = 'Project NPV';
  goalSeekTargetValue = 0;

  catalogColumns: string[] = [];
  catalogRows: Array<Record<string, unknown>> = [];
  baseMetricsRows: Array<{ metric: string; value: unknown }> = [];
  comparisonColumns: string[] = [];
  comparisonRows: Array<Record<string, unknown>> = [];
  reverseColumns: string[] = [];
  reverseRows: Array<Record<string, unknown>> = [];
  goalSeekRows: GoalSeekDisplayRow[] = [];

  constructor(private cassavaModelService: CassavaModelService) {}

  get isEditing(): boolean {
    return this.editingRowIndex !== null;
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  onGoalSeekTargetChange(value: number | null | undefined): void {
    const numeric = Number(value);
    this.goalSeekTargetValue = Number.isFinite(numeric) ? numeric : 0;
  }

  saveScenario(): void {
    const name = String(this.nameValue ?? '').trim();
    const overridesJson = String(this.overridesJsonValue ?? '').trim();

    if (!name) {
      this.formErrorMessage = 'Name is required.';
      return;
    }

    if (!overridesJson) {
      this.formErrorMessage = 'Overrides JSON is required.';
      return;
    }

    if (!this.tryParseOverrides(overridesJson)) {
      this.formErrorMessage =
        'Overrides JSON must be a valid object with numeric values.';
      return;
    }

    this.formErrorMessage = '';
    const rows = [...this.scenarioRows];
    const candidateIndex =
      this.editingRowIndex !== null &&
      this.editingRowIndex >= 0 &&
      this.editingRowIndex < rows.length
        ? this.editingRowIndex
        : rows.findIndex(
            (row) =>
              String(row.name ?? '')
                .trim()
                .toLowerCase() === name.toLowerCase(),
          );

    const next: ScenarioEditorRow = {
      name,
      overridesJson,
    };

    if (candidateIndex >= 0) {
      rows[candidateIndex] = next;
    } else {
      rows.push(next);
    }

    this.scenarioRows = rows;
    this.resetScenarioForm();
  }

  onEditRow(row: ScenarioEditorRow, index: number): void {
    this.editingRowIndex = index;
    this.nameValue = String(row.name ?? '');
    this.overridesJsonValue = String(row.overridesJson ?? '');
    this.formErrorMessage = '';
  }

  cancelEdit(): void {
    this.resetScenarioForm();
  }

  removeRow(index: number): void {
    if (index < 0 || index >= this.scenarioRows.length) {
      return;
    }
    const rows = [...this.scenarioRows];
    rows.splice(index, 1);
    this.scenarioRows = rows;

    if (this.editingRowIndex === index) {
      this.resetScenarioForm();
      return;
    }

    if (this.editingRowIndex !== null && this.editingRowIndex > index) {
      this.editingRowIndex -= 1;
    }
  }

  loadScenarioPresets(): void {
    if (this.isLoadingPresets) {
      return;
    }

    this.setIdleMessages();
    this.isLoadingPresets = true;
    this.cassavaModelService
      .getScenarioPresets()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingPresets = false;
        }),
      )
      .subscribe({
        next: (presets) => {
          this.scenarioRows = presets
            .map((preset) => ({
              name: String(preset?.name ?? '').trim(),
              overridesJson: JSON.stringify(preset?.overrides ?? {}),
            }))
            .filter((row) => row.name);
          this.resetScenarioForm();

          this.setSuccess(
            this.scenarioRows.length
              ? 'Scenario presets loaded.'
              : 'No scenario presets returned.',
          );
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Unable to load scenario presets.'),
          );
        },
      });
  }

  hasValidScenarioRows(): boolean {
    return this.toScenarioConfigs().length > 0;
  }

  runScenarioComparison(): void {
    if (this.isRunningScenario) {
      return;
    }

    const scenarios = this.toScenarioConfigs();
    if (!scenarios.length) {
      this.setError('Please load at least one valid scenario configuration.');
      return;
    }

    this.setIdleMessages();
    this.isRunningScenario = true;
    forkJoin({
      catalog: this.cassavaModelService.getScenarioParameterCatalog(),
      scenario: this.cassavaModelService.runScenarioAnalysis(scenarios),
    })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningScenario = false;
        }),
      )
      .subscribe({
        next: ({ catalog, scenario }) => {
          const catalogTable = resolveCassavaTable(
            catalog as CassavaTablePayload | undefined,
            'Parameter',
          );
          this.catalogColumns = catalogTable.columns;
          this.catalogRows = catalogTable.rows;
          this.baseMetricsRows = metricsToRows(
            (scenario?.base_metrics as Record<string, unknown> | undefined) ?? null,
          );

          const comparisonTable = resolveCassavaTable(
            scenario?.comparison as CassavaTablePayload | undefined,
            'Case',
          );
          this.comparisonColumns = comparisonTable.columns;
          this.comparisonRows = comparisonTable.rows;

          this.setSuccess('Scenario comparison completed.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Scenario comparison failed.'),
          );
        },
      });
  }

  runReverseStress(): void {
    if (this.isRunningReverseStress) {
      return;
    }

    this.setIdleMessages();
    this.isRunningReverseStress = true;
    this.cassavaModelService
      .runReverseStress()
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningReverseStress = false;
        }),
      )
      .subscribe({
        next: (response) => {
          const table = resolveCassavaTable(
            response?.results as CassavaTablePayload | undefined,
            'Scenario',
          );
          this.reverseColumns = table.columns;
          this.reverseRows = table.rows;
          this.setSuccess('Reverse stress completed.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Reverse stress failed.'),
          );
        },
      });
  }

  runGoalSeek(): void {
    if (this.isRunningGoalSeek) {
      return;
    }

    this.setIdleMessages();
    this.isRunningGoalSeek = true;
    this.cassavaModelService
      .runGoalSeek({
        parameter: this.goalSeekParameter,
        metric: this.goalSeekMetric,
        targetValue: this.goalSeekTargetValue,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningGoalSeek = false;
        }),
      )
      .subscribe({
        next: (result) => {
          this.goalSeekRows = this.goalSeekToRows(result);
          this.setSuccess('Goal seek completed.');
        },
        error: (error: unknown) => {
          this.setError(this.resolveErrorMessage(error, 'Goal seek failed.'));
        },
      });
  }

  private toScenarioConfigs(): CassavaScenarioConfigPayload[] {
    const configs: CassavaScenarioConfigPayload[] = [];
    for (const row of this.scenarioRows) {
      const name = String(row.name ?? '').trim();
      const overrides = this.tryParseOverrides(row.overridesJson);
      if (!name || !overrides) {
        continue;
      }
      configs.push({ name, overrides });
    }
    return configs;
  }

  private tryParseOverrides(raw: string): Record<string, number> | null {
    const text = String(raw ?? '').trim();
    if (!text) {
      return null;
    }

    try {
      const value = JSON.parse(text);
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
      }

      const normalized: Record<string, number> = {};
      for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
        const name = String(key ?? '').trim();
        if (!name) {
          continue;
        }
        const numeric = Number(entryValue);
        if (!Number.isFinite(numeric)) {
          return null;
        }
        normalized[name] = numeric;
      }

      return normalized;
    } catch {
      return null;
    }
  }

  private goalSeekToRows(result: CassavaGoalSeekResultPayload): GoalSeekDisplayRow[] {
    const rows: GoalSeekDisplayRow[] = [];
    const ordered = [
      'parameter',
      'metric',
      'target_value',
      'target_name',
      'achieved_value',
      'tolerance',
      'iterations',
    ];

    for (const key of ordered) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        rows.push({
          metric: this.humanizeLabel(key),
          value: result[key],
        });
      }
    }

    for (const [key, value] of Object.entries(result ?? {})) {
      if (!ordered.includes(key)) {
        rows.push({
          metric: this.humanizeLabel(key),
          value,
        });
      }
    }

    return rows;
  }

  private resetScenarioForm(): void {
    this.editingRowIndex = null;
    this.nameValue = '';
    this.overridesJsonValue = '';
    this.formErrorMessage = '';
  }

  private humanizeLabel(value: string): string {
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
