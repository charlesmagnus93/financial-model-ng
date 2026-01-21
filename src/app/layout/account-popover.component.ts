import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { ApiService } from '../pages/services/api.service';
import { AuthService } from '../pages/services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-account-popover',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    TagModule,
  ],
  template: `
    <div class="flex flex-col gap-3">
      <div class="font-semibold">Personnal Information</div>
      <div class="flex items-center gap-2">
        <!-- <p-tag [value]="currentEmail() || 'No email'" /> -->
        @if (loading()) {
          <span class="text-xs text-surface-400">Loading...</span>
        }
      </div>

      <form class="flex flex-col gap-3" [formGroup]="nameForm" (ngSubmit)="saveName()">
        <div class="grid grid-cols-12 gap-4 items-start">
          <div class="col-span-12 lg:col-span-12 md:col-span-12 flex flex-col">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-surface-500">Name</label>
              <input pInputText type="text" formControlName="name" placeholder="Display name" />
            </div>
          </div>
        </div>
        @if (statusMessage()) {
          <div class="text-xs text-green-400">{{ statusMessage() }}</div>
        }
        <div class="flex justify-end">
          @if (errorMessage()) {
            <div class="text-xs text-red-400">{{ errorMessage() }}</div>
          }
          <p-button
            label="Update name"
            type="submit"
            outlined="true"
            [disabled]="saving() || loading() || nameForm.invalid"
            [loading]="saving()"
          ></p-button>
        </div>
      </form>

      <div class="font-semibold">Change Password</div>
      <form class="flex flex-col gap-3" [formGroup]="passwordForm" (ngSubmit)="savePassword()">
        <div class="grid grid-cols-12 gap-4 items-start">
          <div class="col-span-12 lg:col-span-6 md:col-span-12 flex flex-col">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-surface-500">New password</label>
              <input pInputText type="password" formControlName="password" placeholder="Enter new password" />
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6 md:col-span-12 flex flex-col">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-surface-500">Confirm password</label>
              <input pInputText type="password" formControlName="confirmPassword" placeholder="Repeat password" />
            </div>
            @if (passwordMismatch()) {
              <div class="text-xs text-red-400">Passwords do not match.</div>
            }
          </div>
        </div>
        <div class="flex justify-end">
          <p-button
            label="Update password"
            type="submit"
            outlined="true"
            [disabled]="saving() || loading() || passwordForm.invalid || passwordMismatch()"
            [loading]="saving()"
          ></p-button>
        </div>
      </form>

      <p-divider></p-divider>

      <div class="flex flex-col gap-2">
        <div class="font-semibold text-red-500">Deactivate account</div>
        <div>
          Type your email to confirm deactivation. This cannot be undone.
        </div>
        <input
          pInputText
          type="text"
          [value]="deleteConfirm()"
          (input)="deleteConfirm.set($any($event.target).value)"
          placeholder="you@example.com"
        />
        <div class="flex justify-end">
          <p-button
            label="Deactivate"
            severity="danger"
            outlined="true"
            [disabled]="deleting() || !canDelete()"
            [loading]="deleting()"
            (onClick)="openDeleteConfirm()"
          ></p-button>
        </div>
      </div>
    </div>

    <p-dialog
      header="Confirm deactivation"
      [(visible)]="showDeleteConfirm"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '28rem' }"
      (onHide)="closeDeleteConfirm()"
    >
      <div class="flex flex-col gap-3">
        <div class="text-sm text-surface-500">
          This will permanently deactivate your account and remove access. This action cannot be undone.
        </div>
        <div class="flex justify-end gap-2">
          <p-button label="Cancel" outlined="true" (onClick)="closeDeleteConfirm()"></p-button>
          <p-button
            label="Yes, deactivate"
            severity="danger"
            outlined="true"
            [loading]="deleting()"
            (onClick)="confirmDeleteAccount()"
          ></p-button>
        </div>
      </div>
    </p-dialog>
  `,
})
export class AccountPopoverComponent implements OnInit {
  @Output() userUpdated = new EventEmitter<User>();
  @Output() signOut = new EventEmitter<void>();

  currentUser = signal<User | null>(null);
  loading = signal(false);
  saving = signal(false);
  deleting = signal(false);
  showDeleteConfirm = signal(false);
  statusMessage = signal('');
  errorMessage = signal('');
  deleteConfirm = signal('');

  nameForm: FormGroup;
  passwordForm: FormGroup;
  
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Form builder already initialized in property declaration.
    const passwordPattern =
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';
    this.nameForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  currentEmail(): string {
    return this.currentUser()?.email || '';
  }

  passwordMismatch(): boolean {
    const password = this.passwordForm.value.password || '';
    const confirm = this.passwordForm.value.confirmPassword || '';
    return Boolean(password) && password !== confirm;
  }

  canDelete(): boolean {
    const email = this.currentEmail();
    return Boolean(email) && this.deleteConfirm().trim() === email;
  }

  openDeleteConfirm(): void {
    this.statusMessage.set('');
    this.errorMessage.set('');
    if (!this.canDelete()) {
      this.errorMessage.set('Email confirmation does not match.');
      return;
    }
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
  }

  confirmDeleteAccount(): void {
    this.showDeleteConfirm.set(false);
    this.deleteAccount();
  }

  saveName(): void {
    this.statusMessage.set('');
    this.errorMessage.set('');

    const name = (this.nameForm.value.name || '').trim();
    const current = this.currentUser();

    if (name && name !== current?.name) {
      this.updateProfile({ name }, name);
      return;
    }

    this.statusMessage.set('No changes to save.');
  }

  savePassword(): void {
    this.statusMessage.set('');
    this.errorMessage.set('');
    if (this.passwordMismatch()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    const password = this.passwordForm.value.password || '';
    if (!password) {
      this.errorMessage.set('Password is required.');
      return;
    }

    this.updateProfile({ password });
  }

  private updateProfile(payload: Record<string, string>, nameOverride?: string): void {
    if (!Object.keys(payload).length) {
      this.statusMessage.set('No changes to save.');
      return;
    }

    const current = this.currentUser();
    this.saving.set(true);
    this.api
      .patch('/auth/me', payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response: any) => {
          const userName = nameOverride ?? current?.name ?? '';
          const user = this.parseUser(response) || {
            email: current?.email || '',
            name: userName,
          };
          this.setCurrentUser(user);
          this.statusMessage.set('Profile updated.');
          this.passwordForm.patchValue({ password: '', confirmPassword: '' });
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to update profile.'
          );
        },
      });
  }

  deleteAccount(): void {
    this.statusMessage.set('');
    this.errorMessage.set('');
    const email = this.currentEmail();
    if (!email || !this.canDelete()) {
      this.errorMessage.set('Email confirmation does not match.');
      return;
    }

    this.deleting.set(true);
    this.api
      .delete(`/auth/users/${encodeURIComponent(email)}`)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.signOut.emit();
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to delete account.'
          );
        },
      });
  }

  private loadUser(): void {
    this.loading.set(true);
    this.api
      .get('/auth/me')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response: any) => {
          const user = this.parseUser(response);
          if (user) {
            this.setCurrentUser(user);
          }
        },
        error: () => {
          this.errorMessage.set('Unable to load account.');
        },
      });
  }

  private parseUser(response: any): User | null {
    const raw = response?.user ?? response;
    if (!raw) {
      return null;
    }
    const email = raw.email || raw?.claims?.email || '';
    const fallbackName = email ? email.split('@')[0] : '';
    const name = raw.name || raw?.claims?.name || fallbackName;
    if (!email) {
      return null;
    }
    return { email, name };
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.userUpdated.emit(user);
    this.authService.setUser(user);
    this.nameForm.patchValue({ name: user.name || '' });
  }
}
