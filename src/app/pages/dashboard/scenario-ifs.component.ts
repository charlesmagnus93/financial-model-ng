import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';
import { GoalSeekConfigurationWidget } from './components/goalseekconfigurationwidget';
import { ScenarioConfigurationWidget } from './components/scenarioconfigurationwidget';
import { ScenarioToolConfigurationWidget } from './components/scenariotoolconfigurationwidget';
import { StressTestingWidget } from './components/stresstestingwidget';
import { BacktestingWidget } from './components/backtestingwidget';
import { WalkForwardTestingWidget } from './components/walkforwardtestingwidget';
import { DriverBasedModelingWidget } from './components/driverbasedmodelingwidget';
import { RoaWidget } from './components/roawidget';
import { BaseCaseForecastingWidget } from './components/basecaseforecastingwidget';
import { BestCaseForecastingWidget } from './components/bestcaseforecastingwidget';
import { WorstCaseForecastingWidget } from './components/worstcaseforecastingwidget';

@Component({
  standalone: true,
  selector: 'app-scenario-ifs',
  imports: [
    CommonModule,
    // ScenarioAnalysisWidget,
    GoalSeekConfigurationWidget,
    ScenarioConfigurationWidget,
    ScenarioToolConfigurationWidget,
    StressTestingWidget,
    BacktestingWidget,
    WalkForwardTestingWidget,
    DriverBasedModelingWidget,
    RoaWidget,
    BaseCaseForecastingWidget,
    BestCaseForecastingWidget,
    WorstCaseForecastingWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <goal-seek-configuration-widget />
      <scenario-configuration-widget />
      <scenario-tool-configuration-widget />
      <stress-testing-widget />
      <backtesting-widget />
      <walk-forward-testing-widget />
      <driver-based-modeling-widget />
      <roa-widget />
      <base-case-forecasting-widget />
      <best-case-forecasting-widget />
      <worst-case-forecasting-widget />
    </div>
  `,
})
export class ScenarioIfsComponent {
}
