import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ILoginResponse,
  UserRegister,
  ILoginAuth,
  UserRegisterResponse,
  RegistrationTokenValidationResponse,
  RegistrationTokenValidation,
  RecoveryAccessRequest,
  Send2AuthCodeSMS,
  RegistrationCodeValidationResponse,
  RegistrationCodeValidation,
  CaptchaResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../interfaces/external';
import {
  catchError,
  delay,
  interval,
  map,
  Observable,
  of,
  Subscription,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';

import { SetPassword } from '../interfaces/external/ISetPassword';
import { SetPasswordResponse } from '../interfaces/external/ISetPasswordResponse';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ExternalAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.externalAuth.apiUrl}${'/auth/'}`; // Replace with your actual API URL


  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Allow-Origin': '*',
    'Access-Control-Allow-Origin': '*',
  });

  //Auth state
  private _token = signal<string | null>(localStorage.getItem('token'));
  public isAuthenticated = computed(
    () => !!this.getToken() && !this.isTokenExpired(this.getToken())
  );
  private tokenCheckSubscription?: Subscription;

  constructor() {
    // Initialize token validation on service creation
    this.setupTokenValidation();
  }


  login(data: ILoginAuth): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${this.apiUrl}`, data, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => this.handleAuthResponse(response)), // Handle response here
        catchError((error: any) => {
          return throwError(
            () => new Error(error.message || 'An error occurred during login.')
          );
        })
      );
  }

  register(data: UserRegister): Observable<UserRegisterResponse> {
    return this.http
      .post<UserRegisterResponse>(`${this.apiUrl}/Register`, data, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => this.handleRegisterResponse(response)),
        catchError((error) => {
          //debugger;
          return throwError(() => new Error(error));
        })
      );
  }



  private handleRegistrationTokenValidation(
    response: RegistrationTokenValidationResponse
  ): RegistrationTokenValidationResponse {
    debugger;
    if (!response.isValid) {
      throw new Error(
        response.errors.length > 0
          ? response.errors[0].description
          : 'Token validation failed'
      );
    }
    return response;
  }

  private handleRegisterResponse(
    response: UserRegisterResponse
  ): UserRegisterResponse {
    //debugger;
    if (!response.succeeded) {
      throw new Error(
        response.errors.length > 0
          ? response.errors[0].description
          : 'Registration failed'
      );
    }
    return response;
  }

  private handleAuthResponse(response: ILoginResponse): ILoginResponse {
    if (!response.success || !response.token) {
      throw new Error(response.errors || 'Login failed');
    }
    localStorage.setItem('token', response.token);
    this._token.set(response.token);

    return response;
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return true;
    }
  }

  private setupTokenValidation(): void {
    // Clean up any existing subscription
    this.tokenCheckSubscription?.unsubscribe();

    // Check token validity every 10 minutes
    this.tokenCheckSubscription = interval(1200000) // 1200000 ms = 10 minutes
      .pipe(
        tap(() => console.log('Checking token validity...')),
        takeWhile(() => !!this.getToken())
      )
      .subscribe(() => {
        this.validateToken();
      });
  }

  validateToken(): boolean {
    const currentToken = this.getToken();
    if (!currentToken || this.isTokenExpired(currentToken)) {
      this.logout();
      return false;
    }
    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this.tokenCheckSubscription?.unsubscribe();
    this.router.navigate(['/login']);
  }

  isAuthenticatedValue(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return this._token();
  }


}
