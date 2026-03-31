import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PasswordModule,
    ButtonModule,
    Message,
  ],
  template: `
    <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
      <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
      >
        <div class="flex flex-col items-center justify-center">
          <div
            style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
          >
            <div
              class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
              style="border-radius: 53px"
            >
              <div class="text-center mb-8">
                <div
                  class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4"
                >
                  Reset your password
                </div>
                <span class="text-muted-color font-medium">
                  Create a new password for your account.
                </span>
              </div>

              @if (isVerifyingToken) {
                <div class="text-center">
                  <p class="text-sm text-muted-color mb-4">
                    Verifying token...
                  </p>
                </div>
              } @else if (!isTokenValid) {
                <div class="text-center">
                <div class="card flex flex-col items-center justify-center">
                    <p-message
                        severity="error"
                        variant="simple"
                        size="small"
                        [text]="tokenErrorMessage"
                    ></p-message>
                </div>
                  <p class="text-sm text-muted-color mt-4 mb-6">
                    Request a new reset link and try again.
                  </p>
                  <p-button
                    type="button"
                    styleClass="w-full"
                    label="Request new reset link"
                    routerLink="/forgot-password"
                  >
                  </p-button>
                </div>
              } @else if (!resetDone) {
                <div>
                  <p-message
                    severity="info"
                    variant="simple"
                    size="small"
                    text="Reset link detected. Set a new password to continue."
                  >
                  </p-message>

                  <label
                    for="newPassword"
                    class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2 mt-4"
                    >New password</label
                  >
                  <p-password
                    id="newPassword"
                    formControlName="newPassword"
                    placeholder="New password"
                    [toggleMask]="true"
                    styleClass="mb-4"
                    [fluid]="true"
                    [feedback]="false"
                  >
                  </p-password>
                  <div class="text-xs text-surface-500 mb-2">
                    Use 8+ chars with upper/lowercase, a number, and a special
                    character.
                  </div>
                  @if (
                    resetPasswordForm.controls['newPassword'].invalid &&
                    (resetPasswordForm.controls['newPassword'].dirty ||
                      resetPasswordForm.controls['newPassword'].touched)
                  ) {
                    <p-message severity="error" variant="simple" size="small">
                      @if (
                        resetPasswordForm.controls['newPassword'].errors?.[
                          'required'
                        ]
                      ) {
                        <div
                          class="p-message p-component p-message-error p-message-simple p-message-sm"
                          aria-live="polite"
                          role="alert"
                        >
                          <div class="p-message-content">
                            <span class="p-message-text"
                              >New password is required</span
                            >
                          </div>
                        </div>
                      }
                      @if (
                        resetPasswordForm.controls['newPassword'].errors?.[
                          'pattern'
                        ]
                      ) {
                        <div
                          class="p-message p-component p-message-error p-message-simple p-message-sm"
                          aria-live="polite"
                          role="alert"
                        >
                          <div class="p-message-content">
                            <span class="p-message-text"
                              >Password must match the required format.</span
                            >
                          </div>
                        </div>
                      }
                    </p-message>
                  }

                  <label
                    for="confirmPassword"
                    class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                    >Confirm password</label
                  >
                  <p-password
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    placeholder="Confirm password"
                    [toggleMask]="true"
                    styleClass="mb-4"
                    [fluid]="true"
                    [feedback]="false"
                  >
                  </p-password>
                  @if (
                    (resetPasswordForm.controls['confirmPassword'].invalid &&
                      (resetPasswordForm.controls['confirmPassword'].dirty ||
                        resetPasswordForm.controls['confirmPassword']
                          .touched)) ||
                    (resetPasswordForm.hasError('passwordMismatch') &&
                      (resetPasswordForm.controls['confirmPassword'].dirty ||
                        resetPasswordForm.controls['confirmPassword'].touched ||
                        resetPasswordForm.controls['newPassword'].dirty ||
                        resetPasswordForm.controls['newPassword'].touched))
                  ) {
                    <p-message severity="error" variant="simple" size="small">
                      @if (
                        resetPasswordForm.controls['confirmPassword'].errors?.[
                          'required'
                        ]
                      ) {
                        <div
                          class="p-message p-component p-message-error p-message-simple p-message-sm"
                          aria-live="polite"
                          role="alert"
                        >
                          <div class="p-message-content">
                            <span class="p-message-text"
                              >Confirm password is required</span
                            >
                          </div>
                        </div>
                      }
                      @if (resetPasswordForm.hasError('passwordMismatch')) {
                        <div
                          class="p-message p-component p-message-error p-message-simple p-message-sm"
                          aria-live="polite"
                          role="alert"
                        >
                          <div class="p-message-content">
                            <span class="p-message-text"
                              >Passwords do not match</span
                            >
                          </div>
                        </div>
                      }
                    </p-message>
                  }

                  <p-button
                    type="submit"
                    [disabled]="!resetPasswordForm.valid || isSubmitting"
                    [label]="
                      isSubmitting ? 'Updating password...' : 'Update password'
                    "
                    styleClass="w-full mt-2"
                  >
                  </p-button>
                  @if (submitErrorMessage) {
                    <div class="flex justify-center mt-4">
                      <p-message
                        severity="error"
                        variant="simple"
                        size="small"
                        [text]="submitErrorMessage"
                      ></p-message>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center">
                  <p-message
                    severity="success"
                    variant="simple"
                    size="small"
                    [text]="resetSuccessMessage || 'Password updated successfully.'"
                  >
                  </p-message>
                  <p class="text-sm text-muted-color mt-4 mb-6">
                    You can now sign in with your new password.
                  </p>
                  <p-button
                    type="button"
                    styleClass="w-full"
                    label="Back to sign in"
                    routerLink="/login"
                  >
                  </p-button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class ResetPassword implements OnInit {
  isVerifyingToken = true;
  isTokenValid = false;
  tokenErrorMessage = '';
  token = '';
  resetDone = false;
  isSubmitting = false;
  submitErrorMessage = '';
  resetSuccessMessage = '';

  passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator },
  );

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';

    if (!this.token) {
      this.isVerifyingToken = false;
      this.isTokenValid = false;
      this.tokenErrorMessage = 'Invalid or missing reset token.';
      return;
    }

    // Backend does not expose a dedicated "validate token" endpoint.
    this.isVerifyingToken = false;
    this.isTokenValid = true;
    this.tokenErrorMessage = '';
  }

  onSubmit() {
    if (!this.isTokenValid) {
      return;
    }

    if (!this.resetPasswordForm.valid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitErrorMessage = '';
    this.resetSuccessMessage = '';

    const newPassword = this.resetPasswordForm.value.newPassword ?? '';
    this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.resetDone = true;
          this.resetSuccessMessage = response?.message ?? '';
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitErrorMessage =
            error?.error?.message ||
            'Unable to update password. Please try again.';
        },
      });
  }
}
