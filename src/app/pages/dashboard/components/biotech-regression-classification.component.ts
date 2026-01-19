import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-regression-classification',
  imports: [CommonModule, FieldsetModule],
  template: `
    <p-fieldset
      legend="Regression &amp; classification models"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-3">
        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Install scikit-learn to unlock regression diagnostics.
        </div>
        <div class="text-sm text-surface-400">
          Classification output requires scikit-learn and at least one product.
          Base rNPV: <span class="font-semibold text-surface-200">{{ formatNumber(baseRnpv) }}</span>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechRegressionClassificationComponent implements OnInit {
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
