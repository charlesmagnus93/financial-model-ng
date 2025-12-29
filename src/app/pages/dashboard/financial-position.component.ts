import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StatementFinancialPositionWidget } from './components/statementfinancialpositionwidget';
import { AnalyticalTrendsWidget } from './components/analyticaltrendswidget';

interface PositionSection {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-financial-position',
  imports: [
    CommonModule,
    TabsModule,
    StatementFinancialPositionWidget,
    AnalyticalTrendsWidget,
  ],
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
            @case ('statement-financial-position') {
              <statement-financial-position-widget></statement-financial-position-widget>
            }
            @case ('analytical-trends') {
              <analytical-trends-widget></analytical-trends-widget>
            }
            @default {
              <statement-financial-position-widget></statement-financial-position-widget>
            }
          }
        </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class FinancialPositionComponent {
  sections: PositionSection[] = [
    {
      key: 'statement-financial-position',
      label: 'Statement of Financial Position',
    },
    {
      key: 'analytical-trends',
      label: 'Analytical Trends',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'statement-financial-position';
}
