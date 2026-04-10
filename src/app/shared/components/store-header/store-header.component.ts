import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenStorageService } from '../../../auth/service/token-storage.service';
import { CurrentUserService } from '../../../auth/service/current-user.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrl: './store-header.component.css',
  animations: [
    trigger('menuFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' }))])
    ]),
    trigger('drawerSlide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('160ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('120ms ease-in', style({ opacity: 0 }))])
    ])
  ]
})
export class StoreHeaderComponent implements OnInit{
  // private readonly cartFacade = inject(CartFacadeService);
  // readonly cartCount$ = this.cartFacade.totalUniqueItemsCount$;
  private readonly currentUserService = inject(CurrentUserService);
  query = '';
  locationLabel = 'Home';
  showProfile = false;
  showDrawer = false;
  elevate = false;
  readonly currentUser$ = this.currentUserService.currentUser$;

  constructor(private router: Router, private storageService: TokenStorageService) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.showProfile = false;
      this.showDrawer = false;
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.elevate = (window?.scrollY ?? 0) > 4;
  }

  ngOnInit(): void {
    // this.cartFacade.loadCart();
  }
  
  toggleProfile(): void {
    this.showProfile = !this.showProfile;
  }

  toggleDrawer(): void {
    this.showDrawer = !this.showDrawer;
  }

  closeOverlays(): void {
    this.showProfile = false;
    this.showDrawer = false;
  }

  onSearch(): void {
    const q = this.query.trim();
    this.router.navigate(['/layout/tests'], { queryParams: q ? { q } : {} });
  }

  logout() {
    this.storageService.clear();
    this.currentUserService.clear();
    this.router.navigate(['/login']);
  }
}

