import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModelSetupGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isComplete = localStorage.getItem('model_setup_complete') === 'true';
    if (isComplete) {
      return true;
    }

    const selectedModel = localStorage.getItem('selected_model');
    const inputRouteByModel: Record<string, string> = {
      pharma: '/dashboard/pharma-input-landing',
      biotech: '/dashboard/biotech-input-landing',
      cassava_ethanol: '/dashboard/cassava-ethanol-input-landing',
    };

    this.router.navigate([
      inputRouteByModel[selectedModel ?? ''] ?? inputRouteByModel['pharma'],
    ]);
    return false;
  }
}

