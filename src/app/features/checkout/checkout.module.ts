import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutShellComponent } from './checkout-shell/checkout-shell.component';
import { CheckoutAddressComponent } from './steps/checkout-address/checkout-address.component';
import { CheckoutPatientComponent } from './steps/checkout-patient/checkout-patient.component';
import { CheckoutPaymentComponent } from './steps/checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './steps/checkout-success/checkout-success.component';

@NgModule({
  declarations: [
    CheckoutShellComponent,
    CheckoutAddressComponent,
    CheckoutPatientComponent,
    CheckoutPaymentComponent,
    CheckoutSuccessComponent
  ],
  imports: [CommonModule, FormsModule, SharedModule, MatIconModule, CheckoutRoutingModule]
})
export class CheckoutModule {}

