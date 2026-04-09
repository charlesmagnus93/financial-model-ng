import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api.service';

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
    return this.api.get<CassavaInputsPayload>('/inputs/cassava_ethanol/default').pipe(
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
}
