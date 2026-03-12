import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PharmaModelService } from '../services/pharma-model.service';
import {
  BiotechModelService,
  ValidationIssue,
} from '../services/biotech-model.service';
import { BiotechGeneralAssumptionsComponent } from './components/biotech-general-assumptions.component';
import { BiotechProductAssumptionsComponent } from './components/biotech-product-assumptions.component';

@Component({
  standalone: true,
  selector: 'app-input-biotech-landing',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ButtonModule,
    DialogModule,
    BiotechGeneralAssumptionsComponent,
    BiotechProductAssumptionsComponent,
  ],
  providers: [BiotechModelService, { provide: PharmaModelService, useExisting: BiotechModelService }],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <p-button
          label="Back"
          icon="pi pi-arrow-left"
          variant="outlined"
          severity="secondary"
          [disabled]="isFirstSection"
          (click)="goToPrevious()"
        ></p-button>
        <p-button
          label="Use Defaults"
          icon="pi pi-refresh"
          variant="outlined"
          severity="success"
          [disabled]="isUsingDefaults"
          (click)="useDefaults()"
        ></p-button>
        <!-- <div class="text-sm text-surface-400">
          Section {{ currentSectionIndex + 1 }} of {{ sections.length }} -
          {{ currentSectionLabel }}
        </div> -->
        @if (isLastSection) {
          <p-button
            label="Submit Customer Data"
            icon="pi pi-check"
            [disabled]="isSubmitting"
            (click)="openSubmitConfirm()"
          ></p-button>
        } @else {
          <p-button
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            (click)="goToNext()"
          ></p-button>
        }
      </div>

      @if (isUsingDefaults) {
        <div
          class="flex items-center justify-center gap-3 py-16 text-surface-500"
        >
          <i class="pi pi-spinner pi-spin text-xl" aria-hidden="true"></i>
          <span class="text-sm">Loading defaults...</span>
        </div>
      } @else if (formVisible) {
        <p-tabs [(value)]="activeTab" class="w-full" scrollable>
          <p-tablist>
            @for (section of sections; track section.key) {
            <p-tab [value]="section.key" class="whitespace-nowrap">
              {{ section.label }}
            </p-tab>
            }
          </p-tablist>

          <p-tabpanels>
            @for (section of sections; track section.key) {
            <p-tabpanel [value]="section.key">
              @if (sectionErrors(section.key).length) {
                <div
                  class="mb-4 rounded border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300"
                >
                  <div class="font-semibold">Required fields</div>
                  <div class="mt-2 flex flex-col gap-1">
                    @for (error of sectionErrors(section.key); track error.path) {
                      <div>
                        {{ formatFieldPath(error.path) }}: {{ error.message }}
                      </div>
                    }
                  </div>
                </div>
              }
              @switch (section.key) { @case ('assumptions') {
              <biotech-general-assumptions></biotech-general-assumptions>
              } @case ('product') {
              <biotech-product-assumptions></biotech-product-assumptions>
              } @default {
              }
            }
            </p-tabpanel>
            }
          </p-tabpanels>
        </p-tabs>
      }
    </div>

    <p-dialog
      header="Confirmation!"
      [(visible)]="showSubmitConfirm"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '26rem' }"
      (onHide)="closeSubmitConfirm()"
    >
      <div class="flex flex-col gap-4">
        <p class="text-sm text-surface-500">
          <!-- This will submit the current inputs and run the model. -->
          Are you sure, you want to submit the customer data and run the model ?
        </p>
        <div class="flex justify-end gap-2">
          <p-button
            label="No"
            icon="pi pi-times"
            severity="secondary"
            [text]="true"
            (click)="closeSubmitConfirm()"
          ></p-button>
          <p-button
            label="Yes"
            icon="pi pi-check"
            [disabled]="isSubmitting"
            (click)="confirmSubmitModel()"
          ></p-button>
        </div>
      </div>
    </p-dialog>

    <p-dialog
      header="Submission failed"
      [(visible)]="showSubmitError"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '26rem' }"
      (onHide)="closeSubmitError()"
    >
      <div class="flex flex-col gap-4">
        <p class="text-sm text-surface-500">{{ submitErrorMessage }}</p>
        <div class="flex justify-end">
          <p-button
            label="Close"
            severity="secondary"
            [text]="true"
            (click)="closeSubmitError()"
          ></p-button>
        </div>
      </div>
    </p-dialog>

    <p-dialog
      header="Running model"
      [(visible)]="isSubmitting"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [style]="{ width: '22rem' }"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-spinner pi-spin text-xl" aria-hidden="true"></i>
        <span class="text-sm text-surface-500">Processing submission...</span>
      </div>
    </p-dialog>
  `,
})
export class InputBiotechLandingComponent implements OnInit {
  sections = [
    { key: 'assumptions', label: 'Model assumptions' },
    { key: 'product', label: 'Product assumptions' },
  ];

  activeTab = 'assumptions';
  isSubmitting = false;
  formVisible = false;
  isUsingDefaults = false;
  showSubmitConfirm = false;
  showSubmitError = false;
  submitErrorMessage = '';
  private fieldSectionMap: Record<string, string> = {
    model_config: 'assumptions',
    products: 'product',
  };

  constructor(
    private router: Router,
    private biotechModelService: BiotechModelService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get currentSectionIndex(): number {
    return this.sections.findIndex((section) => section.key === this.activeTab);
  }

  get currentSectionLabel(): string {
    return this.sections[this.currentSectionIndex]?.label ?? '';
  }

  get isFirstSection(): boolean {
    return this.currentSectionIndex <= 0;
  }

  get isLastSection(): boolean {
    return this.currentSectionIndex >= this.sections.length - 1;
  }

  goToPrevious(): void {
    const prevIndex = this.currentSectionIndex - 1;
    if (prevIndex >= 0) {
      this.activeTab = this.sections[prevIndex].key;
    }
  }

  goToNext(): void {
    const nextIndex = this.currentSectionIndex + 1;
    if (nextIndex < this.sections.length) {
      this.activeTab = this.sections[nextIndex].key;
    }
  }

  openSubmitConfirm(): void {
    if (this.isSubmitting) {
      return;
    }
    this.showSubmitConfirm = true;
  }

  closeSubmitConfirm(): void {
    this.showSubmitConfirm = false;
  }

  confirmSubmitModel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.showSubmitConfirm = false;
    this.submitModel();
  }

  private submitModel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.biotechModelService.runBiotechModel().subscribe({
      next: () => {
        localStorage.setItem('model_setup_complete', 'true');
        this.router.navigate(['/dashboard/biotech-results']);
        this.isSubmitting = false;
      },
      error: (err: Error) => {
        this.submitErrorMessage =
          err?.message || 'Unable to submit data. Please try again.';
        this.showSubmitError = true;
        this.focusFirstErrorSection();
        this.isSubmitting = false;
      },
    });
  }

  closeSubmitError(): void {
    this.showSubmitError = false;
  }

  useDefaults(): void {
    if (this.isUsingDefaults) {
      return;
    }
    this.isUsingDefaults = true;
    this.biotechModelService.loadDefaults().subscribe({
      next: () => {
        this.refreshForms(() => {
          this.isUsingDefaults = false;
        });
      },
      error: () => {
        this.isUsingDefaults = false;
      },
    });
  }

  private initializeForm(): void {
    this.biotechModelService.clearValidationErrors();
    this.refreshForms();
  }

  private refreshForms(onComplete?: () => void): void {
    this.formVisible = false;
    setTimeout(() => {
      this.formVisible = true;
      if (onComplete) {
        onComplete();
      }
    }, 0);
  }

  sectionErrors(sectionKey: string): ValidationIssue[] {
    return this.biotechModelService
      .validationErrors()
      .filter((error) => this.resolveSection(error.path) === sectionKey);
  }

  formatFieldPath(path: string): string {
    return path
      .split('.')
      .filter(Boolean)
      .map((segment) => segment.replace(/_/g, ' '))
      .join(' > ');
  }

  private focusFirstErrorSection(): void {
    const errors = this.biotechModelService.validationErrors();
    for (const error of errors) {
      const section = this.resolveSection(error.path);
      if (section) {
        this.activeTab = section;
        return;
      }
    }
  }

  private resolveSection(path: string): string | null {
    if (!path) {
      return null;
    }
    if (path.startsWith('products') || path.startsWith('product')) {
      return 'product';
    }
    const topLevel = path.split('.')[0];
    return this.fieldSectionMap[topLevel] ?? 'assumptions';
  }

}



