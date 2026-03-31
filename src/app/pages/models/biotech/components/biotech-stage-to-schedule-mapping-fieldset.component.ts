import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { BiotechStageDurationsFieldsetComponent } from './biotech-stage-durations-fieldset.component';
import { BiotechTransitionProbabilitiesFieldsetComponent } from './biotech-transition-probabilities-fieldset.component';
import { BiotechRdCapexAllocationFieldsetComponent } from './biotech-rd-capex-allocation-fieldset.component';
import { BiotechMilestonesFieldsetComponent } from './biotech-milestones-fieldset.component';
import { BiotechFullMappingTableFieldsetComponent } from './biotech-full-mapping-table-fieldset.component';
import { BiotechMappingAuditTrailFieldsetComponent } from './biotech-mapping-audit-trail-fieldset.component';

interface StageOption {
  label: string;
  value: string;
}

interface AuditEntry {
  timestamp: string;
  action: string;
  stage: string;
  owner: string;
}

type StageRow = Record<string, any>;

@Component({
  standalone: true,
  selector: 'biotech-stage-to-schedule-mapping-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    BiotechStageDurationsFieldsetComponent,
    BiotechTransitionProbabilitiesFieldsetComponent,
    BiotechRdCapexAllocationFieldsetComponent,
    BiotechMilestonesFieldsetComponent,
    BiotechFullMappingTableFieldsetComponent,
    BiotechMappingAuditTrailFieldsetComponent,
  ],
  template: `
    <p-fieldset legend="Stage-to-schedule mapping" [toggleable]="true" class="w-full mt-4">
      <div class="flex flex-col gap-4">
        <p class="text-xs text-surface-500">
          Define default schedule assumptions per stage. These defaults can automatically
          populate product assumptions when the stage changes. Stage durations are used to
          derive time-to-market and to build annual transition probability curves.
        </p>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Mapping updated by</label>
          <input
            pInputText
            [(ngModel)]="mappingUpdatedBy"
            (ngModelChange)="updateMappingMeta()"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <p-checkbox
              [(ngModel)]="autoApplyDefaults"
              [binary]="true"
              (ngModelChange)="updateMappingMeta()"
            ></p-checkbox>
            <span class="text-sm font-semibold">Auto-apply stage defaults to product assumptions</span>
          </div>
          <div class="flex items-center gap-2">
            <p-checkbox
              [(ngModel)]="overrideExistingValues"
              [binary]="true"
              (ngModelChange)="updateMappingMeta()"
            ></p-checkbox>
            <span class="text-sm font-semibold">Override existing values when applying defaults</span>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-sm font-semibold">Quick edit by stage</div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold">Select stage to edit</label>
            <p-select
              [options]="stageOptions"
              [(ngModel)]="selectedStage"
              (ngModelChange)="onStageChange()"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            ></p-select>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">Success Probability %</label>
              <p-inputnumber
                [(ngModel)]="quickEditor.successProbabilityPct"
                [showButtons]="true"
                [min]="0"
                [max]="100"
                [step]="0.1"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">Sales ramp length (years)</label>
              <p-inputnumber
                [(ngModel)]="quickEditor.salesRampYears"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
            </div>
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">R&D remaining pre-launch (USD)</label>
              <p-inputnumber
                [(ngModel)]="quickEditor.rdRemainingPreLaunchUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
            </div>
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">Time to market (years)</label>
              <p-inputnumber
                [(ngModel)]="quickEditor.timeToMarketYears"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
            </div>
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">Ramp shape</label>
              <p-select
                [options]="rampShapeOptions"
                [(ngModel)]="quickEditor.rampShape"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
            </div>
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
              <label class="text-sm font-semibold">R&D annual post-launch (USD/year)</label>
              <p-inputnumber
                [(ngModel)]="quickEditor.rdAnnualPostLaunchUsd"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="true"
                inputStyleClass="w-full"
              />
            </div>
          </div>

          <biotech-stage-durations-fieldset
            [fields]="stageDurationFields"
            [selectedRow]="selectedStageRow"
            (fieldChange)="updateSelectedRowField($event.key, $event.value)"
          ></biotech-stage-durations-fieldset>

          <biotech-transition-probabilities-fieldset
            [entries]="transitionEntries()"
            (fieldChange)="updateSelectedRowField($event.key, $event.value)"
          ></biotech-transition-probabilities-fieldset>

          <biotech-rd-capex-allocation-fieldset
            [fields]="allocationFields"
            [selectedRow]="selectedStageRow"
            (fieldChange)="updateSelectedRowField($event.key, $event.value)"
          ></biotech-rd-capex-allocation-fieldset>

          <biotech-milestones-fieldset
            [entries]="milestoneEntries()"
            (fieldChange)="updateSelectedRowField($event.key, $event.value)"
          ></biotech-milestones-fieldset>

          <div>
            <p-button
              label="Apply quick edits"
              size="small"
              [outlined]="true"
              (onClick)="applyQuickEdits()"
            ></p-button>
          </div>

          <biotech-full-mapping-table-fieldset
            [rows]="stageRows"
          ></biotech-full-mapping-table-fieldset>

          <biotech-mapping-audit-trail-fieldset
            [entries]="auditLog"
          ></biotech-mapping-audit-trail-fieldset>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechStageToScheduleMappingFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();
  private defaultsSnapshot: any | null = null;
  private defaultsStageRows: StageRow[] = [];

  stageRows: StageRow[] = [];
  selectedStage = '';
  mappingUpdatedBy = 'Finance';
  autoApplyDefaults = true;
  overrideExistingValues = false;
  auditLog: AuditEntry[] = [];

  quickEditor = {
    successProbabilityPct: 0,
    salesRampYears: 0,
    rdRemainingPreLaunchUsd: 0,
    timeToMarketYears: 0,
    rampShape: 'Linear',
    rdAnnualPostLaunchUsd: 0,
  };

  rampShapeOptions: StageOption[] = [
    { label: 'Linear', value: 'Linear' },
    { label: 'S-curve', value: 'S-curve' },
    { label: 'Front-loaded', value: 'Front-loaded' },
    { label: 'Back-loaded', value: 'Back-loaded' },
  ];

  stageDurationFields: Array<{ label: string; key: string }> = [];

  allocationFields: Array<{ label: string; key: string }> = [];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.loadStageMappingDefaults();
    this.syncFromModel();
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get stageOptions(): StageOption[] {
    return this.stageRows.map((row) => {
      const stage = String(row?.['Stage'] ?? '').trim();
      return { label: stage, value: stage };
    });
  }

  get selectedStageRow(): StageRow | undefined {
    return this.findSelectedRow();
  }

  updateMappingMeta(): void {
    this.persistCurrentRows();
  }

  onStageChange(): void {
    this.syncQuickEditorFromSelectedStage();
    this.persistCurrentRows();
  }

  applyQuickEdits(): void {
    const current = this.findSelectedRow();
    if (!current) {
      return;
    }

    const updatedRow: StageRow = {
      ...current,
      'Success Probability %': this.toNumber(this.quickEditor.successProbabilityPct),
      'Sales ramp length (years)': this.toNumber(this.quickEditor.salesRampYears),
      'R&D remaining pre-launch (USD)': this.toNumber(this.quickEditor.rdRemainingPreLaunchUsd),
      'Time to market (years)': this.toNumber(this.quickEditor.timeToMarketYears),
      'Ramp shape': String(this.quickEditor.rampShape || 'Linear'),
      'R&D annual post-launch (USD/year)': this.toNumber(
        this.quickEditor.rdAnnualPostLaunchUsd
      ),
    };

    const nextRows = this.stageRows.map((row) =>
      String(row?.['Stage']) === this.selectedStage ? updatedRow : row
    );
    this.stageRows = nextRows;

    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const nextPatch: Record<string, unknown> = {
      ...this.buildBasePatch(nextRows),
    };

    if (this.autoApplyDefaults) {
      nextPatch['products'] = this.applyDefaultsToProducts(snapshot?.products, updatedRow);
      nextPatch['vaccine_development'] = this.applyDefaultsToVaccineDevelopment(
        snapshot?.vaccine_development,
        updatedRow
      );
    }

    this.persistWithPatch(nextPatch, 'Stage mapping updated');
  }

  updateSelectedRowField(key: string, value: unknown): void {
    const row = this.findSelectedRow();
    if (!row) {
      return;
    }
    const normalizedValue =
      typeof value === 'string'
        ? value
        : typeof value === 'number'
          ? this.toNumber(value)
          : value;

    const updatedRow: StageRow = {
      ...row,
      [key]: normalizedValue,
    };
    this.stageRows = this.stageRows.map((item) =>
      String(item?.['Stage']) === this.selectedStage ? updatedRow : item
    );
    this.persistCurrentRows();
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const snapshotRows = Array.isArray(snapshot?.stage_schedule_mapping)
      ? snapshot.stage_schedule_mapping
      : [];
    const mappingRows =
      snapshotRows.length > 0
        ? snapshotRows
        : this.defaultsStageRows.length > 0
          ? this.defaultsStageRows
          : [];

    const sourceRows = mappingRows.length > 0 ? mappingRows : this.buildDefaultRows();
    this.stageDurationFields = this.buildStageDurationFields(sourceRows);
    this.allocationFields = this.buildAllocationFields(sourceRows);
    this.stageRows = sourceRows.map((row: StageRow) => this.normalizeStageRow(row));

    this.mappingUpdatedBy = String(
      snapshot?.stage_mapping_audit_owner ??
        this.defaultsSnapshot?.stage_mapping_audit_owner ??
        'Finance'
    );
    this.autoApplyDefaults = Boolean(
      snapshot?.stage_mapping_auto_apply ??
        this.defaultsSnapshot?.stage_mapping_auto_apply ??
        true
    );
    this.overrideExistingValues = Boolean(
      snapshot?.stage_mapping_overwrite ??
        this.defaultsSnapshot?.stage_mapping_overwrite ??
        false
    );

    const preferredStage = String(
      snapshot?.stage_mapping_selected_template ??
        this.defaultsSnapshot?.stage_mapping_selected_template ??
        ''
    ).trim();
    const available = this.stageOptions.map((item) => item.value);
    this.selectedStage =
      preferredStage && available.includes(preferredStage)
        ? preferredStage
        : this.stageOptions[0]?.value ?? '';

    this.auditLog = Array.isArray(snapshot?.stage_mapping_audit_log)
      ? snapshot.stage_mapping_audit_log
      : Array.isArray(this.defaultsSnapshot?.stage_mapping_audit_log)
        ? this.defaultsSnapshot.stage_mapping_audit_log
        : [];

    this.syncQuickEditorFromSelectedStage();
  }

  private loadStageMappingDefaults(): void {
    this.biotechModelService
      .getDefaultsTemplate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (defaults: any) => {
          this.defaultsSnapshot = defaults ?? {};
          const mappingRows = Array.isArray(defaults?.stage_schedule_mapping)
            ? defaults.stage_schedule_mapping
            : [];
          this.defaultsStageRows = mappingRows.map((row: StageRow) => ({
            ...row,
          }));
          this.syncFromModel();
        },
      });
  }

  private syncQuickEditorFromSelectedStage(): void {
    const row = this.findSelectedRow();
    if (!row) {
      return;
    }
    this.quickEditor = {
      successProbabilityPct: this.toNumber(row?.['Success Probability %']),
      salesRampYears: this.toNumber(row?.['Sales ramp length (years)']),
      rdRemainingPreLaunchUsd: this.toNumber(row?.['R&D remaining pre-launch (USD)']),
      timeToMarketYears: this.toNumber(row?.['Time to market (years)']),
      rampShape: String(row?.['Ramp shape'] ?? 'Linear'),
      rdAnnualPostLaunchUsd: this.toNumber(row?.['R&D annual post-launch (USD/year)']),
    };
  }

  private findSelectedRow(): StageRow | undefined {
    return this.stageRows.find((row) => String(row?.['Stage']) === this.selectedStage);
  }

  private buildBasePatch(stageRows: StageRow[]): Record<string, unknown> {
    return {
      stage_schedule_mapping: stageRows,
      stage_mapping_auto_apply: this.autoApplyDefaults,
      stage_mapping_overwrite: this.overrideExistingValues,
      stage_mapping_audit_owner: this.mappingUpdatedBy,
      stage_mapping_selected_template: this.selectedStage,
      stage_mapping_audit_log: this.auditLog,
    };
  }

  private persistCurrentRows(): void {
    this.biotechModelService.patchInput(this.buildBasePatch(this.stageRows));
  }

  private persistWithPatch(
    patch: Record<string, unknown>,
    action: string
  ): void {
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      stage: this.selectedStage,
      owner: this.mappingUpdatedBy || 'Unknown',
    };
    const nextAudit = [entry, ...this.auditLog].slice(0, 50);
    this.auditLog = nextAudit;
    this.biotechModelService.patchInput({
      ...patch,
      stage_mapping_audit_log: nextAudit,
    });
  }

  private applyDefaultsToProducts(products: unknown, row: StageRow): any[] {
    if (!Array.isArray(products)) {
      return [];
    }
    return products.map((product: any) => {
      const stage = String(product?.stage ?? '').trim();
      if (stage !== this.selectedStage) {
        return product;
      }
      const next = { ...product };
      this.assignMapped(next, 'success_prob', this.toNumber(row['Success Probability %']) / 100);
      this.assignMapped(next, 'time_to_market', this.toNumber(row['Time to market (years)']));
      this.assignMapped(
        next,
        'rd_remaining_pre_launch',
        this.toNumber(row['R&D remaining pre-launch (USD)'])
      );
      this.assignMapped(
        next,
        'rd_annual_post_launch',
        this.toNumber(row['R&D annual post-launch (USD/year)'])
      );
      return next;
    });
  }

  private applyDefaultsToVaccineDevelopment(rows: unknown, row: StageRow): any[] {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((item: any) => {
      const stage = String(item?.['Stage'] ?? '').trim();
      if (stage !== this.selectedStage) {
        return item;
      }
      const next = { ...item };
      this.assignMapped(
        next,
        'Success Probability %',
        this.toNumber(row['Success Probability %'])
      );
      this.assignMapped(
        next,
        'Time to market',
        this.toNumber(row['Time to market (years)'])
      );
      return next;
    });
  }

  private assignMapped(target: Record<string, unknown>, key: string, value: unknown): void {
    if (this.overrideExistingValues) {
      target[key] = value;
      return;
    }
    const current = target[key];
    const isEmpty =
      current === undefined ||
      current === null ||
      (typeof current === 'string' && current.trim() === '');
    if (isEmpty) {
      target[key] = value;
    }
  }

  private buildDefaultRows(): StageRow[] {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const mappingRows = this.resolveStageScheduleMapping(snapshot);

    return mappingRows.map((row) => ({ ...row }));
  }

  private buildStageDurationFields(
    rows: StageRow[]
  ): Array<{ label: string; key: string }> {
    const durationKeys: string[] = [];

    for (const row of rows) {
      const rowKeys = Object.keys(row ?? {});
      for (const key of rowKeys) {
        if (!/duration/i.test(key) || !/\(years\)/i.test(key)) {
          continue;
        }
        if (!durationKeys.includes(key)) {
          durationKeys.push(key);
        }
      }
    }

    return durationKeys.map((key) => ({
      label: key,
      key,
    }));
  }

  private buildAllocationFields(
    rows: StageRow[]
  ): Array<{ label: string; key: string }> {
    const allocationKeys: string[] = [];

    for (const row of rows) {
      const rowKeys = Object.keys(row ?? {});
      for (const key of rowKeys) {
        const normalized = key.toLowerCase();
        const isWeight = normalized.includes('weight');
        const isRdOrCapex =
          normalized.includes('r&d') ||
          normalized.includes('rd') ||
          normalized.includes('capex');
        if (!isWeight || !isRdOrCapex) {
          continue;
        }
        if (!allocationKeys.includes(key)) {
          allocationKeys.push(key);
        }
      }
    }

    return allocationKeys.map((key) => ({
      label: key,
      key,
    }));
  }

  private resolveStageScheduleMapping(snapshot: any): StageRow[] {
    if (
      Array.isArray(snapshot?.stage_schedule_mapping) &&
      snapshot.stage_schedule_mapping.length > 0
    ) {
      return snapshot.stage_schedule_mapping;
    }

    if (
      Array.isArray(this.defaultsSnapshot?.stage_schedule_mapping) &&
      this.defaultsSnapshot.stage_schedule_mapping.length > 0
    ) {
      return this.defaultsSnapshot.stage_schedule_mapping;
    }

    return [];
  }

  private normalizeStageRow(row: StageRow): StageRow {
    const stage = String(row?.['Stage'] ?? '').trim();
    const baseRow: StageRow = {
      Stage: stage,
      'Success Probability %': 0,
      'Time to market (years)': 0,
      'Sales ramp length (years)': 0,
      'Ramp shape': 'Linear',
      'R&D remaining pre-launch (USD)': 0,
      'R&D annual post-launch (USD/year)': 0,
      ...Object.fromEntries(this.stageDurationFields.map((field) => [field.key, 0])),
      ...Object.fromEntries(this.allocationFields.map((field) => [field.key, 0])),
    };

    return {
      ...baseRow,
      ...row,
      Stage: stage,
    };
  }

  transitionEntries(): Array<{ key: string; value: number }> {
    const row = this.findSelectedRow();
    if (!row) {
      return [];
    }

    const stageSequence = this.getStageSequence();

    const generatedTransitions = stageSequence
      .slice(0, -1)
      .map((stage, index) => `${stage}->${stageSequence[index + 1]}`);
    const generatedAnnual = generatedTransitions.map(
      (transition) => `${transition} annual success %`
    );

    const rowTransitionKeys = Object.keys(row).filter((key) => {
      const normalized = key.toLowerCase();
      return (
        normalized.includes('transition') ||
        normalized.includes('annual success') ||
        key.includes('->')
      );
    });

    const keys = Array.from(
      new Set([...generatedTransitions, ...generatedAnnual, ...rowTransitionKeys])
    );

    return keys.map((key) => ({ key, value: this.toNumber(row[key] ?? 0) }));
  }

  milestoneEntries(): Array<{ key: string; value: number }> {
    const row = this.findSelectedRow();
    if (!row) {
      return [];
    }

    const generatedMilestones = this.getStageSequence()
      .slice(0, -1)
      .map((stage) => `${stage} completion milestone (USD)`);

    const rowMilestoneKeys = Object.keys(row).filter((key) =>
      /milestone/i.test(key)
    );

    const keys = Array.from(new Set([...generatedMilestones, ...rowMilestoneKeys]));

    return keys.map((key) => ({ key, value: this.toNumber(row[key] ?? 0) }));
  }

  private getStageSequence(): string[] {
    return Array.from(
      new Set(
        this.stageRows
          .map((item) => String(item?.['Stage'] ?? '').trim())
          .filter((stage) => Boolean(stage))
      )
    );
  }

  private toNumber(value: unknown): number {
    const num = Number(value ?? 0);
    return Number.isFinite(num) ? num : 0;
  }
}

