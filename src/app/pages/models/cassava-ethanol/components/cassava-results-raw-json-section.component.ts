import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import {
  CassavaBundleResponse,
  CassavaModelService,
  CassavaReportBundleResponse,
} from '../../../services/cassava-model.service';

interface JsonSourceOption {
  label: string;
  value: 'model_bundle' | 'report_bundle' | 'inputs';
}

@Component({
  selector: 'app-cassava-results-raw-json-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FieldsetModule, SelectModule, ButtonModule],
  template: `
    <p-fieldset legend="Raw JSON" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-3">
        <div class="grid gap-3 md:grid-cols-[20rem_auto_auto] md:items-end">
          <div class="flex flex-col gap-2">
            <label class="text-xs text-surface-500">Payload source</label>
            <p-select
              [options]="sourceOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="selectedSource"
              (ngModelChange)="onSourceChange($event)"
              class="w-full"
            ></p-select>
          </div>

          <div>
            <p-button
              label="Refresh"
              [outlined]="true"
              [loading]="isLoadingReportBundle"
              [disabled]="isLoadingReportBundle"
              (onClick)="refreshSelectedSource()"
            ></p-button>
          </div>

          <div>
            <p-button
              label="Copy JSON"
              [outlined]="true"
              [disabled]="!jsonPreview"
              (onClick)="copyJson()"
            ></p-button>
          </div>
        </div>

        @if (successMessage) {
          <div class="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {{ successMessage }}
          </div>
        }

        @if (errorMessage) {
          <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ errorMessage }}
          </div>
        }

        @if (jsonPreview) {
          <pre
            class="max-h-[34rem] overflow-auto rounded border border-surface-200 bg-surface-50 p-3 text-xs"
          ><code>{{ jsonPreview }}</code></pre>
        } @else {
          <div class="text-sm text-surface-500">
            {{
              isLoadingReportBundle
                ? 'Loading report bundle payload...'
                : 'No payload available for the selected source.'
            }}
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class CassavaResultsRawJsonSectionComponent implements OnInit, OnDestroy {
  private outputSub?: Subscription;

  sourceOptions: JsonSourceOption[] = [
    { label: 'Model Bundle Payload', value: 'model_bundle' },
    { label: 'Report Bundle Payload', value: 'report_bundle' },
    { label: 'Input Payload', value: 'inputs' },
  ];

  selectedSource: JsonSourceOption['value'] = 'model_bundle';

  modelBundle: CassavaBundleResponse | null = null;
  reportBundle: CassavaReportBundleResponse | null = null;

  jsonPreview = '';

  isLoadingReportBundle = false;
  successMessage = '';
  errorMessage = '';

  constructor(private cassavaModelService: CassavaModelService) {}

  ngOnInit(): void {
    this.outputSub = this.cassavaModelService.output$.subscribe((output) => {
      this.modelBundle = output ? this.deepClone(output) : null;
      if (this.selectedSource === 'model_bundle') {
        this.updateJsonPreview();
      }
    });

    this.modelBundle = this.deepClone(this.cassavaModelService.getOutputSnapshot());
    this.updateJsonPreview();
  }

  ngOnDestroy(): void {
    this.outputSub?.unsubscribe();
  }

  onSourceChange(value: JsonSourceOption['value']): void {
    this.selectedSource = value;
    this.successMessage = '';
    this.errorMessage = '';

    if (value === 'report_bundle') {
      if (!this.reportBundle) {
        this.loadReportBundle();
        return;
      }
    }

    this.updateJsonPreview();
  }

  refreshSelectedSource(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedSource === 'report_bundle') {
      this.loadReportBundle();
      return;
    }

    this.modelBundle = this.deepClone(this.cassavaModelService.getOutputSnapshot());
    this.updateJsonPreview();
  }

  copyJson(): void {
    if (!this.jsonPreview) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(this.jsonPreview)
        .then(() => {
          this.successMessage = 'JSON copied to clipboard.';
        })
        .catch(() => {
          this.errorMessage = 'Unable to copy JSON to clipboard.';
        });
      return;
    }

    this.errorMessage = 'Clipboard API is not available in this browser.';
  }

  private loadReportBundle(): void {
    if (this.isLoadingReportBundle) {
      return;
    }

    this.isLoadingReportBundle = true;
    this.cassavaModelService
      .getReportBundle()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingReportBundle = false;
        }),
      )
      .subscribe({
        next: (payload) => {
          this.reportBundle = this.deepClone(payload);
          this.successMessage = 'Report bundle payload refreshed.';
          this.errorMessage = '';
          this.updateJsonPreview();
        },
        error: (error: unknown) => {
          this.errorMessage = this.resolveErrorMessage(
            error,
            'Unable to load report bundle payload.',
          );
          this.updateJsonPreview();
        },
      });
  }

  private updateJsonPreview(): void {
    let payload: unknown = null;

    if (this.selectedSource === 'model_bundle') {
      payload = this.modelBundle;
    } else if (this.selectedSource === 'report_bundle') {
      payload = this.reportBundle;
    } else {
      payload = this.cassavaModelService.getInputSnapshot();
    }

    this.jsonPreview = this.safeStringify(payload);
  }

  private safeStringify(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '';
    }
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const maybeError = error as { message?: string; error?: unknown };
      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
      if (maybeError.error && typeof maybeError.error === 'object') {
        const body = maybeError.error as { detail?: string; message?: string };
        if (typeof body.detail === 'string' && body.detail.trim()) {
          return body.detail;
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return body.message;
        }
      }
    }
    return fallback;
  }

  private deepClone<T>(value: T): T {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }
}
