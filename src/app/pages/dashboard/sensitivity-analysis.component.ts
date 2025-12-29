import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SensitivityConfigWidget } from './components/sensitivityconfigwidget';
import { SensitivityAnalysisWidget } from './components/sensitivityanalysiswidget';
import { DiscountRateWidget } from './components/discountratewidget';
import { RawMaterialCostWidget } from './components/rawmaterialcostwidget';
import { TabletPriceWidget } from './components/tabletpricewidget';

interface SensitivitySection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-sensitivity-analysis',
  imports: [
    CommonModule,
    TabsModule,
    SensitivityConfigWidget,
    SensitivityAnalysisWidget,
    DiscountRateWidget,
    RawMaterialCostWidget,
    TabletPriceWidget,
  ],
  template: `
    <p-tabs [(value)]="activeTab" class="w-full" scrollable>
      <p-tablist>
        @for (section of sections; track section.key) {
          <p-tab [value]="section.key" class="whitespace-nowrap">
            {{ section.label }}
          </p-tab>
        }
      </p-tablist>

      <p-tabpanels>
        @for (section of sections; track section.key) {
          <p-tabpanel [value]="section.key">
            @switch (section.key) {
              @case ('sensitivity-analysis') {
                <sensitivity-analysis-widget></sensitivity-analysis-widget>
              }
              @case ('sensitivity-configuration') {
                <sensitivity-config-widget></sensitivity-config-widget>
              }
              @case ('discount-rate') {
                <discount-rate-widget></discount-rate-widget>
              }
              @case ('raw-material-cost') {
                <raw-material-cost-widget></raw-material-cost-widget>
              }
              @case ('tablet-price') {
                <tablet-price-widget></tablet-price-widget>
              }
              @default {
                <sensitivity-analysis-widget></sensitivity-analysis-widget>
              }
            }
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class SensitivityAnalysisComponent {
  sections: SensitivitySection[] = [
    {
      key: 'sensitivity-analysis',
      label: 'Sensitivity Analysis',
    },
    {
      key: 'sensitivity-configuration',
      label: 'Sensitivity Analysis Configuration',
    },
    {
      key: 'discount-rate',
      label: 'Discount Rate',
    },
    {
      key: 'raw-material-cost',
      label: 'Raw Material Cost',
    },
    {
      key: 'tablet-price',
      label: 'Tablet Price',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'sensitivity-analysis';
}
