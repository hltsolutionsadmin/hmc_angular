import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { TokenStorageService } from './auth/service/token-storage.service';
import { CurrentUserService } from './auth/service/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'hmc';
  private readonly destroy$ = new Subject<void>();
  private loadingUser = false;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private currentUser: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.maybeLoadCurrentUser();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.maybeLoadCurrentUser());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private maybeLoadCurrentUser(): void {
    if (!this.tokenStorage.isLoggedIn() || this.loadingUser) return;

    this.loadingUser = true;
    this.currentUser.load().subscribe({
      next: () => {
        this.loadingUser = false;
      },
      error: () => {
        this.loadingUser = false;
        this.currentUser.clear();
      }
    });
  }
}
