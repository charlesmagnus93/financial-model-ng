import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AVAILABLE_MODELS, ModelOption } from '@/pages/dashboard/model-options';

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
  availableModels: ModelOption[] = AVAILABLE_MODELS;
  model: MenuItem[] = [];

  ngOnInit() {
    const readyModels = this.availableModels.filter((entry) => entry.isAvailable);
    const inDevelopmentModels = this.availableModels.filter((entry) => !entry.isAvailable);

    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard'],
          },
          // {
          //   label: 'Profile',
          //   icon: 'pi pi-fw pi-user',
          //   routerLink: ['/dashboard/profile'],
          // },
        ],
      },
      {
        label: `Available Models (${readyModels.length})`,
        items: [
          ...readyModels.map((model) => this.toMenuItem(model)),
        ],
      },
      {
        label: `In Coming (${inDevelopmentModels.length})`,
        items: [
          ...inDevelopmentModels.map((model) => this.toMenuItem(model)),
        ],
      },
    ];
  }

  private toMenuItem(model: ModelOption): MenuItem {
    const baseLabel = model.name.replace(/ Model$/i, '');
    if (!model.isAvailable) {
      return {
        label: baseLabel,
        icon: model.icon || 'pi pi-fw pi-circle',
        disabled: true,
        title: 'In development',
        stateIcon: 'pi pi-wrench',
        stateIconClass: 'layout-menuitem-state-icon-dev',
        styleClass: 'layout-menuitem-coming-soon',
      };
    }

    return {
      label: baseLabel,
      icon: model.icon || 'pi pi-fw pi-circle',
      routerLink: ['/dashboard/models', model.code],
      command: () => this.selectModel(model),
    };
  }

  private selectModel(model: ModelOption): void {
    localStorage.setItem('selected_model', model.code);
    localStorage.removeItem('model_setup_complete');
  }
}
