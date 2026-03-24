import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiotechConsolidatedForecastComponent } from './components/biotech-consolidated-forecast.component';
import { BiotechFinancialPerformanceComponent } from './components/biotech-financial-performance.component';
import { BiotechFinancialPositionComponent } from './components/biotech-financial-position.component';
import { BiotechCashFlowComponent } from './components/biotech-cash-flow.component';
import { BiotechDebtScheduleComponent } from './components/biotech-debt-schedule.component';
import { BiotechExcelModelDownloadComponent } from './components/biotech-excel-model-download.component';

@Component({
  standalone: true,
  selector: 'app-biotech-financial-statements',
  imports: [
    CommonModule,
    BiotechConsolidatedForecastComponent,
    BiotechFinancialPerformanceComponent,
    BiotechFinancialPositionComponent,
    BiotechCashFlowComponent,
    BiotechDebtScheduleComponent,
    BiotechExcelModelDownloadComponent,
  ],
  template: `
    <app-biotech-consolidated-forecast></app-biotech-consolidated-forecast>
    <app-biotech-financial-performance></app-biotech-financial-performance>
    <app-biotech-financial-position></app-biotech-financial-position>
    <app-biotech-cash-flow></app-biotech-cash-flow>
    <app-biotech-debt-schedule></app-biotech-debt-schedule>
    <app-biotech-excel-model-download></app-biotech-excel-model-download>
  `,
})
export class BiotechFinancialStatementsComponent {}
