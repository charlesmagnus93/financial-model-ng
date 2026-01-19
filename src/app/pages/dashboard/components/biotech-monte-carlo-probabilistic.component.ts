import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-monte-carlo-probabilistic',
  imports: [CommonModule, FormsModule, FieldsetModule, InputNumberModule, ButtonModule],
  template: `
    <p-fieldset
      legend="Monte Carlo &amp; probabilistic valuation"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-2">
            <div class="text-xs uppercase text-surface-400">Simulations</div>
            <p-inputnumber
              [(ngModel)]="simulations"
              [showButtons]="true"
              [min]="1"
              [useGrouping]="false"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs uppercase text-surface-400">Revenue sigma</div>
            <p-inputnumber
              [(ngModel)]="revenueSigma"
              [showButtons]="true"
              [min]="0"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs uppercase text-surface-400">Cost sigma</div>
            <p-inputnumber
              [(ngModel)]="costSigma"
              [showButtons]="true"
              [min]="0"
              [step]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              inputStyleClass="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-xs uppercase text-surface-400">Random seed</div>
            <p-inputnumber
              [(ngModel)]="randomSeed"
              [showButtons]="true"
              [min]="0"
              [useGrouping]="false"
              inputStyleClass="w-full"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <p-button
            label="Run Monte Carlo simulation"
            [outlined]="true"
          ></p-button>
        </div>

        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Run the simulation to unlock probabilistic metrics. Current base rNPV:
          <span class="font-semibold">{{ formatNumber(baseRnpv) }}</span>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechMonteCarloProbabilisticComponent implements OnInit {
  simulations = 1000;
  revenueSigma = 0.15;
  costSigma = 0.1;
  randomSeed = 42;
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
