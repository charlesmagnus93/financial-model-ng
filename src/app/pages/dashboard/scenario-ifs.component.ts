import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ScenarioAnalysisWidget } from './components/scenarioanalysiswidget';
import { ButtonModule } from 'primeng/button';
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

interface ScenarioSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-scenario-ifs',
  imports: [
    CommonModule,
    TabsModule,
    ScenarioAnalysisWidget,
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
    ButtonModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <p-button
          label="Back"
          icon="pi pi-arrow-left"
          variant="outlined"
          severity="secondary"
          [disabled]="isFirstSection"
          (click)="goToPrevious()"
        ></p-button>
        <div class="text-sm text-surface-400">
          Section {{ currentSectionIndex + 1 }} of {{ sections.length }} -
          {{ currentSectionLabel }}
        </div>
        <p-button
          label="Next"
          icon="pi pi-arrow-right"
          iconPos="right"
          [disabled]="isLastSection"
          (click)="goToNext()"
        ></p-button>
      </div>

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
                @case ('goal-seek-configuration') {
                  <goal-seek-configuration-widget />
                }
                @case ('scenario-configuration') {
                  <scenario-configuration-widget />
                }
                @case ('scenario-tool-configuration') {
                  <scenario-tool-configuration-widget />
                }
                @case ('stress-testing') {
                  <stress-testing-widget />
                }
                @case ('back-testing') {
                  <backtesting-widget />
                }
                @case ('walk-forward-testing') {
                  <walk-forward-testing-widget />
                }
                @case ('driver-based-modeling') {
                  <driver-based-modeling-widget />
                }
                @case ('ROA') {
                  <roa-widget />
                }
                @case ('base-case-forecasting') {
                  <base-case-forecasting-widget />
                }
                @case ('best-case-forecasting') {
                  <best-case-forecasting-widget />
                }
                @case ('worst-case-forecasting') {
                  <worst-case-forecasting-widget />
                }
                @default {
                  <div class="card">
                    <div class="text-lg font-semibold mb-2">{{ section.label }}</div>
                    <p class="text-sm text-surface-400 mb-3">
                      {{ section.description }}
                    </p>
                    <div
                      class="border border-dashed border-surface-800 rounded p-4 text-sm text-surface-400"
                    >
                      Scenario content for {{ section.label }} will appear here.
                    </div>
                  </div>
                }
              }
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class ScenarioIfsComponent {
  sections: ScenarioSection[] = [
    {
      key: 'goal-seek-configuration',
      label: 'Goal Seek Configuration',
    },
    {
      key: 'scenario-configuration',
      label: 'Scenario / IFs Configuration',
    },
    {
      key: 'scenario-tool-configuration',
      label: 'Scenario Tool Configuration',
    },
    {
      key: 'stress-testing',
      label: 'Stress Testing',
    },
    {
      key: 'back-testing',
      label: 'Backtesting',
    },
    {
      key: 'walk-forward-testing',
      label: 'Walk-forward Testing',
    },
    {
      key: 'driver-based-modeling',
      label: 'Driver-based Modeling',
    },
    {
      key: 'ROA',
      label: 'Real Options Analysis (ROA)',
    },
    {
      key: 'base-case-forecasting',
      label: 'Base Case Forecasting',
    },
    {
      key: 'best-case-forecasting',
      label: 'Best Case Forecasting',
    },
    {
      key: 'worst-case-forecasting',
      label: 'Worst Case Forecasting',
    },
  ];

  activeTab = this.sections[0]?.key ?? 'scenario-cases';

  get currentSectionIndex(): number {
    return this.sections.findIndex((section) => section.key === this.activeTab);
  }

  get currentSectionLabel(): string {
    return this.sections[this.currentSectionIndex]?.label ?? '';
  }

  get isFirstSection(): boolean {
    return this.currentSectionIndex <= 0;
  }

  get isLastSection(): boolean {
    return this.currentSectionIndex >= this.sections.length - 1;
  }

  goToPrevious(): void {
    const prevIndex = this.currentSectionIndex - 1;
    if (prevIndex >= 0) {
      this.activeTab = this.sections[prevIndex].key;
    }
  }

  goToNext(): void {
    const nextIndex = this.currentSectionIndex + 1;
    if (nextIndex < this.sections.length) {
      this.activeTab = this.sections[nextIndex].key;
    }
  }
}
