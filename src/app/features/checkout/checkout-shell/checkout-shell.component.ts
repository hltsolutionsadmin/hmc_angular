import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

type StepKey = 'address' | 'patient' | 'payment' | 'success';

@Component({
  selector: 'app-checkout-shell',
  templateUrl: './checkout-shell.component.html',
  styleUrl: './checkout-shell.component.css'
})
export class CheckoutShellComponent {
  active: StepKey = 'address';

  steps: { key: StepKey; label: string; icon: string; route: string }[] = [
    { key: 'address', label: 'Address', icon: 'location_on', route: '/layout/checkout/address' },
    { key: 'patient', label: 'Patient', icon: 'person', route: '/layout/checkout/patient' },
    { key: 'payment', label: 'Payment', icon: 'payments', route: '/layout/checkout/payment' },
    { key: 'success', label: 'Done', icon: 'verified', route: '' }
  ];

  constructor(private router: Router) {
    this.setActiveFromUrl(router.url);
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.setActiveFromUrl((e as NavigationEnd).urlAfterRedirects);
    });
  }

  go(route: string): void {
    if (!route) return;
    this.router.navigateByUrl(route);
  }

  private setActiveFromUrl(url: string): void {
    if (url.includes('/payment')) this.active = 'payment';
    else if (url.includes('/patient')) this.active = 'patient';
    else if (url.includes('/success')) this.active = 'success';
    else this.active = 'address';
  }
}

