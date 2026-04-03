import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SlotDate, TimeSlot } from '../models/booking-flow.model';
import { environment } from '../../../../environment/environment';

interface AppointmentSlotDto {
  id: string;
  storeId: string;
  productId: string;
  slotDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  maxCapacity: number;
  slotClosed?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SlotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apicommereceUrl;

  getDates(): SlotDate[] {
    const dates: SlotDate[] = [];
    const today = new Date();
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 8; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DAY_NAMES[d.getDay()],
        dayNumber: String(d.getDate()),
        monthName: MONTH_NAMES[d.getMonth()],
      });
    }
    return dates;
  }

  getSlots(testId: string, dateStr: string): Observable<TimeSlot[]> {
    const params = new HttpParams()
      .set('storeId', environment.storeId)
      .set('productId', testId)
      .set('date', dateStr);

    return this.http
      .get<AppointmentSlotDto[]>(`${this.baseUrl}/api/appointments/slots`, { params })
      .pipe(
        map((items) => (items ?? []).slice().sort((a, b) => a.startTime.localeCompare(b.startTime))),
        map((items) => items.map((s) => this.mapApiSlotToTimeSlot(s))),
        catchError(() => of(this.fallbackSlots(dateStr)))
      );
  }

  private mapApiSlotToTimeSlot(slot: AppointmentSlotDto): TimeSlot {
    const start = this.stripSeconds(slot.startTime);
    const end = this.stripSeconds(slot.endTime);
    return {
      id: slot.id,
      startTime: start,
      endTime: end,
      available: (slot.maxCapacity ?? 0) > 0,
      slotClosed: Boolean(slot.slotClosed),
      displayTime: `${this.to12h(start)} – ${this.to12h(end)}`
    };
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

  private fallbackSlots(dateStr: string): TimeSlot[] {
    const base: { startTime: string; endTime: string }[] = [
      { startTime: '07:00', endTime: '07:30' },
      { startTime: '07:30', endTime: '08:00' },
      { startTime: '08:00', endTime: '08:30' },
      { startTime: '08:30', endTime: '09:00' },
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' },
      { startTime: '16:30', endTime: '17:00' },
      { startTime: '17:00', endTime: '17:30' },
      { startTime: '17:30', endTime: '18:00' }
    ];

    const seed = dateStr.split('-').reduce((acc, v) => acc + parseInt(v, 10), 0);
    const busyIdx = new Set([
      (seed + 1) % base.length,
      (seed + 3) % base.length,
      (seed + 5) % base.length,
      (seed + 7) % base.length
    ]);

    return base.map((s, idx) => ({
      id: `fallback_${dateStr}_${idx}`,
      startTime: s.startTime,
      endTime: s.endTime,
      available: !busyIdx.has(idx),
      displayTime: `${this.to12h(s.startTime)} – ${this.to12h(s.endTime)}`
    }));
  }
}
