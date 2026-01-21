import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccountPopoverComponent } from '../../layout/account-popover.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule, CardModule, AccountPopoverComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-2xl font-semibold">Profile</div>
        <div class="text-sm text-surface-500">
          Manage your account details and security settings.
        </div>
      </div>
      <p-card>
        <app-account-popover (signOut)="logout()"></app-account-popover>
      </p-card>
    </div>
  `,
})
export class AccountProfileComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.signout();
  }
}
