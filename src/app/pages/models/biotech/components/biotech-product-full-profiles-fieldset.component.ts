import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../../services/biotech-model.service';
import { Subject, take, takeUntil } from 'rxjs';

interface VaccineProductRow {
  id: string;
  name: string;
  stage: string;
  success_prob: number;
  include_in_consolidation: boolean;
  time_to_market: number;
  patent_years: number;
  patent_revenue_target: number;
  post_patent_revenue_target: number;
  market_growth_patent: number;
  market_growth_post: number;
  cogs_patent: number;
  cogs_post: number;
  labor_pct: number;
  overhead_pct: number;
  material_pct: number;
  sales_marketing_pct: number;
  gna_pct: number;
  rd_remaining_pre_launch: number;
  rd_annual_post_launch: number;
  capex_remaining_pre_launch: number;
  capex_annual_post_launch: number;
}

interface IncrementHelper {
  column:
    | 'success_prob'
    | 'time_to_market'
    | 'patent_years'
    | 'patent_revenue_target'
    | 'post_patent_revenue_target'
    | 'market_growth_patent'
    | 'market_growth_post'
    | 'cogs_patent'
    | 'cogs_post'
    | 'labor_pct'
    | 'overhead_pct'
    | 'material_pct'
    | 'sales_marketing_pct'
    | 'gna_pct'
    | 'rd_remaining_pre_launch'
    | 'rd_annual_post_launch'
    | 'capex_remaining_pre_launch'
    | 'capex_annual_post_launch';
  startRow: number;
  incrementPerYear: number;
  yearsToApply: number;
  compound: boolean;
}

interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

interface HelperColumnDefinition {
  sourceKey: string;
  label: string;
  value: IncrementHelper['column'];
}

@Component({
  standalone: true,
  selector: 'biotech-product-full-profiles-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset
      legend="Product full profiles"
      [toggleable]="true"
      class="w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [(ngModel)]="selectedRowId"
              (ngModelChange)="syncSelectedRow()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select product"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Edit selected row</div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 items-start">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
                  <label class="text-xs font-semibold">success_prob</label>
                  <p-inputnumber
                    formControlName="success_prob"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 pt-1 mt-1 mb-8">
                    <p-checkbox formControlName="include_in_consolidation" [binary]="true"></p-checkbox>
                    <span class="text-xs font-semibold">include_in_consolidation</span>
                  </div>
                  <label class="text-xs font-semibold">time_to_market</label>
                  <p-inputnumber
                    formControlName="time_to_market"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">patent_years</label>
                  <p-inputnumber
                    formControlName="patent_years"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">post_patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="post_patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_patent</label>
                  <p-inputnumber
                    formControlName="market_growth_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_post</label>
                  <p-inputnumber
                    formControlName="market_growth_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">cogs_patent</label>
                  <p-inputnumber
                    formControlName="cogs_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">cogs_post</label>
                  <p-inputnumber
                    formControlName="cogs_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">labor_pct</label>
                  <p-inputnumber
                    formControlName="labor_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">overhead_pct</label>
                  <p-inputnumber
                    formControlName="overhead_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">material_pct</label>
                  <p-inputnumber
                    formControlName="material_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">sales_marketing_pct</label>
                  <p-inputnumber
                    formControlName="sales_marketing_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">gna_pct</label>
                  <p-inputnumber
                    formControlName="gna_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="rd_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="rd_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="capex_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="capex_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
              </div>
              <p-button
                label="Save changes"
                size="small"
                [outlined]="true"
                (onClick)="saveSelectedRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="text-xs text-surface-600 font-semibold">Add a new row</div>
            <form [formGroup]="newRowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 items-start">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">name</label>
                  <input pInputText formControlName="name" class="w-full" />
                  <label class="text-xs font-semibold">stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
                  <label class="text-xs font-semibold">success_prob</label>
                  <p-inputnumber
                    formControlName="success_prob"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <div class="flex items-center gap-2 pt-1 mt-1 mb-8">
                    <p-checkbox formControlName="include_in_consolidation" [binary]="true"></p-checkbox>
                    <span class="text-xs font-semibold">include_in_consolidation</span>
                  </div>
                  <label class="text-xs font-semibold">time_to_market</label>
                  <p-inputnumber
                    formControlName="time_to_market"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">patent_years</label>
                  <p-inputnumber
                    formControlName="patent_years"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">post_patent_revenue_target</label>
                  <p-inputnumber
                    formControlName="post_patent_revenue_target"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_patent</label>
                  <p-inputnumber
                    formControlName="market_growth_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">market_growth_post</label>
                  <p-inputnumber
                    formControlName="market_growth_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">cogs_patent</label>
                  <p-inputnumber
                    formControlName="cogs_patent"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-semibold">cogs_post</label>
                  <p-inputnumber
                    formControlName="cogs_post"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">labor_pct</label>
                  <p-inputnumber
                    formControlName="labor_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">overhead_pct</label>
                  <p-inputnumber
                    formControlName="overhead_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">material_pct</label>
                  <p-inputnumber
                    formControlName="material_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">sales_marketing_pct</label>
                  <p-inputnumber
                    formControlName="sales_marketing_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">gna_pct</label>
                  <p-inputnumber
                    formControlName="gna_pct"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [max]="1"
                    [step]="0.01"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="rd_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">rd_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="rd_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_remaining_pre_launch</label>
                  <p-inputnumber
                    formControlName="capex_remaining_pre_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                  <label class="text-xs font-semibold">capex_annual_post_launch</label>
                  <p-inputnumber
                    formControlName="capex_annual_post_launch"
                    styleClass="w-full"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
                </div>
              </div>
              <p-button
                label="Add row"
                size="small"
                [outlined]="true"
                (onClick)="addRow()"
                fluid
              ></p-button>
            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <p class="text-xs text-surface-500">
                Apply a fixed change or % growth from a start year onward. "Increment per year" is
                the step size (or growth rate when compounding). "Years to apply" controls how many
                consecutive rows are updated.
              </p>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                [(ngModel)]="helper.column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Start row</label>
              <p-inputnumber
                [(ngModel)]="helper.startRow"
                [showButtons]="true"
                [min]="0"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerYear"
                [showButtons]="true"
                [step]="0.01"
                [minFractionDigits]="2"
                [maxFractionDigits]="2"
                inputStyleClass="w-full"
              />
              <label class="text-xs font-semibold">Years to apply</label>
              <p-inputnumber
                [(ngModel)]="helper.yearsToApply"
                [showButtons]="true"
                [min]="1"
                [useGrouping]="false"
                inputStyleClass="w-full"
              />
              <div class="flex items-center gap-2 mt-1">
                <p-checkbox [(ngModel)]="helper.compound" [binary]="true"></p-checkbox>
                <label class="text-xs font-semibold">
                  Compound annually (apply % growth)
                </label>
              </div>
              <p-button
                label="Apply increment"
                size="small"
                [outlined]="true"
                (onClick)="applyIncrement()"
                fluid
              ></p-button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-12 flex flex-col gap-2">
            <div class="overflow-x-auto rounded max-w-full">
              <p-table [value]="displayRows" [scrollable]="true" showGridlines class="text-sm w-full" [size]="'small'">
                <ng-template #header>
                  <tr>
                    <th style="min-width:150px">name</th>
                    <th style="min-width:150px">stage</th>
                    <th>success_prob</th>
                    <th>include_in_consolidation</th>
                    <th>time_to_market</th>
                    <th>patent_years</th>
                    <th>patent_revenue_target</th>
                    <th>post_patent_revenue_target</th>
                    <th>market_growth_patent</th>
                    <th>market_growth_post</th>
                    <th>cogs_patent</th>
                    <th>cogs_post</th>
                    <th>labor_pct</th>
                    <th>overhead_pct</th>
                    <th>material_pct</th>
                    <th>sales_marketing_pct</th>
                    <th>gna_pct</th>
                    <th>rd_remaining_pre_launch</th>
                    <th>rd_annual_post_launch</th>
                    <th>capex_remaining_pre_launch</th>
                    <th>capex_annual_post_launch</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.stage }}</td>
                    <td>{{ row.success_prob | number: '1.2-2' }}</td>
                    <td>
                      <i
                        class="pi"
                        [ngClass]="row.include_in_consolidation ? 'pi-check' : 'pi-times'"
                      ></i>
                    </td>
                    <td>{{ row.time_to_market }}</td>
                    <td>{{ row.patent_years }}</td>
                    <td>{{ row.patent_revenue_target | number: '1.0-0' }}</td>
                    <td>{{ row.post_patent_revenue_target | number: '1.0-0' }}</td>
                    <td>{{ row.market_growth_patent | number: '1.2-2' }}</td>
                    <td>{{ row.market_growth_post | number: '1.2-2' }}</td>
                    <td>{{ row.cogs_patent | number: '1.2-2' }}</td>
                    <td>{{ row.cogs_post | number: '1.2-2' }}</td>
                    <td>{{ row.labor_pct | number: '1.2-2' }}</td>
                    <td>{{ row.overhead_pct | number: '1.2-2' }}</td>
                    <td>{{ row.material_pct | number: '1.2-2' }}</td>
                    <td>{{ row.sales_marketing_pct | number: '1.2-2' }}</td>
                    <td>{{ row.gna_pct | number: '1.2-2' }}</td>
                    <td>{{ row.rd_remaining_pre_launch | number: '1.0-0' }}</td>
                    <td>{{ row.rd_annual_post_launch | number: '1.0-0' }}</td>
                    <td>{{ row.capex_remaining_pre_launch | number: '1.0-0' }}</td>
                    <td>{{ row.capex_annual_post_launch | number: '1.0-0' }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductFullProfilesFieldsetComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() tableOverrideRows: any[] = [];
  private readonly destroy$ = new Subject<void>();
  rows: VaccineProductRow[] = [];
  displayRows: VaccineProductRow[] = [];
  private useTableOverrideRows = false;
  selectedRowId = '';
  rowForm: FormGroup;
  newRowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'success_prob',
    startRow: 0,
    incrementPerYear: 0.01,
    yearsToApply: 1,
    compound: false,
  };

  stageOptions: SelectOption[] = [];

  helperColumnOptions: SelectOption<IncrementHelper['column']>[] = [];
  private defaultsProductsRows: any[] = [];
  private defaultsStageMappingRows: any[] = [];

  private readonly stageFallbackOrder = [
    'Discovery',
    'Preclinical',
    'Phase I',
    'Phase II',
    'Phase III',
    'Filed',
    'Approved',
  ];

  private readonly helperColumnDefinitions: HelperColumnDefinition[] = [
    { sourceKey: 'success_prob', label: 'success_prob', value: 'success_prob' },
    { sourceKey: 'time_to_market', label: 'time_to_market', value: 'time_to_market' },
    { sourceKey: 'patent_years', label: 'patent_years', value: 'patent_years' },
    {
      sourceKey: 'patent_revenue_target',
      label: 'patent_revenue_target',
      value: 'patent_revenue_target',
    },
    {
      sourceKey: 'post_patent_revenue_target',
      label: 'post_patent_revenue_target',
      value: 'post_patent_revenue_target',
    },
    {
      sourceKey: 'market_growth_patent',
      label: 'market_growth_patent',
      value: 'market_growth_patent',
    },
    {
      sourceKey: 'market_growth_post',
      label: 'market_growth_post',
      value: 'market_growth_post',
    },
    { sourceKey: 'cogs_patent', label: 'cogs_patent', value: 'cogs_patent' },
    { sourceKey: 'cogs_post', label: 'cogs_post', value: 'cogs_post' },
    { sourceKey: 'labor_pct', label: 'labor_pct', value: 'labor_pct' },
    { sourceKey: 'overhead_pct', label: 'overhead_pct', value: 'overhead_pct' },
    { sourceKey: 'material_pct', label: 'material_pct', value: 'material_pct' },
    {
      sourceKey: 'sales_marketing_pct',
      label: 'sales_marketing_pct',
      value: 'sales_marketing_pct',
    },
    { sourceKey: 'gna_pct', label: 'gna_pct', value: 'gna_pct' },
    {
      sourceKey: 'rd_remaining_pre_launch',
      label: 'rd_remaining_pre_launch',
      value: 'rd_remaining_pre_launch',
    },
    {
      sourceKey: 'rd_annual_post_launch',
      label: 'rd_annual_post_launch',
      value: 'rd_annual_post_launch',
    },
    {
      sourceKey: 'capex_remaining_pre_launch',
      label: 'capex_remaining_pre_launch',
      value: 'capex_remaining_pre_launch',
    },
    {
      sourceKey: 'capex_annual_post_launch',
      label: 'capex_annual_post_launch',
      value: 'capex_annual_post_launch',
    },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      success_prob: [0],
      include_in_consolidation: [false],
      time_to_market: [0],
      patent_years: [0],
      patent_revenue_target: [0],
      post_patent_revenue_target: [0],
      market_growth_patent: [0],
      market_growth_post: [0],
      cogs_patent: [0],
      cogs_post: [0],
      labor_pct: [0],
      overhead_pct: [0],
      material_pct: [0],
      sales_marketing_pct: [0],
      gna_pct: [0],
      rd_remaining_pre_launch: [0],
      rd_annual_post_launch: [0],
      capex_remaining_pre_launch: [0],
      capex_annual_post_launch: [0],
    });
    this.newRowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      success_prob: [0],
      include_in_consolidation: [false],
      time_to_market: [0],
      patent_years: [0],
      patent_revenue_target: [0],
      post_patent_revenue_target: [0],
      market_growth_patent: [0],
      market_growth_post: [0],
      cogs_patent: [0],
      cogs_post: [0],
      labor_pct: [0],
      overhead_pct: [0],
      material_pct: [0],
      sales_marketing_pct: [0],
      gna_pct: [0],
      rd_remaining_pre_launch: [0],
      rd_annual_post_launch: [0],
      capex_remaining_pre_launch: [0],
      capex_annual_post_launch: [0],
    });
  }

  ngOnInit(): void {
    this.loadDefaultsData();
    this.syncFromModel();
    this.biotechModelService.input$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.syncFromModel());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableOverrideRows']) {
      this.useTableOverrideRows =
        Array.isArray(this.tableOverrideRows) && this.tableOverrideRows.length > 0;
      this.syncDisplayRows();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: row.name || row.id,
      value: row.id,
    }));
  }

  get rowFormValue(): VaccineProductRow {
    return this.rowForm.getRawValue() as VaccineProductRow;
  }

  get newRowFormValue(): VaccineProductRow {
    return this.newRowForm.getRawValue() as VaccineProductRow;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.rowForm.reset({ ...row });
    }
  }

  saveSelectedRow(): void {
    const value = this.rowFormValue;
    const sanitized = this.sanitizeRow(value, this.nextProductId());
    let nextRows = [...this.rows];
    const selectedIndex = nextRows.findIndex((row) => row.id === this.selectedRowId);
    const duplicateIndex =
      sanitized.id === this.selectedRowId
        ? -1
        : nextRows.findIndex((row) => row.id === sanitized.id);
    if (duplicateIndex >= 0) {
      nextRows[duplicateIndex] = sanitized;
      if (selectedIndex >= 0 && selectedIndex !== duplicateIndex) {
        nextRows.splice(selectedIndex, 1);
      }
    } else if (selectedIndex >= 0) {
      nextRows[selectedIndex] = sanitized;
    } else {
      nextRows = [...nextRows, sanitized];
    }
    this.rows = nextRows;
    this.selectedRowId = sanitized.id;
    this.rowForm.reset({ ...sanitized });
    this.useTableOverrideRows = false;
    this.syncDisplayRows();
    this.persist();
  }

  addRow(): void {
    const value = this.newRowFormValue;
    const sanitized = this.sanitizeRow(value, this.nextProductId());
    this.rows = [...this.rows, sanitized];
    this.selectedRowId = sanitized.id;
    this.syncSelectedRow();
    this.resetNewRow();
    this.useTableOverrideRows = false;
    this.syncDisplayRows();
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
    this.syncSelectedRow();
    this.resetNewRow();
    this.useTableOverrideRows = false;
    this.syncDisplayRows();
    this.persist();
  }

  applyIncrement(): void {
    const startIndex = Math.max(0, Math.floor(this.helper.startRow || 0));
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    if (startIndex >= this.rows.length) {
      return;
    }
    const updated = [...this.rows];
    for (let i = 0; i < years; i += 1) {
      const idx = startIndex + i;
      if (!updated[idx]) {
        break;
      }
      const row = { ...updated[idx] };
      const key = this.helper.column;
      const current = Number(row[key] ?? 0);
      const nextValue = this.helper.compound
        ? current * (1 + increment / 100)
        : current + increment;
      row[key] = Math.max(0, nextValue);
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.useTableOverrideRows = false;
    this.syncDisplayRows();
    this.persist();
  }

  private sanitizeRow(value: VaccineProductRow, fallbackId: string): VaccineProductRow {
    return {
      id: String(value.id ?? '').trim() || fallbackId,
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      success_prob: Number(value.success_prob || 0),
      include_in_consolidation: Boolean(value.include_in_consolidation),
      time_to_market: Number(value.time_to_market || 0),
      patent_years: Number(value.patent_years || 0),
      patent_revenue_target: Number(value.patent_revenue_target || 0),
      post_patent_revenue_target: Number(value.post_patent_revenue_target || 0),
      market_growth_patent: Number(value.market_growth_patent || 0),
      market_growth_post: Number(value.market_growth_post || 0),
      cogs_patent: Number(value.cogs_patent || 0),
      cogs_post: Number(value.cogs_post || 0),
      labor_pct: Number(value.labor_pct || 0),
      overhead_pct: Number(value.overhead_pct || 0),
      material_pct: Number(value.material_pct || 0),
      sales_marketing_pct: Number(value.sales_marketing_pct || 0),
      gna_pct: Number(value.gna_pct || 0),
      rd_remaining_pre_launch: Number(value.rd_remaining_pre_launch || 0),
      rd_annual_post_launch: Number(value.rd_annual_post_launch || 0),
      capex_remaining_pre_launch: Number(value.capex_remaining_pre_launch || 0),
      capex_annual_post_launch: Number(value.capex_annual_post_launch || 0),
    };
  }

  private getSelectedRow(): VaccineProductRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      products: this.rows.map((row) => ({
        ...row,
      })),
    });
  }

  private syncFromModel(): void {
    const snapshot = this.biotechModelService.getInputSnapshot() ?? {};
    this.refreshDynamicOptions(snapshot);
    const currentSelectedId = this.selectedRowId;
    const stored =
      Array.isArray(snapshot?.products) && snapshot.products.length
        ? snapshot.products
        : this.defaultsProductsRows;
    const defaultStage = this.stageOptions[0]?.value ?? this.stageFallbackOrder[0];
    if (stored.length) {
      this.rows = stored.map((row: any, index: number) =>
        this.normalizeRow(row, index, defaultStage)
      );
      this.selectedRowId =
        this.rows.find((row) => row.id === currentSelectedId)?.id ??
        this.rows[0]?.id ??
        '';
      this.syncSelectedRow();
    } else {
      this.rows = [];
      this.selectedRowId = '';
    }
    this.syncDisplayRows();
    this.resetNewRow();
  }

  private syncDisplayRows(): void {
    const defaultStage = this.stageOptions[0]?.value ?? this.stageFallbackOrder[0];
    if (this.useTableOverrideRows && Array.isArray(this.tableOverrideRows) && this.tableOverrideRows.length) {
      this.displayRows = this.tableOverrideRows.map((row: any, index: number) =>
        this.normalizeRow(row, index, defaultStage)
      );
      return;
    }
    this.displayRows = this.rows.map((row) => ({ ...row }));
  }

  private normalizeRow(row: any, index: number, defaultStage: string): VaccineProductRow {
    const fallbackId = `VAC-${String(index + 1).padStart(3, '0')}`;
    const sanitized = this.sanitizeRow((row ?? {}) as VaccineProductRow, fallbackId);
    return {
      ...sanitized,
      name: sanitized.name || `Template ${index + 1}`,
      stage: sanitized.stage || defaultStage,
    };
  }

  private nextProductId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /(?:VAC|PROD)-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return `VAC-${String(maxId + 1).padStart(3, '0')}`;
  }

  private resetNewRow(): void {
    this.newRowForm.reset({
      id: this.nextProductId(),
      name: 'New vaccine',
      stage: this.stageOptions[0]?.value ?? 'Discovery',
      success_prob: 0.3,
      include_in_consolidation: true,
      time_to_market: 3,
      patent_years: 15,
      patent_revenue_target: 120000000,
      post_patent_revenue_target: 60000000,
      market_growth_patent: 0.04,
      market_growth_post: 0,
      cogs_patent: 0.32,
      cogs_post: 0.5,
      labor_pct: 0.12,
      overhead_pct: 0.08,
      material_pct: 0.1,
      sales_marketing_pct: 0.18,
      gna_pct: 0.12,
      rd_remaining_pre_launch: 180000000,
      rd_annual_post_launch: 12000000,
      capex_remaining_pre_launch: 55000000,
      capex_annual_post_launch: 6500000,
    });
  }

  private loadDefaultsData(): void {
    this.biotechModelService
      .getDefaultsTemplate()
      .pipe(take(1))
      .subscribe({
        next: (defaults: any) => {
          this.defaultsProductsRows = Array.isArray(defaults?.products) ? defaults.products : [];
          this.defaultsStageMappingRows = Array.isArray(defaults?.stage_schedule_mapping)
            ? defaults.stage_schedule_mapping
            : [];
          this.syncFromModel();
        },
      });
  }

  private refreshDynamicOptions(snapshot?: any): void {
    const sourceSnapshot = snapshot ?? this.biotechModelService.getInputSnapshot() ?? {};
    this.stageOptions = this.buildStageOptions(sourceSnapshot);
    this.helperColumnOptions = this.buildHelperColumnOptions(sourceSnapshot);

    const allowedColumns = this.helperColumnOptions.map((item) => item.value);
    if (!allowedColumns.includes(this.helper.column)) {
      this.helper.column = this.helperColumnOptions[0]?.value ?? 'success_prob';
    }
  }

  private buildStageOptions(snapshot: any): SelectOption[] {
    const orderedStages: string[] = [];
    const seenStages = new Set<string>();

    const appendStage = (value: unknown): void => {
      const stage = String(value ?? '').trim();
      if (!stage || seenStages.has(stage)) {
        return;
      }
      seenStages.add(stage);
      orderedStages.push(stage);
    };

    this.defaultsStageMappingRows.forEach((row: any) => appendStage(row?.Stage));

    const stageMappingRows = Array.isArray(snapshot?.stage_schedule_mapping)
      ? snapshot.stage_schedule_mapping
      : [];
    stageMappingRows.forEach((row: any) => appendStage(row?.Stage));

    this.defaultsProductsRows.forEach((row: any) => appendStage(row?.stage));

    const productRows = Array.isArray(snapshot?.products) ? snapshot.products : [];
    productRows.forEach((row: any) => appendStage(row?.stage));

    this.rows.forEach((row) => appendStage(row.stage));

    if (!orderedStages.length) {
      this.stageFallbackOrder.forEach((stage) => appendStage(stage));
    }

    return orderedStages.map((stage) => ({
      label: stage,
      value: stage,
    }));
  }

  private buildHelperColumnOptions(snapshot: any): SelectOption<IncrementHelper['column']>[] {
    const availableKeys = new Set<string>();

    const collectKeys = (rows: any[]): void => {
      rows.forEach((row: any) => {
        Object.keys(row ?? {}).forEach((key) => {
          const normalized = String(key ?? '').trim();
          if (normalized) {
            availableKeys.add(normalized);
          }
        });
      });
    };

    collectKeys(this.defaultsProductsRows);
    const productRows = Array.isArray(snapshot?.products) ? snapshot.products : [];
    collectKeys(productRows);
    collectKeys(this.rows as any[]);

    const optionsFromData = this.helperColumnDefinitions
      .filter((definition) => availableKeys.has(definition.sourceKey))
      .map((definition) => ({
        label: definition.label,
        value: definition.value,
      }));

    if (optionsFromData.length) {
      return optionsFromData;
    }

    return this.helperColumnDefinitions.map((definition) => ({
      label: definition.label,
      value: definition.value,
    }));
  }
}

