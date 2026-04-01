import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../../shared/services/booking.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CheckoutStateService } from '../../services/checkout-state.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.css'
})
export class CheckoutPaymentComponent {
  method: 'upi' | 'card' | 'cod' = 'upi';
  placing = false;

  constructor(
    public cart: CartService,
    public state: CheckoutStateService,
    private booking: BookingService,
    private router: Router
  ) {}

  placeOrder(): void {
    if (this.cart.count === 0) {
      this.router.navigate(['/layout/cart']);
      return;
    }
    if (!this.state.patientName.trim()) {
      this.router.navigate(['/layout/checkout/patient']);
      return;
    }

    this.placing = true;
    setTimeout(() => {
      const b = this.booking.create({
        patientName: this.state.patientName.trim(),
        items: this.cart.items,
        amountPaid: this.cart.subtotal()
      });
      this.cart.clear();
      this.placing = false;
      this.router.navigate(['/layout/checkout/success', b.id]);
    }, 650);
  }
}

