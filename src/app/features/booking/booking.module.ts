import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BookingRoutingModule } from './booking-routing.module';
import { SlotSelectionComponent } from './slot-selection/slot-selection.component';
import { BookingCheckoutComponent } from './booking-checkout/booking-checkout.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SlotSelectionComponent,
    BookingCheckoutComponent,
    BookingConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BookingRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRippleModule,
  ],
})
export class BookingModule {}
