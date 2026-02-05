import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { BiotechModelService } from '../../services/biotech-model.service';
import biotechOutput from '../../../../../biotech_output.json';

interface MarginRow {
  year: number;
  grossMargin: number;
  ebitdaMargin: number;
  nopatMargin: number;
  rdIntensity: number;
  capexIntensity: number;
}

interface BreakEvenInputRow {
  id: string;
  name: string;
  unitPrice: number;
  unitVariableCost: number;
  unitFixedCost: number;
  unitsPerYear: number;
}

interface BreakEvenOutputRow extends BreakEvenInputRow {
  index: number;
  unitContributionMargin: number;
  contributionMarginPct: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  breakEvenUnitCost: number | null;
  aiSuggestedUnitPrice: number | null;
}

@Component({
  standalone: true,
  selector: 'app-biotech-margin-intensity',
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, SliderModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">Margin &amp; intensity analysis</div>
      <div class="overflow-auto">
        <p-table
          [value]="rows"
          showGridlines
          responsiveLayout="scroll"
          class="text-sm"
          [scrollable]="true"
          scrollHeight="300px"
          [size]="'small'"
          [tableStyle]="{ 'min-width': '1400px' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>index - streamlit-generated</th>
              <th>Gross margin</th>
              <th>EBITDA margin</th>
              <th>NOPAT margin</th>
              <th>R&amp;D intensity</th>
              <th>Capex intensity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td>{{ formatPercent(row.grossMargin) }}</td>
              <td>{{ formatPercent(row.ebitdaMargin) }}</td>
              <td>{{ formatPercent(row.nopatMargin) }}</td>
              <td>{{ formatPercent(row.rdIntensity) }}</td>
              <td>{{ formatPercent(row.capexIntensity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="border-t border-surface-800 pt-4 flex flex-col gap-4">
        <div class="text-lg font-semibold">Vaccine break-even analysis (interactive)</div>

        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3 text-sm">
            <p-checkbox
              inputId="aiAssistToggle"
              [binary]="true"
              [(ngModel)]="aiAssistEnabled"
            ></p-checkbox>
            <label for="aiAssistToggle">AI/ML assist: suggest unit prices for target break-even</label>
          </div>

          <div class="flex flex-col gap-2 w-full lg:w-1/2">
            <div class="text-xs font-semibold">Target break-even horizon (years)</div>
            <div class="flex items-center gap-4">
              <p-slider
                [min]="1"
                [max]="10"
                [step]="1"
                [ngModel]="targetBreakEvenYears"
                (ngModelChange)="targetBreakEvenYears = $event"
                class="w-full"
              ></p-slider>
              <div class="text-sm font-semibold">{{ targetBreakEvenYears }}</div>
            </div>
          </div>
        </div>

        <div class="text-xs text-surface-400">
          Adjust unit price and cost inputs to see contribution margin, break-even units,
          and AI-assisted price suggestions based on the target horizon.
        </div>

        <div class="overflow-auto">
          <p-table
            [value]="breakEvenInputs"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="260px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '1400px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Unit price (USD)</th>
                <th>Unit variable cost (USD)</th>
                <th>Unit fixed cost (USD/year)</th>
                <th>Units per year</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="font-semibold">{{ row.id }}</td>
                <td class="font-semibold">{{ row.name }}</td>
                <td class="text-right">{{ formatCurrency(row.unitPrice) }}</td>
                <td class="text-right">{{ formatCurrency(row.unitVariableCost) }}</td>
                <td class="text-right">{{ formatPlainNumber(row.unitFixedCost) }}</td>
                <td class="text-right">{{ formatPlainNumber(row.unitsPerYear) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-lg font-semibold">Break-even outputs</div>
        <div class="overflow-auto">
          <p-table
            [value]="breakEvenOutputs"
            showGridlines
            responsiveLayout="scroll"
            class="text-sm"
            [scrollable]="true"
            scrollHeight="260px"
            [size]="'small'"
            [tableStyle]="{ 'min-width': '2000px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>ID_vaccine</th>
                <th>Vaccine name</th>
                <th>Unit price (USD)</th>
                <th>Unit variable cost (USD)</th>
                <th>Unit fixed cost (USD/year)</th>
                <th>Units per year</th>
                <th>Unit contribution margin (USD)</th>
                <th>Contribution margin %</th>
                <th>Break-even units</th>
                <th>Break-even revenue (USD)</th>
                <th>Break-even unit cost (USD)</th>
                <th>AI suggested unit price (USD)</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.index }}</td>
                <td class="font-semibold">{{ row.id }}</td>
                <td class="font-semibold">{{ row.name }}</td>
                <td class="text-right">{{ formatCurrency(row.unitPrice) }}</td>
                <td class="text-right">{{ formatCurrency(row.unitVariableCost) }}</td>
                <td class="text-right">{{ formatPlainNumber(row.unitFixedCost) }}</td>
                <td class="text-right">{{ formatPlainNumber(row.unitsPerYear) }}</td>
                <td class="text-right">{{ formatCurrency(row.unitContributionMargin) }}</td>
                <td class="text-right">{{ formatPercent(row.contributionMarginPct) }}</td>
                <td class="text-right">{{ formatNullable(row.breakEvenUnits) }}</td>
                <td class="text-right">{{ formatNullable(row.breakEvenRevenue) }}</td>
                <td class="text-right">{{ formatNullable(row.breakEvenUnitCost) }}</td>
                <td class="text-right">{{ formatNullable(row.aiSuggestedUnitPrice) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
})
export class BiotechMarginIntensityComponent implements OnInit {
  rows: MarginRow[] = [];
  breakEvenInputs: BreakEvenInputRow[] = [];
  targetBreakEvenYears = 3;
  aiAssistEnabled = true;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    const output = this.normalizeOutput(this.biotechModelService.getOutputSnapshot());
    const consolidated = (output as any)?.consolidated ?? {};
    const years = (consolidated.index as number[]) ?? [];
    const data = consolidated.data ?? {};

    const revenue = this.asNumberArray(data['revenue']);
    const cogs = this.asNumberArray(data['cogs']);
    const ebitda = this.asNumberArray(data['ebitda']);
    const nopat = this.asNumberArray(data['nopat']);
    const rdExpense = this.asNumberArray(data['rd_expense_pnl']);
    const capexCash = this.asNumberArray(data['capex_cash']);

    this.rows = years.map((year, idx) => {
      const rev = revenue[idx] ?? 0;
      const safeRev = rev === 0 ? 0 : rev;
      const grossMargin = safeRev ? (rev + (cogs[idx] ?? 0)) / safeRev : 0;
      const ebitdaMargin = safeRev ? (ebitda[idx] ?? 0) / safeRev : 0;
      const nopatMargin = safeRev ? (nopat[idx] ?? 0) / safeRev : 0;
      const rdIntensity = safeRev ? Math.abs(rdExpense[idx] ?? 0) / safeRev : 0;
      const capexIntensity = safeRev ? Math.abs(capexCash[idx] ?? 0) / safeRev : 0;

      return {
        year,
        grossMargin,
        ebitdaMargin,
        nopatMargin,
        rdIntensity,
        capexIntensity,
      };
    });

    this.breakEvenInputs = this.buildBreakEvenInputs(
      this.biotechModelService.getInputSnapshot()
    );
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatCurrency(value: number): string {
    return `$${this.formatFixed(value, 2)}`;
  }

  formatPlainNumber(value: number): string {
    return this.formatFixed(value, 0);
  }

  formatNullable(value: number | null): string {
    if (value === null || Number.isNaN(value)) return 'N/A';
    return this.formatFixed(value, 2);
  }

  get breakEvenOutputs(): BreakEvenOutputRow[] {
    return this.breakEvenInputs.map((row, index) => {
      const unitContributionMargin = row.unitPrice - row.unitVariableCost;
      const contributionMarginPct =
        row.unitPrice !== 0 ? unitContributionMargin / row.unitPrice : 0;
      const breakEvenUnits =
        unitContributionMargin > 0 ? row.unitFixedCost / unitContributionMargin : null;
      const breakEvenRevenue =
        breakEvenUnits !== null ? breakEvenUnits * row.unitPrice : null;
      const breakEvenUnitCost =
        row.unitsPerYear > 0
          ? row.unitVariableCost + row.unitFixedCost / row.unitsPerYear
          : null;
      const aiSuggestedUnitPrice = this.aiAssistEnabled
        ? this.calculateSuggestedUnitPrice(row)
        : null;

      return {
        ...row,
        index,
        unitContributionMargin,
        contributionMarginPct,
        breakEvenUnits,
        breakEvenRevenue,
        breakEvenUnitCost,
        aiSuggestedUnitPrice,
      };
    });
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) return [];
    return values.map((v) => Number(v ?? 0));
  }

  private formatFixed(value: number, digits: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value ?? 0);
  }

  private calculateSuggestedUnitPrice(row: BreakEvenInputRow): number | null {
    if (!row.unitsPerYear || row.unitsPerYear <= 0) return null;
    const horizon = Math.max(1, Math.round(this.targetBreakEvenYears));
    return row.unitVariableCost + row.unitFixedCost / (row.unitsPerYear * horizon);
  }

  private buildBreakEvenInputs(snapshot: any): BreakEvenInputRow[] {
    if (!snapshot) return [];

    const dev = Array.isArray(snapshot.vaccine_development)
      ? snapshot.vaccine_development
      : [];
    const revenue = Array.isArray(snapshot.vaccine_revenue) ? snapshot.vaccine_revenue : [];
    const costs = Array.isArray(snapshot.vaccine_costs) ? snapshot.vaccine_costs : [];
    const rd = Array.isArray(snapshot.vaccine_rd) ? snapshot.vaccine_rd : [];
    const capex = Array.isArray(snapshot.vaccine_capex) ? snapshot.vaccine_capex : [];

    const mapById = (rows: any[], idKey: string, nameKey: string) => {
      const map = new Map<string, any>();
      rows.forEach((row) => {
        const id = String(row?.[idKey] ?? '').trim();
        const name = String(row?.[nameKey] ?? '').trim();
        if (id) map.set(id, row);
        if (name) map.set(name, row);
      });
      return map;
    };

    const revMap = mapById(revenue, 'ID_vaccine', 'Vaccine name');
    const costMap = mapById(costs, 'ID_vaccine', 'Vaccine name');
    const rdMap = mapById(rd, 'ID_vaccine', 'Vaccine name');
    const capexMap = mapById(capex, 'ID_vaccine', 'Vaccine name');

    const sourceList = dev.length ? dev : revenue;
    return sourceList.map((row: any) => {
      const id = String(row?.['ID_vaccine'] ?? row?.id ?? '').trim();
      const name = String(row?.['Vaccine name'] ?? row?.name ?? '').trim();
      const key = id || name;
      const revRow = revMap.get(key);
      const costRow = costMap.get(key);
      const rdRow = rdMap.get(key);
      const capexRow = capexMap.get(key);

      const unitPrice = Number(revRow?.['Patent price (USD/customer)'] ?? 0);
      const unitsPerYear = Number(revRow?.['Patent customers per year'] ?? 0);

      const cogsPct = Number(costRow?.['COGS patent % of sales'] ?? 0);
      const marketingPct = Number(costRow?.['Marketing annual % of sales'] ?? 0);
      const royaltyPct = Number(costRow?.['Royalties cost % of sales'] ?? 0);
      const unitVariableCost =
        unitPrice * (cogsPct + marketingPct + royaltyPct) / 100;

      const rdAnnual = Number(rdRow?.['Post-GTM annual cost (USD/year)'] ?? 0);
      const capexAnnual = Number(capexRow?.['Post-GTM yearly capex (USD)'] ?? 0);
      const indirect = Number(costRow?.['Indirect staff cost (USD)'] ?? 0);
      const electricity = Number(costRow?.['Electricity (USD)'] ?? 0);
      const depreciation = Number(costRow?.['Depreciation (USD)'] ?? 0);
      const interest = Number(costRow?.['Interest & amortization (USD)'] ?? 0);

      const unitFixedCost =
        rdAnnual + capexAnnual + indirect + electricity + depreciation + interest;

      return {
        id,
        name,
        unitPrice,
        unitVariableCost,
        unitFixedCost,
        unitsPerYear,
      };
    });
  }

  private normalizeOutput(rawOutput: unknown): any {
    const fallback = biotechOutput as any;
    const output = rawOutput && typeof rawOutput === 'object' ? (rawOutput as any) : {};
    const consolidated = this.normalizeConsolidated(
      output.consolidated ?? {},
      fallback.consolidated ?? {}
    );
    return {
      ...fallback,
      ...output,
      consolidated,
    };
  }

  private normalizeConsolidated(source: any, fallback: any): any {
    const index = this.asNumberArray(source?.index ?? fallback?.index ?? []);
    const data = this.normalizeConsolidatedData(source?.data ?? {}, fallback?.data ?? {});
    return {
      ...fallback,
      ...source,
      index,
      data,
    };
  }

  private normalizeConsolidatedData(source: any, fallback: any): any {
    const aliases: Record<string, string[]> = {
      revenue: ['revenue', 'Revenue'],
      cogs: ['cogs', 'COGS'],
      ebitda: ['ebitda', 'EBITDA'],
      nopat: ['nopat', 'NOPAT'],
      rd_expense_pnl: ['rd_expense_pnl', 'rdExpense', 'R&D expense', 'rd_expense'],
      capex_cash: ['capex_cash', 'capexCash', 'capex', 'capital_expenditure'],
    };

    const result: Record<string, number[]> = {};
    Object.keys(fallback ?? {}).forEach((key) => {
      const keys = aliases[key] ?? [key];
      const match = keys.find((candidate) => Array.isArray(source?.[candidate]));
      const values = match ? source[match] : fallback?.[key];
      result[key] = this.asNumberArray(values);
    });

    return result;
  }
}
