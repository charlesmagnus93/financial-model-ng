import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonteCarloSimulationWidget } from './components/montecarlosimulationwidget';

@Component({
  standalone: true,
  selector: 'app-simulation-montecarlo',
  imports: [CommonModule, MonteCarloSimulationWidget],
  template: `
    <div class="flex flex-col gap-4">
      <monte-carlo-simulation-widget />
    </div>
  `,
})
export class MonteCarloSimulationComponent {
}
