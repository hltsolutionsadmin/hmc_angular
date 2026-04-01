import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreTest } from '../../../shared/models/storefront';
import { BookingFlowState, PatientDetails, SlotDate, TimeSlot } from '../models/booking-flow.model';

const SESSION_KEY = 'hmc_booking_flow';

@Injectable({ providedIn: 'root' })
export class BookingFlowStateService {
  private _state: BookingFlowState = {
    selectedTest: null,
    selectedSlot: null,
    selectedDate: null,
    patientDetails: null,
    bookingId: null,
  };

  private _state$ = new BehaviorSubject<BookingFlowState>(this._state);

  get state$(): Observable<BookingFlowState> {
    return this._state$.asObservable();
  }

  snapshot(): BookingFlowState {
    return this._state;
  }

  setTest(test: StoreTest): void {
    this._state = { ...this._state, selectedTest: test, selectedSlot: null, selectedDate: null };
    this._state$.next(this._state);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ test }));
    } catch { /* ignore */ }
  }

  setSlotAndDate(slot: TimeSlot, date: SlotDate): void {
    this._state = { ...this._state, selectedSlot: slot, selectedDate: date };
    this._state$.next(this._state);
  }

  setPatientDetails(details: PatientDetails): void {
    this._state = { ...this._state, patientDetails: details };
    this._state$.next(this._state);
  }

  setBookingId(id: string): void {
    this._state = { ...this._state, bookingId: id };
    this._state$.next(this._state);
  }

  /** Called after login redirect to restore the selected test */
  restoreFromSession(): void {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { test: StoreTest };
      if (data?.test) {
        this._state = { ...this._state, selectedTest: data.test };
        this._state$.next(this._state);
      }
    } catch { /* ignore */ }
  }

  reset(): void {
    this._state = {
      selectedTest: null,
      selectedSlot: null,
      selectedDate: null,
      patientDetails: null,
      bookingId: null,
    };
    this._state$.next(this._state);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }
}
