import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BiotechModelService } from '../../services/biotech-model.service';

interface VaccineProductRow {
  id: string;
  name: string;
  stage: string;
  successProbPct: number;
  includeInConsolidation: boolean;
  timeToMarket: number;
  patentYears: number;
  patentRevenueTargetUsd: number;
  postPatentRevenueTargetUsd: number;
  marketSharePatentPct: number;
  marketSharePostPct: number;
  marketGrowthPct: number;
  salesGrowthPct: number;
  avgPriceUsd: number;
  cogsPct: number;
  marketingAnnualPct: number;
  marketingLaunchUsd: number;
  rndSpentUsd: number;
  capexInitialUsd: number;
  capexLaunchUsd: number;
}

interface IncrementHelper {
  column:
    | 'successProbPct'
    | 'timeToMarket'
    | 'patentYears'
    | 'patentRevenueTargetUsd'
    | 'postPatentRevenueTargetUsd'
    | 'marketSharePatentPct'
    | 'marketSharePostPct'
    | 'marketGrowthPct'
    | 'salesGrowthPct'
    | 'avgPriceUsd'
    | 'cogsPct'
    | 'marketingAnnualPct'
    | 'marketingLaunchUsd'
    | 'rndSpentUsd'
    | 'capexInitialUsd'
    | 'capexLaunchUsd';
  incrementPerYear: number;
  yearsToApply: number;
}

@Component({
  standalone: true,
  selector: 'biotech-product-vaccines-fieldset',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    FieldsetModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <p-fieldset legend="Vaccines" [toggleable]="true" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-3 items-end">
          <div class="col-span-12 lg:col-span-9 flex flex-col gap-2">
            <label class="text-xs font-semibold">Select row</label>
            <p-select
              [options]="rowOptions"
              [(ngModel)]="selectedRowId"
              (ngModelChange)="syncSelectedRow()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select vaccine"
              [showClear]="false"
              class="w-full"
            ></p-select>
          </div>
          <div class="col-span-12 lg:col-span-3 flex">
            <p-button
              label="Remove row"
              [outlined]="true"
              severity="danger"
              (onClick)="removeRow()"
              [disabled]="rows.length <= 1"
              class="w-full"
              fluid
            ></p-button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-8 rounded border border-surface-700 p-3 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="text-xs text-surface-600 font-semibold">
                {{ isCreatingRow ? 'Add a new row' : 'Edit selected row' }}
              </div>
              <p-button
                label="New row"
                size="small"
                [outlined]="true"
                (onClick)="startNewRow()"
              ></p-button>
            </div>
            <form [formGroup]="rowForm" class="flex flex-col gap-2">
              <div class="grid grid-cols-12 gap-3 items-end">
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Vaccine name</label>
                  <input pInputText formControlName="name" class="w-full" />
    
                  <label class="text-xs font-semibold">Stage</label>
                  <p-select
                    [options]="stageOptions"
                    formControlName="stage"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  ></p-select>
    
                  <label class="text-xs font-semibold">Success probability %</label>
                  <p-inputnumber
                    formControlName="successProbPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <div class="flex items-center gap-2 pt-1">
                    <p-inputSwitch formControlName="includeInConsolidation"></p-inputSwitch>
                    <span class="text-xs font-semibold">Include in consolidation</span>
                  </div>
    
                  <label class="text-xs font-semibold">Time to market</label>
                  <p-inputnumber
                    formControlName="timeToMarket"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Patent years</label>
                  <p-inputnumber
                    formControlName="patentYears"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="false"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Patent revenue target (USD)</label>
                  <p-inputnumber
                    formControlName="patentRevenueTargetUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Post patent revenue target (USD)</label>
                  <p-inputnumber
                    formControlName="postPatentRevenueTargetUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Market share patent %</label>
                  <p-inputnumber
                    formControlName="marketSharePatentPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Market share post %</label>
                  <p-inputnumber
                    formControlName="marketSharePostPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
                </div>
                <div class="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <label class="text-xs font-semibold">Market growth %</label>
                  <p-inputnumber
                    formControlName="marketGrowthPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Sales growth %</label>
                  <p-inputnumber
                    formControlName="salesGrowthPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Average price (USD)</label>
                  <p-inputnumber
                    formControlName="avgPriceUsd"
                    [showButtons]="true"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">COGS %</label>
                  <p-inputnumber
                    formControlName="cogsPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Marketing annual %</label>
                  <p-inputnumber
                    formControlName="marketingAnnualPct"
                    [showButtons]="true"
                    [min]="0"
                    [max]="100"
                    [step]="1"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Marketing launch cost (USD)</label>
                  <p-inputnumber
                    formControlName="marketingLaunchUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">R&D spent (USD)</label>
                  <p-inputnumber
                    formControlName="rndSpentUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Capex initial (USD)</label>
                  <p-inputnumber
                    formControlName="capexInitialUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <label class="text-xs font-semibold">Capex launch (USD)</label>
                  <p-inputnumber
                    formControlName="capexLaunchUsd"
                    [showButtons]="true"
                    [min]="0"
                    [useGrouping]="true"
                    inputStyleClass="w-full"
                  />
    
                  <p-button
                    [label]="isCreatingRow ? 'Add row' : 'Save changes'"
                    size="small"
                    [outlined]="true"
                    (onClick)="saveRow()"
                    fluid
                  ></p-button>
                </div>
              </div>

            </form>
          </div>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div class="rounded border border-surface-700 p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Yearly Increment Helper</div>
              <label class="text-xs font-semibold">Column</label>
              <p-select
                [options]="helperColumnOptions"
                [(ngModel)]="helper.column"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              ></p-select>
              <label class="text-xs font-semibold">Increment per year</label>
              <p-inputnumber
                [(ngModel)]="helper.incrementPerYear"
                [showButtons]="true"
                [step]="1"
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
              <div class="text-xs text-surface-500">
                Current value: {{ currentHelperValue | number: '1.2-2' }}
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

        <div class="overflow-auto rounded">
          <p-table [value]="productRows" showGridlines class="text-sm">
            <ng-template #header>
              <tr>
                <th>Name</th>
                <th>Stage</th>
                <th>Success probability</th>
                <th>Include</th>
                <th>Time to market</th>
                <th>Patent years</th>
                <th>Patent revenue target</th>
                <th>Post patent revenue target</th>
                <th>Market growth patent</th>
                <th>Market growth post</th>
                <th>COGS patent</th>
                <th>COGS post</th>
                <th>Sales marketing %</th>
                <th>G&amp;A %</th>
                <th>R&amp;D remaining pre launch</th>
                <th>R&amp;D annual post launch</th>
                <th>Capex remaining pre launch</th>
                <th>Capex annual post launch</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td>{{ row.name }}</td>
                <td>{{ row.stage }}</td>
                <td>{{ row.successProbPct | number: '1.2-2' }}</td>
                <td>
                  <i
                    class="pi"
                    [ngClass]="row.includeInConsolidation ? 'pi-check' : 'pi-times'"
                  ></i>
                </td>
                <td>{{ row.timeToMarket }}</td>
                <td>{{ row.patentYears }}</td>
                <td>{{ row.patentRevenueTarget | number: '1.0-0' }}</td>
                <td>{{ row.postPatentRevenueTarget | number: '1.0-0' }}</td>
                <td>{{ row.marketGrowthPatent | number: '1.2-2' }}</td>
                <td>{{ row.marketGrowthPost | number: '1.2-2' }}</td>
                <td>{{ row.cogsPatent | number: '1.2-2' }}</td>
                <td>{{ row.cogsPost | number: '1.2-2' }}</td>
                <td>{{ row.salesMarketingPct | number: '1.2-2' }}</td>
                <td>{{ row.gnaPct | number: '1.2-2' }}</td>
                <td>{{ row.rdRemainingPreLaunch | number: '1.0-0' }}</td>
                <td>{{ row.rdAnnualPostLaunch | number: '1.0-0' }}</td>
                <td>{{ row.capexRemainingPreLaunch | number: '1.0-0' }}</td>
                <td>{{ row.capexAnnualPostLaunch | number: '1.0-0' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </p-fieldset>
  `,
})
export class BiotechProductVaccinesFieldsetComponent implements OnInit {
  rows: VaccineProductRow[] = [];
  productRows: Array<{
    name: string;
    stage: string;
    successProbPct: number;
    includeInConsolidation: boolean;
    timeToMarket: number;
    patentYears: number;
    patentRevenueTarget: number;
    postPatentRevenueTarget: number;
    marketGrowthPatent: number;
    marketGrowthPost: number;
    cogsPatent: number;
    cogsPost: number;
    salesMarketingPct: number;
    gnaPct: number;
    rdRemainingPreLaunch: number;
    rdAnnualPostLaunch: number;
    capexRemainingPreLaunch: number;
    capexAnnualPostLaunch: number;
  }> = [];
  selectedRowId = '';
  isCreatingRow = false;
  rowForm: FormGroup;
  helper: IncrementHelper = {
    column: 'successProbPct',
    incrementPerYear: 1,
    yearsToApply: 1,
  };

  stageOptions = [
    { label: 'Discovery', value: 'Discovery' },
    { label: 'Preclinical', value: 'Preclinical' },
    { label: 'Phase I', value: 'Phase I' },
    { label: 'Phase II', value: 'Phase II' },
    { label: 'Phase III', value: 'Phase III' },
    { label: 'Filed', value: 'Filed' },
    { label: 'Approved', value: 'Approved' },
  ];

  helperColumnOptions = [
    { label: 'Success probability %', value: 'successProbPct' },
    { label: 'Time to market', value: 'timeToMarket' },
    { label: 'Patent years', value: 'patentYears' },
    { label: 'Patent revenue target (USD)', value: 'patentRevenueTargetUsd' },
    { label: 'Post patent revenue target (USD)', value: 'postPatentRevenueTargetUsd' },
    { label: 'Market share patent %', value: 'marketSharePatentPct' },
    { label: 'Market share post %', value: 'marketSharePostPct' },
    { label: 'Market growth %', value: 'marketGrowthPct' },
    { label: 'Sales growth %', value: 'salesGrowthPct' },
    { label: 'Average price (USD)', value: 'avgPriceUsd' },
    { label: 'COGS %', value: 'cogsPct' },
    { label: 'Marketing annual %', value: 'marketingAnnualPct' },
    { label: 'Marketing launch cost (USD)', value: 'marketingLaunchUsd' },
    { label: 'R&D spent (USD)', value: 'rndSpentUsd' },
    { label: 'Capex initial (USD)', value: 'capexInitialUsd' },
    { label: 'Capex launch (USD)', value: 'capexLaunchUsd' },
  ];

  constructor(
    private biotechModelService: BiotechModelService,
    private formBuilder: FormBuilder
  ) {
    this.rowForm = this.formBuilder.group({
      id: [''],
      name: [''],
      stage: [''],
      successProbPct: [0],
      includeInConsolidation: [false],
      timeToMarket: [0],
      patentYears: [0],
      patentRevenueTargetUsd: [0],
      postPatentRevenueTargetUsd: [0],
      marketSharePatentPct: [0],
      marketSharePostPct: [0],
      marketGrowthPct: [0],
      salesGrowthPct: [0],
      avgPriceUsd: [0],
      cogsPct: [0],
      marketingAnnualPct: [0],
      marketingLaunchUsd: [0],
      rndSpentUsd: [0],
      capexInitialUsd: [0],
      capexLaunchUsd: [0],
    });
  }

  ngOnInit(): void {
    this.syncFromModel();
    this.syncProductRows();
  }

  get rowOptions() {
    return this.rows.map((row) => ({
      label: row.name ? `${row.id} - ${row.name}` : row.id,
      value: row.id,
    }));
  }

  get currentHelperValue(): number {
    const row = this.getSelectedRow();
    if (!row) {
      return 0;
    }
    return Number(row[this.helper.column] ?? 0);
  }

  get rowFormValue(): VaccineProductRow {
    return this.rowForm.getRawValue() as VaccineProductRow;
  }

  syncSelectedRow(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.isCreatingRow = false;
      this.rowForm.reset({ ...row });
    }
  }

  startNewRow(): void {
    const nextId = this.nextVaccineId();
    this.isCreatingRow = true;
    this.rowForm.reset({
      id: nextId,
      name: 'New vaccine',
      stage: this.stageOptions[0]?.value ?? 'Discovery',
      successProbPct: 30,
      includeInConsolidation: true,
      timeToMarket: 3,
      patentYears: 15,
      patentRevenueTargetUsd: 120000000,
      postPatentRevenueTargetUsd: 80000000,
      marketSharePatentPct: 5,
      marketSharePostPct: 3,
      marketGrowthPct: 5,
      salesGrowthPct: 8,
      avgPriceUsd: 100,
      cogsPct: 30,
      marketingAnnualPct: 15,
      marketingLaunchUsd: 2000000,
      rndSpentUsd: 50000000,
      capexInitialUsd: 1500000,
      capexLaunchUsd: 1000000,
    });
  }

  saveRow(): void {
    const value = this.rowFormValue;
    const sanitized: VaccineProductRow = {
      id: String(value.id ?? '').trim() || this.nextVaccineId(),
      name: String(value.name ?? '').trim(),
      stage: String(value.stage ?? '').trim(),
      successProbPct: Number(value.successProbPct || 0),
      includeInConsolidation: Boolean(value.includeInConsolidation),
      timeToMarket: Number(value.timeToMarket || 0),
      patentYears: Number(value.patentYears || 0),
      patentRevenueTargetUsd: Number(value.patentRevenueTargetUsd || 0),
      postPatentRevenueTargetUsd: Number(value.postPatentRevenueTargetUsd || 0),
      marketSharePatentPct: Number(value.marketSharePatentPct || 0),
      marketSharePostPct: Number(value.marketSharePostPct || 0),
      marketGrowthPct: Number(value.marketGrowthPct || 0),
      salesGrowthPct: Number(value.salesGrowthPct || 0),
      avgPriceUsd: Number(value.avgPriceUsd || 0),
      cogsPct: Number(value.cogsPct || 0),
      marketingAnnualPct: Number(value.marketingAnnualPct || 0),
      marketingLaunchUsd: Number(value.marketingLaunchUsd || 0),
      rndSpentUsd: Number(value.rndSpentUsd || 0),
      capexInitialUsd: Number(value.capexInitialUsd || 0),
      capexLaunchUsd: Number(value.capexLaunchUsd || 0),
    };
    let nextRows = [...this.rows];
    if (this.isCreatingRow) {
      const existingIndex = nextRows.findIndex((row) => row.id === sanitized.id);
      if (existingIndex >= 0) {
        nextRows[existingIndex] = sanitized;
      } else {
        nextRows = [...nextRows, sanitized];
      }
      this.selectedRowId = sanitized.id;
      this.isCreatingRow = false;
    } else {
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
      this.selectedRowId = sanitized.id;
    }
    this.rows = nextRows;
    this.rowForm.reset({ ...sanitized });
    this.persist();
  }

  removeRow(): void {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter((row) => row.id !== this.selectedRowId);
    this.selectedRowId = this.rows[0]?.id ?? '';
    this.syncSelectedRow();
    this.persist();
  }

  applyIncrement(): void {
    const startRow = this.getSelectedRow();
    if (!startRow) {
      return;
    }
    const years = Math.max(1, Math.floor(this.helper.yearsToApply || 0));
    const increment = Number(this.helper.incrementPerYear || 0);
    const startIndex = this.rows.findIndex((row) => row.id === startRow.id);
    if (startIndex === -1) {
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
      row[key] = Number(row[key] ?? 0) + increment;
      updated[idx] = row;
    }
    this.rows = updated;
    this.syncSelectedRow();
    this.persist();
  }

  private getSelectedRow(): VaccineProductRow | undefined {
    return this.rows.find((row) => row.id === this.selectedRowId);
  }

  private persist(): void {
    this.biotechModelService.patchInput({
      vaccineProductsAssumptions: {
        rows: this.rows.map((row) => ({ ...row })),
      },
    });
  }

  private syncFromModel(): void {
    const stored =
      this.biotechModelService.getInputSnapshot()?.vaccineProductsAssumptions?.rows;
    if (Array.isArray(stored) && stored.length) {
      this.rows = stored.map((row: any) => ({
        id: String(row?.id ?? ''),
        name: String(row?.name ?? ''),
        stage: String(row?.stage ?? ''),
        successProbPct: Number(row?.successProbPct ?? 0),
        includeInConsolidation: Boolean(row?.includeInConsolidation),
        timeToMarket: Number(row?.timeToMarket ?? 0),
        patentYears: Number(row?.patentYears ?? 0),
        patentRevenueTargetUsd: Number(row?.patentRevenueTargetUsd ?? 0),
        postPatentRevenueTargetUsd: Number(row?.postPatentRevenueTargetUsd ?? 0),
        marketSharePatentPct: Number(row?.marketSharePatentPct ?? 0),
        marketSharePostPct: Number(row?.marketSharePostPct ?? 0),
        marketGrowthPct: Number(row?.marketGrowthPct ?? 0),
        salesGrowthPct: Number(row?.salesGrowthPct ?? 0),
        avgPriceUsd: Number(row?.avgPriceUsd ?? 0),
        cogsPct: Number(row?.cogsPct ?? 0),
        marketingAnnualPct: Number(row?.marketingAnnualPct ?? 0),
        marketingLaunchUsd: Number(row?.marketingLaunchUsd ?? 0),
        rndSpentUsd: Number(row?.rndSpentUsd ?? 0),
        capexInitialUsd: Number(row?.capexInitialUsd ?? 0),
        capexLaunchUsd: Number(row?.capexLaunchUsd ?? 0),
      }));
      this.selectedRowId = this.rows[0]?.id ?? '';
      this.syncSelectedRow();
    }
  }

  private syncProductRows(): void {
    const stored = this.biotechModelService.getInputSnapshot()?.products;
    if (!Array.isArray(stored) || !stored.length) {
      this.productRows = [];
      return;
    }
    this.productRows = stored.map((product: any) => ({
      name: String(product?.name ?? ''),
      stage: String(product?.stage ?? ''),
      successProbPct: Number(product?.success_prob ?? 0) * 100,
      includeInConsolidation: Boolean(product?.include_in_consolidation),
      timeToMarket: Number(product?.time_to_market ?? 0),
      patentYears: Number(product?.patent_years ?? 0),
      patentRevenueTarget: Number(product?.patent_revenue_target ?? 0),
      postPatentRevenueTarget: Number(product?.post_patent_revenue_target ?? 0),
      marketGrowthPatent: Number(product?.market_growth_patent ?? 0),
      marketGrowthPost: Number(product?.market_growth_post ?? 0),
      cogsPatent: Number(product?.cogs_patent ?? 0),
      cogsPost: Number(product?.cogs_post ?? 0),
      salesMarketingPct: Number(product?.sales_marketing_pct ?? 0),
      gnaPct: Number(product?.gna_pct ?? 0),
      rdRemainingPreLaunch: Number(product?.rd_remaining_pre_launch ?? 0),
      rdAnnualPostLaunch: Number(product?.rd_annual_post_launch ?? 0),
      capexRemainingPreLaunch: Number(product?.capex_remaining_pre_launch ?? 0),
      capexAnnualPostLaunch: Number(product?.capex_annual_post_launch ?? 0),
    }));
  }

  private nextVaccineId(): string {
    const maxId = this.rows.reduce((max, row) => {
      const match = /VAC-(\d+)/i.exec(row.id);
      if (!match) {
        return max;
      }
      return Math.max(max, Number(match[1] || 0));
    }, 0);
    return `VAC-${String(maxId + 1).padStart(3, '0')}`;
  }
}

