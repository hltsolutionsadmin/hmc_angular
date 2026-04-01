import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlotSelectionComponent } from './slot-selection/slot-selection.component';
import { BookingCheckoutComponent } from './booking-checkout/booking-checkout.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { authGuard } from '../../auth/guards/auth.guard';

const routes: Routes = [
  // Public — no auth needed to browse slots
  { path: 'slots/:testId', component: SlotSelectionComponent },

  // Protected — must be logged in
  { path: 'checkout', component: BookingCheckoutComponent, canActivate: [authGuard] },
  { path: 'confirmation', component: BookingConfirmationComponent, canActivate: [authGuard] },

  // Default redirect
  { path: '', redirectTo: '/layout/tests', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
