import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../../shared/models/storefront';
import { OrderAppointmentDto, OrderDto, OrdersService } from '../../../shared/services/orders.service';

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

  constructor(private ordersApi: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.ordersApi.getMyOrders(0, 50).subscribe({
      next: (res) => {
        this.bookings = (res?.content ?? []).map((o) => this.mapOrderToBooking(o));
      },
      error: () => {
        this.bookings = [];
      }
    });
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

  private mapOrderToBooking(order: OrderDto): Booking {
    const appt = this.pickAppointment(order);
    return {
      id: order.id,
      placedOn: this.pickPlacedOn(order),
      patientName: '—',
      items: (order.lineItems ?? []).map((li) => ({
        title: `${li.productName} (${li.productCode})`,
        kind: 'test',
      })),
      amountPaid: Number(order.totalPrice ?? 0),
      status: this.mapStatus(order.status),
      etaText: 'Report ready by tomorrow',
      appointment: appt
        ? {
            slotDate: appt.slotDate,
            displayTime: this.formatTimeRange(appt.startTime, appt.endTime),
          }
        : undefined,
    };
  }

  private pickPlacedOn(order: OrderDto): string {
    return String(order.createdAt || order.updatedAt || '').trim();
  }

  private pickAppointment(order: OrderDto): OrderAppointmentDto | null {
    const items = order.appointments ?? [];
    if (!Array.isArray(items) || items.length === 0) return null;
    return items[0] ?? null;
  }

  private stripSeconds(value: string): string {
    const parts = String(value ?? '').split(':');
    const hh = String(parts[0] ?? '00').padStart(2, '0');
    const mm = String(parts[1] ?? '00').padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private to12h(hhmm: string): string {
    const [h, m] = String(hhmm ?? '').split(':');
    const hh = Number(h ?? 0);
    const mm = Number(m ?? 0);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${String(hour12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ampm}`;
  }

  private formatTimeRange(startTime: string, endTime: string): string {
    const start = this.stripSeconds(startTime);
    const end = this.stripSeconds(endTime);
    return `${this.to12h(start)} – ${this.to12h(end)}`;
  }

  formatSlotDate(dateStr: string): string {
    const raw = String(dateStr ?? '').trim();
    const [y, m, d] = raw.split('-').map((x) => Number(x));
    if (!y || !m || !d) return raw;
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d).padStart(2, '0')} ${MONTH[m - 1] ?? ''} ${y}`.trim();
  }

  private mapStatus(raw: string): Booking['status'] {
    const s = String(raw || '').toUpperCase();
    if (s === 'CONFIRMED') return 'Confirmed';
    if (s === 'PENDING') return 'Pending';
    if (s === 'CANCELLED' || s === 'CANCELED') return 'Cancelled';
    if (s === 'COMPLETED') return 'Completed';
    return 'Processing';
  }
}
