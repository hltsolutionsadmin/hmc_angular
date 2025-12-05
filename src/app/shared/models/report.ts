export interface Report {
  id: number;
  patientName: string;
  testName: string;
  date: string; // ISO date string
  status: 'Completed' | 'Delivered';
  downloadUrl?: string;
}
