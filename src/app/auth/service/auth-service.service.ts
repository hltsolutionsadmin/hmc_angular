import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import {
  LoginRequest,
  LoginResponse,
  OtpLoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  SendOtpRequest,
  VerifyOtpRequest
} from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly authServiceBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload, { headers }).pipe(
      tap((response) => {
        this.tokenStorage.setTokens(response);
        if (payload.deviceId) {
          this.tokenStorage.setDeviceId(payload.deviceId);
        }
      })
    );
  }

  sendOtp(payload: SendOtpRequest): Observable<unknown> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.post(`${this.baseUrl}/otp/send`, payload, { headers });
  }

  loginWithOtp(payload: OtpLoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.post<LoginResponse>(`${this.baseUrl}/otp/login`, payload, { headers }).pipe(
      tap((response) => {
        this.tokenStorage.setTokens(response);
        if (payload.deviceId) {
          this.tokenStorage.setDeviceId(payload.deviceId);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.post<RegisterResponse>(`${this.authServiceBaseUrl}/auth/register`, payload, { headers });
  }

  verifyOtp(payload: VerifyOtpRequest): Observable<unknown> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.post(`${this.authServiceBaseUrl}/api/auth/verify-otp`, payload, { headers });
  }

  resendOtp(payload: ResendOtpRequest): Observable<unknown> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    // Backend currently exposes resend-otp on port 9443
    return this.http.post(`${environment.apiBaseUrl}/api/auth/resend-otp`, payload, { headers });
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.isLoggedIn();
  }
}
