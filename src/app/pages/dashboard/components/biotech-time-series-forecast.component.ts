import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-time-series-forecast',
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    SelectModule,
    SliderModule,
    ButtonModule,
  ],
  template: `
    <p-fieldset
      legend="Time-series &amp; ML forecasting"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Series to forecast</div>
          <p-select
            [options]="seriesOptions"
            [(ngModel)]="series"
            optionLabel="label"
            optionValue="value"
            placeholder="Select series"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Forecast model</div>
          <p-select
            [options]="modelOptions"
            [(ngModel)]="model"
            optionLabel="label"
            optionValue="value"
            placeholder="Select model"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Forecast steps</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>2</span>
            <!-- <span>{{ steps }}</span> -->
            <span>25</span>
          </div>
          <p-slider [(ngModel)]="steps" [min]="5" [max]="25" [step]="1"></p-slider>
        </div>

        <div class="flex items-center gap-3">
          <p-button label="Run time-series model" [outlined]="true"></p-button>
        </div>

        <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
          Forecasting uses historical revenue. Current base rNPV:
          <span class="font-semibold">{{ formatNumber(baseRnpv) }}</span>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechTimeSeriesForecastComponent implements OnInit {
  series = 'revenue';
  model = 'ARIMA';
  steps = 10;
  seriesOptions = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'EBITDA', value: 'ebitda' }
  ];
  modelOptions = [
    { label: 'ARIMA', value: 'ARIMA' },
    { label: 'Prophet', value: 'Prophet' },
    { label: 'LSTM', value: 'LSTM' },
  ];
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

