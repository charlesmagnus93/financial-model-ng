import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const TOKEN_EXPIRATION_KEY = 'tokenExpiration';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const expiration = localStorage.getItem(TOKEN_EXPIRATION_KEY);

  if (expiration) {
    const expirationTime = parseInt(expiration, 10);
    if (!Number.isNaN(expirationTime) && Date.now() > expirationTime) {
      authService.signout();
      return throwError(() => new Error('Session expired.'));
    }
  }

  const token = authService.getToken();
  const authorizedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.signout();
      }
      return throwError(() => error);
    })
  );
};
