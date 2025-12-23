import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import inputData from '../../../../../input.json';

@Component({
  standalone: true,
  selector: 'projection-widget',
  imports: [CommonModule, FormsModule],
  template: ` <div class="card space-y-4">
    <div class="text-xl font-semibold">Projection Horizon</div>
    <div class="grid grid-cols-12 gap-4 items-end">
      <div class="col-span-12 md:col-span-6">
        <div class="text-sm font-semibold mb-1">Start Year</div>
        <select
          class="p-inputtext w-full bg-surface-900 text-surface-50 border border-surface-700 rounded-md py-2 px-3"
          [(ngModel)]="startYear"
        >
          @for (year of startYearOptions; track year) {
          <option [value]="year">{{ year }}</option>
          }
        </select>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div class="text-sm font-semibold mb-1">End Year</div>
        <select
          class="p-inputtext w-full bg-surface-900 text-surface-50 border border-surface-700 rounded-md py-2 px-3"
          [(ngModel)]="endYear"
        >
          @for (year of startYearOptions; track year) {
          <option [value]="year">{{ year }}</option>
          }
        </select>
      </div>
    </div>
  </div>`,
})
export class ProjectionWidget {
  activeTab = 'projection';
  years: number[] = inputData.years ?? [];
  startYear: number = this.years[0] ?? new Date().getFullYear();
  endYear: number = this.years[this.years.length - 1] ?? this.startYear;
  startYearOptions = this.buildYearRange(1900, 2300);

  private buildYearRange(min: number, max: number): number[] {
    const list: number[] = [];
    for (let y = min; y <= max; y++) {
      list.push(y);
    }
    return list;
  }
}
