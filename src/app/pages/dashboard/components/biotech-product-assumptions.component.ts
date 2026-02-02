import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiotechProductAssumptionsFieldsetComponent } from './biotech-product-assumptions-fieldset.component';
import { BiotechProductVaccineMarketFieldsetComponent } from './biotech-product-vaccine-market-fieldset.component';
import { BiotechProductVaccineRevenueFieldsetComponent } from './biotech-product-vaccine-revenue-fieldset.component';
import { BiotechProductVaccineCostFieldsetComponent } from './biotech-product-vaccine-cost-fieldset.component';
import { BiotechProductVaccineResearchDevFieldsetComponent } from './biotech-product-vaccine-research-dev-fieldset.component';
import { BiotechProductVaccineCapexFieldsetComponent } from './biotech-product-vaccine-capex-fieldset.component';
import { BiotechProductVaccineRoyaltyRevenuesFieldsetComponent } from './biotech-product-vaccine-royalty-revenues-fieldset.component';
import { BiotechProductVaccineMarketShareFieldsetComponent } from './biotech-product-vaccine-market-share-fieldset.component';
import { BiotechProductVaccinesFieldsetComponent } from './biotech-product-vaccines-fieldset.component';

@Component({
  standalone: true,
  selector: 'biotech-product-assumptions',
  imports: [
    CommonModule,
    BiotechProductAssumptionsFieldsetComponent,
    BiotechProductVaccineMarketFieldsetComponent,
    BiotechProductVaccineRevenueFieldsetComponent,
    BiotechProductVaccineCostFieldsetComponent,
    BiotechProductVaccineResearchDevFieldsetComponent,
    BiotechProductVaccineCapexFieldsetComponent,
    BiotechProductVaccineRoyaltyRevenuesFieldsetComponent,
    BiotechProductVaccineMarketShareFieldsetComponent,
    BiotechProductVaccinesFieldsetComponent,
  ],
  template: `
    <biotech-product-assumptions-fieldset></biotech-product-assumptions-fieldset>
    <biotech-product-vaccine-market-fieldset></biotech-product-vaccine-market-fieldset>
    <biotech-product-vaccine-revenue-fieldset></biotech-product-vaccine-revenue-fieldset>
    <biotech-product-vaccine-cost-fieldset></biotech-product-vaccine-cost-fieldset>
    <biotech-product-vaccine-research-dev-fieldset></biotech-product-vaccine-research-dev-fieldset>
    <biotech-product-vaccine-capex-fieldset></biotech-product-vaccine-capex-fieldset>
    <biotech-product-vaccine-royalty-revenues-fieldset></biotech-product-vaccine-royalty-revenues-fieldset>
    <biotech-product-vaccine-market-share-fieldset></biotech-product-vaccine-market-share-fieldset>
    <biotech-product-vaccines-fieldset></biotech-product-vaccines-fieldset>
  `,
})
export class BiotechProductAssumptionsComponent {}
