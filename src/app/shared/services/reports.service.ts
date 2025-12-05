import { Injectable } from '@angular/core';
import { Report } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private reports: Report[] = [
    { id: 1, patientName: 'Aarav Kumar', testName: 'CBC', date: new Date().toISOString(), status: 'Completed', downloadUrl: '#' },
    { id: 2, patientName: 'Maya Rao', testName: 'LFT', date: new Date().toISOString(), status: 'Delivered', downloadUrl: '#' },
  ];

  getAll(): Report[] { return [...this.reports]; }
  update(id: number, patch: Partial<Report>) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx > -1) this.reports[idx] = { ...this.reports[idx], ...patch };
  }
}
