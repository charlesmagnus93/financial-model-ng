import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api.service';
const INPUT_STORAGE_KEY = 'biotech_model_input';
const OUTPUT_STORAGE_KEY = 'biotech_model_output';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface TablePayload {
  index_name?: string;
  index?: any[];
  data?: Record<string, any[]>;
}

export interface BiotechVcRequestPayload {
  exit_year: number;
  target_irr: number;
  investor_ownership_at_exit: number;
  new_money: number;
  exit_multiple?: number | null;
}

export interface BiotechWhatIfShockPayload {
  revenue_multiplier: number;
  cost_multiplier: number;
  discount_shift: number;
  success_prob_multiplier: number;
  launch_delay_years: number;
  stage_slippage_years: Record<string, number>;
}

export interface BiotechScenarioPayload {
  name: string;
  revenue_multiplier: number;
  cost_multiplier: number;
  discount_rate_shift: number;
  success_prob_multiplier: number;
  launch_delay_years: number;
  stage_slippage_years: Record<string, number>;
}

export interface BiotechGoalSeekResponse {
  revenue_multiplier: number;
  achieved_rnpv?: number | null;
  iterations: number;
}

export interface BiotechDiagnosticsResponse {
  base_rnpv: number;
  tornado: TablePayload;
  spider: TablePayload;
}

export interface BiotechMonteCarloSimulationPayload {
  n_sims: number;
  revenue_sigma: number;
  cost_sigma: number;
  revenue_dist: string;
  cost_dist: string;
  revenue_min: number;
  revenue_max: number;
  cost_min: number;
  cost_max: number;
  revenue_cost_correlation?: number;
  random_seed?: number | null;
  alpha?: number;
}

export interface BiotechMonteCarloResponse {
  summary: Record<string, number>;
  simulations: TablePayload;
}

export interface BiotechForecastPayload {
  metric: 'revenue' | 'ebitda';
  method: 'ARIMA' | 'Prophet' | 'LSTM';
  steps: number;
}

export interface BiotechForecastResponse {
  metric: string;
  method: string;
  steps: number;
  forecast: TablePayload;
}

export interface BiotechForecastCapabilitiesResponse {
  models: Record<string, boolean>;
}

export interface BiotechReportBundleResponse {
  chart_tables?: Record<string, TablePayload>;
  warnings?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BiotechModelService {
  private inputSubject = new BehaviorSubject<any>({});
  private outputSubject = new BehaviorSubject<any>(null);
  validationErrors = signal<ValidationIssue[]>([]);
  subscriptionStatus = signal<'checking' | 'active' | 'inactive' | 'error'>(
    'checking'
  );
  subscriptionMessage = signal('');

  input$ = this.inputSubject.asObservable();
  output$ = this.outputSubject.asObservable();

  private defaultsRequest?: Observable<any>;
  private defaultsTemplate: any | null = null;

  constructor(private api: ApiService) {
    this.loadFromStorage();
    this.hydrateInputWithDefaults();
  }

  getInputSnapshot(): any {
    const current = this.inputSubject.getValue();
    if (!this.defaultsTemplate) {
      return current;
    }
    return this.mergeWithDefaults(current, this.defaultsTemplate);
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
    return this.getDefaultsTemplate().pipe(
      tap((defaults) => {
        this.defaultsTemplate = defaults;
        this.setInput(defaults);
      }),
      map(() => undefined)
    );
  }

  getDefaultsTemplate(): Observable<any> {
    if (!this.defaultsRequest) {
      this.defaultsRequest = this.api
        .get<any>('/inputs/biotech_v2/default')
        .pipe(shareReplay(1));
    }
    return this.defaultsRequest.pipe(
      map((defaults) => JSON.parse(JSON.stringify(defaults)))
    );
  }

  clearInput(): void {
    this.setInput({});
  }

  clearValidationErrors(): void {
    this.validationErrors.set([]);
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
    // const payload = { inputs: this.buildRunPayload() };
    const payload = { inputs: this.getInputSnapshot() };
    // console.log('Running Biotech Model with payload:', payload);
    this.validationErrors.set([]);
    return this.api.post('/inputs/biotech_v2/validate', payload).pipe(
      catchError((error) => {
        const issues = this.extractValidationIssues(error);
        if (issues.length) {
          this.validationErrors.set(issues);
        }
        const message = this.formatValidationError(error, issues);
        return throwError(() => new Error(message));
      }),
      switchMap((validation: { valid: boolean; message: string }) => {
        if (!validation?.valid) {
          return throwError(
            () => new Error(validation?.message || 'Inputs failed validation.')
          );
        }
        return this.api
          .post('/model/biotech_v2/run', payload)
          .pipe(
            tap((response) => this.setOutput(response)),
            tap(() => this.validationErrors.set([]))
          );
      })
    );
  }

  runVcMethod(vc: BiotechVcRequestPayload): Observable<Record<string, number>> {
    const payload = {
      inputs: this.getInputSnapshot(),
      vc,
    };
    return this.api
      .post<{ results?: Record<string, number> }>('/model/biotech_v2/vc', payload)
      .pipe(map((response) => response?.results ?? {}));
  }

  runWhatIf(shock: BiotechWhatIfShockPayload): Observable<any> {
    const payload = {
      inputs: this.getInputSnapshot(),
      shock,
    };
    return this.api.post('/model/biotech_v2/what-if', payload);
  }

  runScenarioAnalysis(
    scenarios: BiotechScenarioPayload[],
    ebitdaYearOffset = 0
  ): Observable<TablePayload> {
    const payload = {
      inputs: this.getInputSnapshot(),
      scenarios,
      ebitda_year_offset: ebitdaYearOffset,
    };
    return this.api
      .post<{ scenarios?: TablePayload }>('/model/biotech_v2/scenario', payload)
      .pipe(map((response) => response?.scenarios ?? {}));
  }

  runGoalSeek(
    targetRnpv: number,
    tolerance = 1e-3,
    maxIter = 20
  ): Observable<BiotechGoalSeekResponse> {
    const payload = {
      inputs: this.getInputSnapshot(),
      target_rnpv: Number(targetRnpv || 0),
      tolerance,
      max_iter: maxIter,
    };
    return this.api.post<BiotechGoalSeekResponse>('/model/biotech_v2/goal-seek', payload);
  }

  runDiagnostics(): Observable<BiotechDiagnosticsResponse> {
    const payload = {
      inputs: this.getInputSnapshot(),
    };
    return this.api.post<BiotechDiagnosticsResponse>('/model/biotech_v2/diagnostics', payload);
  }

  runMonteCarlo(
    simulation: BiotechMonteCarloSimulationPayload
  ): Observable<BiotechMonteCarloResponse> {
    const payload = {
      inputs: this.getInputSnapshot(),
      simulation,
    };
    return this.api.post<BiotechMonteCarloResponse>(
      '/model/biotech_v2/monte-carlo',
      payload
    );
  }

  getForecastCapabilities(): Observable<BiotechForecastCapabilitiesResponse> {
    return this.api.get<BiotechForecastCapabilitiesResponse>(
      '/model/biotech_v2/forecast-capabilities'
    );
  }

  runForecast(payload: BiotechForecastPayload): Observable<BiotechForecastResponse> {
    return this.api.post<BiotechForecastResponse>('/model/biotech_v2/forecast', {
      inputs: this.getInputSnapshot(),
      metric: payload.metric,
      method: payload.method,
      steps: Number(payload.steps ?? 10),
    });
  }

  getReportBundleV2(): Observable<BiotechReportBundleResponse> {
    const payload = {
      inputs: this.getInputSnapshot(),
    };
    return this.api.post<BiotechReportBundleResponse>('/report/biotech_v2/bundle', payload);
  }

  prepareFinancialExcelModel(): Observable<Blob> {
    const payload = {
      inputs: this.getInputSnapshot(),
    };
    return this.api.postBlob('/report/biotech_v2/financial-excel', payload);
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
      .pipe(
        tap((response: { is_active: boolean; email?: string; message?: string }) => {
          this.subscriptionStatus.set(
            response?.is_active ? 'active' : 'inactive'
          );
          this.subscriptionMessage.set(response?.message || '');
        }),
        catchError(() => {
          this.subscriptionStatus.set('error');
          this.subscriptionMessage.set('Unable to verify subscription.');
          return throwError(() => new Error('Unable to verify subscription.'));
        })
      );
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

  private hydrateInputWithDefaults(): void {
    this.getDefaultsTemplate()
      .pipe(take(1))
      .subscribe({
        next: (defaults) => {
          this.defaultsTemplate = defaults;
          const current = this.inputSubject.getValue() ?? {};
          const merged = this.mergeWithDefaults(current, defaults);
          this.inputSubject.next(merged);
          this.persist(INPUT_STORAGE_KEY, merged);
        },
        error: () => {
          // Keep the current snapshot when defaults cannot be loaded.
        },
      });
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

  private formatValidationError(
    error: any,
    issues: ValidationIssue[] = []
  ): string {
    if (issues.length) {
      const details = issues
        .slice(0, 3)
        .map((issue) => issue.path)
        .filter(Boolean)
        .join(', ');
      const suffix = issues.length > 3 ? '...' : '';
      return details
        ? `Validation failed: ${details}${suffix}`
        : issues[0]?.message || 'Inputs failed validation.';
    }
    const body = error?.error;
    if (body) {
      if (typeof body === 'string') {
        return body;
      }
      if (typeof body?.message === 'string') {
        return body.message;
      }
      try {
        return JSON.stringify(body);
      } catch {
        return 'Inputs failed validation.';
      }
    }
    return error?.message || 'Inputs failed validation.';
  }

  private extractValidationIssues(error: any): ValidationIssue[] {
    const body = error?.error ?? error;
    const issues = Array.isArray(body)
      ? body
      : Array.isArray(body?.detail)
        ? body.detail
        : [];
    if (!Array.isArray(issues)) {
      return [];
    }
    return issues
      .map((issue) => {
        const loc = Array.isArray(issue?.loc) ? issue.loc : [];
        const path = loc
          .slice(2)
          .filter((segment: any) => typeof segment === 'string')
          .join('.');
        const message =
          typeof issue?.msg === 'string'
            ? issue.msg
            : typeof issue?.message === 'string'
              ? issue.message
              : 'Validation error';
        return { path, message };
      })
      .filter((issue) => issue.path || issue.message);
  }

  private buildRunPayload(): any {
    const snapshot = this.getInputSnapshot() ?? {};
    const baseConfig = (snapshot.model_config as Record<string, unknown>) ?? {};
    const baseProducts = Array.isArray(snapshot.products) ? snapshot.products : [];

    const modelConfig = {
      ...baseConfig,
      ...this.mapGeneralAssumptions(snapshot.generalAssumptions),
      ...this.mapRiskAdjustedDcf(snapshot.riskAdjustedDcfAssumptions),
      ...this.mapForecastAssumptions(snapshot.forecastAssumptions),
    };

    const productsSource = baseProducts;
    const maps = this.buildAssumptionMaps(snapshot);
    const products = productsSource.map((product: any, index: number) =>
      this.buildProductPayload(product, index, maps)
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
    maps: Record<string, Map<string, any>>
  ): any {
    const base = { ...(product ?? {}) };
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

  private mergeWithDefaults(current: any, defaults: any): any {
    if (Array.isArray(defaults)) {
      const currentArray = Array.isArray(current) ? current : [];
      const merged = defaults.map((defaultItem, index) =>
        this.mergeWithDefaults(currentArray[index], defaultItem)
      );
      if (currentArray.length > defaults.length) {
        for (let i = defaults.length; i < currentArray.length; i += 1) {
          merged.push(this.cloneValue(currentArray[i]));
        }
      }
      return merged;
    }

    if (defaults && typeof defaults === 'object') {
      const currentObject =
        current && typeof current === 'object' && !Array.isArray(current)
          ? current
          : {};
      const result: Record<string, unknown> = {};

      for (const key of Object.keys(currentObject)) {
        if (Object.prototype.hasOwnProperty.call(defaults, key)) {
          result[key] = this.mergeWithDefaults(currentObject[key], defaults[key]);
        } else {
          result[key] = this.cloneValue(currentObject[key]);
        }
      }

      for (const key of Object.keys(defaults)) {
        if (!Object.prototype.hasOwnProperty.call(result, key)) {
          result[key] = this.mergeWithDefaults(undefined, defaults[key]);
        }
      }

      return result;
    }

    if (current === undefined || current === null) {
      return this.cloneValue(defaults);
    }

    return current;
  }

  private cloneValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.cloneValue(item));
    }
    if (value && typeof value === 'object') {
      const cloned: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        cloned[key] = this.cloneValue(value[key]);
      }
      return cloned;
    }
    return value;
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}
