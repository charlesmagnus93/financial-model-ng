import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';

interface TemplateOption {
  label: string;
  value: string;
}

interface ProductTemplateRow {
  name?: string;
  stage?: string;
  success_prob?: number;
  include_in_consolidation?: boolean;
  time_to_market?: number;
  patent_years?: number;
  [key: string]: unknown;
}

type TemplateLibrary = Record<string, ProductTemplateRow[]>;

const FALLBACK_TEMPLATES: TemplateLibrary = {
  'Phase II oncology asset': [
    {
      name: 'Onco-Phase2',
      stage: 'Phase II',
      success_prob: 0.35,
      include_in_consolidation: true,
      time_to_market: 4,
      patent_years: 12,
    },
  ],
};

@Component({
  standalone: true,
  selector: 'biotech-product-template-library-fieldset',
  imports: [CommonModule, FormsModule, ButtonModule, FieldsetModule, SelectModule],
  template: `
    <p-fieldset legend="Template library" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold">Choose a template</label>
          <p-select
            [options]="templateOptions"
            [(ngModel)]="selectedTemplate"
            optionLabel="label"
            optionValue="value"
            [showClear]="false"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex">
          <p-button
            label="Load template into product table"
            [outlined]="true"
            (onClick)="loadTemplateIntoProductTable()"
          ></p-button>
        </div>

        <p class="text-xs text-surface-500">
          Templates provide starting points for common biotech asset profiles.
        </p>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductTemplateLibraryFieldsetComponent implements OnInit {
  templateOptions: TemplateOption[] = [];
  selectedTemplate = '';
  private templateLibrary: TemplateLibrary = {};

  constructor(
    private http: HttpClient,
    private biotechModelService: BiotechModelService
  ) {}

  ngOnInit(): void {
    this.loadTemplateLibrary();
  }

  loadTemplateIntoProductTable(): void {
    const templateRows = Array.isArray(this.templateLibrary[this.selectedTemplate])
      ? this.templateLibrary[this.selectedTemplate]
      : [];
    if (!templateRows.length) {
      return;
    }

    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const existingProducts = Array.isArray(snapshot?.products) ? snapshot.products : [];
    const existingDevelopmentRows = Array.isArray(snapshot?.vaccine_development)
      ? snapshot.vaccine_development
      : [];
    const nextIdSeed = this.nextVaccineIdSeed(existingProducts, existingDevelopmentRows);
    const currentYear = new Date().getFullYear();

    const newProducts = templateRows.map((row, index) => {
      const id = this.formatId(nextIdSeed + index);
      const name = String(row?.name ?? `${this.selectedTemplate}-${index + 1}`).trim();
      return {
        ...row,
        id,
        name,
      };
    });

    const newDevelopmentRows = templateRows.map((row, index) => {
      const id = this.formatId(nextIdSeed + index);
      const name = String(row?.name ?? `${this.selectedTemplate}-${index + 1}`).trim();
      const successProb = Number(row?.success_prob ?? 0);
      const timeToMarket = Number(row?.time_to_market ?? 0);
      const patentYears = Number(row?.patent_years ?? 0);
      return {
        ID_vaccine: id,
        'Vaccine name': name,
        Stage: String(row?.stage ?? '').trim(),
        'Success Probability %': successProb <= 1 ? successProb * 100 : successProb,
        Consolidation: Boolean(row?.include_in_consolidation),
        'First year forecast': currentYear,
        'Time to market': timeToMarket,
        'Market entry year': currentYear,
        'Patent duration years': patentYears,
        'End patent year': currentYear,
      };
    });

    this.biotechModelService.patchInput({
      product_template_selected: this.selectedTemplate,
      products: [...existingProducts, ...newProducts],
      vaccine_development: [...existingDevelopmentRows, ...newDevelopmentRows],
    });
  }

  private loadTemplateLibrary(): void {
    this.http
      .get<TemplateLibrary>('assets/biotech_product_templates.json')
      .pipe(take(1))
      .subscribe({
        next: (templates) => {
          const source = this.normalizeTemplateLibrary(templates);
          this.applyTemplateLibrary(source);
        },
        error: () => {
          this.applyTemplateLibrary(FALLBACK_TEMPLATES);
        },
      });
  }

  private applyTemplateLibrary(library: TemplateLibrary): void {
    this.templateLibrary = library;
    this.templateOptions = Object.keys(library).map((name) => ({
      label: name,
      value: name,
    }));
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const preferred = String(snapshot?.product_template_selected ?? '').trim();
    this.selectedTemplate =
      this.templateOptions.find((option) => option.value === preferred)?.value ??
      this.templateOptions[0]?.value ??
      '';
  }

  private normalizeTemplateLibrary(raw: any): TemplateLibrary {
    if (!raw || typeof raw !== 'object') {
      return FALLBACK_TEMPLATES;
    }
    const normalized: TemplateLibrary = {};
    Object.keys(raw).forEach((key) => {
      const rows = Array.isArray(raw[key]) ? raw[key] : [];
      normalized[String(key)] = rows;
    });
    return Object.keys(normalized).length ? normalized : FALLBACK_TEMPLATES;
  }

  private nextVaccineIdSeed(existingProducts: any[], existingDevelopmentRows: any[]): number {
    const ids: string[] = [];
    existingProducts.forEach((row: any) => {
      ids.push(String(row?.id ?? ''));
    });
    existingDevelopmentRows.forEach((row: any) => {
      ids.push(String(row?.ID_vaccine ?? ''));
    });
    const max = ids.reduce((currentMax, idValue) => {
      const match = /VAC-(\d+)/i.exec(idValue);
      if (!match) {
        return currentMax;
      }
      return Math.max(currentMax, Number(match[1] ?? 0));
    }, 0);
    return max + 1;
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}
