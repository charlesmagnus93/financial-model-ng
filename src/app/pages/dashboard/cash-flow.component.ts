import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementCashFlowWidget } from './components/statementcashflowwidget';
import { CashFlowAnalyticalTrendsWidget } from './components/cashflowanalyticaltrendswidget';

@Component({
  standalone: true,
  selector: 'app-cash-flow',
  imports: [
    CommonModule,
    StatementCashFlowWidget,
    CashFlowAnalyticalTrendsWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <statement-cash-flow-widget></statement-cash-flow-widget>
      <cash-flow-analytical-trends-widget></cash-flow-analytical-trends-widget>
    </div>
  `,
})
export class CashFlowComponent {
}
