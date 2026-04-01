import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../../shared/models/storefront';
import { BookingService } from '../../../shared/services/booking.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  bookings: Booking[] = [];
  searchText = '';
  statusFilter = '';
  statuses: Booking['status'][] = ['Pending', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready', 'Completed', 'Cancelled'];

  constructor(private svc: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.bookings = this.svc.list();
  }

  get filtered(): Booking[] {
    const q = this.searchText.trim().toLowerCase();
    return this.bookings.filter((b) => {
      const matchQ =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.items.some((x) => x.title.toLowerCase().includes(q));
      const matchStatus = !this.statusFilter || b.status === this.statusFilter;
      return matchQ && matchStatus;
    });
  }

  statusClass(status: Booking['status']): string {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Confirmed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Sample Collected':
        return 'bg-sky-50 border-sky-200 text-sky-800';
      case 'Processing':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'Report Ready':
        return 'bg-violet-50 border-violet-200 text-violet-800';
      case 'Completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Cancelled':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  }

  track(b: Booking): void {
    this.router.navigate(['/layout/orders/track', b.id]);
  }
}
