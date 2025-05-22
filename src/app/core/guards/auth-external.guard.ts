import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ExternalAuthService } from '../../core/auth/services/external-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(ExternalAuthService);
  debugger;
  if (authService.isAuthenticated()) {
    // User is authenticated, proceed
    return true;
  }
  
  // User is not authenticated, redirect to login
  return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(ExternalAuthService);
  
  if (!authService.isAuthenticated()) {
    // User is not authenticated, proceed to auth pages
    return true;
  }
  
  // User is already authenticated, redirect to home
  router.navigate(['/']);
  
  return false;
};
