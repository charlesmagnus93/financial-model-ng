import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensitivityConfigWidget } from './components/sensitivityconfigwidget';
import { SensitivityAnalysisWidget } from './components/sensitivityanalysiswidget';
import { DiscountRateWidget } from './components/discountratewidget';
import { RawMaterialCostWidget } from './components/rawmaterialcostwidget';
import { TabletPriceWidget } from './components/tabletpricewidget';

@Component({
  standalone: true,
  selector: 'app-sensitivity-analysis',
  imports: [
    CommonModule,
    SensitivityConfigWidget,
    SensitivityAnalysisWidget,
    DiscountRateWidget,
    RawMaterialCostWidget,
    TabletPriceWidget,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <sensitivity-analysis-widget></sensitivity-analysis-widget>
      <sensitivity-config-widget></sensitivity-config-widget>
      <discount-rate-widget></discount-rate-widget>
      <raw-material-cost-widget></raw-material-cost-widget>
      <tablet-price-widget></tablet-price-widget>
    </div>
  `,
})
export class SensitivityAnalysisComponent {
}
