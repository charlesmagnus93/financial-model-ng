import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import {
  CassavaAdvancedDecisionTreeResultPayload,
  CassavaAdvancedRegressionResultPayload,
  CassavaBundleResponse,
  CassavaModelService,
  CassavaScenarioConfigPayload,
  CassavaScenarioResultPayload,
  CassavaTablePayload,
} from '../../../services/cassava-model.service';
import {
  formatCassavaCell,
  isNumericValue,
  resolveCassavaTable,
} from './cassava-results-table.utils';

interface MetricRow {
  Metric: string;
  Value: unknown;
}

@Component({
  selector: 'app-cassava-results-advanced-tools-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, TableModule],
  template: `
    @if (!bundle) {
      <div class="rounded border border-surface-200 px-4 py-5 text-sm text-surface-500">
        Run the cassava model to unlock advanced tools.
      </div>
    } @else {
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

        <h3 class="text-2xl font-semibold">Advanced Tools</h3>

        <div class="grid gap-6 xl:grid-cols-2">
          <div class="flex flex-col gap-4">
            <div>
              <p-button
                label="Run Regression"
                [outlined]="true"
                [loading]="isRunningRegression || (isLoadingComparison && loadingConsumer === 'regression')"
                [disabled]="isRunningRegression || isLoadingComparison"
                (onClick)="runRegression()"
              ></p-button>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-surface-500">Forecast periods</label>
              <p-inputnumber
                [showButtons]="true"
                [min]="1"
                [max]="24"
                [useGrouping]="false"
                [ngModel]="forecastPeriods"
                (ngModelChange)="onForecastPeriodsChange($event)"
                inputStyleClass="w-full"
              ></p-inputnumber>
            </div>

            <div>
              <p-button
                label="Run Forecast"
                [outlined]="true"
                [loading]="isRunningForecast"
                [disabled]="isRunningForecast || !annualRows.length || !forecastValueColumn"
                (onClick)="runForecast()"
              ></p-button>
            </div>

            <h3 class="text-2xl font-semibold">Forecast</h3>
            @if (forecastRows.length && forecastColumns.length) {
              <p-table
                [value]="forecastRows"
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
                    @for (column of forecastColumns; track column) {
                      <th>{{ column }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    @for (column of forecastColumns; track column) {
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
                  isRunningForecast
                    ? 'Forecast is running...'
                    : 'Forecast is empty.'
                }}
              </div>
            }
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <p-button
                label="Run Decision Tree"
                [outlined]="true"
                [loading]="isRunningTree || (isLoadingComparison && loadingConsumer === 'tree')"
                [disabled]="isRunningTree || isLoadingComparison"
                (onClick)="runDecisionTree()"
              ></p-button>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs text-surface-500">Revolver window</label>
              <p-inputnumber
                [showButtons]="true"
                [min]="1"
                [max]="60"
                [useGrouping]="false"
                [ngModel]="revolverWindow"
                (ngModelChange)="onRevolverWindowChange($event)"
                inputStyleClass="w-full"
              ></p-inputnumber>
            </div>

            <div>
              <p-button
                label="Run Revolver Projection"
                [outlined]="true"
                [loading]="isRunningRevolver"
                [disabled]="isRunningRevolver || !monthlyRows.length || !revolverValueColumn"
                (onClick)="runRevolver()"
              ></p-button>
            </div>

            <h3 class="text-2xl font-semibold">Revolver Projection</h3>
            @if (revolverRows.length && revolverColumns.length) {
              <p-table
                [value]="revolverRows"
                showGridlines
                responsiveLayout="scroll"
                [scrollable]="true"
                scrollHeight="175px"
                [size]="'small'"
                class="text-sm"
                [tableStyle]="{ 'min-width': '40rem' }"
              >
                <ng-template pTemplate="header">
                  <tr>
                    @for (column of revolverColumns; track column) {
                      <th>{{ column }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    @for (column of revolverColumns; track column) {
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
                  isRunningRevolver
                    ? 'Revolver projection is running...'
                    : 'Revolver Projection is empty.'
                }}
              </div>
            }
          </div>
        </div>

        @if (regressionMetricRows.length || regressionCoefficientRows.length) {
          <h3 class="text-2xl font-semibold">Regression Result</h3>
          <div class="grid gap-4 lg:grid-cols-2">
            @if (regressionMetricRows.length) {
              <p-table [value]="regressionMetricRows" [size]="'small'" showGridlines>
                <ng-template pTemplate="header">
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    <td>{{ row.Metric }}</td>
                    <td class="text-right">{{ formatCell(row.Value, row.Metric) }}</td>
                  </tr>
                </ng-template>
              </p-table>
            }

            @if (regressionCoefficientRows.length) {
              <p-table
                [value]="regressionCoefficientRows"
                [size]="'small'"
                showGridlines
                responsiveLayout="scroll"
                [scrollable]="true"
                scrollHeight="175px"
                [tableStyle]="{ 'min-width': '28rem' }"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th>Feature</th>
                    <th>Coefficient</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    <td>{{ row.Feature }}</td>
                    <td class="text-right">{{ formatCell(row.Coefficient, 'Coefficient') }}</td>
                  </tr>
                </ng-template>
              </p-table>
            }
          </div>
        }

        @if (treeMetricRows.length || treeFeatureRows.length) {
          <h3 class="text-2xl font-semibold">Decision Tree Result</h3>
          <div class="grid gap-4 lg:grid-cols-2">
            @if (treeMetricRows.length) {
              <p-table [value]="treeMetricRows" [size]="'small'" showGridlines>
                <ng-template pTemplate="header">
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    <td>{{ row.Metric }}</td>
                    <td class="text-right">{{ formatCell(row.Value, row.Metric) }}</td>
                  </tr>
                </ng-template>
              </p-table>
            }

            @if (treeFeatureRows.length) {
              <p-table
                [value]="treeFeatureRows"
                [size]="'small'"
                showGridlines
                responsiveLayout="scroll"
                [scrollable]="true"
                scrollHeight="175px"
                [tableStyle]="{ 'min-width': '28rem' }"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th>Feature</th>
                    <th>Importance</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                  <tr>
                    <td>{{ row.Feature }}</td>
                    <td class="text-right">{{ formatCell(row.Importance, 'Importance') }}</td>
                  </tr>
                </ng-template>
              </p-table>
            }
          </div>
        }
      </div>
    }
  `,
})
export class CassavaResultsAdvancedToolsSectionComponent
implements OnInit, OnDestroy {
  private outputSub?: Subscription;

  bundle: CassavaBundleResponse | null = null;

  successMessage = '';
  errorMessage = '';

  isLoadingComparison = false;
  loadingConsumer: 'regression' | 'tree' | null = null;
  comparisonColumns: string[] = [];
  comparisonRows: Array<Record<string, unknown>> = [];

  annualColumns: string[] = [];
  annualRows: Array<Record<string, unknown>> = [];
  monthlyColumns: string[] = [];
  monthlyRows: Array<Record<string, unknown>> = [];

  regressionTarget = 'Project NPV';
  isRunningRegression = false;
  regressionResult: CassavaAdvancedRegressionResultPayload | null = null;
  regressionMetricRows: MetricRow[] = [];
  regressionCoefficientRows: Array<Record<string, unknown>> = [];

  treeTarget = 'Project NPV';
  treeMaxDepth = 3;
  isRunningTree = false;
  treeResult: CassavaAdvancedDecisionTreeResultPayload | null = null;
  treeMetricRows: MetricRow[] = [];
  treeFeatureRows: Array<Record<string, unknown>> = [];

  forecastPeriodColumn = '';
  forecastValueColumn = '';
  forecastPeriods = 5;
  isRunningForecast = false;
  forecastColumns: string[] = [];
  forecastRows: Array<Record<string, unknown>> = [];

  revolverPeriodColumn = '';
  revolverValueColumn = '';
  revolverWindow = 12;
  isRunningRevolver = false;
  revolverColumns: string[] = [];
  revolverRows: Array<Record<string, unknown>> = [];

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.outputSub = this.cassavaModelService.output$.subscribe((output) => {
      this.applySnapshot(output);
    });
    this.applySnapshot(this.cassavaModelService.getOutputSnapshot());
  }

  ngOnDestroy(): void {
    this.outputSub?.unsubscribe();
  }

  formatCell(value: unknown, columnName?: string): string {
    return formatCassavaCell(value, columnName);
  }

  isNumeric(value: unknown): boolean {
    return isNumericValue(value);
  }

  onForecastPeriodsChange(value: number | null | undefined): void {
    this.forecastPeriods = this.clampInteger(value, 1, 24, 5);
  }

  onRevolverWindowChange(value: number | null | undefined): void {
    this.revolverWindow = this.clampInteger(value, 1, 60, 12);
  }

  runRegression(): void {
    if (this.isRunningRegression || this.isLoadingComparison) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.loadingConsumer = 'regression';

    this.ensureComparisonRows(() => {
      if (!this.comparisonRows.length || !this.regressionTarget) {
        this.setError('No scenario comparison data available for regression.');
        return;
      }

      this.isRunningRegression = true;
      this.cassavaModelService
        .runAdvancedRegression(this.toApiRows(this.comparisonRows), this.regressionTarget)
        .pipe(
          take(1),
          finalize(() => {
            this.isRunningRegression = false;
          }),
        )
        .subscribe({
          next: (result) => {
            this.regressionResult = result;
            this.regressionMetricRows = [
              { Metric: 'Intercept', Value: result?.intercept ?? null },
              { Metric: 'Score', Value: result?.score ?? null },
            ];
            this.regressionCoefficientRows = Object.entries(
              result?.coefficients ?? {},
            ).map(([feature, coefficient]) => ({
              Feature: feature,
              Coefficient: coefficient,
            }));
            this.setSuccess('Regression analysis completed.');
          },
          error: (error: unknown) => {
            this.setError(
              this.resolveErrorMessage(error, 'Regression analysis failed.'),
            );
          },
        });
    });
  }

  runDecisionTree(): void {
    if (this.isRunningTree || this.isLoadingComparison) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.loadingConsumer = 'tree';

    this.ensureComparisonRows(() => {
      if (!this.comparisonRows.length || !this.treeTarget) {
        this.setError('No scenario comparison data available for decision tree.');
        return;
      }

      this.isRunningTree = true;
      this.cassavaModelService
        .runAdvancedDecisionTree(
          this.toApiRows(this.comparisonRows),
          this.treeTarget,
          this.treeMaxDepth,
        )
        .pipe(
          take(1),
          finalize(() => {
            this.isRunningTree = false;
          }),
        )
        .subscribe({
          next: (result) => {
            this.treeResult = result;
            this.treeMetricRows = [
              { Metric: 'Depth', Value: result?.depth ?? null },
              { Metric: 'Score', Value: result?.score ?? null },
            ];
            this.treeFeatureRows = Object.entries(
              result?.feature_importances ?? {},
            ).map(([feature, importance]) => ({
              Feature: feature,
              Importance: importance,
            }));
            this.setSuccess('Decision tree analysis completed.');
          },
          error: (error: unknown) => {
            this.setError(
              this.resolveErrorMessage(error, 'Decision tree analysis failed.'),
            );
          },
        });
    });
  }

  runForecast(): void {
    if (this.isRunningForecast) {
      return;
    }
    if (!this.annualRows.length || !this.forecastValueColumn) {
      this.setError('No annual cash flow table is available for forecasting.');
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isRunningForecast = true;
    this.cassavaModelService
      .runAdvancedForecast(this.toApiRows(this.annualRows), {
        periodColumn: this.forecastPeriodColumn || 'Period',
        valueColumn: this.forecastValueColumn,
        periods: this.forecastPeriods,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningForecast = false;
        }),
      )
      .subscribe({
        next: (result) => {
          const table = resolveCassavaTable(
            result?.forecast as CassavaTablePayload | undefined,
            'Period',
          );
          this.forecastColumns = table.columns;
          this.forecastRows = table.rows;
          this.setSuccess('Forecast completed.');
        },
        error: (error: unknown) => {
          this.setError(this.resolveErrorMessage(error, 'Forecast failed.'));
        },
      });
  }

  runRevolver(): void {
    if (this.isRunningRevolver) {
      return;
    }
    if (!this.monthlyRows.length || !this.revolverValueColumn) {
      this.setError('No monthly cash flow table is available for revolver projection.');
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isRunningRevolver = true;
    this.cassavaModelService
      .runAdvancedRevolver(this.toApiRows(this.monthlyRows), {
        periodColumn: this.revolverPeriodColumn || 'Period',
        valueColumn: this.revolverValueColumn,
        window: this.revolverWindow,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isRunningRevolver = false;
        }),
      )
      .subscribe({
        next: (result) => {
          const table = resolveCassavaTable(
            result?.results as CassavaTablePayload | undefined,
            'Period',
          );
          this.revolverColumns = table.columns;
          this.revolverRows = table.rows;
          this.setSuccess('Revolver projection completed.');
        },
        error: (error: unknown) => {
          this.setError(
            this.resolveErrorMessage(error, 'Revolver projection failed.'),
          );
        },
      });
  }

  private ensureComparisonRows(onReady: () => void): void {
    if (this.comparisonRows.length) {
      this.loadingConsumer = null;
      onReady();
      return;
    }

    if (this.isLoadingComparison) {
      return;
    }

    this.isLoadingComparison = true;
    this.cassavaModelService
      .getScenarioPresets()
      .pipe(take(1))
      .subscribe({
        next: (presets) => {
          const scenarios = this.normalizeScenarioConfigs(presets);
          if (!scenarios.length) {
            this.isLoadingComparison = false;
            this.loadingConsumer = null;
            this.setError('No scenario presets returned by API.');
            return;
          }

          this.cassavaModelService
            .runScenarioAnalysis(scenarios)
            .pipe(
              take(1),
              finalize(() => {
                this.isLoadingComparison = false;
                this.loadingConsumer = null;
              }),
            )
            .subscribe({
              next: (result) => {
                this.applyScenarioResult(result);
                if (!this.comparisonRows.length) {
                  this.setError('Scenario comparison is empty.');
                  return;
                }
                onReady();
              },
              error: (error: unknown) => {
                this.setError(
                  this.resolveErrorMessage(error, 'Scenario comparison failed.'),
                );
              },
            });
        },
        error: (error: unknown) => {
          this.isLoadingComparison = false;
          this.loadingConsumer = null;
          this.setError(
            this.resolveErrorMessage(error, 'Unable to load scenario presets.'),
          );
        },
      });
  }

  private applySnapshot(output: CassavaBundleResponse | null): void {
    this.bundle = output ? this.deepClone(output) : null;

    const annual = resolveCassavaTable(
      this.bundle?.['cash_flow_annual'] as CassavaTablePayload | undefined,
    );
    this.annualColumns = annual.columns;
    this.annualRows = annual.rows;

    const monthly = resolveCassavaTable(
      this.bundle?.['cash_flow_monthly'] as CassavaTablePayload | undefined,
    );
    this.monthlyColumns = monthly.columns;
    this.monthlyRows = monthly.rows;

    this.syncForecastControls();
    this.syncRevolverControls();
  }

  private applyScenarioResult(result: CassavaScenarioResultPayload): void {
    const comparison = resolveCassavaTable(
      result?.comparison as CassavaTablePayload | undefined,
      'Scenario',
    );
    this.comparisonColumns = comparison.columns;
    this.comparisonRows = comparison.rows;

    if (!this.comparisonColumns.includes(this.regressionTarget)) {
      this.regressionTarget = this.pickPreferredColumn(this.comparisonColumns, [
        'Project NPV',
        'Project IRR',
      ]);
    }
    if (!this.comparisonColumns.includes(this.treeTarget)) {
      this.treeTarget = this.regressionTarget;
    }
  }

  private normalizeScenarioConfigs(
    presets: CassavaScenarioConfigPayload[],
  ): CassavaScenarioConfigPayload[] {
    if (!Array.isArray(presets)) {
      return [];
    }
    return presets
      .map((preset) => ({
        name: String(preset?.name || '').trim(),
        overrides:
          preset?.overrides && typeof preset.overrides === 'object'
            ? preset.overrides
            : {},
      }))
      .filter((preset) => preset.name && Object.keys(preset.overrides).length > 0);
  }

  private syncForecastControls(): void {
    if (!this.annualColumns.length) {
      this.forecastPeriodColumn = '';
      this.forecastValueColumn = '';
      return;
    }

    this.forecastPeriodColumn = this.annualColumns.includes(this.forecastPeriodColumn)
      ? this.forecastPeriodColumn
      : this.pickPreferredColumn(this.annualColumns, ['Period', 'Year', 'Index']);

    this.forecastValueColumn = this.annualColumns.includes(this.forecastValueColumn)
      ? this.forecastValueColumn
      : this.pickPreferredColumn(this.annualColumns, [
        'Free Cash Flow',
        'Net Cash Flow',
        'Value',
      ]);
  }

  private syncRevolverControls(): void {
    if (!this.monthlyColumns.length) {
      this.revolverPeriodColumn = '';
      this.revolverValueColumn = '';
      return;
    }

    this.revolverPeriodColumn = this.monthlyColumns.includes(this.revolverPeriodColumn)
      ? this.revolverPeriodColumn
      : this.pickPreferredColumn(this.monthlyColumns, ['Period', 'Month', 'Year', 'Index']);

    this.revolverValueColumn = this.monthlyColumns.includes(this.revolverValueColumn)
      ? this.revolverValueColumn
      : this.pickPreferredColumn(this.monthlyColumns, [
        'Free Cash Flow',
        'Net Cash Flow',
        'Value',
      ]);
  }

  private pickPreferredColumn(columns: string[], preferred: string[]): string {
    if (!columns.length) {
      return '';
    }

    for (const candidate of preferred) {
      const exact = columns.find((column) => column === candidate);
      if (exact) {
        return exact;
      }
    }

    for (const candidate of preferred) {
      const insensitive = columns.find(
        (column) => column.toLowerCase() === candidate.toLowerCase(),
      );
      if (insensitive) {
        return insensitive;
      }
    }

    return columns[0] ?? '';
  }

  private toApiRows(
    rows: Array<Record<string, unknown>>,
  ): Array<Record<string, any>> {
    return rows.map((row) => ({ ...row }));
  }

  private clampInteger(
    value: number | null | undefined,
    min: number,
    max: number,
    fallback: number,
  ): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.trunc(numeric)));
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

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
