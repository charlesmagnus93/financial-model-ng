import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { BiotechModelService } from '../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface VcMetricRow {
  metric: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-biotech-vc-method-helper',
  imports: [CommonModule, FormsModule, TableModule, InputNumberModule, SliderModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">VC method helper</div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Exit year</div>
          <p-inputnumber
            [(ngModel)]="exitYear"
            [useGrouping]="false"
            [min]="2024"
            [max]="2050"
            [showButtons]="true"
            inputStyleClass="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Target IRR</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>0%</span>
            <span>{{ formatPercent(targetIrr) }}</span>
            <span>60%</span>
          </div>
          <p-slider
            [(ngModel)]="targetIrr"
            [min]="0"
            [max]="0.6"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">Investor ownership at exit</div>
          <div class="flex items-center justify-between text-xs text-surface-400">
            <span>0%</span>
            <span>{{ formatPercent(investorOwnership) }}</span>
            <span>100%</span>
          </div>
          <p-slider
            [(ngModel)]="investorOwnership"
            [min]="0"
            [max]="1"
            [step]="0.01"
          ></p-slider>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-surface-400">New money ($)</div>
          <p-inputnumber
            [(ngModel)]="newMoney"
            [min]="0"
            [showButtons]="true"
            [useGrouping]="true"
            inputStyleClass="w-full"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm text-surface-400">Exit EV/EBITDA multiple</div>
        <div class="flex items-center justify-between text-xs text-surface-400">
          <span>2x</span>
          <span>{{ exitMultiple.toFixed(2) }}x</span>
          <span>25x</span>
        </div>
        <p-slider
          [(ngModel)]="exitMultiple"
          [min]="2"
          [max]="25"
          [step]="0.25"
        ></p-slider>
      </div>

      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '900px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.metric }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class BiotechVcMethodHelperComponent implements OnInit {
  exitYear = 2029;
  targetIrr = 0.3;
  investorOwnership = 0.25;
  newMoney = 50_000_000;
  exitMultiple = 8.0;
  rows: VcMetricRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.biotechModelService.getOutputSnapshot() ?? {};
    const baseRnpv = Number(output?.rnpv ?? 0);
    const consolidated = output?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};
    const ebitda = this.asNumberArray(data['ebitda']);
    const exitIndex = Math.max(0, years.indexOf(this.exitYear));
    const exitEbitda = ebitda[exitIndex] ?? 0;
    const exitEnterpriseValue = exitEbitda * this.exitMultiple;
    const investorExitValue = exitEnterpriseValue * this.investorOwnership;
    const yearsToExit = Math.max(1, this.exitYear - (years[0] ?? this.exitYear));
    const investorPvRequired =
      investorExitValue / Math.pow(1 + this.targetIrr, yearsToExit);
    const impliedPostMoney = investorPvRequired / this.investorOwnership;
    const impliedPreMoney = impliedPostMoney - this.newMoney;
    const investorIrrIfPayNewMoney =
      investorExitValue > 0
        ? Math.pow(investorExitValue / Math.max(1, this.newMoney), 1 / yearsToExit) - 1
        : 0;

    this.rows = [
      { metric: 'exit_enterprise_value', value: this.formatNumber(exitEnterpriseValue) },
      { metric: 'investor_exit_value', value: this.formatNumber(investorExitValue) },
      { metric: 'investor_pv_required', value: this.formatNumber(investorPvRequired) },
      { metric: 'implied_post_money', value: this.formatNumber(impliedPostMoney) },
      { metric: 'implied_pre_money', value: this.formatNumber(impliedPreMoney) },
      { metric: 'investor_irr_if_pay_new_money', value: this.formatPercent(investorIrrIfPayNewMoney) },
    ];
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

}
