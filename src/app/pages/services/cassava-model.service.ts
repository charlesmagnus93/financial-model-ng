import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api.service';
import cassavaEthanolInputDefaults from '../../../assets/cassava_ethanol_input.json';

const INPUT_STORAGE_KEY = 'cassava_model_input';
const OUTPUT_STORAGE_KEY = 'cassava_model_output';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface CassavaProjectionPayload {
  start_year: number;
  end_year: number;
  planning_start: string;
  [key: string]: any;
}

export interface CassavaLandingTablePayload {
  name: string;
  columns: string[];
  rows: Array<Record<string, any>>;
  placeholder?: boolean;
  [key: string]: any;
}

export interface CassavaInputsPayload {
  scenario?: string;
  projection?: CassavaProjectionPayload;
  tables?: Record<string, CassavaLandingTablePayload>;
  [key: string]: any;
}

export interface CassavaTablePayload {
  index_name?: string;
  index?: Array<string | number>;
  data?: Record<string, any[]> | Array<Record<string, any>>;
  [key: string]: any;
}

export interface CassavaBundleResponse {
  scenario?: string;
  metrics?: Record<string, any>;
  [key: string]: any;
}

export interface CassavaSensitivityScenarioPayload {
  name: string;
  parameter: string;
  delta: number;
}

export interface CassavaSensitivityResultPayload {
  results?: CassavaTablePayload;
  tornado?: CassavaTablePayload;
}

export interface CassavaScenarioConfigPayload {
  name: string;
  overrides: Record<string, number>;
}

export interface CassavaScenarioResultPayload {
  base_metrics?: Record<string, any>;
  comparison?: CassavaTablePayload;
}

export interface CassavaReverseStressResultPayload {
  results?: CassavaTablePayload;
}

export interface CassavaGoalSeekResultPayload {
  parameter?: string;
  metric?: string;
  target_value?: number;
  target_name?: string;
  achieved_value?: number;
  tolerance?: number;
  iterations?: number;
  [key: string]: any;
}

export interface CassavaAdvancedRegressionResultPayload {
  coefficients?: Record<string, number>;
  intercept?: number;
  score?: number;
}

export interface CassavaAdvancedDecisionTreeResultPayload {
  feature_importances?: Record<string, number>;
  depth?: number;
  score?: number;
}

export interface CassavaAdvancedForecastResultPayload {
  forecast?: CassavaTablePayload;
}

export interface CassavaAdvancedRevolverResultPayload {
  results?: CassavaTablePayload;
}

export interface CassavaMonteCarloDefaultsPayload {
  iterations?: number;
  seed?: number;
  distributions?: string[];
  parameter_configs?: CassavaTablePayload;
}

export interface CassavaMonteCarloRunResultPayload {
  results?: CassavaTablePayload;
  summary?: CassavaTablePayload;
}

export interface CassavaReportBundleResponse {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CassavaModelService {
  private inputSubject = new BehaviorSubject<CassavaInputsPayload>({});
  private outputSubject = new BehaviorSubject<CassavaBundleResponse | null>(null);
  validationErrors = signal<ValidationIssue[]>([]);

  input$ = this.inputSubject.asObservable();
  output$ = this.outputSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadFromStorage();
  }

  getInputSnapshot(): CassavaInputsPayload {
    return this.inputSubject.getValue() ?? {};
  }

  getOutputSnapshot(): CassavaBundleResponse | null {
    return this.outputSubject.getValue();
  }

  setInput(input: CassavaInputsPayload): void {
    const sanitized = this.deepClone(input ?? {});
    this.inputSubject.next(sanitized);
    this.persist(INPUT_STORAGE_KEY, sanitized);
  }

  setOutput(output: CassavaBundleResponse | null): void {
    const sanitized = output ? this.deepClone(output) : null;
    this.outputSubject.next(sanitized);
    this.persist(OUTPUT_STORAGE_KEY, sanitized);
  }

  clearInput(): void {
    this.setInput({});
  }

  clearValidationErrors(): void {
    this.validationErrors.set([]);
  }

  loadDefaults(): Observable<void> {
    return this.loadDefaultsForScenario('FARM_ONLY');
  }

  loadDefaultsForScenario(scenario: string): Observable<void> {
    const normalizedScenario = this.normalizeScenario(scenario);
    return this.api
      .get<any>('/inputs/cassava_ethanol/default', { scenario: normalizedScenario })
      .pipe(
      map((defaults) => this.resolveDefaultsForScenario(defaults, normalizedScenario)),
      catchError(() =>
        of(
          this.resolveDefaultsForScenario(
            cassavaEthanolInputDefaults as any,
            normalizedScenario,
          ),
        ),
      ),
      tap((defaults) => {
        const payload = this.deepClone(defaults ?? {});
        payload.scenario = normalizedScenario;
        this.setInput(payload);
      }),
      map(() => undefined),
      );
  }

  runCassavaModel(): Observable<CassavaBundleResponse> {
    const payload = { inputs: this.getInputSnapshot() };
    this.validationErrors.set([]);

    return this.api.post('/inputs/cassava_ethanol/validate', payload).pipe(
      catchError((error) => {
        const issues = this.extractValidationIssues(error);
        if (issues.length) {
          this.validationErrors.set(issues);
        }
        const message = this.formatValidationError(error, issues);
        return throwError(() => new Error(message));
      }),
      switchMap((validation: { valid?: boolean; message?: string }) => {
        if (!validation?.valid) {
          return throwError(
            () => new Error(validation?.message || 'Inputs failed validation.'),
          );
        }

        return this.api
          .post<CassavaBundleResponse>('/model/cassava_ethanol/bundle', payload)
          .pipe(
            tap((response) => this.setOutput(response)),
            tap(() => this.validationErrors.set([])),
          );
      }),
    );
  }

  getSensitivityDefaults(): Observable<CassavaSensitivityScenarioPayload[]> {
    return this.api
      .get<{ scenarios?: CassavaSensitivityScenarioPayload[] }>(
        '/model/cassava_ethanol/sensitivity-defaults',
      )
      .pipe(
        map((response) =>
          Array.isArray(response?.scenarios) ? response.scenarios : [],
        ),
      );
  }

  runSensitivity(
    scenarios: CassavaSensitivityScenarioPayload[],
    options?: {
      tornadoDrivers?: Array<[string, number]>;
      tornadoScale?: number;
    },
  ): Observable<CassavaSensitivityResultPayload> {
    const payload: Record<string, any> = {
      inputs: this.getInputSnapshot(),
      scenarios: Array.isArray(scenarios) ? scenarios : [],
    };

    if (options?.tornadoDrivers?.length) {
      payload['tornado_drivers'] = options.tornadoDrivers;
    }
    if (typeof options?.tornadoScale === 'number') {
      payload['tornado_scale'] = options.tornadoScale;
    }

    return this.api.post<CassavaSensitivityResultPayload>(
      '/model/cassava_ethanol/sensitivity',
      payload,
    );
  }

  getScenarioPresets(): Observable<CassavaScenarioConfigPayload[]> {
    return this.api
      .post<{ scenarios?: CassavaScenarioConfigPayload[] }>(
        '/model/cassava_ethanol/scenario-presets',
        {
          inputs: this.getInputSnapshot(),
        },
      )
      .pipe(
        map((response) =>
          Array.isArray(response?.scenarios) ? response.scenarios : [],
        ),
      );
  }

  getScenarioParameterCatalog(): Observable<CassavaTablePayload> {
    return this.api
      .post<{ catalog?: CassavaTablePayload }>(
        '/model/cassava_ethanol/scenario-parameter-catalog',
        {
          inputs: this.getInputSnapshot(),
        },
      )
      .pipe(map((response) => response?.catalog ?? {}));
  }

  runScenarioAnalysis(
    scenarios: CassavaScenarioConfigPayload[],
  ): Observable<CassavaScenarioResultPayload> {
    return this.api.post<CassavaScenarioResultPayload>(
      '/model/cassava_ethanol/scenario',
      {
        inputs: this.getInputSnapshot(),
        scenarios: Array.isArray(scenarios) ? scenarios : [],
      },
    );
  }

  runReverseStress(options?: {
    dscrFloor?: number;
    npvFloor?: number;
  }): Observable<CassavaReverseStressResultPayload> {
    const payload: Record<string, any> = {
      inputs: this.getInputSnapshot(),
    };

    if (typeof options?.dscrFloor === 'number') {
      payload['dscr_floor'] = options.dscrFloor;
    }
    if (typeof options?.npvFloor === 'number') {
      payload['npv_floor'] = options.npvFloor;
    }

    return this.api.post<CassavaReverseStressResultPayload>(
      '/model/cassava_ethanol/reverse-stress',
      payload,
    );
  }

  runGoalSeek(options: {
    parameter: string;
    metric: string;
    targetValue: number;
  }): Observable<CassavaGoalSeekResultPayload> {
    return this.api.post<CassavaGoalSeekResultPayload>(
      '/model/cassava_ethanol/goal-seek',
      {
        inputs: this.getInputSnapshot(),
        parameter: String(options?.parameter || 'Corporate tax rate'),
        metric: String(options?.metric || 'Project NPV'),
        target_value: Number(options?.targetValue || 0),
      },
    );
  }

  runAdvancedRegression(
    rows: Array<Record<string, any>>,
    target = 'Project NPV',
  ): Observable<CassavaAdvancedRegressionResultPayload> {
    return this.api.post<CassavaAdvancedRegressionResultPayload>(
      '/model/cassava_ethanol/advanced/regression',
      {
        inputs: this.getInputSnapshot(),
        rows: Array.isArray(rows) ? rows : [],
        target: String(target || 'Project NPV'),
      },
    );
  }

  runAdvancedDecisionTree(
    rows: Array<Record<string, any>>,
    target = 'Project NPV',
    maxDepth = 3,
  ): Observable<CassavaAdvancedDecisionTreeResultPayload> {
    return this.api.post<CassavaAdvancedDecisionTreeResultPayload>(
      '/model/cassava_ethanol/advanced/decision-tree',
      {
        inputs: this.getInputSnapshot(),
        rows: Array.isArray(rows) ? rows : [],
        target: String(target || 'Project NPV'),
        max_depth: Math.max(1, Math.trunc(Number(maxDepth) || 3)),
      },
    );
  }

  runAdvancedForecast(
    rows: Array<Record<string, any>>,
    options?: {
      periodColumn?: string;
      valueColumn?: string;
      periods?: number;
    },
  ): Observable<CassavaAdvancedForecastResultPayload> {
    return this.api.post<CassavaAdvancedForecastResultPayload>(
      '/model/cassava_ethanol/advanced/forecast',
      {
        inputs: this.getInputSnapshot(),
        rows: Array.isArray(rows) ? rows : [],
        period_column: String(options?.periodColumn || 'Period'),
        value_column: String(options?.valueColumn || 'Free Cash Flow'),
        periods: Math.max(1, Math.trunc(Number(options?.periods) || 5)),
      },
    );
  }

  runAdvancedRevolver(
    rows: Array<Record<string, any>>,
    options?: {
      periodColumn?: string;
      valueColumn?: string;
      window?: number;
    },
  ): Observable<CassavaAdvancedRevolverResultPayload> {
    return this.api.post<CassavaAdvancedRevolverResultPayload>(
      '/model/cassava_ethanol/advanced/revolver',
      {
        inputs: this.getInputSnapshot(),
        rows: Array.isArray(rows) ? rows : [],
        period_column: String(options?.periodColumn || 'Period'),
        value_column: String(options?.valueColumn || 'Free Cash Flow'),
        window: Math.max(1, Math.trunc(Number(options?.window) || 12)),
      },
    );
  }

  getMonteCarloDefaults(): Observable<CassavaMonteCarloDefaultsPayload> {
    return this.api.get<CassavaMonteCarloDefaultsPayload>(
      '/model/cassava_ethanol/monte-carlo/defaults',
    );
  }

  runMonteCarlo(options: {
    iterations?: number;
    randomSeed?: number;
    parameterConfigs?: Array<Record<string, any>>;
    correlationMatrix?: Record<string, Record<string, number>>;
  }): Observable<CassavaMonteCarloRunResultPayload> {
    const payload: Record<string, any> = {
      inputs: this.getInputSnapshot(),
      iterations: Math.max(1, Math.trunc(Number(options?.iterations) || 250)),
      random_seed: Math.trunc(Number(options?.randomSeed) || 42),
      parameter_configs: Array.isArray(options?.parameterConfigs)
        ? options.parameterConfigs
        : [],
    };

    if (options?.correlationMatrix && Object.keys(options.correlationMatrix).length) {
      payload['correlation_matrix'] = options.correlationMatrix;
    }

    return this.api.post<CassavaMonteCarloRunResultPayload>(
      '/model/cassava_ethanol/monte-carlo',
      payload,
    );
  }

  getReportBundle(): Observable<CassavaReportBundleResponse> {
    return this.api.post<CassavaReportBundleResponse>(
      '/report/cassava_ethanol/bundle',
      {
        inputs: this.getInputSnapshot(),
      },
    );
  }

  prepareFinancialExcelModel(): Observable<Blob> {
    return this.api.postBlob('/report/cassava_ethanol/financial-excel', {
      inputs: this.getInputSnapshot(),
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

  private formatValidationError(
    error: any,
    issues: ValidationIssue[] = [],
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
      if (typeof body?.detail === 'string') {
        return body.detail;
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
          .map((segment: any) => String(segment))
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

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }

  private normalizeScenario(value: string | null | undefined): string {
    const scenario = String(value || 'FARM_ONLY')
      .trim()
      .toUpperCase();
    if (scenario === 'BUY_ONLY' || scenario === 'HYBRID') {
      return scenario;
    }
    return 'FARM_ONLY';
  }

  private resolveDefaultsForScenario(source: any, scenario: string): CassavaInputsPayload {
    if (!source || typeof source !== 'object') {
      return {};
    }

    const scenarioAliases = this.scenarioAliases(scenario);
    const findByScenarioKey = (container: any): any => {
      if (!container || typeof container !== 'object') {
        return undefined;
      }

      for (const key of Object.keys(container)) {
        const upperKey = String(key).trim().toUpperCase();
        if (scenarioAliases.includes(upperKey)) {
          return container[key];
        }
      }
      return undefined;
    };

    const directCandidates = [
      source?.scenarios?.[scenario],
      findByScenarioKey(source?.scenarios),
      source?.scenario_defaults?.[scenario],
      findByScenarioKey(source?.scenario_defaults),
      source?.defaults?.[scenario],
      findByScenarioKey(source?.defaults),
      source?.[scenario],
      findByScenarioKey(source),
    ];
    for (const candidate of directCandidates) {
      if (this.isInputsPayload(candidate)) {
        return candidate;
      }
    }

    if (this.isInputsPayload(source)) {
      return source;
    }

    const farmFallback =
      source?.scenarios?.FARM_ONLY ??
      source?.scenario_defaults?.FARM_ONLY ??
      source?.defaults?.FARM_ONLY ??
      source?.FARM_ONLY;
    if (this.isInputsPayload(farmFallback)) {
      return farmFallback;
    }

    return {};
  }

  private isInputsPayload(value: any): value is CassavaInputsPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }
    return (
      !!value?.tables ||
      !!value?.projection ||
      typeof value?.scenario === 'string'
    );
  }

  private scenarioAliases(value: string | null | undefined): string[] {
    const normalized = this.normalizeScenario(value);
    const compact = normalized.replace(/[^A-Z]/g, '');
    const lower = normalized.toLowerCase();
    const kebab = normalized.toLowerCase().replace(/_/g, '-');
    const compactLower = compact.toLowerCase();

    return Array.from(
      new Set([
        normalized,
        normalized.toUpperCase(),
        normalized.toLowerCase(),
        compact,
        compactLower,
        lower,
        kebab,
      ]),
    );
  }
}
