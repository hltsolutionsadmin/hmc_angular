import { StoreTest } from '../../../shared/models/storefront';

export interface TimeSlot {
  id: string;
  startTime: string;   // "09:00"
  endTime: string;     // "09:30"
  available: boolean;
  displayTime: string; // "09:00 AM – 09:30 AM"
}

export interface SlotDate {
  date: Date;
  dateStr: string;   // "2026-04-01"
  dayName: string;   // "Today" | "Tmrw" | "Mon" | "Tue" ...
  dayNumber: string; // "1"
  monthName: string; // "Apr"
}

export interface PatientDetails {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  collectionType: 'home' | 'lab';
}

export interface BookingFlowState {
  selectedTest: StoreTest | null;
  selectedSlot: TimeSlot | null;
  selectedDate: SlotDate | null;
  patientDetails: PatientDetails | null;
  bookingId: string | null;
}
