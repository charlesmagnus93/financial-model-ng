import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PharmaModelService } from '../../services/pharma-model.service';

@Component({
  standalone: true,
  selector: 'projection-widget',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: ` <div class="card space-y-4">
    <div class="text-xl font-semibold">Projection Horizon</div>
    <form [formGroup]="form">
      <div class="grid grid-cols-12 gap-4 items-end">
        <div class="col-span-12 md:col-span-6">
          <div class="text-sm font-semibold mb-1">Start Year</div>
          <select
            class="p-inputtext w-full bg-surface-900 text-surface-50 border border-surface-700 rounded-md py-2 px-3"
            formControlName="startYear"
            (change)="onProjectionChange()"
          >
            <option [ngValue]="null">Select year</option>
            @for (year of startYearOptions; track year) {
            <option [value]="year">{{ year }}</option>
            }
          </select>
        </div>
        <div class="col-span-12 md:col-span-6">
          <div class="text-sm font-semibold mb-1">End Year</div>
          <select
            class="p-inputtext w-full bg-surface-900 text-surface-50 border border-surface-700 rounded-md py-2 px-3"
            formControlName="endYear"
            (change)="onProjectionChange()"
          >
            <option [ngValue]="null">Select year</option>
            @for (year of startYearOptions; track year) {
            <option [value]="year">{{ year }}</option>
            }
          </select>
        </div>
      </div>
    </form>
  </div>`,
})
export class ProjectionWidget {

  form: FormGroup;
  
  activeTab = 'projection';
  years: number[] = [];
  startYear: number | null = null;
  endYear: number | null = null;
  startYearOptions = this.buildYearRange(1900, 2300);

  constructor(private pharmaModelService: PharmaModelService) {
    const input = this.pharmaModelService.getInputSnapshot();
    this.years = Array.isArray(input?.years) ? input.years : [];
    if (this.years.length > 0) {
      this.startYear = this.years[0];
      this.endYear = this.years[this.years.length - 1];
    }

    this.form = new FormGroup({
      startYear: new FormControl(this.startYear),
      endYear: new FormControl(this.endYear),
    });
  }

  onProjectionChange(): void {
    this.startYear = this.form.get('startYear')?.value;
    this.endYear = this.form.get('endYear')?.value;
    this.updateYears();
  }

  private buildYearRange(min: number, max: number): number[] {
    const list: number[] = [];
    for (let y = min; y <= max; y++) {
      list.push(y);
    }
    return list;
  }

  private updateYears(): void {
    const start = Number(this.startYear);
    const end = Number(this.endYear);
    const actualStart = Number.isFinite(start) ? start : new Date().getFullYear();
    const actualEnd = Number.isFinite(end) ? end : actualStart;
    const min = Math.min(actualStart, actualEnd);
    const max = Math.max(actualStart, actualEnd);
    const years: number[] = [];
    for (let y = min; y <= max; y++) {
      years.push(y);
    }
    this.pharmaModelService.patchInput({ years });
  }
}
