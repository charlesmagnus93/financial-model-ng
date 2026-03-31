import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';

interface AuditEntry {
  timestamp: string;
  action?: string;
  stage?: string;
  owner?: string;
  updated_by?: string;
  note?: string;
}

interface AuditTableRow {
  timestamp: string;
  updated_by: string;
  note: string;
}

@Component({
  standalone: true,
  selector: 'biotech-mapping-audit-trail-fieldset',
  imports: [CommonModule, FieldsetModule, TableModule],
  template: `
    <p-fieldset legend="Mapping audit trail" [toggleable]="true" class="w-full">
      @if (entries.length) {
        <div class="overflow-auto rounded">
          <p-table [value]="tableRows" showGridlines class="text-sm" [size]="'small'">
            <ng-template #header>
              <tr>
                <th style="width: 3rem"></th>
                <th>timestamp</th>
                <th>updated_by</th>
                <th>note</th>
              </tr>
            </ng-template>
            <ng-template #body let-row let-rowIndex="rowIndex">
              <tr>
                <td class="text-right">{{ rowIndex }}</td>
                <td>{{ row.timestamp }}</td>
                <td>{{ row.updated_by }}</td>
                <td>{{ row.note }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      } @else {
        <p class="text-xs text-surface-500">No mapping audit entries yet.</p>
      }
    </p-fieldset>
  `,
})
export class BiotechMappingAuditTrailFieldsetComponent {
  @Input() entries: AuditEntry[] = [];

  get tableRows(): AuditTableRow[] {
    return this.entries.map((entry) => {
      const timestamp = String(entry?.timestamp ?? '').trim();
      const updatedBy = String(entry?.updated_by ?? entry?.owner ?? '').trim();
      const note = String(entry?.note ?? entry?.action ?? '').trim();
      return {
        timestamp,
        updated_by: updatedBy,
        note,
      };
    });
  }
}

