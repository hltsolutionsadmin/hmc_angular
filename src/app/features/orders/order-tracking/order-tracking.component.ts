import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Booking } from '../../../shared/models/storefront.model';
import { FulfillmentOrderDto, FulfillmentService, FulfillmentTrackingEventDto } from '../../../shared/services/fulfillment/fulfillment.service';
import { OrderAppointmentDto, OrderDto, OrdersService } from '../../../shared/services/orders/orders.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('220ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  id = '';
  loading = true;
  errorMessage = '';

  booking?: Booking;
  fulfillmentOrders: FulfillmentOrderDto[] = [];
  latestTracking?: { fulfillmentId: string; event: FulfillmentTrackingEventDto };
  trackingTimeline: { fulfillmentId: string; event: FulfillmentTrackingEventDto }[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersApi: OrdersService,
    private fulfillmentApi: FulfillmentService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      void this.router.navigate(['/layout/orders']);
      return;
    }

    this.loadOrderBasics();
    this.loadTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  back(): void {
    void this.router.navigate(['/layout/orders']);
  }

  formatTrackingStatus(value: string): string {
    return String(value ?? '')
      .trim()
      .replaceAll('_', ' ')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }

  formatDateTime(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso ?? '');
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private loadOrderBasics(): void {
    // We don't have an order-by-id API wired yet; reuse "my orders" list to show items/slot/amount.
    this.ordersApi
      .getMyOrders(0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const order = (res?.content ?? []).find((o) => o.id === this.id);
          if (!order) return;
          this.booking = this.mapOrderToBooking(order);
        },
        error: () => {
          // ignore: tracking view still works without this
        }
      });
  }

  loadTracking(): void {
    this.loading = true;
    this.errorMessage = '';

    this.fulfillmentApi
      .getOrderFulfillment(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.fulfillmentOrders = Array.isArray(res) ? res : [];
          this.rebuildTrackingTimeline();
          this.loading = false;
        },
        error: () => {
          this.fulfillmentOrders = [];
          this.trackingTimeline = [];
          this.latestTracking = undefined;
          this.loading = false;
          this.errorMessage = 'Unable to load tracking right now. Please try again.';
        }
      });
  }

  private rebuildTrackingTimeline(): void {
    const all: { fulfillmentId: string; event: FulfillmentTrackingEventDto }[] = [];

    for (const f of this.fulfillmentOrders ?? []) {
      for (const ev of f.trackingEvents ?? []) {
        all.push({ fulfillmentId: f.id, event: ev });
      }
    }

    all.sort((a, b) => this.ts(b.event.eventTimestamp) - this.ts(a.event.eventTimestamp));
    this.trackingTimeline = all;
    this.latestTracking = all[0];
  }

  private ts(value: string): number {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private mapOrderToBooking(order: OrderDto): Booking {
    const appt = this.pickAppointment(order);
    return {
      id: order.id,
      placedOn: this.pickPlacedOn(order),
      patientName: '—',
      items: (order.lineItems ?? []).map((li) => ({
        title: `${li.productName} (${li.productCode})`,
        kind: 'test'
      })),
      amountPaid: Number(order.totalPrice ?? 0),
      status: this.mapStatus(order.status),
      appointment: appt
        ? {
            slotDate: appt.slotDate,
            displayTime: this.formatTimeRange(appt.startTime, appt.endTime)
          }
        : undefined
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

