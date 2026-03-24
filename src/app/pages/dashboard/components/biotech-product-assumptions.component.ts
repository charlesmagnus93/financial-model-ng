import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiotechProductAssumptionsFieldsetComponent } from './biotech-product-assumptions-fieldset.component';
import { BiotechProductVaccineResearchDevFieldsetComponent } from './biotech-product-vaccine-research-dev-fieldset.component';
import { BiotechProductVaccineCapexFieldsetComponent } from './biotech-product-vaccine-capex-fieldset.component';
import { BiotechProductTemplateLibraryFieldsetComponent } from './biotech-product-template-library-fieldset.component';
import { BiotechProductFullProfilesFieldsetComponent } from './biotech-product-full-profiles-fieldset.component';

@Component({
  standalone: true,
  selector: 'biotech-product-assumptions',
  imports: [
    CommonModule,
    BiotechProductAssumptionsFieldsetComponent,
    BiotechProductVaccineResearchDevFieldsetComponent,
    BiotechProductVaccineCapexFieldsetComponent,
    BiotechProductTemplateLibraryFieldsetComponent,
    BiotechProductFullProfilesFieldsetComponent,
  ],
  template: `
    <biotech-product-assumptions-fieldset></biotech-product-assumptions-fieldset>
    <biotech-product-vaccine-research-dev-fieldset></biotech-product-vaccine-research-dev-fieldset>
    <biotech-product-vaccine-capex-fieldset></biotech-product-vaccine-capex-fieldset>
    <biotech-product-template-library-fieldset
      (templateRowsLoaded)="onTemplateRowsLoaded($event)"
    ></biotech-product-template-library-fieldset>
    <biotech-product-full-profiles-fieldset
      [tableOverrideRows]="templatePreviewRows"
    ></biotech-product-full-profiles-fieldset>
  `,
})
export class BiotechProductAssumptionsComponent {
  templatePreviewRows: any[] = [];

  onTemplateRowsLoaded(rows: any[]): void {
    this.templatePreviewRows = Array.isArray(rows) ? [...rows] : [];
  }
}
