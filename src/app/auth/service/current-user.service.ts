import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CurrentUser } from '../models/current-user.model';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly userApiBaseUrl = environment.apiBaseUrl;
  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<CurrentUser> {
    const headers = new HttpHeaders({
      'X-Skillrat-Tenant': 'default'
    });

    return this.http
      .get<CurrentUser>(`${this.userApiBaseUrl}/api/users/me`, { headers })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  clear(): void {
    this.currentUserSubject.next(null);
  }
}

