import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CatalogService } from '../../../shared/services/catalog.service';
import { SectionService } from '../../home/sections/section.service';
import { BookingFlowStateService } from '../services/booking-flow-state.service';
import { SlotService } from '../services/slot.service';
import { SlotDate, TimeSlot } from '../models/booking-flow.model';
import { StoreTest } from '../../../shared/models/storefront';

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
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private slotService: SlotService,
    private flowState: BookingFlowStateService,
    private catalog: CatalogService,
  ) {}

  ngOnInit(): void {
    this.dates = this.slotService.getDates();
    this.selectedDate = this.dates[0];

    // Restore test from state or find from catalog
    const state = this.flowState.snapshot();
    if (state.selectedTest) {
      this.test = state.selectedTest;
    } else {
      // Try to find from catalog by id param
      const testId = this.route.snapshot.paramMap.get('testId');
      if (testId) {
        const allTests = this.catalog.getAllTests();
        this.test = allTests.find(t => t.id === testId) ?? null;
        if (this.test) {
          this.flowState.setTest(this.test);
        }
      }
    }

    this.loadSlots();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectDate(date: SlotDate): void {
    this.selectedDate = date;
    this.selectedSlot = null;
    this.loadSlots();
  }

  selectSlot(slot: TimeSlot): void {
    if (!slot.available) return;
    this.selectedSlot = slot;
  }

  private loadSlots(): void {
    if (!this.test) return;
    this.loadingSlots = true;
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
        },
      });
  }

  get morningSlots(): TimeSlot[] {
    return this.slots.filter(s => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h < 12;
    });
  }

  get afternoonSlots(): TimeSlot[] {
    return this.slots.filter(s => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h >= 12 && h < 17;
    });
  }

  get eveningSlots(): TimeSlot[] {
    return this.slots.filter(s => {
      const h = parseInt(s.startTime.split(':')[0]);
      return h >= 17;
    });
  }

  onBookAppointment(): void {
    if (!this.selectedSlot || !this.test) return;
    this.flowState.setSlotAndDate(this.selectedSlot, this.selectedDate);
    this.router.navigate(['/layout/booking/checkout']);
  }

  trackById(_: number, item: TimeSlot): string {
    return item.id;
  }

  trackByDateStr(_: number, item: SlotDate): string {
    return item.dateStr;
  }
}
