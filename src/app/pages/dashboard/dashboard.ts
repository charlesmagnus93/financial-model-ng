import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AVAILABLE_MODELS, ModelOption } from './model-options';
import { PharmaModelService } from '../services/pharma-model.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TabsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DialogModule
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <div class="text-2xl font-semibold">Models</div>
        <div class="text-sm text-surface-400">
          Create a new model and enter customer data before accessing dashboards.
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6 xl:col-span-4">
          <div class="card flex flex-col gap-3 h-full border border-dashed border-surface-700">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="text-lg font-semibold">Create New Model</div>
                <div class="text-xs text-surface-500">
                  Choose a model to start a new customer form.
                </div>
              </div>
            </div>
            <p class="text-sm text-surface-400">
              Select a model and complete the input form before other dashboards
              unlock.
            </p>
            <div class="mt-auto flex flex-col gap-3">
              <p-button
                label="Choose Model"
                icon="pi pi-plus"
                (click)="toggleModelPicker()"
              ></p-button>
            </div>
          </div>
        </div>
        @for (model of availableModels.slice(0, 5); track model.id) {
          <div class="col-span-12 md:col-span-6 xl:col-span-4">
            <div class="card flex flex-col gap-3 h-full">
              <div>
                <div class="text-lg font-semibold">{{ model.name }}</div>
              </div>
              <p class="text-sm text-surface-600">{{ model.description }}</p>
              <div class="mt-auto">
                <p-button
                  label="Create"
                  (click)="selectModel(model)"
                ></p-button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <p-dialog
      header="Choose a model"
      [(visible)]="showModelPicker"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '32rem' }"
      (onHide)="closeModelPicker()"
    >
      <div class="flex flex-col gap-3">
        <div class="w-full">
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input
              type="text"
              class="p-inputtext-fluid"
              pInputText
              [(ngModel)]="searchTerm"
              placeholder="Search models..."
            />
          </p-iconfield>
        </div>
        <div class="flex flex-col gap-2">
          @for (model of filteredModels; track model.id) {
            <button
              type="button"
              class="w-full rounded border border-surface-700 p-3 text-left transition hover:border-primary"
              (click)="selectModel(model)"
            >
              <div class="text-sm font-semibold">{{ model.name }}</div>
              <div class="text-xs text-surface-400">
                {{ model.description }}
              </div>
            </button>
          }
          @if (filteredModels.length === 0) {
            <div class="text-xs text-surface-400">No models match your search.</div>
          }
        </div>
      </div>
    </p-dialog>

    <router-outlet></router-outlet>
  `,
})
export class Dashboard implements OnInit, OnDestroy {
  searchTerm = '';
  showModelPicker = false;
  availableModels: ModelOption[] = AVAILABLE_MODELS;

  private queryParamSub?: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private pharmaModelService: PharmaModelService
  ) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const section = params.get('section');
      const trxref = params.get('trxref');
      const reference = params.get('reference');
      if (!section) {
        this.searchTerm = '';
      }

      const refValue = reference || trxref;
      if (refValue) {
        console.log('Reference param:', refValue);
        this.pharmaModelService.verifySubscription(refValue);
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub?.unsubscribe();
  }

  toggleModelPicker(): void {
    this.showModelPicker = !this.showModelPicker;
  }

  closeModelPicker(): void {
    this.showModelPicker = false;
  }

  get filteredModels() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.availableModels;
    return this.availableModels.filter(
      (model) =>
        model.name.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term)
    );
  }

  selectModel(model: ModelOption): void {
    localStorage.setItem('selected_model', model.code);
    localStorage.removeItem('model_setup_complete');
    this.showModelPicker = false;
    this.router.navigate(model.route);
  }
}
