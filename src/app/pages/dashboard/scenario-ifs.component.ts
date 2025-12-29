import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';

interface ScenarioSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-scenario-ifs',
  imports: [CommonModule, TabsModule, ScenarioAnalysisWidget],
  template: `
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
            @switch (section.key) {
              @case ('scenario-cases') {
                <scenario-analysis-widget></scenario-analysis-widget>
              }
              @default {
                <div class="card">
                  <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
                  <p class="text-sm text-surface-400 mb-3">
                    {{ section.description }}
                  </p>
                  <div
                    class="border border-dashed border-surface-800 rounded p-4 text-sm text-surface-400"
                  >
                    Scenario content for {{ section.label }} will appear here.
                  </div>
                </div>
              }
            }
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class ScenarioIfsComponent {
  sections: ScenarioSection[] = [
    {
      key: 'scenario-cases',
      label: 'Scenario Cases',
      description: 'Build base, upside, and downside cases for key drivers.',
    },
    {
      key: 'documentation',
      label: 'Documentation',
      description: 'Capture “what-if” logic, assumptions, and qualitative notes.',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'scenario-cases';
}
