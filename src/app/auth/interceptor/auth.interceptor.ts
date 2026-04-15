import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';
import { environment } from '../../../environment/environment';
import { CurrentUserService } from '../service/current-user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);
  const httpBackend = inject(HttpBackend);

  const shouldSkipAuth = isAuthExcludedUrl(req.url);
  const accessToken = tokenStorage.getAccessToken();

  const authReq =
    !shouldSkipAuth && accessToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
            'X-Skillrat-Tenant': 'default'
          }
        })
      : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (
        shouldSkipAuth ||
        !(error instanceof HttpErrorResponse) ||
        (error.status !== HttpStatusCode.Unauthorized && error.status !== HttpStatusCode.Forbidden)
      ) {
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      const deviceId = tokenStorage.getDeviceId();

      if (!refreshToken || !deviceId) {
        forceLogout(tokenStorage, currentUser, router);
        return throwError(() => error);
      }

      const shouldValidateFirst = !isCurrentUserUrl(req.url);

      const validation$ = shouldValidateFirst
        ? validateAccessToken(httpBackend, accessToken)
        : of(false);

      return validation$.pipe(
        switchMap((tokenIsValid) => {
          if (tokenIsValid) {
            // Token is valid; treat this as an API-specific 401/403.
            return throwError(() => error);
          }

          return refreshTokens(httpBackend, tokenStorage, refreshToken, deviceId).pipe(
            switchMap((tokens) => {
              const retryReq = authReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                  'X-Skillrat-Tenant': 'default'
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              forceLogout(tokenStorage, currentUser, router);
              return throwError(() => refreshError);
            })
          );
        }),
        catchError(() => {
          // Token validation endpoint failed unexpectedly; keep the original error.
          return throwError(() => error);
        })
      );
    })
  );
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

let refreshRequest$: Observable<RefreshResponse> | null = null;

function validateAccessToken(httpBackend: HttpBackend, accessToken: string | null): Observable<boolean> {
  if (!accessToken) return of(false);

  const http = new HttpClient(httpBackend);
  const headers = new HttpHeaders({
    Authorization: `Bearer ${accessToken}`,
    'X-Skillrat-Tenant': 'default'
  });

  return http.get(`${environment.userApiBaseUrl}/api/users/me`, { headers }).pipe(
    map(() => true),
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden)
      ) {
        return of(false);
      }
      return throwError(() => error);
    })
  );
}

function refreshTokens(
  httpBackend: HttpBackend,
  tokenStorage: TokenStorageService,
  refreshToken: string,
  deviceId: string
): Observable<RefreshResponse> {
  if (!refreshRequest$) {
    const http = new HttpClient(httpBackend);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    refreshRequest$ = http
      .post<RefreshResponse>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken, deviceId }, { headers })
      .pipe(
        tap((tokens) => tokenStorage.setTokens(tokens)),
        finalize(() => {
          refreshRequest$ = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
  }

  return refreshRequest$;
}

function forceLogout(tokenStorage: TokenStorageService, currentUser: CurrentUserService, router: Router): void {
  tokenStorage.clear();
  currentUser.clear();
  void router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
}

function isAuthExcludedUrl(url: string): boolean {
  const normalized = url.toLowerCase();
  return (
    normalized.includes('/auth/login') ||
    normalized.includes('/auth/register') ||
    normalized.includes('/auth/refresh') ||
    normalized.includes('/auth/otp/send') ||
    normalized.includes('/auth/otp/login') ||
    normalized.includes('/api/auth/verify-otp') ||
    normalized.includes('/api/auth/resend-otp')
  );
}

function isCurrentUserUrl(url: string): boolean {
  return url.toLowerCase().includes('/api/users/me');
}
