import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

interface MonteCarloSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-simulation-montecarlo',
  imports: [CommonModule, TabsModule],
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
            <div class="card">
              <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
              <p class="text-sm text-surface-400 mb-3">
                {{ section.description }}
              </p>
              <div
                class="border border-dashed border-surface-800 rounded p-4 text-sm text-surface-400"
              >
                Monte Carlo content for {{ section.label }} will appear here.
              </div>
            </div>
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class MonteCarloSimulationComponent {
  sections: MonteCarloSection[] = [
    {
      key: 'simulation-setup',
      label: 'Simulation Setup',
      description: 'Define distributions, iterations, and sampling approach.',
    },
    {
      key: 'simulation-results',
      label: 'Results & Insights',
      description: 'View percentile outcomes, tornado charts, and key drivers.',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'simulation-setup';
}
