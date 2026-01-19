import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-funding-required-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    InputNumberModule,
  ],
  template: `
    <p-fieldset legend="Funding required" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold">Total funding required</label>
        <p-inputnumber
          [(ngModel)]="totalFundingRequired"
          (ngModelChange)="updateFundingRequired()"
          [showButtons]="true"
          [min]="0"
          [useGrouping]="true"
          inputStyleClass="w-full"
        />
      </div>
    </p-fieldset>
  `,
})
export class BiotechFundingRequiredAssumptionsFieldsetComponent
  implements OnInit
{
  totalFundingRequired = 0;

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncFromModel();
  }

  updateFundingRequired(): void {
    this.biotechModelService.patchInput({
      fundingRequiredAssumptions: {
        totalFundingRequired: this.totalFundingRequired,
      },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()
        ?.fundingRequiredAssumptions?.totalFundingRequired;
    if (stored !== undefined && stored !== null) {
      this.totalFundingRequired = Number(stored);
    }
  }
}
