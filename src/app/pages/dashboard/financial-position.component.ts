import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementFinancialPositionWidget } from './components/statementfinancialpositionwidget';
import { AnalyticalTrendsWidget } from './components/analyticaltrendswidget';

@Component({
  standalone: true,
  selector: 'app-financial-position',
  imports: [
    CommonModule,
    StatementFinancialPositionWidget,
    AnalyticalTrendsWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <statement-financial-position-widget></statement-financial-position-widget>
      <analytical-trends-widget></analytical-trends-widget>
    </div>
  `,
})
export class FinancialPositionComponent {
}
