import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li
        app-menuitem
        *ngIf="!item.separator"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Pharmaceuticals Financial Model',
        icon: 'pi pi-fw pi-th-large',
        routerLink: ['/dashboard'],
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            items: [
              {
                label: 'Input Landing Page',
                icon: 'pi pi-fw pi-sign-in',
                routerLink: ['/dashboard/pharma-input-landing'],
                queryParams: { section: 'input' },
              },
              {
                label: 'Key Metrics Dashboard',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/dashboard/pharma-key-metrics'],
                queryParams: { section: 'metrics' },
              },
              {
                label: 'Financial Performance',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: ['/dashboard/pharma-financial-performance'],
                queryParams: { section: 'overview' },
              },
              {
                label: 'Financial Position',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/dashboard/pharma-financial-position'],
                queryParams: { section: 'balance-sheet' },
              },
              {
                label: 'Cash Flow Statement',
                icon: 'pi pi-fw pi-dollar',
                routerLink: ['/dashboard/pharma-cash-flow'],
                queryParams: { section: 'cashflow' },
              },
              {
                label: 'Sensitivity Analysis',
                icon: 'pi pi-fw pi-sliders-h',
                routerLink: ['/dashboard/pharma-sensitivity-analysis'],
                queryParams: { section: 'sensitivity' },
              },
              {
                label: 'Scenario / IFs Analysis',
                icon: 'pi pi-fw pi-sitemap',
                routerLink: ['/dashboard/pharma-scenario-ifs'],
                queryParams: { section: 'scenario' },
              },
              {
                label: 'Monte Carlo Simulation',
                icon: 'pi pi-fw pi-discord',
                routerLink: ['/dashboard/pharma-simulation-montecarlo'],
                queryParams: { section: 'montecarlo' },
              },
              {
                label: 'Break-even & Payback',
                icon: 'pi pi-fw pi-stopwatch',
                routerLink: ['/dashboard/pharma-break-even-payback'],
                queryParams: { section: 'breakeven' },
              },
            ],
          },
        ],
      },
      {
        label: 'Other Models',
        // items: [
        //   {
        //     label: 'Add New Model',
        //     icon: 'pi pi-fw pi-plus',
        //     routerLink: ['/dashboard'],
        //     queryParams: { section: 'add-model' },
        //   },
        // ],
      },
    ];
  }
}
