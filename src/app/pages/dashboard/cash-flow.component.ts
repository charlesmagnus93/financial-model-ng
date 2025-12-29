import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { StatementCashFlowWidget } from './components/statementcashflowwidget';
import { CashFlowAnalyticalTrendsWidget } from './components/cashflowanalyticaltrendswidget';

interface CashFlowSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-cash-flow',
  imports: [
    CommonModule,
    TabsModule,
    StatementCashFlowWidget,
    CashFlowAnalyticalTrendsWidget,
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
              @case ('statement-cash-flow') {
                <statement-cash-flow-widget></statement-cash-flow-widget>
              }
              @case ('analytical-trends') {
                <cash-flow-analytical-trends-widget></cash-flow-analytical-trends-widget>
              }
              @default {
                <statement-cash-flow-widget></statement-cash-flow-widget>
              }
            }
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class CashFlowComponent {
  sections: CashFlowSection[] = [
    {
      key: 'statement-cash-flow',
      label: 'Statement of Cash Flows'
    },
    {
      key: 'analytical-trends',
      label: 'Analytical Trends'
    },
  ];

  activeTab = this.sections[0]?.key ?? 'statement-cash-flow';
}
