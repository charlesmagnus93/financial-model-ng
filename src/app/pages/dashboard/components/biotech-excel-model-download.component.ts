import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';

@Component({
  standalone: true,
  selector: 'app-biotech-excel-model-download',
  imports: [CommonModule, FieldsetModule, ButtonModule],
  template: `
    <p-fieldset legend="Excel Model Download" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-3">
        @if (!excelBlob) {
          <div class="flex">
            <p-button
              label="Prepare Excel Model"
              [outlined]="true"
              [loading]="isPreparing"
              [disabled]="isPreparing"
              (onClick)="prepareExcelModel()"
            ></p-button>
          </div>
        }

        @if (excelBlob) {
          <div class="flex flex-wrap items-center gap-3">
            <p-button
              label="Download Excel Model"
              [outlined]="true"
              (onClick)="downloadExcelModel()"
            ></p-button>
            <p-button
              label="Clear Prepared Excel"
              [text]="true"
              (onClick)="clearPreparedExcel()"
            ></p-button>
          </div>
        }

        @if (!excelBlob) {
          <div class="text-sm text-surface-400">
            Click "Prepare Excel Model" to generate the workbook for download.
          </div>
        }

        @if (errorMessage) {
          <div class="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500">
            {{ errorMessage }}
          </div>
        }
      </div>
    </p-fieldset>
  `,
})
export class BiotechExcelModelDownloadComponent {
  isPreparing = false;
  errorMessage = '';
  excelBlob: Blob | null = null;

  constructor(private readonly biotechModelService: BiotechModelService) {}

  prepareExcelModel(): void {
    if (this.isPreparing) {
      return;
    }
    this.errorMessage = '';
    this.isPreparing = true;
    this.biotechModelService
      .prepareFinancialExcelModel()
      .pipe(take(1))
      .subscribe({
        next: (blob) => {
          this.excelBlob = blob;
          this.isPreparing = false;
        },
        error: () => {
          this.excelBlob = null;
          this.errorMessage = 'Unable to prepare Excel model. Please try again.';
          this.isPreparing = false;
        },
      });
  }

  downloadExcelModel(): void {
    if (!this.excelBlob) {
      return;
    }
    const url = window.URL.createObjectURL(this.excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Financial_Report.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  clearPreparedExcel(): void {
    this.excelBlob = null;
    this.errorMessage = '';
  }
}
