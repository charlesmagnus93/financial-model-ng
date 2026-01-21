import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api.service';

const INPUT_STORAGE_KEY = 'pharma_model_input';
const OUTPUT_STORAGE_KEY = 'pharma_model_output';

export interface ValidationIssue {
  path: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PharmaModelService {
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
        .get<any>('assets/input.json')
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

  runPharmaModel(): Observable<any> {
    const payload = { inputs: this.getInputSnapshot() };
    // console.log('Running Pharma Model with payload:', payload);
    this.validationErrors.set([]);
    return this.api.post('/inputs/pharma/validate', payload).pipe(
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
          .post('/model/pharma/run', payload)
          .pipe(
            tap((response) => this.setOutput(response)),
            tap(() => this.validationErrors.set([]))
          );
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
}
