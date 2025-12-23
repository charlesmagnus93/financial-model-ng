import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-chart-view',
  imports: [NgChartsModule],
  template: `
    <div class="card w-full">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <ng-content select="[chart-actions]"></ng-content>
      </div>
      <div class="h-80">
        <canvas
          baseChart
          [type]="type"
          [data]="data"
          [options]="options"
          class="w-full h-full"
        ></canvas>
      </div>
    </div>
  `,
})
export class ChartViewComponent {
  @Input() title = '';
  @Input() type: ChartType = 'bar';
  @Input() data: ChartConfiguration['data'] = { labels: [], datasets: [] };
  @Input() options: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  refresh(): void {
    this.chart?.update();
  }
}
