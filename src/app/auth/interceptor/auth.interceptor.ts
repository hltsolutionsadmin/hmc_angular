import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../service/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getAccessToken();
  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Skillrat-Tenant': 'default'
      }
    })
  }
  return next(req);
};
