import { Component } from '@angular/core';
import { CheckoutStateService } from '../../checkout/services/checkout-state.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  name = 'Clinic User';
  mobile = '9999999999';
  email = 'user@clinic.com';

  constructor(public checkoutState: CheckoutStateService) {}
}

