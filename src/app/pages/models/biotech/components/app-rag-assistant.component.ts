import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { finalize, take } from 'rxjs';
import { BiotechModelService } from '../../../services/biotech-model.service';

type NoticeType = 'success' | 'info' | 'warning' | 'error';

interface SnapshotRow {
  name: string;
  npv: number | null;
  irr: number | null;
}

@Component({
  standalone: true,
  selector: 'app-rag-assistant',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    PasswordModule,
    FieldsetModule,
    TableModule,
  ],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">RAG Assistant</div>

      <div class="flex flex-col gap-2">
        <div class="text-2xl font-semibold">Upload reference documents</div>
        <div class="text-sm text-surface-400">Set RAG_HOST and RAG_PROJECT_ID env vars to override defaults.</div>
      </div>

      <div class="flex items-center justify-between gap-4 rounded-lg border px-4 py-4">
        <div class="text-sm">
          <div class="font-semibold">Drag and drop files here</div>
          <div class="text-xs text-surface-400">Limit 200MB per file</div>
        </div>
        <input #uploadInput type="file" multiple class="hidden" (change)="onFilesSelected($event)" />
        <p-button label="Browse files" [outlined]="true" (onClick)="openFilePicker()"></p-button>
      </div>
      @if (selectedFiles.length) {
        <div class="text-xs text-surface-400">{{ selectedFiles.length }} document(s) ready for indexing.</div>
      }

      <div class="flex flex-col gap-4">
        <div class="text-xl font-semibold">AI &amp; Machine Learning Configuration</div>
        <div class="flex items-center gap-3 text-sm">
          <p-checkbox inputId="aiEnhancements" [binary]="true" [(ngModel)]="enableAi"></p-checkbox>
          <label for="aiEnhancements">Enable AI enhancements</label>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Provider</div>
          <p-select [options]="providerOptions" [(ngModel)]="provider" optionLabel="label" optionValue="value" class="w-full"></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Model</div>
          <input pInputText [(ngModel)]="model" class="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Forecast horizon (years)</div>
          <p-inputnumber [(ngModel)]="forecastHorizon" [min]="1" [max]="50" [showButtons]="true" [useGrouping]="false" inputStyleClass="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Machine learning method</div>
          <p-multiselect [options]="mlMethodOptions" [(ngModel)]="mlMethods" optionLabel="label" optionValue="value" display="chip" class="w-full" [maxSelectedLabels]="6"></p-multiselect>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Generative features</div>
          <p-multiselect [options]="featureOptions" [(ngModel)]="features" optionLabel="label" optionValue="value" display="chip" class="w-full" [maxSelectedLabels]="6"></p-multiselect>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">API key</div>
          <p-password [(ngModel)]="apiKey" [feedback]="false" [toggleMask]="true" inputStyleClass="w-full" fluid></p-password>
        </div>

        <div><p-button label="Save AI configuration" [outlined]="true" (onClick)="saveAiConfiguration()"></p-button></div>
        @if (configNotice) {
          <div [class]="noticeClass(configType)">{{ configNotice }}</div>
        }
      </div>
      <p-fieldset legend="AI Insights" [toggleable]="true" class="w-full">
        <div class="flex flex-col gap-4">
          <div>
            <p-button label="Refresh snapshot from latest model" [outlined]="true" [loading]="isRefreshing" [disabled]="isRefreshing" (onClick)="refreshSnapshot()"></p-button>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Currency</div><input pInputText [(ngModel)]="snapshot.currency" (ngModelChange)="persistSnapshot()" class="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">NPV</div><p-inputnumber [(ngModel)]="snapshot.npv" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">IRR</div><p-inputnumber [(ngModel)]="snapshot.irr" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="4" [maxFractionDigits]="4" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Minimum DSCR</div><p-inputnumber [(ngModel)]="snapshot.dscr_min" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Payback (years)</div><p-inputnumber [(ngModel)]="snapshot.payback_years" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Total capex</div><p-inputnumber [(ngModel)]="snapshot.capex_total" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="grid gap-4 md:grid-cols-2 md:col-span-2">
              <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual opex</div><p-inputnumber [(ngModel)]="snapshot.opex_annual" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
              <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual revenue</div><p-inputnumber [(ngModel)]="snapshot.revenue_annual" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            </div>
          </div>

          <div class="text-xs font-semibold">Financing assumptions</div>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Beginning cash balance</div><p-inputnumber [(ngModel)]="snapshot.beginning_cash" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual equity issuance</div><p-inputnumber [(ngModel)]="snapshot.equity_issuance" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual debt drawdowns</div><p-inputnumber [(ngModel)]="snapshot.debt_draw" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            <div class="grid gap-4 md:grid-cols-2 md:col-span-2">
              <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual debt repayments</div><p-inputnumber [(ngModel)]="snapshot.debt_repay" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
              <div class="flex flex-col gap-2"><div class="text-xs font-semibold">Annual interest paid</div><p-inputnumber [(ngModel)]="snapshot.interest_paid" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></div>
            </div>
          </div>

          <p-table [value]="snapshot.scenarios" showGridlines responsiveLayout="scroll" class="text-sm" [size]="'small'" [tableStyle]="{ 'min-width': '760px' }">
            <ng-template pTemplate="header"><tr><th>#</th><th>Scenario</th><th>NPV</th><th>IRR</th><th></th></tr></ng-template>
            <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                <td>{{ i }}</td>
                <td><input pInputText [(ngModel)]="row.name" (ngModelChange)="persistSnapshot()" class="w-full" /></td>
                <td><p-inputnumber [(ngModel)]="row.npv" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="2" [maxFractionDigits]="2" inputStyleClass="w-full" /></td>
                <td><p-inputnumber [(ngModel)]="row.irr" (ngModelChange)="persistSnapshot()" [showButtons]="true" [minFractionDigits]="4" [maxFractionDigits]="4" inputStyleClass="w-full" /></td>
                <td><p-button icon="pi pi-trash" [text]="true" size="small" (onClick)="removeScenario(i)"></p-button></td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-surface-500">empty</td>
              </tr>
            </ng-template>
          </p-table>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="flex flex-col gap-2">
              <p-button label="Index documents" [outlined]="true" [loading]="isIndexing" [disabled]="isIndexing || !selectedFiles.length" (onClick)="indexDocuments()"></p-button>
              @if (!selectedFiles.length) { <div class="text-xs text-surface-500">Upload reference documents to enable indexing.</div> }
            </div>
            <div class="flex flex-col gap-2"><p-button label="Clear indexed documents" [outlined]="true" (onClick)="clearIndexedDocuments()"></p-button></div>
            <div class="flex flex-col gap-2">
              <p-button label="Run AI insights" [outlined]="true" [loading]="isRunningInsights" [disabled]="isRunningInsights || !hasIndexed" (onClick)="runAiInsights()"></p-button>
              @if (!hasIndexed) { <div class="text-xs text-surface-500">Index documents before running AI insights.</div> }
            </div>
          </div>

          @if (insightNotice) { <div [class]="noticeClass(insightType)">{{ insightNotice }}</div> }

          <div class="flex flex-col gap-2">
            <div class="text-sm font-semibold">Ask a question</div>
            <input pInputText [(ngModel)]="question" class="w-full" />
            <div><p-button label="Search" [outlined]="true" (onClick)="search()"></p-button></div>
          </div>
          @if (searchNotice) { <div [class]="noticeClass(searchType)">{{ searchNotice }}</div> }
        </div>
      </p-fieldset>

      <p-fieldset legend="Business Plan Downloads" [toggleable]="true" class="w-full">
        <div class="flex flex-col gap-4">
          <div class="text-sm text-surface-400">Generate a consolidated business plan bundle that includes the full financial report and snapshot.</div>
          <div><p-button label="Prepare business plan bundle" [outlined]="true" [loading]="isPreparingBundle" [disabled]="isPreparingBundle" (onClick)="prepareBundle()"></p-button></div>
          @if (bundleNotice) { <div [class]="noticeClass(bundleType)">{{ bundleNotice }}</div> }
          @if (bundleWarnings.length) {
            @for (warning of bundleWarnings; track warning) {
              <div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">{{ warning }}</div>
            }
          }
          @if (bundleReady) {
            <div class="flex flex-col gap-2">
              @if (canDownloadExcel) {
                <p-button label="Download business plan (Excel)" [outlined]="true" [disabled]="isDownloading" (onClick)="downloadBundle('Excel')" fluid></p-button>
              }
              @if (canDownloadWord) {
                <p-button label="Download business plan (Word)" [outlined]="true" [disabled]="isDownloading" (onClick)="downloadBundle('Word')" fluid></p-button>
              }
              @if (canDownloadPdf) {
                <p-button label="Download business plan (PDF)" [outlined]="true" [disabled]="isDownloading" (onClick)="downloadBundle('PDF')" fluid></p-button>
              }
            </div>
          }
          <div class="text-xs text-surface-500">Tip: Upload a Prophet-ready dataframe (ds, y) and plug it into ForecastScenarioBridge for richer scenarios.</div>
        </div>
      </p-fieldset>
    </div>
  `,
})
export class RagAssistantComponent implements OnInit {
  @ViewChild('uploadInput') uploadInput?: ElementRef<HTMLInputElement>;

  selectedFiles: File[] = [];
  providerOptions = [
    { label: 'OpenAI', value: 'OpenAI' },
    { label: 'Azure OpenAI', value: 'Azure OpenAI' },
    { label: 'Anthropic', value: 'Anthropic' },
    { label: 'Vertex', value: 'Vertex' },
    { label: 'Custom', value: 'Custom' },
  ];
  mlMethodOptions = [
    { label: 'Linear regression', value: 'linear_regression' },
    { label: 'Compound annual growth', value: 'cagr' },
    { label: 'ARIMA', value: 'arima' },
    { label: 'Prophet', value: 'prophet' },
    { label: 'LSTM', value: 'lstm' },
  ];
  featureOptions = [
    { label: 'Executive summary', value: 'summary' },
    { label: 'Risk review', value: 'risk_review' },
    { label: 'Cash flow highlights', value: 'cash_flow_highlight' },
    { label: 'ESG review', value: 'esg_review' },
    { label: 'Market overview', value: 'market_overview' },
  ];

  enableAi = true;
  provider = 'OpenAI';
  model = 'gpt-4o-mini';
  forecastHorizon = 10;
  mlMethods: string[] = ['linear_regression'];
  features: string[] = ['summary', 'risk_review', 'cash_flow_highlight'];
  apiKey = '';

  ragHost = 'http://localhost:8000';
  ragProjectId = 'default-project';

  snapshot: any = {
    currency: 'USD',
    npv: null,
    irr: null,
    dscr_min: null,
    payback_years: null,
    capex_total: null,
    opex_annual: null,
    revenue_annual: null,
    beginning_cash: 0,
    equity_issuance: 0,
    debt_draw: 0,
    debt_repay: 0,
    interest_paid: 0,
    scenarios: [] as SnapshotRow[],
    sensitivities: [],
    assumptions: {},
  };
  hasIndexed = false;
  lastReport: Record<string, unknown> = {};

  isRefreshing = false;
  isIndexing = false;
  isRunningInsights = false;
  isPreparingBundle = false;
  isDownloading = false;
  bundleReady = false;
  bundleWarnings: string[] = [];
  canDownloadExcel = true;
  canDownloadWord = true;
  canDownloadPdf = true;

  configNotice = '';
  configType: NoticeType = 'info';
  insightNotice = '';
  insightType: NoticeType = 'info';
  searchNotice = '';
  searchType: NoticeType = 'info';
  bundleNotice = '';
  bundleType: NoticeType = 'info';
  question = '';

  constructor(private readonly biotechModelService: BiotechModelService, private readonly http: HttpClient) {}

  ngOnInit(): void {
    const input = this.biotechModelService.getInputSnapshot() ?? {};
    this.ragHost = String(input?.rag_host ?? this.ragHost);
    this.ragProjectId = String(input?.rag_project_id ?? this.ragProjectId);
    this.snapshot = { ...this.snapshot, ...(input?.snapshot_inputs ?? {}) };
    if (!Array.isArray(this.snapshot.scenarios)) this.snapshot.scenarios = [];
    if (!Array.isArray(this.snapshot.sensitivities)) this.snapshot.sensitivities = [];
    if (!this.snapshot.assumptions || typeof this.snapshot.assumptions !== 'object') {
      this.snapshot.assumptions = {};
    }
    this.lastReport = (input?.last_report ?? {}) as Record<string, unknown>;
    const ai = (input?.rag_ai_config ?? {}) as Record<string, unknown>;
    this.enableAi = Boolean(ai['enable_ai'] ?? true);
    this.provider = this.normalizeSingleOptionValue(
      ai['provider'],
      this.providerOptions,
      this.provider
    );
    this.model = String(ai['model'] ?? this.model);
    this.forecastHorizon = Number(ai['forecast_horizon'] ?? this.forecastHorizon);
    this.mlMethods = this.normalizeMultiOptionValues(
      ai['ml_methods'],
      this.mlMethodOptions,
      this.mlMethods
    );
    this.features = this.normalizeMultiOptionValues(
      ai['generative_features'],
      this.featureOptions,
      this.features
    );
  }

  openFilePicker(): void { this.uploadInput?.nativeElement.click(); }
  onFilesSelected(event: Event): void { const target = event.target as HTMLInputElement | null; this.selectedFiles = target?.files ? Array.from(target.files) : []; }

  saveAiConfiguration(): void {
    this.biotechModelService.patchInput({
      rag_ai_config: {
        enable_ai: this.enableAi,
        provider: this.provider,
        model: this.model,
        forecast_horizon: Math.max(1, Math.min(50, Math.floor(this.forecastHorizon || 10))),
        ml_methods: this.mlMethods,
        generative_features: this.features,
        api_key_set: Boolean(this.apiKey.trim()),
      },
      rag_host: this.ragHost,
      rag_project_id: this.ragProjectId,
    });
    this.configType = 'success';
    this.configNotice = 'AI configuration saved.';
    if (this.apiKey.trim()) this.apiKey = '';
  }
  refreshSnapshot(): void {
    if (this.isRefreshing) return;
    const output = this.biotechModelService.getOutputSnapshot();
    if (!output || !output?.consolidated || !output?.dcf_table) {
      this.insightType = 'warning';
      this.insightNotice = 'Run the model workspace to generate a snapshot.';
      return;
    }

    this.isRefreshing = true;
    try {
      const dcf = output?.dcf_table?.data ?? {};
      const cons = output?.consolidated?.data ?? {};
      const fcff = Array.isArray(dcf['fcff']) ? dcf['fcff'].map((v: unknown) => Number(v ?? 0)) : [];
      const terminal = Array.isArray(dcf['terminal_value']) ? dcf['terminal_value'].map((v: unknown) => Number(v ?? 0)) : [];
      if (fcff.length && terminal.length) fcff[fcff.length - 1] += terminal[terminal.length - 1] ?? 0;
      const years = Array.isArray(output?.dcf_table?.index)
        ? output.dcf_table.index.map((v: unknown) => Number(v ?? 0))
        : Array.from({ length: fcff.length }, (_, i) => i);
      const capex = Array.isArray(cons['capex_cash']) ? cons['capex_cash'].map((v: unknown) => Number(v ?? 0)) : [];
      const revenue = Array.isArray(cons['revenue']) ? cons['revenue'].map((v: unknown) => Number(v ?? 0)) : [];
      const opexCols = ['sales_marketing', 'gna', 'royalty', 'rd_cash'];
      const opexSeries = opexCols
        .map((column) =>
          Array.isArray(cons[column]) ? cons[column].map((v: unknown) => Number(v ?? 0)) : []
        )
        .filter((series) => series.length > 0);
      let opexAnnual: number | null = null;
      if (opexSeries.length) {
        const maxLen = Math.max(...opexSeries.map((series) => series.length));
        const totals = Array.from({ length: maxLen }, (_, idx) =>
          opexSeries.reduce((sum, series) => sum + Number(series[idx] ?? 0), 0)
        );
        opexAnnual = totals.length
          ? -(totals.reduce((sum, value) => sum + value, 0) / totals.length)
          : null;
      }
      const revenueAnnual = revenue.length
        ? revenue.reduce((sum, value) => sum + value, 0) / revenue.length
        : null;
      this.snapshot = {
        ...this.snapshot,
        currency: String((this.biotechModelService.getInputSnapshot()?.model_config?.currency as string) ?? 'USD'),
        npv: Number(output?.rnpv ?? 0),
        irr: this.computeIrr(fcff),
        payback_years: this.computePayback(years, fcff),
        capex_total: capex.length ? -capex.reduce((s: number, v: number) => s + v, 0) : null,
        opex_annual: opexAnnual,
        revenue_annual: revenueAnnual,
        scenarios: [{ name: 'Base', npv: Number(output?.rnpv ?? 0), irr: null }],
      };
      this.persistSnapshot();
      this.insightType = 'success';
      this.insightNotice = 'Snapshot refreshed from latest model output.';
    } finally {
      this.isRefreshing = false;
    }
  }

  persistSnapshot(): void {
    this.biotechModelService.patchInput({
      snapshot_inputs: this.snapshot,
      rag_host: this.ragHost,
      rag_project_id: this.ragProjectId,
      last_report: this.lastReport,
    });
  }

  addScenario(): void {
    this.snapshot.scenarios = [...(this.snapshot.scenarios ?? []), { name: `Scenario ${(this.snapshot.scenarios?.length ?? 0) + 1}`, npv: null, irr: null }];
    this.persistSnapshot();
  }

  removeScenario(index: number): void {
    this.snapshot.scenarios = (this.snapshot.scenarios ?? []).filter((_: unknown, i: number) => i !== index);
    this.persistSnapshot();
  }

  indexDocuments(): void {
    if (this.isIndexing || !this.selectedFiles.length) return;
    this.isIndexing = true;
    this.insightNotice = '';

    const form = new FormData();
    this.selectedFiles.forEach((file) => form.append('files', file, file.name));
    const url = `${this.ragHost.replace(/\/+$/, '')}/ingest`;
    const params = new HttpParams().set('project_id', this.ragProjectId);

    this.http.post<Record<string, unknown>>(url, form, { params }).pipe(
      take(1),
      finalize(() => { this.isIndexing = false; })
    ).subscribe({
      next: (response) => {
        this.hasIndexed = true;
        this.insightType = 'success';
        this.insightNotice = this.compactMessage(response, 'Documents indexed successfully.');
      },
      error: (error) => {
        this.insightType = this.isConnectionError(error) ? 'warning' : 'error';
        this.insightNotice = this.isConnectionError(error)
          ? 'RAG service unreachable. Start the service or update RAG_HOST to a reachable URL.'
          : this.resolveError(error, 'Failed to ingest files.');
      },
    });
  }

  clearIndexedDocuments(): void {
    this.hasIndexed = false;
    this.lastReport = {};
    this.biotechModelService.patchInput({ last_report: {}, rag_host: this.ragHost, rag_project_id: this.ragProjectId });
    this.insightType = 'info';
    this.insightNotice = 'Local index metadata cleared. Clear the backend index from the service if needed.';
  }

  runAiInsights(): void {
    if (this.isRunningInsights || !this.hasIndexed) return;
    this.isRunningInsights = true;
    const url = `${this.ragHost.replace(/\/+$/, '')}/generate`;
    const payload = {
      project_id: this.ragProjectId,
      section_outline: [
        'Executive Summary',
        'Project Description & Scope',
        'Market & Demand Analysis',
        'Technical & Operations',
        'Legal, Permitting & Environmental',
        'Implementation Plan',
        'Financial Analysis',
        'Risk Assessment & Mitigations',
        'Conclusion & Recommendation',
        'Appendices',
      ],
    };

    this.http.post<Record<string, unknown>>(url, payload).pipe(
      take(1),
      finalize(() => { this.isRunningInsights = false; })
    ).subscribe({
      next: (response) => {
        this.lastReport = response ?? {};
        this.biotechModelService.patchInput({ last_report: this.lastReport, rag_host: this.ragHost, rag_project_id: this.ragProjectId });
        this.insightType = 'success';
        this.insightNotice = this.compactMessage(response, 'AI insights generated successfully.');
      },
      error: (error) => {
        this.insightType = this.isConnectionError(error) ? 'warning' : 'error';
        this.insightNotice = this.isConnectionError(error)
          ? 'RAG service unreachable. Start the service or update RAG_HOST to a reachable URL.'
          : this.resolveError(error, 'Failed to run AI insights.');
      },
    });
  }

  search(): void {
    if (!this.question.trim()) {
      this.searchType = 'warning';
      this.searchNotice = 'Enter a question to search.';
      return;
    }
    this.searchType = 'info';
    this.searchNotice = 'Search requires a backend endpoint (e.g. /search). Configure it to enable results.';
  }

  prepareBundle(): void {
    if (this.isPreparingBundle) return;
    this.isPreparingBundle = true;
    this.bundleNotice = '';
    this.bundleWarnings = [];
    this.canDownloadExcel = true;
    this.canDownloadWord = true;
    this.canDownloadPdf = true;

    this.biotechModelService.patchInput({
      snapshot_inputs: this.snapshot,
      rag_host: this.ragHost,
      rag_project_id: this.ragProjectId,
      last_report: this.lastReport,
    });

    this.biotechModelService.getReportBundleV2().pipe(
      take(1),
      finalize(() => { this.isPreparingBundle = false; })
    ).subscribe({
      next: (bundle) => {
        this.bundleReady = true;
        this.bundleType = 'success';
        this.bundleNotice = 'Bundle ready. Download below.';
        this.bundleWarnings = Array.isArray(bundle?.warnings)
          ? bundle.warnings.filter((warning): warning is string => typeof warning === 'string' && warning.trim().length > 0)
          : [];
        this.applyBundleAvailability(this.bundleWarnings);
        if (bundle?.snapshot?.financial_snapshot) {
          this.snapshot = { ...this.snapshot, ...bundle.snapshot.financial_snapshot };
        }
        if (bundle?.last_report) {
          this.lastReport = bundle.last_report;
        }
      },
      error: (error) => {
        this.bundleReady = false;
        this.bundleWarnings = [];
        this.canDownloadExcel = true;
        this.canDownloadWord = true;
        this.canDownloadPdf = true;
        this.bundleType = 'error';
        this.bundleNotice = this.resolveError(error, 'Unable to prepare business plan bundle.');
      },
    });
  }

  downloadBundle(format: 'Excel' | 'Word' | 'PDF'): void {
    if (
      (format === 'Excel' && !this.canDownloadExcel) ||
      (format === 'Word' && !this.canDownloadWord) ||
      (format === 'PDF' && !this.canDownloadPdf)
    ) {
      return;
    }
    if (this.isDownloading) return;
    this.isDownloading = true;
    this.biotechModelService.exportModelReport('biotech_v2', format).pipe(
      take(1),
      finalize(() => { this.isDownloading = false; })
    ).subscribe({
      next: (blob) => {
        const ext = format === 'Word' ? 'docx' : format.toLowerCase();
        this.downloadBlob(blob, `business_plan.${ext}`);
        this.bundleType = 'success';
        this.bundleNotice = `${format} report downloaded.`;
      },
      error: (error) => {
        this.bundleType = 'error';
        this.bundleNotice = this.resolveError(error, `Unable to download ${format} report.`);
      },
    });
  }

  noticeClass(type: NoticeType): string {
    if (type === 'success') return 'rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-green-500';
    if (type === 'warning') return 'rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300';
    if (type === 'error') return 'rounded-lg bg-red-100 px-4 py-3 text-sm text-red-500';
    return 'rounded-lg bg-blue-300 px-4 py-3 text-sm text-blue-600';
  }

  private computeIrr(cashflows: number[]): number | null {
    if (!cashflows.length || cashflows.every((v) => v >= 0) || cashflows.every((v) => v <= 0)) return null;
    const npv = (r: number): number => cashflows.reduce((s, cf, i) => s + cf / Math.pow(1 + r, i), 0);
    let low = -0.9;
    let high = 1.0;
    let nLow = npv(low);
    let nHigh = npv(high);
    let tries = 0;
    while (nLow * nHigh > 0 && tries < 10) {
      high += 1;
      nHigh = npv(high);
      tries += 1;
    }
    if (nLow * nHigh > 0) return null;
    for (let i = 0; i < 60; i += 1) {
      const mid = (low + high) / 2;
      const nMid = npv(mid);
      if (Math.abs(nMid) < 1e-6) return mid;
      if (nLow * nMid <= 0) { high = mid; nHigh = nMid; } else { low = mid; nLow = nMid; }
    }
    return (low + high) / 2;
  }

  private computePayback(years: number[], cashflows: number[]): number | null {
    if (!years.length || years.length !== cashflows.length) return null;
    let cumulative = 0;
    for (let i = 0; i < years.length; i += 1) {
      const prev = cumulative;
      cumulative += Number(cashflows[i] ?? 0);
      if (cumulative >= 0 && i > 0) {
        const cf = Number(cashflows[i] ?? 0);
        if (cf === 0) return years[i] - years[0];
        const fraction = (0 - prev) / cf;
        return (years[i - 1] + fraction * (years[i] - years[i - 1])) - years[0];
      }
    }
    return null;
  }

  private compactMessage(payload: Record<string, unknown> | null | undefined, fallback: string): string {
    if (!payload) return fallback;
    try {
      const text = JSON.stringify(payload);
      if (!text || text === '{}') return fallback;
      return text.length <= 260 ? text : `${text.slice(0, 257)}...`;
    } catch {
      return fallback;
    }
  }

  private applyBundleAvailability(warnings: string[]): void {
    const warningsLower = warnings.map((warning) => warning.toLowerCase());
    this.canDownloadExcel = !warningsLower.some((warning) => warning.includes('excel export unavailable'));
    this.canDownloadWord = !warningsLower.some((warning) => warning.includes('word export unavailable'));
    this.canDownloadPdf = !warningsLower.some((warning) => warning.includes('pdf export unavailable'));
  }

  private resolveError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) return error.error;
      if (error.error && typeof error.error === 'object') {
        const detail = (error.error as Record<string, unknown>)['detail'];
        if (typeof detail === 'string' && detail.trim()) return detail;
      }
      if (typeof error.message === 'string' && error.message.trim()) return error.message;
    }
    if (error && typeof error === 'object' && typeof (error as any).message === 'string') return (error as any).message;
    return fallback;
  }

  private isConnectionError(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private normalizeSingleOptionValue(
    rawValue: unknown,
    options: Array<{ label: string; value: string }>,
    fallback: string
  ): string {
    const normalized = this.normalizeMultiOptionValues(rawValue, options, [fallback]);
    return normalized[0] ?? fallback;
  }

  private normalizeMultiOptionValues(
    rawValue: unknown,
    options: Array<{ label: string; value: string }>,
    fallback: string[]
  ): string[] {
    const allowedValues = new Set(options.map((option) => String(option.value)));
    const optionLookup = new Map<string, string>();
    options.forEach((option) => {
      optionLookup.set(String(option.value).toLowerCase(), String(option.value));
      optionLookup.set(String(option.label).toLowerCase(), String(option.value));
    });

    const rawItems: unknown[] = Array.isArray(rawValue)
      ? rawValue
      : typeof rawValue === 'string'
        ? this.parseRawSelectionString(rawValue)
        : rawValue && typeof rawValue === 'object'
          ? [rawValue]
          : [];

    const normalizedItems = rawItems
      .map((item) => this.extractRawSelectionValue(item))
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => optionLookup.get(item.toLowerCase()) ?? item)
      .filter((item) => allowedValues.has(item));

    const deduplicated = Array.from(new Set(normalizedItems));
    if (deduplicated.length) {
      return deduplicated;
    }

    const fallbackNormalized = fallback
      .map((item) => String(item ?? '').trim())
      .filter((item) => allowedValues.has(item));

    return Array.from(new Set(fallbackNormalized));
  }

  private extractRawSelectionValue(item: unknown): string {
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item);
    }
    if (!item || typeof item !== 'object') {
      return '';
    }
    const candidate = item as Record<string, unknown>;
    if (typeof candidate['value'] === 'string' || typeof candidate['value'] === 'number') {
      return String(candidate['value']);
    }
    if (typeof candidate['label'] === 'string' || typeof candidate['label'] === 'number') {
      return String(candidate['label']);
    }
    if (typeof candidate['name'] === 'string' || typeof candidate['name'] === 'number') {
      return String(candidate['name']);
    }
    return '';
  }

  private parseRawSelectionString(rawValue: string): unknown[] {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Keep fallback parsing below.
      }
    }

    return rawValue.split(',');
  }
}

