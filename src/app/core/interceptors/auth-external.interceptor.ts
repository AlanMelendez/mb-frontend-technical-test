import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Type } from '@angular/core';
import { ExternalAuthService } from '../../core/auth/services/external-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

export const authExternalInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ExternalAuthService);
  const cookieService = inject(CookieService);
  const loaderService = inject(NgxUiLoaderService);
  
  loaderService.start();
  
  const language = cookieService.get('lang') || 'en';
  const token = authService.isAuthenticated() ? authService.getToken() : null;
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Allow-Origin': '*',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`,
        'Language': language,
      },
    });
    
    return next(clonedRequest).pipe(
      finalize(() => loaderService.stop())
    );
  }
  
  return next(req).pipe(
    finalize(() => loaderService.stop())
  );
};
