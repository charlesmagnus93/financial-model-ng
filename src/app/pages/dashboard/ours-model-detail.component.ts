import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { OursModelMeta, OursModelService } from '../services/ours-model.service';

@Component({
  standalone: true,
  selector: 'app-ours-model-detail',
  imports: [CommonModule, RouterModule, ButtonModule, TableModule],
  template: `
    <div class="card flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-semibold">{{ model?.name || 'Model' }}</div>
        <div class="text-sm text-surface-400">{{ model?.description }}</div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="text-sm font-semibold">Downloadable template</div>
        <div class="flex flex-wrap items-center gap-3">
          <p-button
            label="Download template"
            icon="pi pi-download"
            (onClick)="downloadTemplate()"
          ></p-button>
          <div class="text-xs text-surface-500">
            Template: {{ model?.templateName }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold">Model creation instructions</div>
        <ol class="list-decimal pl-5 text-sm text-surface-400">
          <li *ngFor="let step of model?.instructions">{{ step }}</li>
        </ol>
      </div>

      <div class="flex items-center gap-3">
        <p-button
          label="Create model"
          icon="pi pi-plus"
          (onClick)="goToCreate()"
        ></p-button>
      </div>
    </div>
  `,
})
export class OursModelDetailComponent implements OnInit, OnDestroy {
  model?: OursModelMeta;
  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oursModelService: OursModelService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const code = params.get('code') ?? '';
      this.model = this.oursModelService.getModel(code);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  downloadTemplate(): void {
    const name = this.model?.templateName ?? 'model-template.txt';
    const content = `Template for ${this.model?.name ?? 'Model'}\\n\\n` +
      (this.model?.instructions ?? []).map((step, i) => `${i + 1}. ${step}`).join('\\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  goToCreate(): void {
    const route = this.model?.createRoute;
    if (route) {
      this.router.navigate([route]);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
