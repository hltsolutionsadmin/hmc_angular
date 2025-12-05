export interface Order {
  id: number;
  patientName: string;
  testType: string;
  date: string; // ISO date string
  status: 'Pending' | 'Confirmed' | 'Completed';
}
