import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmaModelService } from '../../services/pharma-model.service';
import { BiotechModelService } from '../../services/biotech-model.service';
import { BiotechForecastAssumptionsFieldsetComponent } from './biotech-forecast-assumptions-fieldset.component';
import { BiotechGeneralAssumptionsFieldsetComponent } from './biotech-general-assumptions-fieldset.component';
import { BiotechVaccineSalesAssumptionsFieldsetComponent } from "./biotech-vaccine-sales-assumptions-fieldset.component";
import { BiotechUsesSourcesFundsAssumptionsFieldsetComponent } from "./biotech-uses-sources-funds-assumptions-fieldset.component";
import { BiotechRiskAdjustedDcfAssumptionsFieldsetComponent } from "./biotech-risk-adjusted-dcf-assumptions-fieldset.component";
import { BiotechFundingRequiredAssumptionsFieldsetComponent } from "./biotech-funding-required-assumptions-fieldset.component";
import { BiotechShareholdersInvestorsRequiredAssumptionsFieldsetComponent } from "./biotech-shareholders-investors-required-assumptions-fieldset.component";
import { BiotechRelevantMarketSizesAssumptionsFieldsetComponent } from "./biotech-relevant-market-sizes-assumptions-fieldset.component";
import { BiotechNewEquityIssuedAssumptionsFieldsetComponent } from "./biotech-new-equity-issued-assumptions-fieldset.component";
import { BiotechSelectorsAssumptionsFieldsetComponent } from "./biotech-selectors-assumptions-fieldset.component";

@Component({
  standalone: true,
  selector: 'biotech-general-assumptions',
  imports: [
    CommonModule,
    BiotechForecastAssumptionsFieldsetComponent,
    BiotechGeneralAssumptionsFieldsetComponent,
    BiotechVaccineSalesAssumptionsFieldsetComponent,
    BiotechUsesSourcesFundsAssumptionsFieldsetComponent,
    BiotechRiskAdjustedDcfAssumptionsFieldsetComponent,
    BiotechFundingRequiredAssumptionsFieldsetComponent,
    BiotechShareholdersInvestorsRequiredAssumptionsFieldsetComponent,
    BiotechRelevantMarketSizesAssumptionsFieldsetComponent,
    BiotechNewEquityIssuedAssumptionsFieldsetComponent,
    BiotechSelectorsAssumptionsFieldsetComponent
  ],
  template: `
    <!-- @if (!hasInputData()) {
      <div class="mb-4 rounded border border-surface-700 bg-surface-900/60 p-3 text-xs text-surface-300">
        Forms are empty. Click Use Defaults to load data.
      </div>
    } -->
    <biotech-general-assumptions-fieldset></biotech-general-assumptions-fieldset>
    <biotech-forecast-assumptions-fieldset></biotech-forecast-assumptions-fieldset>
    <biotech-vaccine-sales-assumptions-fieldset></biotech-vaccine-sales-assumptions-fieldset>
    <biotech-uses-sources-funds-assumptions-fieldset></biotech-uses-sources-funds-assumptions-fieldset>
    <biotech-risk-adjusted-dcf-assumptions-fieldset></biotech-risk-adjusted-dcf-assumptions-fieldset>
    <biotech-funding-required-assumptions-fieldset></biotech-funding-required-assumptions-fieldset>
    <biotech-shareholders-investors-required-assumptions-fieldset></biotech-shareholders-investors-required-assumptions-fieldset>
    <biotech-relevant-market-sizes-assumptions-fieldset></biotech-relevant-market-sizes-assumptions-fieldset>
    <biotech-new-equity-issued-assumptions-fieldset></biotech-new-equity-issued-assumptions-fieldset>
    <biotech-selectors-assumptions-fieldset></biotech-selectors-assumptions-fieldset>
  `,
})
export class BiotechGeneralAssumptionsComponent {
  constructor(private biotechModelService: BiotechModelService) {}

  hasInputData(): boolean {
    const snapshot = this.biotechModelService.getInputSnapshot();
    return snapshot && Object.keys(snapshot).length > 0;
  }
}
