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
        label: 'Ours NumQuants Models',
        icon: 'pi pi-fw pi-th-large',
        routerLink: ['/dashboard'],
        items: [
          { label: 'Pharmaceuticals', icon: 'pi pi-fw pi-heart-fill' },
          { label: 'Biotech', icon: 'pi pi-fw pi-microchip' },
          { label: 'Microbrewery', icon: 'pi pi-fw pi-building' },
          { label: 'Goat Farming', icon: 'pi pi-fw pi-home' },
          { label: 'Cassava Ethanol', icon: 'pi pi-fw pi-bolt' },
          { label: 'Broiler Chicken', icon: 'pi pi-fw pi-shopping-bag' },
        ],
      },
      {
        label: 'Yours Models',
        items: [
          {
            label: 'Pharmaceuticals',
            icon: 'pi pi-fw pi-heart-fill',
            routerLink: ['/dashboard/pharma-input-landing'],
          },
          // {
          //   label: 'Add New Model',
          //   icon: 'pi pi-fw pi-plus',
          //   routerLink: ['/dashboard'],
          //   queryParams: { section: 'add-model' },
          // },
        ],
      },
    ];
  }
}
