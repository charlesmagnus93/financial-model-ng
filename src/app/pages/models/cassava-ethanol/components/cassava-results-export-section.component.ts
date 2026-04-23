import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CassavaModelService } from '../../../services/cassava-model.service';

@Component({
  selector: 'app-cassava-results-export-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex flex-col gap-6">
      <h3 class="text-3xl font-semibold">Export</h3>

      <div>
        <p-button
          label="Prepare Workbook"
          [outlined]="true"
          [loading]="isPreparing"
          [disabled]="isPreparing"
          (onClick)="prepareWorkbook()"
        ></p-button>
      </div>

      @if (successMessage) {
        <div class="rounded border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {{ errorMessage }}
        </div>
      }

      <div class="rounded border border-blue-500/30 bg-blue-300 px-4 py-3 text-sm text-blue-600">
        Generate a workbook to download the Excel model.
      </div>
    </div>
  `,
})
export class CassavaResultsExportSectionComponent {
  isPreparing = false;

  successMessage = '';
  errorMessage = '';

  constructor(private cassavaModelService: CassavaModelService) {}

  prepareWorkbook(): void {
    if (this.isPreparing) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isPreparing = true;

    this.cassavaModelService
      .prepareFinancialExcelModel()
      .pipe(
        take(1),
        finalize(() => {
          this.isPreparing = false;
        }),
      )
      .subscribe({
        next: (blob) => {
          this.downloadWorkbook(blob);
          this.successMessage = 'Workbook generated and downloaded.';
        },
        error: (error: unknown) => {
          this.errorMessage = this.resolveErrorMessage(
            error,
            'Unable to generate Excel workbook.',
          );
        },
      });
  }

  private downloadWorkbook(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Cassava_Bioethanol_Financial_Model.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
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
}
