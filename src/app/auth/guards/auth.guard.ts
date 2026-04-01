import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';

const RETURN_URL_KEY = 'hmc_return_url';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  // Public routes that never require auth
  const publicPrefixes = [
    '/layout/home',
    '/layout/tests',
    '/layout/booking/slots', // slot browsing is public
  ];

  if (publicPrefixes.some((path) => state.url.startsWith(path))) {
    return true;
  }

  if (tokenStorage.isLoggedIn()) {
    return true;
  }

  // Save the intended URL so login can redirect back
  try {
    sessionStorage.setItem(RETURN_URL_KEY, state.url);
  } catch { /* ignore */ }

  return router.createUrlTree(['/login']);
};

/** Helper to read & clear the return URL after login */
export function consumeReturnUrl(): string | null {
  try {
    const url = sessionStorage.getItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    return url;
  } catch {
    return null;
  }
}
