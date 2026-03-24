import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs';
import { BiotechModelService } from '../../services/biotech-model.service';
import { ApiService } from '../../services/api.service';
import fallbackProductTemplates from '../../../../assets/biotech_product_templates.json';

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
  patent_revenue_target?: number;
  post_patent_revenue_target?: number;
  market_growth_patent?: number;
  market_growth_post?: number;
  cogs_patent?: number;
  cogs_post?: number;
  labor_pct?: number;
  overhead_pct?: number;
  material_pct?: number;
  sales_marketing_pct?: number;
  gna_pct?: number;
  rd_remaining_pre_launch?: number;
  rd_annual_post_launch?: number;
  capex_remaining_pre_launch?: number;
  capex_annual_post_launch?: number;
  [key: string]: unknown;
}

type TemplateLibrary = Record<string, ProductTemplateRow[]>;

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
            [loading]="isLoadingTemplates"
            [disabled]="isLoadingTemplates || !selectedTemplate"
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
  @Output() templateRowsLoaded = new EventEmitter<any[]>();
  templateOptions: TemplateOption[] = [];
  selectedTemplate = '';
  isLoadingTemplates = false;
  private templateLibrary: TemplateLibrary = {};

  constructor(
    private api: ApiService,
    private biotechModelService: BiotechModelService,
  ) {}

  ngOnInit(): void {
    this.applyTemplateLibrary(this.getFallbackTemplateLibrary());
    this.loadTemplateLibrary();
  }

  loadTemplateIntoProductTable(): void {
    this.loadTemplateLibrary(() => this.applySelectedTemplateToProductTable());
  }

  private applySelectedTemplateToProductTable(): void {
    const templateRows = Array.isArray(this.templateLibrary[this.selectedTemplate])
      ? this.templateLibrary[this.selectedTemplate]
      : [];
    if (!templateRows.length) {
      return;
    }

    const nextIdSeed = 1;

    const newProducts = templateRows.map((row, index) => {
      const id = this.formatId(nextIdSeed + index);
      const name = String(row?.name ?? `${this.selectedTemplate}-${index + 1}`).trim();
      return {
        ...row,
        id,
        name,
      };
    });

    this.templateRowsLoaded.emit(newProducts);
  }

  private loadTemplateLibrary(onLoaded?: () => void): void {
    this.isLoadingTemplates = true;
    this.api
      .get<any>('/model/biotech_v2/product-templates')
      .pipe(take(1))
      .subscribe({
        next: (templates) => {
          const source = this.normalizeTemplateLibrary(templates);
          const library = Object.keys(source).length
            ? source
            : this.getFallbackTemplateLibrary();
          this.applyTemplateLibrary(library);
          this.isLoadingTemplates = false;
          onLoaded?.();
        },
        error: () => {
          this.applyTemplateLibrary(this.getFallbackTemplateLibrary());
          this.isLoadingTemplates = false;
          onLoaded?.();
        },
      });
  }

  private getFallbackTemplateLibrary(): TemplateLibrary {
    return this.normalizeTemplateLibrary(fallbackProductTemplates);
  }

  private applyTemplateLibrary(library: TemplateLibrary): void {
    const selectedFromUi = String(this.selectedTemplate ?? '').trim();
    this.templateLibrary = library;
    this.templateOptions = Object.keys(library).map((name) => ({
      label: name,
      value: name,
    }));
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    const preferredFromSnapshot = String(snapshot?.product_template_selected ?? '').trim();
    this.selectedTemplate =
      this.templateOptions.find((option) => option.value === selectedFromUi)?.value ??
      this.templateOptions.find((option) => option.value === preferredFromSnapshot)?.value ??
      this.templateOptions[0]?.value ??
      '';
  }

  private normalizeTemplateLibrary(raw: any): TemplateLibrary {
    if (raw === null || raw === undefined) {
      return {};
    }

    if (typeof raw === 'object') {
      const wrappedCandidates = [raw?.data, raw?.templates, raw?.product_templates];
      for (const candidate of wrappedCandidates) {
        if (candidate === null || candidate === undefined) {
          continue;
        }
        const nested = this.normalizeTemplateLibrary(candidate);
        if (Object.keys(nested).length) {
          return nested;
        }
      }
    }

    if (Array.isArray(raw)) {
      return this.extractTemplateLibraryFromArray(raw);
    }

    const normalizedFromObject = this.extractTemplateLibraryFromObject(raw);
    if (Object.keys(normalizedFromObject).length) {
      return normalizedFromObject;
    }

    return {};
  }

  private extractTemplateLibraryFromObject(source: any): TemplateLibrary {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      return {};
    }

    const normalized: TemplateLibrary = {};

    Object.keys(source).forEach((key) => {
      const rawValue = source[key];
      const templateName = String(key ?? '').trim();
      if (!templateName) {
        return;
      }

      const rows = Array.isArray(rawValue)
        ? rawValue
        : Array.isArray(rawValue?.rows)
          ? rawValue.rows
          : Array.isArray(rawValue?.products)
            ? rawValue.products
            : [];

      if (!rows.length) {
        return;
      }

      normalized[templateName] = rows
        .map((row: any) => this.normalizeTemplateRow(row))
        .filter((row: ProductTemplateRow) => Object.keys(row).length > 0);
    });

    return normalized;
  }

  private extractTemplateLibraryFromArray(items: any[]): TemplateLibrary {
    const normalized: TemplateLibrary = {};

    items.forEach((item: any, index: number) => {
      const templateName = String(
        item?.template_name ?? item?.template ?? item?.name ?? item?.label ?? ''
      ).trim();
      const rowsSource = Array.isArray(item?.rows)
        ? item.rows
        : Array.isArray(item?.products)
          ? item.products
          : Array.isArray(item)
            ? item
            : null;

      if (!templateName || !rowsSource?.length) {
        if (item && typeof item === 'object' && !rowsSource) {
          const inferredName = `Template ${index + 1}`;
          const normalizedRow = this.normalizeTemplateRow(item);
          if (Object.keys(normalizedRow).length) {
            normalized[inferredName] = [normalizedRow];
          }
        }
        return;
      }

      normalized[templateName] = rowsSource
        .map((row: any) => this.normalizeTemplateRow(row))
        .filter((row: ProductTemplateRow) => Object.keys(row).length > 0);
    });

    return normalized;
  }

  private normalizeTemplateRow(row: any): ProductTemplateRow {
    if (!row || typeof row !== 'object') {
      return {};
    }

    const pickDefined = (...keys: string[]): unknown => {
      for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(row, key)) {
          continue;
        }
        const value = row?.[key];
        if (value === undefined || value === null) {
          continue;
        }
        if (typeof value === 'string' && !value.trim()) {
          continue;
        }
        return value;
      }
      return undefined;
    };

    const pickNumber = (...keys: string[]): number | undefined => {
      const rawValue = pickDefined(...keys);
      if (rawValue === undefined) {
        return undefined;
      }
      const num = Number(rawValue);
      return Number.isFinite(num) ? num : undefined;
    };

    const pickRatio = (...keys: string[]): number | undefined => {
      const value = pickNumber(...keys);
      if (value === undefined) {
        return undefined;
      }
      return value > 1 ? value / 100 : value;
    };

    const pickString = (...keys: string[]): string | undefined => {
      for (const key of keys) {
        const value = row?.[key];
        if (value !== undefined && value !== null && value !== '') {
          const normalized = String(value).trim();
          if (normalized) {
            return normalized;
          }
        }
      }
      return undefined;
    };

    const pickBoolean = (...keys: string[]): boolean | undefined => {
      for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(row, key)) {
          continue;
        }
        const value = row?.[key];
        if (value === undefined || value === null) {
          continue;
        }
        if (typeof value === 'boolean') {
          return value;
        }
        if (typeof value === 'number') {
          return value !== 0;
        }
        if (typeof value === 'string') {
          const normalized = value.trim().toLowerCase();
          if (['true', 'yes', '1'].includes(normalized)) {
            return true;
          }
          if (['false', 'no', '0'].includes(normalized)) {
            return false;
          }
        }
      }
      return undefined;
    };

    const normalized: ProductTemplateRow = {};

    const name = pickString('name', 'Name', 'Vaccine name');
    if (name !== undefined) normalized.name = name;

    const stage = pickString('stage', 'Stage');
    if (stage !== undefined) normalized.stage = stage;

    const successProb = pickRatio(
      'success_prob',
      'Success Probability %',
      'successProbability'
    );
    if (successProb !== undefined) normalized.success_prob = successProb;

    const includeInConsolidation = pickBoolean(
      'include_in_consolidation',
      'Consolidation',
      'includeInConsolidation'
    );
    if (includeInConsolidation !== undefined) {
      normalized.include_in_consolidation = includeInConsolidation;
    }

    const timeToMarket = pickNumber('time_to_market', 'Time to market');
    if (timeToMarket !== undefined) normalized.time_to_market = timeToMarket;

    const patentYears = pickNumber('patent_years', 'Patent duration years');
    if (patentYears !== undefined) normalized.patent_years = patentYears;

    const patentRevenueTarget = pickNumber('patent_revenue_target');
    if (patentRevenueTarget !== undefined) {
      normalized.patent_revenue_target = patentRevenueTarget;
    }

    const postPatentRevenueTarget = pickNumber('post_patent_revenue_target');
    if (postPatentRevenueTarget !== undefined) {
      normalized.post_patent_revenue_target = postPatentRevenueTarget;
    }

    const marketGrowthPatent = pickRatio('market_growth_patent');
    if (marketGrowthPatent !== undefined) {
      normalized.market_growth_patent = marketGrowthPatent;
    }

    const marketGrowthPost = pickRatio('market_growth_post');
    if (marketGrowthPost !== undefined) normalized.market_growth_post = marketGrowthPost;

    const cogsPatent = pickRatio('cogs_patent');
    if (cogsPatent !== undefined) normalized.cogs_patent = cogsPatent;

    const cogsPost = pickRatio('cogs_post');
    if (cogsPost !== undefined) normalized.cogs_post = cogsPost;

    const laborPct = pickRatio('labor_pct');
    if (laborPct !== undefined) normalized.labor_pct = laborPct;

    const overheadPct = pickRatio('overhead_pct');
    if (overheadPct !== undefined) normalized.overhead_pct = overheadPct;

    const materialPct = pickRatio('material_pct');
    if (materialPct !== undefined) normalized.material_pct = materialPct;

    const salesMarketingPct = pickRatio('sales_marketing_pct');
    if (salesMarketingPct !== undefined) {
      normalized.sales_marketing_pct = salesMarketingPct;
    }

    const gnaPct = pickRatio('gna_pct');
    if (gnaPct !== undefined) normalized.gna_pct = gnaPct;

    const rdRemainingPreLaunch = pickNumber('rd_remaining_pre_launch');
    if (rdRemainingPreLaunch !== undefined) {
      normalized.rd_remaining_pre_launch = rdRemainingPreLaunch;
    }

    const rdAnnualPostLaunch = pickNumber('rd_annual_post_launch');
    if (rdAnnualPostLaunch !== undefined) {
      normalized.rd_annual_post_launch = rdAnnualPostLaunch;
    }

    const capexRemainingPreLaunch = pickNumber('capex_remaining_pre_launch');
    if (capexRemainingPreLaunch !== undefined) {
      normalized.capex_remaining_pre_launch = capexRemainingPreLaunch;
    }

    const capexAnnualPostLaunch = pickNumber('capex_annual_post_launch');
    if (capexAnnualPostLaunch !== undefined) {
      normalized.capex_annual_post_launch = capexAnnualPostLaunch;
    }

    return normalized;
  }

  private formatId(value: number): string {
    return `VAC-${String(value).padStart(3, '0')}`;
  }
}
