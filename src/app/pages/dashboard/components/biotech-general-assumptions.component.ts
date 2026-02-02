import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  constructor() {}
}
