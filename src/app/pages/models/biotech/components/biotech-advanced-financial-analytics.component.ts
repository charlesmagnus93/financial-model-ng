import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiotechMarginIntensityComponent } from './biotech-margin-intensity.component';
import { BiotechSensitivityStressTestingComponent } from './biotech-sensitivity-stress-testing.component';
import { BiotechTrendSeasonalityComponent } from './biotech-trend-seasonality.component';
import { BiotechMonteCarloProbabilisticComponent } from './biotech-monte-carlo-probabilistic.component';
import { BiotechWhatIfGoalSeekComponent } from './biotech-what-if-goal-seek.component';
import { BiotechTornadoDiagnosticsComponent } from './biotech-tornado-diagnostics.component';
import { BiotechRegressionClassificationComponent } from './biotech-regression-classification.component';
import { BiotechTimeSeriesForecastComponent } from './biotech-time-series-forecast.component';
import { BiotechOptimizationPortfolioComponent } from './biotech-optimization-portfolio.component';
import { BiotechRiskMacroEsgComponent } from './biotech-risk-macro-esg.component';
import { BiotechComparativeMlValuationComponent } from './biotech-comparative-ml-valuation.component';

@Component({
  standalone: true,
  selector: 'app-biotech-advanced-financial-analytics',
  imports: [
    CommonModule,
    BiotechMarginIntensityComponent,
    BiotechSensitivityStressTestingComponent,
    BiotechTrendSeasonalityComponent,
    BiotechMonteCarloProbabilisticComponent,
    BiotechWhatIfGoalSeekComponent,
    BiotechTornadoDiagnosticsComponent,
    BiotechRegressionClassificationComponent,
    BiotechTimeSeriesForecastComponent,
    BiotechOptimizationPortfolioComponent,
    BiotechRiskMacroEsgComponent,
    BiotechComparativeMlValuationComponent,
  ],
  template: `
    <app-biotech-margin-intensity></app-biotech-margin-intensity>
    <app-biotech-sensitivity-stress-testing></app-biotech-sensitivity-stress-testing>
    <app-biotech-trend-seasonality></app-biotech-trend-seasonality>
    <app-biotech-monte-carlo-probabilistic></app-biotech-monte-carlo-probabilistic>
    <app-biotech-what-if-goal-seek></app-biotech-what-if-goal-seek>
    <app-biotech-tornado-diagnostics></app-biotech-tornado-diagnostics>
    <app-biotech-regression-classification></app-biotech-regression-classification>
    <app-biotech-time-series-forecast></app-biotech-time-series-forecast>
    <app-biotech-optimization-portfolio></app-biotech-optimization-portfolio>
    <app-biotech-risk-macro-esg></app-biotech-risk-macro-esg>
    <app-biotech-comparative-ml-valuation></app-biotech-comparative-ml-valuation>
  `,
})
export class BiotechAdvancedFinancialAnalyticsComponent {}

