import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingFlowStateService } from '../services/booking-flow-state.service';
import { BookingFlowState } from '../models/booking-flow.model';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.css',
})
export class BookingConfirmationComponent implements OnInit {
  state!: BookingFlowState;
  showAnimation = false;

  constructor(
    private router: Router,
    private flowState: BookingFlowStateService,
  ) {}

  ngOnInit(): void {
    this.state = this.flowState.snapshot();

    // Guard: if no booking ID, go to tests
    if (!this.state.bookingId) {
      this.router.navigate(['/layout/tests']);
      return;
    }

    // Trigger success animation
    setTimeout(() => (this.showAnimation = true), 100);
  }

  onBookAnother(): void {
    this.flowState.reset();
    this.router.navigate(['/layout/tests']);
  }

  onTrackBooking(): void {
    this.flowState.reset();
    this.router.navigate(['/layout/orders']);
  }

  onGoHome(): void {
    this.flowState.reset();
    this.router.navigate(['/layout/home']);
  }

  get formattedDate(): string {
    if (!this.state.selectedDate) return '';
    const d = this.state.selectedDate;
    return `${d.dayName}, ${d.dayNumber} ${d.monthName}`;
  }
}
