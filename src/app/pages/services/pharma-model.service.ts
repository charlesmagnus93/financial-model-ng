import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import inputData from '../../../../input.json';

const INPUT_STORAGE_KEY = 'pharma_model_input';
const OUTPUT_STORAGE_KEY = 'pharma_model_output';

@Injectable({
  providedIn: 'root',
})
export class PharmaModelService {
  private inputSubject = new BehaviorSubject<any>({});
  private outputSubject = new BehaviorSubject<any>(null);

  input$ = this.inputSubject.asObservable();
  output$ = this.outputSubject.asObservable();

  constructor(private api: ApiService) {
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

  loadDefaults(): void {
    this.setInput(JSON.parse(JSON.stringify(inputData)));
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
    console.log('Running Pharma Model with payload:', payload);
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

  exportPharmaReport(): Observable<Blob> {
    const payload = { inputs: this.getInputSnapshot() };
    return this.api.postBlob('/report/pharma/generate', payload);
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
