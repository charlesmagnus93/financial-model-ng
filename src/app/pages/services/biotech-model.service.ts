import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  map,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api.service';
import biotechDefaults from '../../../assets/biotech_input.json';

const INPUT_STORAGE_KEY = 'biotech_model_input';
const OUTPUT_STORAGE_KEY = 'biotech_model_output';

@Injectable({
  providedIn: 'root',
})
export class BiotechModelService {
  private inputSubject = new BehaviorSubject<any>({});
  private outputSubject = new BehaviorSubject<any>(null);
  subscriptionStatus = signal<'checking' | 'active' | 'inactive' | 'error'>(
    'checking'
  );
  subscriptionMessage = signal('');

  input$ = this.inputSubject.asObservable();
  output$ = this.outputSubject.asObservable();

  private defaultsRequest?: Observable<any>;

  constructor(private api: ApiService, private http: HttpClient) {
    this.loadFromStorage();
  }

  getInputSnapshot(): any {
    return this.inputSubject.getValue();
  }

  getOutputSnapshot(): any {
    return this.outputSubject.getValue();
  }

  getYearOptions(): number[] {
    const years = this.getInputSnapshot()?.years;
    if (Array.isArray(years) && years.length) {
      return years;
    }
    const current = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, idx) => current + idx);
  }

  setInput(input: any): void {
    this.inputSubject.next(input);
    this.persist(INPUT_STORAGE_KEY, input);
  }

  loadDefaults(): Observable<void> {
    if (!this.defaultsRequest) {
      this.defaultsRequest = this.http
        .get<any>('assets/biotech_input.json')
        .pipe(shareReplay(1));
    }
    return this.defaultsRequest.pipe(
      tap((defaults) => this.setInput(JSON.parse(JSON.stringify(defaults)))),
      map(() => undefined)
    );
  }

  clearInput(): void {
    this.setInput({});
  }

  patchInput(patch: Record<string, unknown>): void {
    const current = this.getInputSnapshot();
    const next = { ...current, ...patch };
    this.setInput(next);
  }

  setOutput(output: any): void {
    this.outputSubject.next(output);
    this.persist(OUTPUT_STORAGE_KEY, output);
  }

  runBiotechModel(): Observable<any> {
    const payload = { inputs: this.buildRunPayload() };
    // console.log('Running Biotech Model with payload:', payload);
    return this.api.post('/inputs/biotech/validate', payload).pipe(
      switchMap((validation: { valid: boolean; message: string }) => {
        if (!validation?.valid) {
          return throwError(
            () => new Error(validation?.message || 'Inputs failed validation.')
          );
        }
        return this.api
          .post('/model/biotech/run', payload)
          .pipe(tap((response) => this.setOutput(response)));
      })
    );
  }

  exportModelReport(
    modelCode: string,
    format: string = 'CSV'
  ): Observable<Blob> {
    const payload = { inputs: this.getInputSnapshot(), format };
    return this.api.postBlob(`/report/${modelCode}/generate`, payload);
  }

  checkSubscriptionStatus(email?: string): void {
    this.subscriptionStatus.set('checking');
    this.subscriptionMessage.set('');
    this.api.post('/subscriptions/check', { email }).subscribe({
      next: (response: { is_active: boolean; message?: string }) => {
        this.subscriptionStatus.set(response?.is_active ? 'active' : 'inactive');
        this.subscriptionMessage.set(response?.message || '');
      },
      error: () => {
        this.subscriptionStatus.set('error');
        this.subscriptionMessage.set('Unable to verify subscription.');
      },
    });
  }

  verifySubscription(trxref: string) {
    this.subscriptionStatus.set('checking');
    this.subscriptionMessage.set('');
    return this.api
      .post('/subscriptions/verify', { reference: trxref })
      .subscribe({
        next: (response: {
          is_active: boolean;
          email?: string;
          message?: string;
        }) => {
          this.subscriptionStatus.set(
            response?.is_active ? 'active' : 'inactive'
          );
          this.subscriptionMessage.set(response?.message || '');
        },
        error: () => {
          this.subscriptionStatus.set('error');
          this.subscriptionMessage.set('Unable to verify subscription.');
        },
      });
  }

  private loadFromStorage(): void {
    const storedInput = this.read(INPUT_STORAGE_KEY);
    if (storedInput) {
      this.inputSubject.next(storedInput);
    }
    const storedOutput = this.read(OUTPUT_STORAGE_KEY);
    if (storedOutput) {
      this.outputSubject.next(storedOutput);
    }
  }

  private persist(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures (private mode, quota issues).
    }
  }

  private read(key: string): any | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private buildRunPayload(): any {
    const defaults = (biotechDefaults as any) ?? {};
    const snapshot = this.getInputSnapshot() ?? {};
    const baseConfig = (defaults.model_config as Record<string, unknown>) ?? {};
    const baseProducts = Array.isArray(defaults.products) ? defaults.products : [];

    const modelConfig = {
      ...baseConfig,
      ...this.mapGeneralAssumptions(snapshot.generalAssumptions),
      ...this.mapRiskAdjustedDcf(snapshot.riskAdjustedDcfAssumptions),
      ...this.mapForecastAssumptions(snapshot.forecastAssumptions),
    };

    const productsSource = Array.isArray(snapshot.products) && snapshot.products.length
      ? snapshot.products
      : baseProducts;

    const maps = this.buildAssumptionMaps(snapshot);
    const products = productsSource.map((product: any, index: number) =>
      this.buildProductPayload(product, index, maps, baseProducts[index])
    );

    return {
      model_config: modelConfig,
      products,
    };
  }

  private mapGeneralAssumptions(general: any): Record<string, unknown> {
    if (!general) return {};
    const mapped: Record<string, unknown> = {};
    if (general.firstForecastYear) mapped['first_year'] = Number(general.firstForecastYear);
    if (general.numberOfYears) mapped['n_years'] = Number(general.numberOfYears);
    if (general.taxRate !== undefined) mapped['tax_rate'] = Number(general.taxRate);
    if (general.workingCapitalPct !== undefined) {
      mapped['working_capital_pct_sales'] = Number(general.workingCapitalPct);
    }
    if (general.inflationAssumption !== undefined) {
      mapped['inflation_rate'] = Number(general.inflationAssumption);
    }
    if (general.currency) mapped['currency'] = String(general.currency);
    return mapped;
  }

  private mapRiskAdjustedDcf(risk: any): Record<string, unknown> {
    if (!risk) return {};
    const mapped: Record<string, unknown> = {};
    if (risk.discountRate !== undefined) mapped['discount_rate'] = Number(risk.discountRate);
    if (risk.terminalMultiple !== undefined) {
      mapped['ev_ebitda_multiple'] = Number(risk.terminalMultiple);
    }
    return mapped;
  }

  private mapForecastAssumptions(forecast: any): Record<string, unknown> {
    if (!forecast || !Array.isArray(forecast.salesRampSchedule)) return {};
    const schedule = [...forecast.salesRampSchedule]
      .filter((row) => row && row.yearOffset !== undefined)
      .sort((a, b) => Number(a.yearOffset) - Number(b.yearOffset));
    if (!schedule.length) return {};
    return {
      sales_ramp_factors: schedule.map((row) => Number(row.rampFactor ?? 0)),
    };
  }

  private buildAssumptionMaps(snapshot: any) {
    return {
      vaccineProducts: this.buildRowMap(snapshot?.vaccineProductsAssumptions?.rows),
      vaccineMarket: this.buildRowMap(snapshot?.vaccineMarketAssumptions?.rows),
      vaccineRevenue: this.buildRowMap(snapshot?.vaccineRevenueAssumptions?.rows),
      vaccineCost: this.buildRowMap(snapshot?.vaccineCostAssumptions?.rows),
      vaccineResearch: this.buildRowMap(snapshot?.vaccineResearchDevAssumptions?.rows),
      vaccineCapex: this.buildRowMap(snapshot?.vaccineCapexAssumptions?.rows),
      vaccineRoyalty: this.buildRowMap(snapshot?.vaccineRoyaltyAssumptions?.rows),
      vaccineMarketShare: this.buildRowMap(snapshot?.vaccineMarketShareAssumptions?.rows),
    };
  }

  private buildRowMap(rows: any): Map<string, any> {
    const map = new Map<string, any>();
    if (!Array.isArray(rows)) return map;
    rows.forEach((row) => {
      const id = String(row?.id ?? '').trim();
      const name = String(row?.name ?? '').trim();
      if (id) map.set(id, row);
      if (name) map.set(name, row);
    });
    return map;
  }

  private buildProductPayload(
    product: any,
    index: number,
    maps: Record<string, Map<string, any>>,
    fallback: any
  ): any {
    const base = { ...(fallback ?? {}), ...(product ?? {}) };
    const id = String(base?.id ?? '').trim() || this.formatId(index + 1);
    const name = String(base?.name ?? '').trim();
    const key = id || name;

    const vaccineProduct = maps['vaccineProducts'].get(key);
    const vaccineMarket = maps['vaccineMarket'].get(key);
    const vaccineRevenue = maps['vaccineRevenue'].get(key);
    const vaccineCost = maps['vaccineCost'].get(key);
    const vaccineResearch = maps['vaccineResearch'].get(key);
    const vaccineCapex = maps['vaccineCapex'].get(key);
    const vaccineRoyalty = maps['vaccineRoyalty'].get(key);
    const vaccineMarketShare = maps['vaccineMarketShare'].get(key);

    const output: any = { ...base, id, name };

    if (vaccineProduct) {
      output.stage = vaccineProduct.stage ?? output.stage;
      if (vaccineProduct.successProbPct !== undefined) {
        output.success_prob = this.ratioFromPercent(vaccineProduct.successProbPct);
      }
      if (vaccineProduct.includeInConsolidation !== undefined) {
        output.include_in_consolidation = Boolean(vaccineProduct.includeInConsolidation);
      }
      if (vaccineProduct.timeToMarket !== undefined) {
        output.time_to_market = Number(vaccineProduct.timeToMarket);
      }
      if (vaccineProduct.patentYears !== undefined) {
        output.patent_years = Number(vaccineProduct.patentYears);
      }
      if (vaccineProduct.patentRevenueTargetUsd !== undefined) {
        output.patent_revenue_target = Number(vaccineProduct.patentRevenueTargetUsd);
      }
      if (vaccineProduct.postPatentRevenueTargetUsd !== undefined) {
        output.post_patent_revenue_target = Number(vaccineProduct.postPatentRevenueTargetUsd);
      }
      if (vaccineProduct.marketGrowthPct !== undefined) {
        output.market_growth_patent = this.ratioFromPercent(vaccineProduct.marketGrowthPct);
      }
      if (vaccineProduct.salesGrowthPct !== undefined) {
        output.market_growth_post = this.ratioFromPercent(vaccineProduct.salesGrowthPct);
      }
      if (vaccineProduct.cogsPct !== undefined) {
        output.cogs_patent = this.ratioFromPercent(vaccineProduct.cogsPct);
      }
      if (vaccineProduct.marketingAnnualPct !== undefined) {
        output.sales_marketing_pct = this.ratioFromPercent(vaccineProduct.marketingAnnualPct);
      }
      if (vaccineProduct.rndSpentUsd !== undefined) {
        output.rd_remaining_pre_launch = Number(vaccineProduct.rndSpentUsd);
      }
      if (vaccineProduct.capexInitialUsd !== undefined) {
        output.capex_remaining_pre_launch = Number(vaccineProduct.capexInitialUsd);
      }
      if (vaccineProduct.capexLaunchUsd !== undefined) {
        output.capex_annual_post_launch = Number(vaccineProduct.capexLaunchUsd);
      }
    }

    if (vaccineMarket) {
      const customers = Number(vaccineMarket.marketSizeCustomers ?? 0);
      const price = Number(vaccineMarket.avgSpendUsd ?? 0);
      if (price) output.price_per_unit = price;
      if (customers && price) output.market_size = customers * price;
    }

    if (vaccineRevenue) {
      const customers = Number(vaccineRevenue.patentCustomersPerYear ?? 0);
      const price = Number(vaccineRevenue.patentPricePerCustomer ?? 0);
      if (customers && price) {
        output.patent_revenue_target = customers * price;
        output.price_per_unit = output.price_per_unit ?? price;
      }
      const postCustomers = customers * this.ratioFromPercent(vaccineRevenue.postPatentCustomerAdjPct);
      const postPrice = price * this.ratioFromPercent(vaccineRevenue.postPatentPriceAdjPct);
      if (postCustomers && postPrice) {
        output.post_patent_revenue_target = postCustomers * postPrice;
      }
    }

    if (vaccineCost) {
      if (vaccineCost.cogsPatentPct !== undefined) {
        output.cogs_patent = this.ratioFromPercent(vaccineCost.cogsPatentPct);
      }
      if (vaccineCost.cogsPostPct !== undefined) {
        output.cogs_post = this.ratioFromPercent(vaccineCost.cogsPostPct);
      }
      if (vaccineCost.marketingAnnualPct !== undefined) {
        output.sales_marketing_pct = this.ratioFromPercent(vaccineCost.marketingAnnualPct);
      }
      if (vaccineCost.royaltiesPct !== undefined) {
        output.royalty_pct = this.ratioFromPercent(vaccineCost.royaltiesPct);
      }
      const gnaTotal = Number(vaccineCost.gnaTotalUsd ?? 0);
      const revenue = Number(output.patent_revenue_target ?? 0);
      if (revenue > 0 && gnaTotal) {
        output.gna_pct = gnaTotal / revenue;
      }
    }

    if (vaccineResearch) {
      if (vaccineResearch.preGtmRemainingUsd !== undefined) {
        output.rd_remaining_pre_launch = Number(vaccineResearch.preGtmRemainingUsd);
      }
      if (vaccineResearch.postGtmAnnualCostUsd !== undefined) {
        output.rd_annual_post_launch = Number(vaccineResearch.postGtmAnnualCostUsd);
      }
      const capRatio = this.parsePercent(vaccineResearch.costAccounting);
      if (capRatio !== null) {
        output.rd_capitalization_ratio = capRatio;
      }
    }

    if (vaccineCapex) {
      if (vaccineCapex.preGtmCapexRemainingUsd !== undefined) {
        output.capex_remaining_pre_launch = Number(vaccineCapex.preGtmCapexRemainingUsd);
      }
      if (vaccineCapex.postGtmYearlyCapexUsd !== undefined) {
        output.capex_annual_post_launch = Number(vaccineCapex.postGtmYearlyCapexUsd);
      }
    }

    if (vaccineRoyalty) {
      if (vaccineRoyalty.royaltyRatePct !== undefined) {
        output.royalty_pct = this.ratioFromPercent(vaccineRoyalty.royaltyRatePct);
      }
    }

    if (vaccineMarketShare) {
      if (vaccineMarketShare.marketGrowthPct !== undefined) {
        output.market_growth_patent = this.ratioFromPercent(vaccineMarketShare.marketGrowthPct);
      }
      if (vaccineMarketShare.salesGrowthPct !== undefined) {
        output.market_growth_post = this.ratioFromPercent(vaccineMarketShare.salesGrowthPct);
      }
      if (vaccineMarketShare.marketSharePatentPct !== undefined) {
        output.peak_penetration = this.ratioFromPercent(vaccineMarketShare.marketSharePatentPct);
      }
      if (vaccineMarketShare.marketSharePostPct !== undefined) {
        output.post_patent_sales = this.ratioFromPercent(vaccineMarketShare.marketSharePostPct);
      }
      if (vaccineMarketShare.marketType) {
        output.preexisting_market = /existing/i.test(String(vaccineMarketShare.marketType));
      }
      if (vaccineMarketShare.relevantMarketSizeUsd !== undefined) {
        output.market_size = Number(vaccineMarketShare.relevantMarketSizeUsd);
      }
    }

    return output;
  }

  private ratioFromPercent(value: unknown): number {
    const num = Number(value ?? 0);
    if (!Number.isFinite(num)) return 0;
    return num > 1 ? num / 100 : num;
  }

  private parsePercent(value: unknown): number | null {
    if (typeof value !== 'string') return null;
    const match = /(\d+(?:\.\d+)?)/.exec(value);
    if (!match) return null;
    const num = Number(match[1] ?? 0);
    if (!Number.isFinite(num)) return null;
    return num > 1 ? num / 100 : num;
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}

