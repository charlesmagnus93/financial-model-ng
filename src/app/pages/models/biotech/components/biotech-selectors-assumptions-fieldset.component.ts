import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { BiotechModelService } from '../../../services/biotech-model.service';

interface SelectorOption {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'biotech-selectors-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    MultiSelectModule,
  ],
  template: `
    <p-fieldset legend="Selectors" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-3">
        <label class="text-xs font-semibold">Tag this run with selectors</label>
        <p-multiselect
          [options]="selectorOptions"
          [(ngModel)]="selectedSelectors"
          (ngModelChange)="updateSelectors()"
          [maxSelectedLabels]="4"
          optionLabel="label"
          optionValue="value"
          display="chip"
          class="w-full"
        ></p-multiselect>
        <div class="text-xs text-surface-500">
          Active selectors: {{ selectedSelectors.join(', ') || 'None' }}
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechSelectorsAssumptionsFieldsetComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  selectorOptions: SelectorOption[] = [];
  selectedSelectors: string[] = [];

  constructor(private biotechModelService: BiotechModelService) {}

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

  updateSelectors(): void {
    this.selectedSelectors = this.uniqueStrings(this.selectedSelectors);
    this.selectorOptions = this.toOptions([
      ...this.selectorOptions.map((option) => option.value),
      ...this.selectedSelectors,
    ]);

    this.biotechModelService.patchInput({
      selectors: [...this.selectedSelectors],
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const storedSelectors = Array.isArray(snapshot?.selectors)
      ? snapshot.selectors
      : [];
    const scenarioPresets = Array.isArray(snapshot?.scenario_presets)
      ? snapshot.scenario_presets
      : [];

    const presetNames = scenarioPresets
      .map((preset: any) => String(preset?.name ?? '').trim())
      .filter(Boolean);

    this.selectedSelectors = this.uniqueStrings(storedSelectors);

    const optionValues = [
      ...presetNames,
      ...this.selectedSelectors,
    ];
    this.selectorOptions = this.toOptions(optionValues);
  }

  private uniqueStrings(values: unknown[]): string[] {
    return Array.from(
      new Set(
        (values ?? [])
          .map((value) => String(value ?? '').trim())
          .filter(Boolean)
      )
    );
  }

  private toOptions(values: string[]): SelectorOption[] {
    return this.uniqueStrings(values).map((value) => ({
      label: value,
      value,
    }));
  }
}

