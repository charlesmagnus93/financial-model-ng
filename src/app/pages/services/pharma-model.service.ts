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

const INPUT_STORAGE_KEY = 'pharma_model_input';
const OUTPUT_STORAGE_KEY = 'pharma_model_output';

@Injectable({
  providedIn: 'root',
})
export class PharmaModelService {
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
    return this.api.post('/inputs/pharma/validate', payload).pipe(
      switchMap((validation: { valid: boolean; message: string }) => {
        if (!validation?.valid) {
          return throwError(
            () => new Error(validation?.message || 'Inputs failed validation.')
          );
        }
        return this.api
          .post('/model/pharma/run', payload)
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
}
