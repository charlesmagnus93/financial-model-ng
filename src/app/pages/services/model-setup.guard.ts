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
    if (selectedModel === 'biotech') {
      this.router.navigate(['/dashboard/biotech-input-landing']);
    } else {
      this.router.navigate(['/dashboard/pharma-input-landing']);
    }
    return false;
  }
}

