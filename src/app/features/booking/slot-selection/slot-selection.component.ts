import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { CatalogService } from '../../../shared/services/catalog.service';
import { SectionService } from '../../home/sections/section.service';
import { BookingFlowStateService } from '../services/booking-flow-state.service';
import { SlotService } from '../services/slot.service';
import { SlotDate, TimeSlot } from '../models/booking-flow.model';
import { StoreTest } from '../../../shared/models/storefront';
import { CartService } from '../../cart/service/cart.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-slot-selection',
  templateUrl: './slot-selection.component.html',
  styleUrl: './slot-selection.component.css',
})
export class SlotSelectionComponent implements OnInit, OnDestroy {
  test: StoreTest | null = null;
  dates: SlotDate[] = [];
  selectedDate!: SlotDate;
  slots: TimeSlot[] = [];
  selectedSlot: TimeSlot | null = null;
  loadingSlots = false;
  booking = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private slotService: SlotService,
    private flowState: BookingFlowStateService,
    private catalog: CatalogService,
    private sections: SectionService,
    private cartApi: CartService,
  ) {}

  ngOnInit(): void {
    this.dates = this.slotService.getDates();
    this.selectedDate = this.dates[0];

    // Restore test from state or fetch by route param
    const state = this.flowState.snapshot();
    if (state.selectedTest) {
      this.test = state.selectedTest;
      this.loadSlots();
      return;
    }

    const testId = this.route.snapshot.paramMap.get('testId');
    if (!testId) return;

    this.loadingSlots = true;
    this.sections
      .getStoreTests(0, 500)
      .pipe(
        map((tests) => tests.find((t) => t.id === testId) ?? null),
        catchError(() => {
          const allTests = this.catalog.getAllTests();
          return of(allTests.find((t) => t.id === testId) ?? null);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((test) => {
        this.test = test;
        if (this.test) this.flowState.setTest(this.test);
        this.loadSlots();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectDate(date: SlotDate): void {
    this.selectedDate = date;
    this.selectedSlot = null;
    this.errorMessage = '';
    this.loadSlots();
  }

  selectSlot(slot: TimeSlot): void {
    if (!slot.available || slot.slotClosed) return;
    this.selectedSlot = slot;
  }

  private loadSlots(): void {
    if (!this.test) return;
    this.loadingSlots = true;
    this.errorMessage = '';
    this.slots = [];
    this.slotService
      .getSlots(this.test.id, this.selectedDate.dateStr)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          this.slots = slots;
          this.loadingSlots = false;
        },
        error: () => {
          this.loadingSlots = false;
          this.errorMessage = 'Failed to load slots. Please try again.';
        },
      });
  }

  private isSelectedDateToday(): boolean {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.selectedDate?.dateStr === todayStr;
  }

  private toMinutes(hhmm: string): number {
    const [hRaw, mRaw] = String(hhmm ?? '').split(':');
    const h = Number(hRaw ?? 0);
    const m = Number(mRaw ?? 0);
    return h * 60 + m;
  }

  get visibleSlots(): TimeSlot[] {
    if (!this.isSelectedDateToday()) return this.slots;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return this.slots.filter((s) => this.toMinutes(s.startTime) > nowMinutes);
  }

  get morningSlots(): TimeSlot[] {
    return this.visibleSlots.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h < 12;
    });
  }

  get afternoonSlots(): TimeSlot[] {
    return this.visibleSlots.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h >= 12 && h < 17;
    });
  }

  get eveningSlots(): TimeSlot[] {
    return this.visibleSlots.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h >= 17;
    });
  }

  onBookAppointment(): void {
    if (this.booking) return;
    if (!this.selectedSlot || !this.test) return;

    this.booking = true;
    this.errorMessage = '';

    this.cartApi
      .getActiveCart(environment.storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          const cartId = cart?.id;
          if (!cartId) {
            this.booking = false;
            this.errorMessage = 'Unable to create/load cart.';
            return;
          }

          this.cartApi
            .addItem(cartId, {
              productId: this.test!.id,
              appointmentSlotId: this.selectedSlot!.id,
              appointmentNotes: '',
              quantity: 1,
              gift: false,
              giftMessage: null
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.booking = false;
                this.flowState.setSlotAndDate(this.selectedSlot!, this.selectedDate);
                this.router.navigate(['/layout/booking/checkout']);
              },
              error: (error) => {
                this.booking = false;
                this.errorMessage = error?.error?.message || 'Failed to add item to cart.';
              }
            });
        },
        error: (error) => {
          this.booking = false;
          this.errorMessage = error?.error?.message || 'Unable to load cart.';
        }
      });
  }

  trackById(_: number, item: TimeSlot): string {
    return item.id;
  }

  trackByDateStr(_: number, item: SlotDate): string {
    return item.dateStr;
  }
}
