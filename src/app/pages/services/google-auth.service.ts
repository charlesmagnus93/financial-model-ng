import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable, from, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {}

  /**
   * Initialize Google OAuth
   */
  initGoogleAuth(): void {
    this.socialAuthService.initState.subscribe(() => {
      // Google OAuth initialized
    });
  }

  /**
   * Sign in with Google
   */
  signInWithGoogle(): Observable<any> {
    return from(this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)).pipe(
      switchMap((socialUser: SocialUser) => {
        // Send Google token to backend for verification
        return this.authService.signinWithGoogle(socialUser.idToken);
      })
    );
  }

  /**
   * Sign out from Google
   */
  signOut(): Promise<void> {
    return this.socialAuthService.signOut();
  }

  /**
   * Get current Google user state
   */
  getCurrentUser(): Observable<SocialUser | null> {
    return this.socialAuthService.authState;
  }

  /**
   * Refresh Google token
   */
  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
