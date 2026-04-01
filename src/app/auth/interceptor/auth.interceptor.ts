import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../service/token-storage.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
let isRedirectingToLogin = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokenStorage.getAccessToken();

  const headers: Record<string, string> = {
    'X-Skillrat-Tenant': 'default'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const clonedReq = req.clone({
    setHeaders: headers
  });

  const isLoginRequest = clonedReq.url.includes('/auth/login');
  const isRefreshRequest = clonedReq.url.includes('/auth/refresh');

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !isLoginRequest &&
        !isRefreshRequest
      ) {
        tokenStorage.clear();

        const currentUrl = router.url;
        const isAlreadyOnLogin = currentUrl.startsWith('/login');

        if (!isRedirectingToLogin && !isAlreadyOnLogin) {
          isRedirectingToLogin = true;

          router.navigate(['/login'], {
            queryParams: { returnUrl: currentUrl }
          }).finally(() => {
            isRedirectingToLogin = false;
          });
        }
      }

      return throwError(() => error);
    })
  );
};
