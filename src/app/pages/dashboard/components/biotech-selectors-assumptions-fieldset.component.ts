import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { BiotechModelService } from '../../services/biotech-model.service';

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
export class BiotechSelectorsAssumptionsFieldsetComponent implements OnInit {
  selectorOptions: SelectorOption[] = [
    { label: 'Base case', value: 'Base case' },
    { label: 'Upside', value: 'Upside' },
    { label: 'Downside', value: 'Downside' },
    { label: 'Aggressive expansion', value: 'Aggressive expansion' },
    { label: 'Defensive posture', value: 'Defensive posture' },
  ];
  selectedSelectors: string[] = [];

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  updateSelectors(): void {
    this.biotechModelService.patchInput({
      selectors: [...this.selectedSelectors],
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.selectors;
    if (Array.isArray(stored) && stored.length) {
      this.selectedSelectors = stored.map((value: any) => String(value));
    }
  }
}
