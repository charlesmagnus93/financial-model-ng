import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { FieldsetModule } from 'primeng/fieldset';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { Subject, takeUntil } from 'rxjs';
import { BiotechProbabilityWeightedCostBurdenComponent } from './biotech-probability-weighted-cost-burden.component';

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
  unitVariableCost: number | null;
  unitFixedCost: number | null;
  unitsPerYear: number;
}

interface BreakEvenOutputRow {
  index: number;
  id: string;
  name: string;
  unitPrice: number;
  unitVariableCost: number;
  unitFixedCost: number;
  unitsPerYear: number;
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
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    SliderModule,
    FieldsetModule,
    BiotechProbabilityWeightedCostBurdenComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
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
              <th class="text-right">Gross margin</th>
              <th class="text-right">EBITDA margin</th>
              <th class="text-right">NOPAT margin</th>
              <th class="text-right">R&amp;D intensity</th>
              <th class="text-right">Capex intensity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>{{ row.year }}</td>
              <td class="text-right">{{ formatPercent(row.grossMargin) }}</td>
              <td class="text-right">{{ formatPercent(row.ebitdaMargin) }}</td>
              <td class="text-right">{{ formatPercent(row.nopatMargin) }}</td>
              <td class="text-right">{{ formatPercent(row.rdIntensity) }}</td>
              <td class="text-right">{{ formatPercent(row.capexIntensity) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <app-biotech-probability-weighted-cost-burden></app-biotech-probability-weighted-cost-burden>

      <p-fieldset legend="Vaccine break-even analysis (interactive)" [toggleable]="true" class="w-full">
        <div class="flex flex-col gap-3">
          <div class="overflow-auto rounded">
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
                <!-- <div class="flex items-center gap-4"> -->
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between text-xs text-surface-400">
                    <span>1</span>
                    <span class="text-red-400">{{ targetBreakEvenYears | number }}</span>
                    <span>10</span>
                  </div>
                  <p-slider
                    [min]="1"
                    [max]="10"
                    [step]="1"
                    [ngModel]="targetBreakEvenYears"
                    (ngModelChange)="targetBreakEvenYears = $event"
                    class="w-full"
                  ></p-slider>
                  <!-- <div class="text-sm font-semibold">{{ targetBreakEvenYears }}</div> -->
                </div>
              </div>
            </div>
    
            <div class="text-xs text-surface-400">
              Adjust unit price and cost inputs to see contribution margin, break-even units,
              and AI-assisted price suggestions based on the target horizon.
            </div>
    
            <div class="overflow-auto" [style]="{ width: '76vw' }">
              <p-table
                [value]="breakEvenInputs"
                showGridlines
                class="text-sm"
                [scrollable]="true"
                scrollHeight="200px"
                [size]="'small'"
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
                    <td class="text-right">{{ formatCurrencyOrNone(row.unitVariableCost) }}</td>
                    <td class="text-right">{{ formatPlainOrNone(row.unitFixedCost) }}</td>
                    <td class="text-right">{{ formatPlainNumber(row.unitsPerYear) }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
            <div class="my-4"></div>
            <div class="text-sm font-semibold">Break-even outputs</div>
            <div class="overflow-auto" [style]="{ width: '76vw' }">
              <p-table
                [value]="breakEvenOutputs"
                showGridlines
                class="text-sm"
                [scrollable]="true"
                scrollHeight="200px"
                [size]="'small'"
              >
                <ng-template pTemplate="header">
                  <tr>
                    <th>#</th>
                    <th>ID_vaccine</th>
                    <th style="min-width:100px">Vaccine name</th>
                    <th style="min-width:100px">Unit price (USD)</th>
                    <th style="min-width:130px">Unit variable cost (USD)</th>
                    <th style="min-width:130px">Unit fixed cost (USD/year)</th>
                    <th style="min-width:130px">Units per year</th>
                    <th style="min-width:160px">Unit contribution margin (USD)</th>
                    <th style="min-width:160px">Contribution margin %</th>
                    <th style="min-width:130px">Break-even units</th>
                    <th style="min-width:150px">Break-even revenue (USD)</th>
                    <th style="min-width:150px">Break-even unit cost (USD)</th>
                    <th style="min-width:150px">AI suggested unit price (USD)</th>
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
      </p-fieldset>
    </div>
  `,
})
export class BiotechMarginIntensityComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  rows: MarginRow[] = [];
  breakEvenInputs: BreakEvenInputRow[] = [];
  targetBreakEvenYears = 3;
  aiAssistEnabled = true;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => this.updateMarginRows(output));

    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe((input) => {
        this.breakEvenInputs = this.buildBreakEvenInputs(
          input ?? this.biotechModelService.getInputSnapshot()
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatCurrency(value: number): string {
    return `$${this.formatFixed(value, 2)}`;
  }

  formatCurrencyOrNone(value: number | null): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'None';
    }
    return this.formatCurrency(Number(value));
  }

  formatPlainOrNone(value: number | null): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'None';
    }
    return this.formatPlainNumber(Number(value));
  }

  formatPlainNumber(value: number): string {
    return this.formatFixed(value, 0);
  }

  formatNullable(value: number | null): string {
    if (value === null || Number.isNaN(value)) return 'None';
    return this.formatFixed(value, 2);
  }

  get breakEvenOutputs(): BreakEvenOutputRow[] {
    return this.breakEvenInputs.map((row, index) => {
      const unitPrice = Number(row.unitPrice ?? 0);
      const unitVariableCost = Number(row.unitVariableCost ?? 0);
      const unitFixedCost = Number(row.unitFixedCost ?? 0);
      const unitsPerYear = Number(row.unitsPerYear ?? 0);
      const unitContributionMargin = unitPrice - unitVariableCost;
      const contributionMarginPct =
        unitPrice !== 0 ? unitContributionMargin / unitPrice : 0;
      const breakEvenUnits =
        unitContributionMargin > 0 ? unitFixedCost / unitContributionMargin : null;
      const breakEvenRevenue =
        breakEvenUnits !== null ? breakEvenUnits * unitPrice : null;
      const breakEvenUnitCost =
        unitsPerYear > 0
          ? unitVariableCost + unitFixedCost / unitsPerYear
          : null;
      const aiSuggestedUnitPrice = this.aiAssistEnabled
        ? this.calculateSuggestedUnitPrice({
            ...row,
            unitPrice,
            unitVariableCost,
            unitFixedCost,
            unitsPerYear,
          })
        : null;

      return {
        ...row,
        index,
        unitPrice,
        unitVariableCost,
        unitFixedCost,
        unitsPerYear,
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

  private updateMarginRows(output: any): void {
    const resolvedOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
    const tableDrivenRows = this.buildMarginRowsFromTablePayload(resolvedOutput);
    if (tableDrivenRows.length) {
      this.rows = tableDrivenRows;
      return;
    }

    const consolidated = (resolvedOutput as any)?.consolidated ?? {};
    const yearsRaw = this.asNumberArray(consolidated?.index);
    const data = consolidated?.data ?? {};

    const revenueRaw = this.pickSeries(data, ['revenue']);
    const cogsRaw = this.pickSeries(data, ['cogs']);
    const ebitdaRaw = this.pickSeries(data, ['ebitda']);
    const nopatRaw = this.pickSeries(data, ['nopat']);
    const rdExpenseRaw = this.pickSeries(data, ['rd_expense_pnl', 'rd_expense', 'r_and_d_expense']);
    const capexCashRaw = this.pickSeries(data, ['capex_cash', 'capex']);

    const requiredLength = Math.max(
      yearsRaw.length,
      revenueRaw.length,
      cogsRaw.length,
      ebitdaRaw.length,
      nopatRaw.length,
      rdExpenseRaw.length,
      capexCashRaw.length
    );

    const years = this.buildLabels(yearsRaw, requiredLength);
    const revenue = this.normalizeSeriesLength(revenueRaw, requiredLength);
    const cogs = this.normalizeSeriesLength(cogsRaw, requiredLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, requiredLength);
    const nopat = this.normalizeSeriesLength(nopatRaw, requiredLength);
    const rdExpense = this.normalizeSeriesLength(rdExpenseRaw, requiredLength);
    const capexCash = this.normalizeSeriesLength(capexCashRaw, requiredLength);

    this.rows = years.map((year, idx) => {
      const rev = revenue[idx] ?? 0;
      const grossMargin = rev ? (rev + (cogs[idx] ?? 0)) / rev : 0;
      const ebitdaMargin = rev ? (ebitda[idx] ?? 0) / rev : 0;
      const nopatMargin = rev ? (nopat[idx] ?? 0) / rev : 0;
      const rdIntensity = rev ? Math.abs(rdExpense[idx] ?? 0) / rev : 0;
      const capexIntensity = rev ? Math.abs(capexCash[idx] ?? 0) / rev : 0;

      return {
        year,
        grossMargin,
        ebitdaMargin,
        nopatMargin,
        rdIntensity,
        capexIntensity,
      };
    });
  }

  private buildMarginRowsFromTablePayload(output: any): MarginRow[] {
    const candidates = [
      output?.margin_intensity_analysis,
      output?.margin_intensity,
      output?.advanced_financial_analytics?.margin_intensity_analysis,
      output?.advanced_financial_analytics?.margin_intensity,
      output?.analytics?.margin_intensity_analysis,
      output?.analytics?.margin_intensity,
    ];

    for (const candidate of candidates) {
      const rows = this.tryBuildRowsFromCandidate(candidate);
      if (rows.length) {
        return rows;
      }
    }
    return [];
  }

  private tryBuildRowsFromCandidate(candidate: any): MarginRow[] {
    if (!candidate || typeof candidate !== 'object') {
      return [];
    }

    if (Array.isArray(candidate)) {
      return candidate
        .map((row: any, idx: number) => {
          const year = Number(
            row?.year ??
              row?.index ??
              row?.['index - streamlit-generated'] ??
              row?.['index'] ??
              idx + 1
          );
          return {
            year,
            grossMargin: Number(row?.gross_margin ?? row?.['Gross margin'] ?? 0),
            ebitdaMargin: Number(row?.ebitda_margin ?? row?.['EBITDA margin'] ?? 0),
            nopatMargin: Number(row?.nopat_margin ?? row?.['NOPAT margin'] ?? 0),
            rdIntensity: Number(row?.rd_intensity ?? row?.['R&D intensity'] ?? 0),
            capexIntensity: Number(row?.capex_intensity ?? row?.['Capex intensity'] ?? 0),
          };
        })
        .filter((row) => Number.isFinite(row.year));
    }

    const indexRaw = this.asNumberArray(candidate?.index);
    const data = candidate?.data;
    if (!data || typeof data !== 'object') {
      return [];
    }

    const grossRaw = this.pickSeries(data, ['gross_margin', 'Gross margin']);
    const ebitdaRaw = this.pickSeries(data, ['ebitda_margin', 'EBITDA margin']);
    const nopatRaw = this.pickSeries(data, ['nopat_margin', 'NOPAT margin']);
    const rdRaw = this.pickSeries(data, ['rd_intensity', 'R&D intensity']);
    const capexRaw = this.pickSeries(data, ['capex_intensity', 'Capex intensity']);
    const requiredLength = Math.max(
      indexRaw.length,
      grossRaw.length,
      ebitdaRaw.length,
      nopatRaw.length,
      rdRaw.length,
      capexRaw.length
    );

    if (!requiredLength) {
      return [];
    }

    const years = this.buildLabels(indexRaw, requiredLength);
    const gross = this.normalizeSeriesLength(grossRaw, requiredLength);
    const ebitda = this.normalizeSeriesLength(ebitdaRaw, requiredLength);
    const nopat = this.normalizeSeriesLength(nopatRaw, requiredLength);
    const rd = this.normalizeSeriesLength(rdRaw, requiredLength);
    const capex = this.normalizeSeriesLength(capexRaw, requiredLength);

    return years.map((year, idx) => ({
      year,
      grossMargin: gross[idx] ?? 0,
      ebitdaMargin: ebitda[idx] ?? 0,
      nopatMargin: nopat[idx] ?? 0,
      rdIntensity: rd[idx] ?? 0,
      capexIntensity: capex[idx] ?? 0,
    }));
  }

  private pickSeries(data: Record<string, unknown>, keys: string[]): number[] {
    for (const key of keys) {
      const series = this.asNumberArray(data[key]);
      if (series.length) {
        return series;
      }
    }
    return [];
  }

  private buildLabels(years: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (years.length >= requiredLength) {
      return years.slice(0, requiredLength);
    }
    if (years.length > 0) {
      const labels = [...years];
      let nextYear = labels[labels.length - 1] ?? 0;
      while (labels.length < requiredLength) {
        nextYear += 1;
        labels.push(nextYear);
      }
      return labels;
    }
    return Array.from({ length: requiredLength }, (_, index) => index + 1);
  }

  private normalizeSeriesLength(values: number[], requiredLength: number): number[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const normalized = [...values];
    while (normalized.length < requiredLength) {
      normalized.push(0);
    }
    return normalized;
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
    const variableCost = Number(row.unitVariableCost ?? 0);
    const fixedCost = Number(row.unitFixedCost ?? 0);
    return variableCost + fixedCost / (row.unitsPerYear * horizon);
  }

  private buildBreakEvenInputs(snapshot: any): BreakEvenInputRow[] {
    if (!snapshot) return [];

    const products = Array.isArray(snapshot.products) ? snapshot.products : [];
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
    const devMap = mapById(dev, 'ID_vaccine', 'Vaccine name');

    if (products.length) {
      return products.map((product: any, index: number) => {
        const id = String(product?.id ?? '').trim() || `VAC-${String(index + 1).padStart(3, '0')}`;
        const name = String(product?.name ?? '').trim() || `Vaccine ${index + 1}`;
        const devRow = devMap.get(id) ?? devMap.get(name);
        const revRow = revMap.get(id) ?? revMap.get(name);
        const costRow = costMap.get(id) ?? costMap.get(name);
        const rdRow = rdMap.get(id) ?? rdMap.get(name);
        const capexRow = capexMap.get(id) ?? capexMap.get(name);

        const unitPrice = Number(
          product?.price_per_unit ??
            revRow?.['Patent price (USD/customer)'] ??
            0
        );

        const unitsPerYear = Number(
          product?.units_per_year ??
            revRow?.['Patent customers per year'] ??
            0
        );

        const cogsPct = this.normalizePercent(
          product?.cogs_patent ?? costRow?.['COGS patent % of sales']
        );
        const marketingPct = this.normalizePercent(
          product?.sales_marketing_pct ?? costRow?.['Marketing annual % of sales']
        );
        const royaltyPct = this.normalizePercent(
          product?.royalty_pct ?? costRow?.['Royalties cost % of sales']
        );

        const canComputeVariableCost =
          unitPrice > 0 && (cogsPct > 0 || marketingPct > 0 || royaltyPct > 0);
        const unitVariableCost = canComputeVariableCost
          ? unitPrice * (cogsPct + marketingPct + royaltyPct)
          : null;

        const rdAnnual = Number(
          product?.rd_annual_post_launch ??
            rdRow?.['Post-GTM annual cost (USD/year)'] ??
            0
        );
        const capexAnnual = Number(
          product?.capex_annual_post_launch ??
            capexRow?.['Post-GTM yearly capex (USD)'] ??
            0
        );
        const indirect = Number(costRow?.['Indirect staff cost (USD)'] ?? 0);
        const electricity = Number(costRow?.['Electricity (USD)'] ?? 0);
        const depreciation = Number(costRow?.['Depreciation (USD)'] ?? 0);
        const interest = Number(costRow?.['Interest & amortization (USD)'] ?? 0);

        const fixedCostComponents = [
          rdAnnual,
          capexAnnual,
          indirect,
          electricity,
          depreciation,
          interest,
        ];
        const hasFixedCostSource = fixedCostComponents.some((value) => value > 0);
        const unitFixedCost = hasFixedCostSource
          ? fixedCostComponents.reduce((sum, value) => sum + value, 0)
          : null;

        const hasLegacyUnitData =
          devRow || revRow || costRow || rdRow || capexRow;
        return {
          id,
          name,
          unitPrice,
          unitVariableCost: hasLegacyUnitData ? unitVariableCost : null,
          unitFixedCost: hasLegacyUnitData ? unitFixedCost : null,
          unitsPerYear,
        };
      });
    }

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
      const canComputeVariableCost =
        unitPrice > 0 && (cogsPct > 0 || marketingPct > 0 || royaltyPct > 0);
      const unitVariableCost = canComputeVariableCost
        ? unitPrice * (cogsPct + marketingPct + royaltyPct) / 100
        : null;

      const rdAnnual = Number(rdRow?.['Post-GTM annual cost (USD/year)'] ?? 0);
      const capexAnnual = Number(capexRow?.['Post-GTM yearly capex (USD)'] ?? 0);
      const indirect = Number(costRow?.['Indirect staff cost (USD)'] ?? 0);
      const electricity = Number(costRow?.['Electricity (USD)'] ?? 0);
      const depreciation = Number(costRow?.['Depreciation (USD)'] ?? 0);
      const interest = Number(costRow?.['Interest & amortization (USD)'] ?? 0);

      const fixedCostTotal =
        rdAnnual + capexAnnual + indirect + electricity + depreciation + interest;
      const unitFixedCost = fixedCostTotal > 0 ? fixedCostTotal : null;

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

  private normalizePercent(value: unknown): number {
    const num = Number(value ?? 0);
    if (!Number.isFinite(num) || num <= 0) {
      return 0;
    }
    return num > 1 ? num / 100 : num;
  }

}

