import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SlotDate, TimeSlot } from '../models/booking-flow.model';

@Injectable({ providedIn: 'root' })
export class SlotService {

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
    const base: { id: string; startTime: string; endTime: string; displayTime: string }[] = [
      { id: 's1',  startTime: '07:00', endTime: '07:30', displayTime: '07:00 AM – 07:30 AM' },
      { id: 's2',  startTime: '07:30', endTime: '08:00', displayTime: '07:30 AM – 08:00 AM' },
      { id: 's3',  startTime: '08:00', endTime: '08:30', displayTime: '08:00 AM – 08:30 AM' },
      { id: 's4',  startTime: '08:30', endTime: '09:00', displayTime: '08:30 AM – 09:00 AM' },
      { id: 's5',  startTime: '09:00', endTime: '09:30', displayTime: '09:00 AM – 09:30 AM' },
      { id: 's6',  startTime: '09:30', endTime: '10:00', displayTime: '09:30 AM – 10:00 AM' },
      { id: 's7',  startTime: '10:00', endTime: '10:30', displayTime: '10:00 AM – 10:30 AM' },
      { id: 's8',  startTime: '10:30', endTime: '11:00', displayTime: '10:30 AM – 11:00 AM' },
      { id: 's9',  startTime: '11:00', endTime: '11:30', displayTime: '11:00 AM – 11:30 AM' },
      { id: 's10', startTime: '11:30', endTime: '12:00', displayTime: '11:30 AM – 12:00 PM' },
      { id: 's11', startTime: '14:00', endTime: '14:30', displayTime: '02:00 PM – 02:30 PM' },
      { id: 's12', startTime: '14:30', endTime: '15:00', displayTime: '02:30 PM – 03:00 PM' },
      { id: 's13', startTime: '15:00', endTime: '15:30', displayTime: '03:00 PM – 03:30 PM' },
      { id: 's14', startTime: '15:30', endTime: '16:00', displayTime: '03:30 PM – 04:00 PM' },
      { id: 's15', startTime: '16:00', endTime: '16:30', displayTime: '04:00 PM – 04:30 PM' },
      { id: 's16', startTime: '16:30', endTime: '17:00', displayTime: '04:30 PM – 05:00 PM' },
      { id: 's17', startTime: '17:00', endTime: '17:30', displayTime: '05:00 PM – 05:30 PM' },
      { id: 's18', startTime: '17:30', endTime: '18:00', displayTime: '05:30 PM – 06:00 PM' },
    ];

    // Deterministic availability per date so repeated loads are consistent
    const seed = dateStr.split('-').reduce((acc, v) => acc + parseInt(v), 0);
    const busyIds = new Set([
      base[(seed + 1) % base.length].id,
      base[(seed + 3) % base.length].id,
      base[(seed + 5) % base.length].id,
      base[(seed + 7) % base.length].id,
    ]);

    const slots: TimeSlot[] = base.map(s => ({
      ...s,
      available: !busyIds.has(s.id),
    }));

    return of(slots).pipe(delay(350));
  }
}
