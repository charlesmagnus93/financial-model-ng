import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';

interface MappingField {
  label: string;
  key: string;
}

type StageRow = Record<string, any>;

@Component({
  standalone: true,
  selector: 'biotech-rd-capex-allocation-fieldset',
  imports: [CommonModule, FormsModule, FieldsetModule, InputNumberModule],
  template: `
    <p-fieldset legend="R&D and CAPEX allocation" [toggleable]="true" class="w-full">
      <div class="grid grid-cols-12 gap-3">
        @for (item of fields; track item.key) {
          <div class="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col gap-2">
            <label class="text-xs font-semibold">{{ item.label }}</label>
            <p-inputnumber
              [ngModel]="toNumber(selectedRow?.[item.key] ?? 0)"
              (ngModelChange)="onFieldChange(item.key, $event)"
              [showButtons]="true"
              [min]="0"
              [max]="100"
              [step]="0.1"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechRdCapexAllocationFieldsetComponent {
  @Input() fields: MappingField[] = [];
  @Input() selectedRow?: StageRow;

  @Output() fieldChange = new EventEmitter<{ key: string; value: unknown }>();

  onFieldChange(key: string, value: unknown): void {
    this.fieldChange.emit({ key, value });
  }

  toNumber(value: unknown): number {
    const num = Number(value ?? 0);
    return Number.isFinite(num) ? num : 0;
  }
}

