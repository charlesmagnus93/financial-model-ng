import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakEvenPaybackInputsWidget } from './components/breakevenpaybackinputswidget';
import { PaybackScheduleWidget } from './components/paybackschedulewidget';
import { DiscountedPaybackScheduleWidget } from './components/discountedpaybackschedulewidget';

@Component({
  standalone: true,
  selector: 'app-break-even-payback',
  imports: [
    CommonModule,
    BreakEvenPaybackInputsWidget,
    PaybackScheduleWidget,
    DiscountedPaybackScheduleWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <breakeven-payback-inputs-widget></breakeven-payback-inputs-widget>
      <payback-schedule-widget></payback-schedule-widget>
      <discounted-payback-schedule-widget></discounted-payback-schedule-widget>
    </div>
  `,
})
export class BreakEvenPaybackComponent {
}
