import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { AiInsightsComponent } from './app-ai-insights.component';
import { FieldsetModule } from 'primeng/fieldset';

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
    AiInsightsComponent,
  ],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="text-xl font-semibold">RAG Assistant</div>

      <div class="flex flex-col gap-2">
        <div class="text-2xl font-semibold">Upload reference documents</div>
        <div class="text-sm text-surface-400">
          Set RAG_HOST and RAG_PROJECT_ID env vars to override defaults.
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold">Upload reference documents</div>
        <div
          class="flex items-center justify-between gap-4 rounded-lg border px-4 py-4"
        >
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
              <span class="text-lg">⬆</span>
            </div>
            <div class="text-sm">
              <div class="font-semibold">Drag and drop files here</div>
              <div class="text-xs text-surface-400">Limit 200MB per file</div>
            </div>
          </div>
          <label class="relative">
            <p-button label="Browse files" [outlined]="true"></p-button>
            <input
              type="file"
              multiple
              class="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-xl font-semibold">AI &amp; Machine Learning Configuration</div>

        <div class="flex items-center gap-3 text-sm">
          <p-checkbox
            inputId="aiEnhancements"
            [binary]="true"
            [(ngModel)]="enableAi"
          ></p-checkbox>
          <label for="aiEnhancements">Enable AI enhancements</label>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Provider</div>
          <p-select
            [options]="providerOptions"
            [(ngModel)]="provider"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Model</div>
          <p-select
            [options]="modelOptions"
            [(ngModel)]="model"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Forecast horizon (years)</div>
          <p-inputnumber
            [(ngModel)]="forecastHorizon"
            [min]="1"
            [max]="50"
            [showButtons]="true"
            [useGrouping]="false"
            inputStyleClass="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Machine learning method</div>
          <p-multiselect
            [options]="mlMethodOptions"
            [(ngModel)]="mlMethods"
            optionLabel="label"
            optionValue="value"
            display="chip"
            class="w-full"
          ></p-multiselect>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">Generative features</div>
          <p-multiselect
            [options]="featureOptions"
            [(ngModel)]="features"
            optionLabel="label"
            optionValue="value"
            display="chip"
            class="w-full"
            autocomplete="'off'"
          ></p-multiselect>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold">API key</div>
          <p-password
            [(ngModel)]="apiKey"
            [feedback]="false"
            [toggleMask]="true"
            inputStyleClass="w-full"
            autocomplete="'off'"
            fluid
          ></p-password>
        </div>

        <div>
          <p-button label="Save AI configuration" [outlined]="true"></p-button>
        </div>
      </div>

      <p-fieldset legend="AI Insights" [toggleable]="true" class="w-full">
        <app-ai-insights></app-ai-insights>
      </p-fieldset>

      <p-fieldset
        legend="Business Plan Downloads"
        [toggleable]="true"
        class="w-full"
      >
        <div class="flex flex-col gap-4">
          <div class="text-sm text-surface-400">
            Generate a consolidated business plan bundle that includes the full financial report and snapshot.
          </div>
          <div>
            <p-button
              label="Prepare business plan bundle"
              [outlined]="true"
              (onClick)="bundleReady = true"
            ></p-button>
          </div>
          @if (bundleReady) {
            <div class="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-green-500">
              Bundle ready. Download below.
            </div>
            <div class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
                  <p-button label="Download business plan (Excel)" [outlined]="true" fluid></p-button>
                </div>
                <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
                  <p-button label="Download business plan (Word)" [outlined]="true" fluid></p-button>
                </div>
                <div class="col-span-12 lg:col-span-4 flex flex-col gap-2">
                  <p-button label="Download business plan (PDF)" [outlined]="true" fluid></p-button>
                </div>
              </div>
            </div>
          }
          <div class="text-xs text-surface-500">
            Tip: Upload a Prophet-ready dataframe (ds, y) and plug it into ForecastScenarioBridge for richer scenarios.
          </div>
        </div>
      </p-fieldset>
    </div>
  `,
})
export class RagAssistantComponent {
  enableAi = true;
  provider = 'openai';
  model = 'gpt-4o-mini';
  forecastHorizon = 10;
  mlMethods = ['linear-regression'];
  features = ['executive-summary', 'risk-review', 'cash-flow-highlights'];
  apiKey = '';
  bundleReady = false;

  providerOptions = [{ label: 'OpenAI', value: 'openai' }];
  modelOptions = [
    { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
    { label: 'gpt-4o', value: 'gpt-4o' },
  ];
  mlMethodOptions = [
    { label: 'Linear regression', value: 'linear-regression' },
    { label: 'Random forest', value: 'random-forest' },
    { label: 'Gradient boosting', value: 'gradient-boosting' },
  ];
  featureOptions = [
    { label: 'Executive summary', value: 'executive-summary' },
    { label: 'Risk review', value: 'risk-review' },
    { label: 'Cash flow highlights', value: 'cash-flow-highlights' },
    { label: 'Market sizing', value: 'market-sizing' },
    { label: 'Scenario guidance', value: 'scenario-guidance' },
  ];
}
