import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { BiotechModelService } from '../../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-new-equity-issued-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    InputNumberModule,
  ],
  template: `
    <p-fieldset legend="New equity issued" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold">Planned new equity</label>
        <p-inputnumber
          [(ngModel)]="plannedNewEquity"
          (ngModelChange)="updatePlannedNewEquity()"
          [showButtons]="true"
          [min]="0"
          [useGrouping]="true"
          inputStyleClass="w-full"
        />
      </div>
    </p-fieldset>
  `,
})
export class BiotechNewEquityIssuedAssumptionsFieldsetComponent
  implements OnInit
{
  plannedNewEquity = 0;

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  updatePlannedNewEquity(): void {
    this.biotechModelService.patchInput({
      planned_new_equity: Number(this.plannedNewEquity ?? 0),
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()?.planned_new_equity;
    if (stored !== undefined && stored !== null) {
      this.plannedNewEquity = Number(stored);
    }
  }
}

