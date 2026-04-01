import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { CheckoutStateService } from '../../services/checkout-state.service';

@Component({
  selector: 'app-checkout-patient',
  templateUrl: './checkout-patient.component.html',
  styleUrl: './checkout-patient.component.css'
})
export class CheckoutPatientComponent {
  constructor(public cart: CartService, public state: CheckoutStateService, private router: Router) {}

  continue(): void {
    if (!this.state.patientName.trim()) return;
    if (this.cart.count === 0) {
      this.router.navigate(['/layout/cart']);
      return;
    }
    this.router.navigate(['/layout/checkout/payment']);
  }
}

