import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';

interface MilestoneEntry {
  key: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'biotech-milestones-fieldset',
  imports: [CommonModule, FormsModule, FieldsetModule, InputNumberModule],
  template: `
    <p-fieldset legend="Milestones" [toggleable]="true" class="w-full">
      <div class="grid grid-cols-12 gap-3">
        @for (entry of entries; track entry.key) {
          <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <label class="text-xs font-semibold">{{ entry.key }}</label>
            <p-inputnumber
              [ngModel]="toNumber(entry.value)"
              (ngModelChange)="onEntryChange(entry.key, $event)"
              [showButtons]="true"
              [min]="0"
              [step]="1"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
        } @empty {
          <p class="col-span-12 text-xs text-surface-500">
            No milestones available for this stage.
          </p>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechMilestonesFieldsetComponent {
  @Input() entries: MilestoneEntry[] = [];
  @Output() fieldChange = new EventEmitter<{ key: string; value: unknown }>();

  onEntryChange(key: string, value: unknown): void {
    this.fieldChange.emit({ key, value });
  }

  toNumber(value: unknown): number {
    const num = Number(value ?? 0);
    return Number.isFinite(num) ? num : 0;
  }
}

