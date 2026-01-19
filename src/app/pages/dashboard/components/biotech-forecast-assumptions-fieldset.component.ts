import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'biotech-forecast-assumptions-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FieldsetModule,
    InputNumberModule,
    InputSwitchModule,
    TableModule,
  ],
  template: `
    <p-fieldset
      legend="Forecast assumptions"
      [toggleable]="true"
      class="w-full mt-4"
    >
      <div class="flex flex-col gap-3">
        <div class="text-sm font-semibold">Sales ramp schedule</div>
        <div class="grid grid-cols-12 gap-4 items-start">
          <div class="col-span-12 lg:col-span-8 flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2">
                <p-inputSwitch
                  [(ngModel)]="salesRampEditEnabled"
                ></p-inputSwitch>
                <span class="text-sm">Edit</span>
              </div>
              <div class="ml-auto flex flex-wrap items-center gap-2">
                <p-button
                  label="Add Row"
                  size="small"
                  [outlined]="true"
                  (onClick)="addSalesRampRow()"
                  [disabled]="!salesRampEditEnabled"
                ></p-button>
                <p-button
                  label="Remove Row"
                  size="small"
                  [outlined]="true"
                  (onClick)="removeSalesRampRow()"
                  [disabled]="!salesRampEditEnabled || salesRampSchedule.length <= 1"
                ></p-button>
              </div>
            </div>
            <div class="overflow-auto rounded">
              <p-table [value]="salesRampSchedule" showGridlines class="text-sm">
                <ng-template #header>
                  <tr>
                    <th>Year offset</th>
                    <th>Ramp factor</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>
                      @if (salesRampEditEnabled) {
                        <p-inputnumber
                          [(ngModel)]="row.yearOffset"
                          (ngModelChange)="updateForecastAssumptions()"
                          [min]="0"
                          [useGrouping]="false"
                          inputStyleClass="w-full"
                          fluid
                        />
                      } @else {
                        <span>{{ row.yearOffset }}</span>
                      }
                    </td>
                    <td>
                      @if (salesRampEditEnabled) {
                        <p-inputnumber
                          [(ngModel)]="row.rampFactor"
                          (ngModelChange)="updateForecastAssumptions()"
                          [min]="0"
                          [step]="0.01"
                          [minFractionDigits]="2"
                          [maxFractionDigits]="4"
                          inputStyleClass="w-full"
                          fluid
                        />
                      } @else {
                        <span>{{ row.rampFactor }}</span>
                      }
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <div class="rounded border border-surface-700 p-3 flex-col gap-3">
              <div class="flex items-center gap-2 text-sm font-semibold">
                <span>Yearly Increment Helper</span>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Start year offset</label>
                <p-inputnumber
                  [(ngModel)]="helper.startYearOffset"
                  [showButtons]="true"
                  [min]="0"
                  [useGrouping]="false"
                  inputStyleClass="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Starting value</label>
                <p-inputnumber
                  [(ngModel)]="helper.startingValue"
                  [showButtons]="true"
                  [min]="0"
                  [step]="0.01"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="4"
                  inputStyleClass="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold">Increment per year</label>
                <p-inputnumber
                  [(ngModel)]="helper.incrementPerYear"
                  [showButtons]="true"
                  [step]="0.01"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="4"
                  inputStyleClass="w-full"
                />
              </div>
              <div class="flex flex-col gap-2 mb-3">
                <label class="text-xs font-semibold">Number of periods</label>
                <p-inputnumber
                  [(ngModel)]="helper.numberOfPeriods"
                  [showButtons]="true"
                  [min]="1"
                  [useGrouping]="false"
                  inputStyleClass="w-full"
                />
              </div>
              <p-button
                label="Apply helper"
                size="small"
                class="mt-2"
                [outlined]="true"
                (onClick)="applyHelper()"
                [disabled]="!salesRampEditEnabled"
              ></p-button>
            </div>
          </div>
        </div>
        <p class="text-xs text-surface-400">
          Ramp factors feed revenue build-ups across every product.
        </p>
      </div>
    </p-fieldset>
  `,
})
export class BiotechForecastAssumptionsFieldsetComponent implements OnInit {
  salesRampEditEnabled = false;
  salesRampSchedule: Array<{ yearOffset: number; rampFactor: number }> = [];
  helper = {
    startYearOffset: 0,
    startingValue: 0,
    incrementPerYear: 0,
    numberOfPeriods: 0,
  };

  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.syncForecastAssumptions();
  }

  addSalesRampRow(): void {
    const last = this.salesRampSchedule[this.salesRampSchedule.length - 1];
    const nextOffset = last ? last.yearOffset + 1 : 0;
    this.salesRampSchedule = [
      ...this.salesRampSchedule,
      { yearOffset: nextOffset, rampFactor: 1 },
    ];
    this.updateForecastAssumptions();
  }

  removeSalesRampRow(): void {
    if (this.salesRampSchedule.length <= 1) {
      return;
    }
    this.salesRampSchedule = this.salesRampSchedule.slice(0, -1);
    this.updateForecastAssumptions();
  }

  applyHelper(): void {
    if (!this.salesRampEditEnabled) {
      return;
    }
    const periods = Math.max(1, Math.floor(this.helper.numberOfPeriods || 0));
    const startOffset = Math.max(0, Math.floor(this.helper.startYearOffset || 0));
    const startValue = Number(this.helper.startingValue || 0);
    const increment = Number(this.helper.incrementPerYear || 0);
    const nextSchedule = Array.from({ length: periods }, (_, idx) => ({
      yearOffset: startOffset + idx,
      rampFactor: startValue + idx * increment,
    }));
    this.salesRampSchedule = nextSchedule;
    this.updateForecastAssumptions();
  }

  updateForecastAssumptions(): void {
    const rampFactors = this.salesRampSchedule.map((row) =>
      Number(row?.rampFactor ?? 0)
    );
    this.biotechModelService.patchInput({
      forecastAssumptions: {
        salesRampSchedule: this.salesRampSchedule.map((row) => ({ ...row })),
      },
      model_config: {
        sales_ramp_factors: rampFactors,
      },
    });
  }

  private syncForecastAssumptions(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const schedule =
      snapshot?.forecastAssumptions?.salesRampSchedule ??
      snapshot?.model_config?.sales_ramp_factors;

    if (Array.isArray(schedule) && schedule.length) {
      this.salesRampSchedule = schedule.map((row: any, index: number) => {
        if (typeof row === 'number') {
          return {
            yearOffset: index,
            rampFactor: Number(row ?? 0),
          };
        }
        return {
          yearOffset: Number(row?.yearOffset ?? index),
          rampFactor: Number(row?.rampFactor ?? 0),
        };
      });
    }
  }
}
