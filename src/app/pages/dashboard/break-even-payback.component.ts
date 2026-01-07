import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { BreakEvenPaybackInputsWidget } from './components/breakevenpaybackinputswidget';
import { PaybackScheduleWidget } from './components/paybackschedulewidget';
import { DiscountedPaybackScheduleWidget } from './components/discountedpaybackschedulewidget';

interface BreakevenSection {
  key: string;
  label: string;
  description?: string;
}

@Component({
  standalone: true,
  selector: 'app-break-even-payback',
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    BreakEvenPaybackInputsWidget,
    PaybackScheduleWidget,
    DiscountedPaybackScheduleWidget,
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
                @case ('breakeven-analyisis') {
                  <breakeven-payback-inputs-widget></breakeven-payback-inputs-widget>
                }
                @case ('payback-schedule') {
                  <payback-schedule-widget></payback-schedule-widget>
                }
                @case ('discounted-payback-schedule') {
                  <discounted-payback-schedule-widget></discounted-payback-schedule-widget>
                }
                @default {
                  <breakeven-payback-inputs-widget></breakeven-payback-inputs-widget>
                }
              }
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class BreakEvenPaybackComponent {
  sections: BreakevenSection[] = [
    {
      key: 'breakeven-analyisis',
      label: 'Break-even Analysis Inputs'
    },
    {
      key: 'payback-schedule',
      label: 'Payback Schedule'
    },
    {
      key: 'discounted-payback-schedule',
      label: 'Discounted Payback Schedule'
    },
  ];

  activeTab = this.sections[0]?.key ?? 'breakeven-analyisis';

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
