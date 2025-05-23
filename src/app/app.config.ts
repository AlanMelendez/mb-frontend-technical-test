import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // Enable zoneless change detection
    provideHttpClient(
      withFetch(), // Use the Fetch API for HTTP requests
    ),
    provideRouter(routes),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
};
