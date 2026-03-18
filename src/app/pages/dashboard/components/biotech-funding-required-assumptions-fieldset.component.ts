import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-funding-required-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    InputNumberModule,
    CheckboxModule,
  ],
  template: `
    <p-fieldset legend="Funding required" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold">Total funding required</label>
        <p-inputnumber
          [(ngModel)]="totalFundingRequired"
          (ngModelChange)="persist()"
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
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

  totalFundingRequired = 0;
  cashBurn = 0;
  workingCapitalDraw = 0;

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

  persist(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    this.biotechModelService.patchInput({
      funding_required: Number(this.totalFundingRequired ?? 0),
    });
  }

  private syncFromModel(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.funding_required;
    if (stored !== undefined && stored !== null) {
      this.totalFundingRequired = Number(stored);
    }
  }
}
