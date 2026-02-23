import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  sidebarOpen = true;
  isTimeAttendanceOpen = false;
  data: string = 'dev'

  constructor(private router: Router) {}

  ngOnInit() {
    // Check the current route on initialization
    this.checkActiveRoute(this.router.url);
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkActiveRoute(event.url);
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleTimeAttendance(): void {
    this.isTimeAttendanceOpen = !this.isTimeAttendanceOpen;
  }

  isServicesActive(): boolean {
    const currentRoute = this.router?.url || '';
    return currentRoute.startsWith('/layout/tests') || 
           currentRoute.startsWith('/layout/products') ||
           currentRoute.startsWith('/layout/categories');
  }

  private checkActiveRoute(url: string): void {
    // Auto-expand the services menu if on a child route
    if (url.startsWith('/layout/tests') || 
        url.startsWith('/layout/products') ||
        url.startsWith('/layout/categories')) {
      this.isTimeAttendanceOpen = true;
    }
  }
}
