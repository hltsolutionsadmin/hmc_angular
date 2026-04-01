import { Injectable } from '@angular/core';
import { Booking, BookingStatus, CartItem } from '../models/storefront';

const STORAGE_KEY = 'hmc_bookings_v1';

function nowIso(): string {
  return new Date().toISOString();
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  list(): Booking[] {
    return this.read();
  }

  get(id: string): Booking | undefined {
    return this.read().find((b) => b.id === id);
  }

  create(payload: {
    patientName: string;
    items: CartItem[];
    amountPaid: number;
  }): Booking {
    const id = String(Date.now());
    const booking: Booking = {
      id,
      placedOn: formatShortDate(new Date()),
      patientName: payload.patientName,
      items: payload.items.map((x) => ({ title: x.title, kind: x.kind })),
      amountPaid: payload.amountPaid,
      status: 'Confirmed',
      etaText: 'Sample collection in 60–120 mins'
    };

    const all = [booking, ...this.read()];
    this.write(all);
    return booking;
  }

  advanceStatus(id: string, next: BookingStatus): void {
    const all = this.read();
    const idx = all.findIndex((b) => b.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], status: next };
    this.write(all);
  }

  private read(): Booking[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.seedIfEmpty();
      const parsed = JSON.parse(raw) as Booking[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return this.seedIfEmpty();
    }
  }

  private write(bookings: Booking[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY}_ts`, nowIso());
    } catch {
      // ignore
    }
  }

  private seedIfEmpty(): Booking[] {
    const seeded: Booking[] = [
      {
        id: 'BK10001',
        placedOn: '20 Oct 2025',
        patientName: 'John Doe',
        items: [{ title: 'Complete Blood Count (CBC)', kind: 'test' }],
        amountPaid: 349,
        status: 'Sample Collected',
        etaText: 'Report ready by tomorrow'
      },
      {
        id: 'BK10002',
        placedOn: '18 Oct 2025',
        patientName: 'Maria Silva',
        items: [{ title: 'Smart Health Basic', kind: 'package' }],
        amountPaid: 1299,
        status: 'Confirmed',
        etaText: 'Sample collection scheduled'
      }
    ];
    this.write(seeded);
    return seeded;
  }
}

