import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  standalone: true,
  selector: 'biotech-start-here-guided-setup-fieldset',
  imports: [CommonModule, FieldsetModule],
  template: `
    <p-fieldset legend="Start here: guided setup" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <ol class="list-decimal pl-6 text-sm flex flex-col gap-2">
          <li>Confirm the pipeline stage taxonomy.</li>
          <li>Set general assumptions (years, tax, working capital).</li>
          <li>Load a template or enter product assumptions.</li>
          <li>Run the model and review dashboard + scenarios.</li>
        </ol>
        <p class="text-xs text-surface-500">
          Use this checklist to keep inputs consistent and audit-ready.
        </p>
      </div>
    </p-fieldset>
  `,
})
export class BiotechStartHereGuidedSetupFieldsetComponent {}
