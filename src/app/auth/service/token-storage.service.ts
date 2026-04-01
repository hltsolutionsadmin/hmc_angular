import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_IN_KEY = 'expires_in';
  private readonly TOKEN_TYPE_KEY = 'token_type';

  setTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.EXPIRES_IN_KEY, String(tokens.expiresIn));
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokens.tokenType);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
