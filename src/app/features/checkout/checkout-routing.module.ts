import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutShellComponent } from './checkout-shell/checkout-shell.component';
import { CheckoutAddressComponent } from './steps/checkout-address/checkout-address.component';
import { CheckoutPatientComponent } from './steps/checkout-patient/checkout-patient.component';
import { CheckoutPaymentComponent } from './steps/checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './steps/checkout-success/checkout-success.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: CheckoutShellComponent,
  //   children: [
  //     { path: '', redirectTo: 'address', pathMatch: 'full' },
  //     { path: 'address', component: CheckoutAddressComponent },
  //     { path: 'patient', component: CheckoutPatientComponent },
  //     { path: 'payment', component: CheckoutPaymentComponent },
  //     { path: 'success/:id', component: CheckoutSuccessComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}

