import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  standalone: true,
  selector: 'app-ai-insights',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    FieldsetModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-2xl font-semibold">AI Insights</div>
      <div>
        <p-button label="Refresh snapshot from latest model" [outlined]="true"></p-button>
      </div>

      <p-fieldset
        legend="Snapshot inputs"
        [toggleable]="true"
        class="w-full"
      >
        <div class="flex flex-col gap-4">
          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Currency</div>
              <p-select
                [options]="currencyOptions"
                [(ngModel)]="snapshot.currency"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">NPV</div>
              <p-inputnumber
                [(ngModel)]="snapshot.npv"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">IRR</div>
              <p-inputnumber
                [(ngModel)]="snapshot.irr"
                [showButtons]="true"
                [minFractionDigits]="4"
                [maxFractionDigits]="4"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Minimum DSCR</div>
              <p-inputnumber
                [(ngModel)]="snapshot.dscrMin"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Payback (years)</div>
              <p-inputnumber
                [(ngModel)]="snapshot.paybackYears"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Total capex</div>
              <p-inputnumber
                [(ngModel)]="snapshot.capexTotal"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <div class="text-xs font-semibold">Annual opex</div>
              <p-inputnumber
                [(ngModel)]="snapshot.opexAnnual"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-1">
              <div class="text-xs font-semibold">Annual revenue</div>
              <p-inputnumber
                [(ngModel)]="snapshot.revenueAnnual"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
          </div>

          <div class="text-xs font-semibold">Financing assumptions</div>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Beginning cash balance</div>
              <p-inputnumber
                [(ngModel)]="snapshot.beginningCash"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Annual equity issuance</div>
              <p-inputnumber
                [(ngModel)]="snapshot.equityIssuance"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">Annual debt drawdowns</div>
              <p-inputnumber
                [(ngModel)]="snapshot.debtDrawdowns"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <div class="text-xs font-semibold">Annual debt repayments</div>
              <p-inputnumber
                [(ngModel)]="snapshot.debtRepayments"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-1">
              <div class="text-xs font-semibold">Annual interest paid</div>
              <p-inputnumber
                [(ngModel)]="snapshot.interestPaid"
                [showButtons]="true"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
            </div>
          </div>

          <div class="overflow-auto">
            <p-table
              [value]="scenarioRows"
              showGridlines
              responsiveLayout="scroll"
              class="text-sm"
              [size]="'small'"
              [tableStyle]="{ 'min-width': '900px' }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>#</th>
                  <th>Scenario</th>
                  <th>NPV</th>
                  <th>IRR</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row let-i="rowIndex">
                <tr>
                  <td>{{ i }}</td>
                  <td class="font-semibold">{{ row.scenario }}</td>
                  <td class="text-right">{{ formatNumber(row.npv) }}</td>
                  <td class="text-right">{{ row.irr ?? 'None' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </p-fieldset>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Index documents</div>
          <p-button label="Clear indexed documents" [outlined]="true"></p-button>
        </div>
        <div class="md:col-span-2 flex items-center justify-end">
          <p-button label="Run AI insights" [outlined]="true"></p-button>
        </div>
      </div>

      <div class="rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600">
        Local index metadata cleared. Clear the backend index from the service if needed.
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold">Ask a question</div>
        <input
          pInputText
          [(ngModel)]="question"
          placeholder="Ask a question"
          class="w-full"
        />
        <div>
          <p-button label="Search" [outlined]="true"></p-button>
        </div>
      </div>
    </div>
  `,
})
export class AiInsightsComponent {
  question = '';

  snapshot = {
    currency: 'USD',
    npv: 898736192.17,
    irr: 0.9525,
    dscrMin: 0,
    paybackYears: 1.82,
    capexTotal: 193200000,
    opexAnnual: 126230804.79,
    revenueAnnual: 426619461.51,
    beginningCash: 0,
    equityIssuance: 0,
    debtDrawdowns: 0,
    debtRepayments: 0,
    interestPaid: 0,
  };

  scenarioRows = [
    { scenario: 'Base', npv: 898736192.1688, irr: 'None' },
    { scenario: 'Upside', npv: 1339962194.449, irr: 'None' },
    { scenario: 'Downside', npv: 467636504.3949, irr: 'None' },
  ];

  currencyOptions = [{ label: 'USD', value: 'USD' }];

  formatNumber(value: number): string {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}${(abs / 1_000).toFixed(2)}k`;
    return value.toFixed(2);
  }
}
