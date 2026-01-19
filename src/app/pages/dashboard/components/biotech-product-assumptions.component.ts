import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiotechModelService } from '@/pages/services/biotech-model.service';
import { PharmaModelService } from '@/pages/services/pharma-model.service';
import { BiotechProductAssumptionsFieldsetComponent } from './biotech-product-assumptions-fieldset.component';
import { BiotechProductVaccineMarketFieldsetComponent } from './biotech-product-vaccine-market-fieldset.component';
import { BiotechProductVaccineRevenueFieldsetComponent } from './biotech-product-vaccine-revenue-fieldset.component';
import { BiotechProductVaccineCostFieldsetComponent } from './biotech-product-vaccine-cost-fieldset.component';
import { BiotechProductVaccineResearchDevFieldsetComponent } from './biotech-product-vaccine-research-dev-fieldset.component';
import { BiotechProductVaccineCapexFieldsetComponent } from './biotech-product-vaccine-capex-fieldset.component';
import { BiotechProductVaccineRoyaltyRevenuesFieldsetComponent } from "./biotech-product-vaccine-royalty-revenues-fieldset.component";
import { BiotechProductVaccineMarketShareFieldsetComponent } from "./biotech-product-vaccine-market-share-fieldset.component";
import { BiotechProductVaccinesFieldsetComponent } from "./biotech-product-vaccines-fieldset.component";

@Component({
  standalone: true,
  selector: 'biotech-product-assumptions',
  imports: [
    CommonModule,
    BiotechProductAssumptionsFieldsetComponent,
    BiotechProductVaccineMarketFieldsetComponent,
    BiotechProductVaccineRevenueFieldsetComponent,
    BiotechProductVaccineCostFieldsetComponent,
    BiotechProductVaccineResearchDevFieldsetComponent,
    BiotechProductVaccineCapexFieldsetComponent,
    BiotechProductVaccineRoyaltyRevenuesFieldsetComponent,
    BiotechProductVaccineMarketShareFieldsetComponent,
    BiotechProductVaccinesFieldsetComponent
],
  template: `
    <biotech-product-assumptions-fieldset></biotech-product-assumptions-fieldset>
    <biotech-product-vaccine-market-fieldset></biotech-product-vaccine-market-fieldset>
    <biotech-product-vaccine-revenue-fieldset></biotech-product-vaccine-revenue-fieldset>
    <biotech-product-vaccine-cost-fieldset></biotech-product-vaccine-cost-fieldset>
    <biotech-product-vaccine-research-dev-fieldset></biotech-product-vaccine-research-dev-fieldset>
    <biotech-product-vaccine-capex-fieldset></biotech-product-vaccine-capex-fieldset>
    <biotech-product-vaccine-royalty-revenues-fieldset></biotech-product-vaccine-royalty-revenues-fieldset>
    <biotech-product-vaccine-market-share-fieldset></biotech-product-vaccine-market-share-fieldset>
    <biotech-product-vaccines-fieldset></biotech-product-vaccines-fieldset>
  `,
})
export class BiotechProductAssumptionsComponent implements OnInit {
  constructor(private biotechModelService: BiotechModelService) {}

  ngOnInit(): void {
    this.mapDefaultProductsToAssumptions();
  }

  private mapDefaultProductsToAssumptions(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const products = Array.isArray(snapshot.products) ? snapshot.products : [];
    if (!products.length) {
      return;
    }

    const normalizedProducts = products.map((product: any, index: number) => {
      const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
      return { ...product, id };
    });

    const patch: Record<string, unknown> = {};

    if (this.needsRows(snapshot?.vaccineProductsAssumptions?.rows)) {
      patch['vaccineProductsAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          return {
            id,
            name: String(product?.name ?? ''),
            stage: String(product?.stage ?? ''),
            successProbPct: this.percentFromRatio(product?.success_prob),
            includeInConsolidation: Boolean(product?.include_in_consolidation),
            timeToMarket: this.asNumber(product?.time_to_market),
            patentYears: this.asNumber(product?.patent_years),
            patentRevenueTargetUsd: this.asNumber(product?.patent_revenue_target),
            postPatentRevenueTargetUsd: this.asNumber(product?.post_patent_revenue_target),
            marketSharePatentPct: this.percentFromRatio(product?.peak_penetration),
            marketSharePostPct: this.percentFromRatio(product?.post_patent_sales),
            marketGrowthPct: this.percentFromRatio(product?.market_growth_patent),
            salesGrowthPct: this.percentFromRatio(product?.market_growth_post),
            avgPriceUsd: this.asNumber(product?.price_per_unit),
            cogsPct: this.percentFromRatio(product?.cogs_patent),
            marketingAnnualPct: this.percentFromRatio(product?.sales_marketing_pct),
            marketingLaunchUsd: 0,
            rndSpentUsd: 0,
            capexInitialUsd: 0,
            capexLaunchUsd: 0,
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineMarketAssumptions?.rows)) {
      patch['vaccineMarketAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const patentRevenue = this.asNumber(product?.patent_revenue_target);
          const price = this.asNumber(product?.price_per_unit) || (patentRevenue ? 100 : 0);
          const marketSizeCustomers = price ? Math.round(patentRevenue / price) : 0;
          return {
            id,
            name: String(product?.name ?? ''),
            marketSizeCustomers,
            avgSpendUsd: price,
            samPctOfTam: 50,
            samPctOfMarket: 40,
            somPct: 20,
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineRevenueAssumptions?.rows)) {
      patch['vaccineRevenueAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const patentRevenue = this.asNumber(product?.patent_revenue_target);
          const postRevenue = this.asNumber(product?.post_patent_revenue_target);
          const price = this.asNumber(product?.price_per_unit) || (patentRevenue ? 100 : 0);
          const customers = price ? Math.round(patentRevenue / price) : 0;
          const postRatio = patentRevenue ? postRevenue / patentRevenue : 0;
          return {
            id,
            name: String(product?.name ?? ''),
            patentCustomersPerYear: customers,
            patentPricePerCustomer: price,
            postPatentCustomerAdjPct: postRatio * 100,
            postPatentPriceAdjPct: 100,
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineCostAssumptions?.rows)) {
      patch['vaccineCostAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const patentRevenue = this.asNumber(product?.patent_revenue_target);
          const gnaPct = this.asNumber(product?.gna_pct);
          return {
            id,
            name: String(product?.name ?? ''),
            cogsPatentPct: this.percentFromRatio(product?.cogs_patent),
            cogsPostPct: this.percentFromRatio(product?.cogs_post),
            marketingAnnualPct: this.percentFromRatio(product?.sales_marketing_pct),
            marketingLaunchUsd: 0,
            indirectStaffUsd: 0,
            electricityUsd: 0,
            depreciationUsd: 0,
            interestAmortizationUsd: 0,
            royaltiesPct: this.percentFromRatio(product?.royalty_pct),
            gnaTotalUsd: gnaPct && patentRevenue ? gnaPct * patentRevenue : 0,
            patentOperatingCostPct: 0,
            postOperatingCostPct: 0,
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineResearchDevAssumptions?.rows)) {
      patch['vaccineResearchDevAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const capitalization = this.percentFromRatio(product?.rd_capitalization_ratio);
          return {
            id,
            name: String(product?.name ?? ''),
            costAccounting: capitalization ? `${capitalization.toFixed(0)}% capitalised` : 'Operating',
            preGtmSpentUsd: 0,
            preGtmRemainingUsd: this.asNumber(product?.rd_remaining_pre_launch),
            postGtmAnnualCostUsd: this.asNumber(product?.rd_annual_post_launch),
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineCapexAssumptions?.rows)) {
      patch['vaccineCapexAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          return {
            id,
            name: String(product?.name ?? ''),
            preGtmCapexSpentUsd: 0,
            preGtmCapexRemainingUsd: this.asNumber(product?.capex_remaining_pre_launch),
            postGtmYearlyCapexUsd: this.asNumber(product?.capex_annual_post_launch),
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineRoyaltyAssumptions?.rows)) {
      patch['vaccineRoyaltyAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const royaltyPct = this.percentFromRatio(product?.royalty_pct);
          return {
            id,
            name: String(product?.name ?? ''),
            monetizationModel: royaltyPct > 0 ? 'Licensing' : 'Product Sale',
            royaltyRatePct: royaltyPct,
          };
        }),
      };
    }

    if (this.needsRows(snapshot?.vaccineMarketShareAssumptions?.rows)) {
      patch['vaccineMarketShareAssumptions'] = {
        rows: normalizedProducts.map((product: any, index: number) => {
          const id = String(product?.id ?? '').trim() || this.formatId(index + 1);
          const marketType = product?.preexisting_market ? 'Existing market' : 'New market';
          const relevantMarketSize = this.asNumber(product?.patent_revenue_target);
          return {
            id,
            name: String(product?.name ?? ''),
            marketType,
            relevantMarketSizeUsd: relevantMarketSize,
            revenueTargetPatentPct: 100,
            revenueTargetPostPct: 100,
            marketSharePatentPct: this.percentFromRatio(product?.peak_penetration),
            marketSharePostPct: this.percentFromRatio(product?.post_patent_sales),
            marketGrowthPct: this.percentFromRatio(product?.market_growth_patent),
            salesGrowthPct: this.percentFromRatio(product?.market_growth_post),
          };
        }),
      };
    }

    const needsProductIds = products.some((product: any) => !String(product?.id ?? '').trim());
    if (needsProductIds) {
      patch['products'] = normalizedProducts;
    }

    if (Object.keys(patch).length) {
      this.biotechModelService.patchInput(patch);
    }
  }

  private needsRows(rows: unknown): boolean {
    return !Array.isArray(rows) || rows.length === 0;
  }

  private asNumber(value: unknown): number {
    return Number(value ?? 0);
  }

  private percentFromRatio(value: unknown): number {
    const num = Number(value ?? 0);
    if (!Number.isFinite(num)) return 0;
    return num <= 1 ? num * 100 : num;
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}
