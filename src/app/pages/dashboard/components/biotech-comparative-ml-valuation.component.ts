import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-comparative-ml-valuation',
  imports: [CommonModule, FieldsetModule],
  template: `
    <p-fieldset
      legend="Comparative &amp; ML-based valuation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-3 text-sm text-surface-500">
        <div>Need scikit-learn and multiple products for clustering.</div>
        <div>
          Install scikit-learn to run ML-driven multiple predictions.
          Base rNPV
          <!-- :<span class="font-semibold text-surface-600">{{ formatNumber(baseRnpv) }}</span> -->
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechComparativeMlValuationComponent implements OnInit {
  baseRnpv = 0;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot();
    this.baseRnpv = Number(output?.rnpv ?? 0);
  }

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
  }
}
