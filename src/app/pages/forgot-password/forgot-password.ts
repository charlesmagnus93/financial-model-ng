import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    Message,
  ],
  template: `
    <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
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
                  Forgot your password?
                </div>
                <span class="text-muted-color font-medium">
                  Enter your email and we will send you a reset link.
                </span>
              </div>

              @if (!submitted) {
                <div>
                  <label
                    for="email"
                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                    >Email</label
                  >
                  <input
                    pInputText
                    id="email"
                    type="text"
                    placeholder="Email address"
                    class="w-full mb-4"
                    formControlName="email"
                  />
                  @if (
                    forgotPasswordForm.controls['email'].invalid &&
                    (forgotPasswordForm.controls['email'].dirty ||
                      forgotPasswordForm.controls['email'].touched)
                  ) {
                    <p-message severity="error" variant="simple" size="small">
                      @if (
                        forgotPasswordForm.controls['email'].errors?.[
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
                              >Email is required</span
                            >
                          </div>
                        </div>
                      }
                      @if (
                        forgotPasswordForm.controls['email'].errors?.['email']
                      ) {
                        <div
                          class="p-message p-component p-message-error p-message-simple p-message-sm"
                          aria-live="polite"
                          role="alert"
                        >
                          <div class="p-message-content">
                            <span class="p-message-text">Email is invalid</span>
                          </div>
                        </div>
                      }
                    </p-message>
                  }

                  <p-button
                    type="submit"
                    [disabled]="!forgotPasswordForm.valid || isSubmitting"
                    [label]="
                      isSubmitting ? 'Sending link...' : 'Send reset link'
                    "
                    styleClass="w-full mt-2"
                  >
                  </p-button>
                  @if (errorMessage) {
                    <div class="flex justify-center mt-4">
                      <p-message
                        severity="error"
                        variant="simple"
                        size="small"
                        [text]="errorMessage"
                      ></p-message>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center">
                <div class="card flex flex-col items-center justify-center">
                    <p-message
                        severity="success"
                        variant="simple"
                        size="small"
                        [text]="successMessage || 'Reset link sent to ' + submittedEmail"
                    >
                    </p-message>
                </div>
                  <p class="text-sm text-muted-color mt-4 mb-6">
                    Open your email and click the link to continue.
                  </p>
                  <p-button
                    type="button"
                    styleClass="w-full mb-3"
                    label="Send again"
                    severity="secondary"
                    (click)="onResend()"
                  >
                  </p-button>
                </div>
              }

              <div class="text-center mt-6">
                <a
                  class="text-primary font-medium no-underline cursor-pointer"
                  routerLink="/login"
                >
                  Back to sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class ForgotPassword {
  isSubmitting = false;
  submitted = false;
  submittedEmail = '';
  errorMessage = '';
  successMessage = '';

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.submittedEmail = this.forgotPasswordForm.value.email ?? '';

    this.authService.requestPasswordReset(this.submittedEmail).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitted = true;
        this.successMessage = response?.message ?? '';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ||
          'Unable to send reset link. Please try again.';
      },
    });
  }

  onResend() {
    this.submitted = false;
    this.onSubmit();
  }
}
