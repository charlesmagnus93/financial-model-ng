import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Observable with authentication response
   */
  signin(email: string, password: string, rememberMe: boolean): Observable<any> {
    const credentials = { email, password };
    
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials).pipe(
      tap((response: any) => {
        // Store token in localStorage if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
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

  /**
   * Sign out user
   */
  signout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/signin']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
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
}
