import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';

type StageRow = Record<string, any>;

@Component({
  standalone: true,
  selector: 'biotech-full-mapping-table-fieldset',
  imports: [CommonModule, FieldsetModule, TableModule],
  template: `
    <p-fieldset legend="Full mapping table (advanced)" [toggleable]="true" class="w-full">
      <div class="overflow-auto rounded" [style]="{ width: '75vw' }">
        <p-table 
          [value]="rows" 
          showGridlines 
          responsiveLayout="scroll"
          class="text-sm" 
          [scrollable]="true"
          [size]="'small'"
        >²
          <ng-template #header>
            <tr>
              <th>Stage</th>
              <th style="min-width:140px">Success Probability %</th>
              <th style="min-width:140px">Time to market (years)</th>
              <th style="min-width:160px">Sales ramp length (years)</th>
              <th style="min-width:100px">Ramp shape</th>
              <th style="min-width:200px">R&D remaining pre-launch (USD)</th>
              <th style="min-width:220px">R&D annual post-launch (USD/year)</th>
              <th style="min-width:190px">Discovery duration (years)</th>
              <th style="min-width:190px">Preclinical duration (years)</th>
              <th style="min-width:190px">Phase I duration (years)</th>
              <th style="min-width:180px">Phase II duration (years)</th>
              <th style="min-width:180px">Phase III duration (years)</th>
              <th style="min-width:180px">Approval duration (years)</th>
              <th style="min-width:190px">Commercial duration (years)</th>
              <th style="min-width:190px">Discovery R&D weight %</th>
              <th style="min-width:190px">Preclinical R&D weight %</th>
              <th style="min-width:180px">Phase I R&D weight %</th>
              <th style="min-width:180px">Phase II R&D weight %</th>
              <th style="min-width:180px">Phase III R&D weight %</th>
              <th style="min-width:190px">Approval R&D weight %</th>
              <th style="min-width:190px">Discovery CAPEX weight %</th>
              <th style="min-width:190px">Preclinical CAPEX weight %</th>
              <th style="min-width:190px">Phase I CAPEX weight %</th>
              <th style="min-width:180px">Phase II CAPEX weight %</th>
              <th style="min-width:180px">Phase III CAPEX weight %</th>
              <th style="min-width:180px">Approval CAPEX weight %</th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr>
              <td>{{ row['Stage'] }}</td>
              <td>{{ row['Success Probability %'] | number: '1.0' }}</td>
              <td>{{ row['Time to market (years)'] }}</td>
              <td>{{ row['Sales ramp length (years)'] }}</td>
              <td>{{ row['Ramp shape'] }}</td>
              <td>{{ row['R&D remaining pre-launch (USD)'] | number: '1.0-0' }}</td>
              <td>{{ row['R&D annual post-launch (USD/year)'] | number: '1.0-0' }}</td>
              <td>{{ row['Discovery duration (years)'] }}</td>
              <td>{{ row['Preclinical duration (years)'] }}</td>
              <td>{{ row['Phase I duration (years)'] }}</td>
              <td>{{ row['Phase II duration (years)'] }}</td>
              <td>{{ row['Phase III duration (years)'] }}</td>
              <td>{{ row['Approval duration (years)'] }}</td>
              <td>{{ row['Commercial duration (years)'] }}</td>
              <td>{{ row['Discovery R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Preclinical R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase I R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase II R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase III R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Approval R&D weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Discovery CAPEX weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Preclinical CAPEX weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase I CAPEX weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase II CAPEX weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Phase III CAPEX weight %'] | number: '1.2-2' }}</td>
              <td>{{ row['Approval CAPEX weight %'] | number: '1.2-2' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-fieldset>
  `,
})
export class BiotechFullMappingTableFieldsetComponent {
  @Input() rows: StageRow[] = [];
}
