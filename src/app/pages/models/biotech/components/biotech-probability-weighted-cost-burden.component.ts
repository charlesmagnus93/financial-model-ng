import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { formatNumberEnglish } from '@/utils/number-format';

interface ProbabilityWeightedCostBurdenRow {
  index: number;
  product: string;
  probabilityWeightedOpex: number;
  probabilityWeightedRdCash: number;
  probabilityWeightedCapex: number;
  totalCostBurden: number;
}

@Component({
  standalone: true,
  selector: 'app-biotech-probability-weighted-cost-burden',
  imports: [CommonModule, TableModule, FieldsetModule],
  template: `
    <p-fieldset legend="Probability-weighted cost burden" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-3">
        <div class="overflow-auto rounded">
          <p-table
            [value]="rows"
            showGridlines
            [scrollable]="true"
            scrollHeight="200px"
            [size]="'small'"
            class="text-sm"
            [tableStyle]="{ 'min-width': '1100px' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="w-8"></th>
                <th>Product</th>
                <th class="text-right">Probability-weighted opex</th>
                <th class="text-right">Probability-weighted R&amp;D cash</th>
                <th class="text-right">Probability-weighted CAPEX</th>
                <th class="text-right">Total cost burden</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="text-right">{{ row.index }}</td>
                <td class="font-semibold">{{ row.product }}</td>
                <td class="text-right">{{ formatNumber(row.probabilityWeightedOpex) }}</td>
                <td class="text-right">{{ formatNumber(row.probabilityWeightedRdCash) }}</td>
                <td class="text-right">{{ formatNumber(row.probabilityWeightedCapex) }}</td>
                <td class="text-right">{{ formatNumber(row.totalCostBurden) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="text-xs text-surface-500">
          Costs are weighted by the annual success schedule so early-stage programs show
          risk-adjusted cash burn rather than raw spend.
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProbabilityWeightedCostBurdenComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private latestOutput: any = null;
  private latestInput: any = null;

  rows: ProbabilityWeightedCostBurdenRow[] = [];

  constructor(private readonly biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.latestInput = this.biotechModelService.getInputSnapshot() ?? {};
    this.latestOutput = this.biotechModelService.getOutputSnapshot() ?? {};
    this.rebuildRows();

    this.biotechModelService.output$
      .pipe(takeUntil(this.destroy$))
      .subscribe((output) => {
        this.latestOutput = output ?? this.biotechModelService.getOutputSnapshot() ?? {};
        this.rebuildRows();
      });

    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe((input) => {
        this.latestInput = input ?? this.biotechModelService.getInputSnapshot() ?? {};
        this.rebuildRows();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatNumber(value: number): string {
    return formatNumberEnglish(value);
  }

  private rebuildRows(): void {
    const outputRows = this.buildRowsFromOutput(this.latestOutput);
    if (outputRows.length) {
      this.rows = outputRows;
      return;
    }
    this.rows = this.buildRowsFromFallback(this.latestInput, this.latestOutput);
  }

  private buildRowsFromOutput(output: any): ProbabilityWeightedCostBurdenRow[] {
    const candidates = [
      output?.probability_weighted_cost_burden,
      output?.probability_weighted_cost_burden_table,
      output?.advanced_financial_analytics?.probability_weighted_cost_burden,
      output?.advanced_financial_analytics?.probability_weighted_cost_burden_table,
      output?.analytics?.probability_weighted_cost_burden,
      output?.analytics?.probability_weighted_cost_burden_table,
      output?.cost_burden,
    ];

    for (const candidate of candidates) {
      const rows = this.tryBuildOutputRows(candidate);
      if (rows.length) {
        return rows;
      }
    }
    return [];
  }

  private tryBuildOutputRows(candidate: any): ProbabilityWeightedCostBurdenRow[] {
    if (!candidate) {
      return [];
    }

    if (Array.isArray(candidate)) {
      const rows = candidate
        .map((row: any, fallbackIndex: number) => this.mapArrayRow(row, fallbackIndex))
        .filter((row): row is ProbabilityWeightedCostBurdenRow => row !== null);
      return rows;
    }

    if (typeof candidate === 'object') {
      const data = candidate?.data;
      if (!data || typeof data !== 'object') {
        return [];
      }

      const indexRaw = candidate?.index;
      const productsFromData = this.pickStringSeries(data, [
        'product',
        'Product',
        'name',
        'Name',
      ]);
      const indexString = this.asStringArray(indexRaw);
      const indexNumbers = this.asNumberArray(indexRaw);

      const opex = this.pickNumberSeries(data, [
        'probability_weighted_opex',
        'Probability-weighted opex',
        'probability weighted opex',
        'pw_opex',
      ]);
      const rdCash = this.pickNumberSeries(data, [
        'probability_weighted_rd_cash',
        'Probability-weighted R&D cash',
        'probability weighted rd cash',
        'pw_rd_cash',
      ]);
      const capex = this.pickNumberSeries(data, [
        'probability_weighted_capex',
        'Probability-weighted CAPEX',
        'probability weighted capex',
        'pw_capex',
      ]);
      const total = this.pickNumberSeries(data, [
        'total_cost_burden',
        'Total cost burden',
        'total',
      ]);

      const requiredLength = Math.max(
        productsFromData.length,
        indexString.length,
        indexNumbers.length,
        opex.length,
        rdCash.length,
        capex.length,
        total.length
      );
      if (!requiredLength) {
        return [];
      }

      const products = this.normalizeStringSeriesLength(
        productsFromData.length ? productsFromData : indexString,
        requiredLength
      );
      const normalizedOpex = this.normalizeNumberSeriesLength(opex, requiredLength);
      const normalizedRdCash = this.normalizeNumberSeriesLength(rdCash, requiredLength);
      const normalizedCapex = this.normalizeNumberSeriesLength(capex, requiredLength);
      const normalizedTotal = this.normalizeNumberSeriesLength(total, requiredLength);

      return Array.from({ length: requiredLength }, (_, idx) => {
        const candidateIndex = indexNumbers[idx];
        const totalCost =
          normalizedTotal[idx] ??
          ((normalizedOpex[idx] ?? 0) + (normalizedRdCash[idx] ?? 0) + (normalizedCapex[idx] ?? 0));
        return {
          index: Number.isFinite(candidateIndex) ? candidateIndex : idx,
          product: products[idx] || `Product ${idx + 1}`,
          probabilityWeightedOpex: normalizedOpex[idx] ?? 0,
          probabilityWeightedRdCash: normalizedRdCash[idx] ?? 0,
          probabilityWeightedCapex: normalizedCapex[idx] ?? 0,
          totalCostBurden: totalCost,
        };
      });
    }

    return [];
  }

  private mapArrayRow(
    row: any,
    fallbackIndex: number
  ): ProbabilityWeightedCostBurdenRow | null {
    if (!row || typeof row !== 'object') {
      return null;
    }

    const product = this.pickFirstString(row, ['product', 'Product', 'name', 'Name']);
    const opex = this.pickFirstNumber(row, [
      'probability_weighted_opex',
      'Probability-weighted opex',
      'probability weighted opex',
      'pw_opex',
    ]);
    const rdCash = this.pickFirstNumber(row, [
      'probability_weighted_rd_cash',
      'Probability-weighted R&D cash',
      'probability weighted rd cash',
      'pw_rd_cash',
    ]);
    const capex = this.pickFirstNumber(row, [
      'probability_weighted_capex',
      'Probability-weighted CAPEX',
      'probability weighted capex',
      'pw_capex',
    ]);
    const total = this.pickFirstNumber(row, [
      'total_cost_burden',
      'Total cost burden',
      'total',
    ]);
    const index = this.pickFirstNumber(row, ['index', 'Index', '#']);

    const mapped: ProbabilityWeightedCostBurdenRow = {
      index: Number.isFinite(index) ? index : fallbackIndex,
      product: product || `Product ${fallbackIndex + 1}`,
      probabilityWeightedOpex: opex,
      probabilityWeightedRdCash: rdCash,
      probabilityWeightedCapex: capex,
      totalCostBurden:
        Number.isFinite(total) && total !== 0 ? total : opex + rdCash + capex,
    };

    return mapped;
  }

  private buildRowsFromFallback(
    inputSnapshot: any,
    outputSnapshot: any
  ): ProbabilityWeightedCostBurdenRow[] {
    const products = Array.isArray(inputSnapshot?.products) ? inputSnapshot.products : [];
    if (!products.length) {
      return [];
    }

    const yearsFromOutput = this.asNumberArray(outputSnapshot?.consolidated?.index);
    const configuredYears = Number(inputSnapshot?.model_config?.n_years ?? 0);
    const totalYears = Math.max(configuredYears, yearsFromOutput.length, 1);
    const rampFactorsRaw = Array.isArray(inputSnapshot?.model_config?.sales_ramp_factors)
      ? inputSnapshot.model_config.sales_ramp_factors
      : [];
    const rampFactors = rampFactorsRaw.length
      ? rampFactorsRaw.map((value: any) => Number(value ?? 1))
      : [1];

    const rows = products.map((product: any, sourceIndex: number) => {
      const name = String(product?.name ?? product?.id ?? `Product ${sourceIndex + 1}`).trim();
      const timeToMarket = Math.max(0, Math.round(Number(product?.time_to_market ?? 0)));
      const patentYears = Math.max(0, Math.round(Number(product?.patent_years ?? 0)));

      const patentRevenueTarget = Number(product?.patent_revenue_target ?? 0);
      const postPatentRevenueTarget = Number(product?.post_patent_revenue_target ?? 0);
      const growthPatent = Number(product?.market_growth_patent ?? 0);
      const growthPost = Number(product?.market_growth_post ?? 0);

      const laborPct = Number(product?.labor_pct ?? 0);
      const overheadPct = Number(product?.overhead_pct ?? 0);
      const materialPct = Number(product?.material_pct ?? 0);
      const salesMarketingPct = Number(product?.sales_marketing_pct ?? 0);
      const gnaPct = Number(product?.gna_pct ?? 0);
      const royaltyPct = Number(product?.royalty_pct ?? 0);
      const cogsPatentPct = Number(product?.cogs_patent ?? 0);
      const cogsPostPct = Number(product?.cogs_post ?? cogsPatentPct);

      let probabilityWeightedOpex = 0;
      for (let yearIndex = 0; yearIndex < totalYears; yearIndex += 1) {
        const launchOffset = yearIndex - timeToMarket;
        if (launchOffset < 0) {
          continue;
        }

        const inPatentWindow = launchOffset < patentYears;
        const growthBase = inPatentWindow
          ? patentRevenueTarget
          : postPatentRevenueTarget;
        const growthRate = inPatentWindow ? growthPatent : growthPost;
        const growthOffset = inPatentWindow
          ? launchOffset
          : Math.max(0, launchOffset - patentYears);
        const rampFactor =
          launchOffset >= 0 && launchOffset < rampFactors.length
            ? Number(rampFactors[launchOffset] ?? 1)
            : 1;

        const yearlyRevenue =
          growthBase * Math.pow(1 + Math.max(-1, growthRate), growthOffset) * rampFactor;
        const cogsPct = inPatentWindow ? cogsPatentPct : cogsPostPct;
        const costRatio =
          cogsPct +
          salesMarketingPct +
          gnaPct +
          laborPct +
          overheadPct +
          materialPct +
          royaltyPct;

        probabilityWeightedOpex += yearlyRevenue * Math.max(0, costRatio);
      }

      const postLaunchYears = Math.max(0, totalYears - timeToMarket);
      const probabilityWeightedRdCash =
        Number(product?.rd_remaining_pre_launch ?? 0) +
        Number(product?.rd_annual_post_launch ?? 0) * postLaunchYears;
      const probabilityWeightedCapex =
        Number(product?.capex_remaining_pre_launch ?? 0) +
        Number(product?.capex_annual_post_launch ?? 0) * postLaunchYears;

      return {
        index: sourceIndex,
        product: name || `Product ${sourceIndex + 1}`,
        probabilityWeightedOpex,
        probabilityWeightedRdCash,
        probabilityWeightedCapex,
        totalCostBurden:
          probabilityWeightedOpex + probabilityWeightedRdCash + probabilityWeightedCapex,
      };
    });

    return rows.sort(
      (
        a: ProbabilityWeightedCostBurdenRow,
        b: ProbabilityWeightedCostBurdenRow
      ) => b.totalCostBurden - a.totalCostBurden
    );
  }

  private asNumberArray(values: unknown): number[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return values.map((value) => Number(value ?? 0));
  }

  private asStringArray(values: unknown): string[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return values.map((value) => String(value ?? '').trim());
  }

  private pickNumberSeries(data: Record<string, unknown>, keys: string[]): number[] {
    for (const key of keys) {
      const values = this.asNumberArray(data[key]);
      if (values.length) {
        return values;
      }
    }
    return [];
  }

  private pickStringSeries(data: Record<string, unknown>, keys: string[]): string[] {
    for (const key of keys) {
      const values = this.asStringArray(data[key]).filter((value) => value.length > 0);
      if (values.length) {
        return values;
      }
    }
    return [];
  }

  private pickFirstNumber(source: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const value = Number(source[key] ?? 0);
      if (Number.isFinite(value)) {
        return value;
      }
    }
    return 0;
  }

  private pickFirstString(source: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = String(source[key] ?? '').trim();
      if (value) {
        return value;
      }
    }
    return '';
  }

  private normalizeNumberSeriesLength(values: number[], requiredLength: number): number[] {
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

  private normalizeStringSeriesLength(values: string[], requiredLength: number): string[] {
    if (requiredLength <= 0) {
      return [];
    }
    if (values.length >= requiredLength) {
      return values.slice(0, requiredLength);
    }
    const normalized = [...values];
    while (normalized.length < requiredLength) {
      normalized.push('');
    }
    return normalized;
  }
}

