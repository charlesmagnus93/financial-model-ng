import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthRes } from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @param rememberMe Whether to remember the user
   * @returns Observable with authentication response
   */
  signin(email: string, password: string, rememberMe: boolean = false): Observable<AuthRes> {
    // Backend expects email/password (not username) for login
    const credentials = { email, password };

    return this.apiService.post('/auth/login', credentials).pipe(
      tap((response: AuthRes) => {
        // console.log('Signin response:', response);
        // Store token in localStorage if provided
        if (response.access_token) {
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('rememberMe', rememberMe.toString());
          // Store expiration time (e.g., 30 days if checked, 1 day if not)
          const expirationDays = rememberMe ? 30 : 1;
          const expirationTime = new Date().getTime() + (expirationDays * 24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        // Store user data if provided
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  signup(email: string, password: string, username: string | null): Observable<AuthRes> {
    const credentials = { email, password, name: username };
    return this.apiService.post('/auth/register', credentials).pipe(
      tap((response: AuthRes) => {
        console.log('Signup response:', response);
        // Store token in localStorage if provided
        if (response.access_token) {
          localStorage.setItem('authToken', response.access_token);
        }
        // Store user data if provided
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * Sign in with Google OAuth token
   * @param idToken Google ID token
   * @returns Observable with authentication response
   */
  signinWithGoogle(idToken: string): Observable<any> {
    const credentials = { idToken };

    return this.apiService.post('/auth/google-signin', credentials).pipe(
      tap((response: any) => {
        // Store token in localStorage if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authProvider', 'google');
          // Store expiration time (default to 30 days for OAuth)
          const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        // Store user data if provided
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * Sign out user
   */
  signout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('authProvider');
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated by verifying token exists and is not expired
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = localStorage.getItem('tokenExpiration');

    if (!token) {
      return false;
    }

    if (expiration) {
      const expirationTime = parseInt(expiration, 10);
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        // Token expired, clean up
        this.signout();
        return false;
      }
    }

    return true;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get stored user data
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if remember me was selected
   */
  isRememberMe(): boolean {
    return localStorage.getItem('rememberMe') === 'true';
  }
}
