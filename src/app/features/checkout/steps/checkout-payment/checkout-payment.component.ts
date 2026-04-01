import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CartFacadeService } from '../../../cart/service/cart-facade.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.css'
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  method: 'upi' | 'card' | 'cod' = 'upi';
  placing = false;

  payable$!: Observable<number>;

  private hasItems = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private cartFacade: CartFacadeService, private router: Router) {}

  ngOnInit(): void {
    this.cartFacade.loadCart();
    this.payable$ = this.cartFacade.grandTotal$;
    this.cartFacade.items$.pipe(takeUntil(this.destroy$)).subscribe((items) => (this.hasItems = !!items?.length));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  placeOrder(): void {
    if (!this.hasItems) {
      this.router.navigate(['/layout/cart']);
      return;
    }
    if (this.placing) return;

    this.placing = true;
    setTimeout(() => {
      this.placing = false;
      const id = `BK-${Date.now()}`;
      this.router.navigate(['/layout/checkout/success', id]);
    }, 650);
  }
}
