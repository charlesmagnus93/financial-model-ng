import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

interface BreakevenSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-break-even-payback',
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
            @switch (section.key) {
              @case ('breakeven-payback') {
                <div class="card">
                  <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
                  <p class="text-sm text-surface-400 mb-3">
                    {{ section.description }}
                  </p>
                  <div
                    class="border border-dashed border-surface-800 rounded p-4 text-sm text-surface-400"
                  >
                    Content for {{ section.label }} will appear here.
                  </div>
                </div>
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
                    Content for {{ section.label }} will appear here.
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
export class BreakEvenPaybackComponent {
  sections: BreakevenSection[] = [
    {
      key: 'breakeven-payback',
      label: 'Break-even & Payback',
      description: 'Breakeven volumes, margins, and cash payback timelines.',
    },
    {
      key: 'notes',
      label: 'Notes & Assumptions',
      description: 'Document breakeven assumptions and sensitivity commentary.',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'breakeven-payback';
}
