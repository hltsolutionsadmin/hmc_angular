import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking, BookingStatus } from '../../../shared/models/storefront';
import { BookingService } from '../../../shared/services/booking.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit {
  id = '';
  booking?: Booking;

  steps: { key: BookingStatus; label: string; icon: string }[] = [
    { key: 'Confirmed', label: 'Confirmed', icon: 'verified' },
    { key: 'Sample Collected', label: 'Sample collected', icon: 'home' },
    { key: 'Processing', label: 'Lab processing', icon: 'science' },
    { key: 'Report Ready', label: 'Report ready', icon: 'description' },
    { key: 'Completed', label: 'Completed', icon: 'check_circle' }
  ];

  constructor(private route: ActivatedRoute, private svc: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.booking = this.svc.get(this.id);
    if (!this.booking) this.router.navigate(['/layout/orders']);
  }

  isDone(step: BookingStatus): boolean {
    if (!this.booking) return false;
    const order = this.steps.map((s) => s.key);
    return order.indexOf(step) <= order.indexOf(this.booking.status);
  }
}

