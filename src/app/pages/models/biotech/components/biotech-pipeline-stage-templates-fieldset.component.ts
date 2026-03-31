import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';

interface StageOption {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'biotech-pipeline-stage-templates-fieldset',
  imports: [CommonModule, FormsModule, FieldsetModule, SelectModule],
  template: `
    <p-fieldset legend="Pipeline stage templates" [toggleable]="true" class="w-full mt-4">
      <div class="flex flex-col gap-4">
        <div class="text-sm font-semibold">
          Use Discovery > Preclinical > Phase I > Phase II > Phase III > Approval > Commercial
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Select a stage template to apply</label>
          <p-select
            [options]="stageTemplateOptions"
            [(ngModel)]="selectedStageTemplate"
            (ngModelChange)="onSelectedTemplateChange()"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm font-semibold">Selected template</div>
          <ul class="list-disc pl-6 text-sm">
            <li>{{ selectedStageTemplate }}</li>
          </ul>
          <p class="text-xs text-surface-500">
            Select a stage to align asset setup and scenario inputs.
          </p>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechPipelineStageTemplatesFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();
  private defaultsStageTemplateOptions: StageOption[] = [];

  stageTemplateOptions: StageOption[] = [];
  selectedStageTemplate = '';

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.loadStageTemplateDefaults();
    this.syncFromModel();
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectedTemplateChange(): void {
    this.biotechModelService.patchInput({
      stage_mapping_selected_template: this.selectedStageTemplate,
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const mappingRows = Array.isArray(snapshot?.stage_schedule_mapping)
      ? snapshot.stage_schedule_mapping
      : [];

    const fromInput = this.toStageOptions(mappingRows);
    if (fromInput.length) {
      this.stageTemplateOptions = fromInput;
    } else if (this.defaultsStageTemplateOptions.length) {
      this.stageTemplateOptions = [...this.defaultsStageTemplateOptions];
    }

    const preferred = String(snapshot?.stage_mapping_selected_template ?? '').trim();
    if (preferred && this.stageTemplateOptions.some((opt) => opt.value === preferred)) {
      this.selectedStageTemplate = preferred;
      return;
    }

    this.selectedStageTemplate =
      this.stageTemplateOptions[0]?.value ?? '';
  }

  private loadStageTemplateDefaults(): void {
    this.biotechModelService
      .getDefaultsTemplate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (defaults: any) => {
          const mappingRows = Array.isArray(defaults?.stage_schedule_mapping)
            ? defaults.stage_schedule_mapping
            : [];
          const fromDefaults = this.toStageOptions(mappingRows);
          if (fromDefaults.length) {
            this.defaultsStageTemplateOptions = fromDefaults;
            this.syncFromModel();
          }
        },
      });
  }

  private toStageOptions(mappingRows: any[]): StageOption[] {
    const stageValues: string[] = mappingRows
      .map((row: any) => String(row?.Stage ?? '').trim())
      .filter((stage: string) => Boolean(stage));
    const uniqueStages: string[] = Array.from(new Set(stageValues));
    return uniqueStages.map((stage) => ({
      label: stage,
      value: stage,
    }));
  }
}

