import { Component } from '@angular/core';
import { ReportsService } from '../../../shared/services/reports.service';
import { Report } from '../../../shared/models/report';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.css'
})
export class ReportsListComponent {
  reports: Report[] = [];
  editingId?: number;
  tempDate?: Date;

  constructor(private svc: ReportsService) {
    this.refresh();
  }

  refresh() { this.reports = this.svc.getAll(); }

  download(r: Report) {
    // Mock download
    window.open(r.downloadUrl || '#', '_blank');
  }

  startReschedule(r: Report) {
    this.editingId = r.id;
    this.tempDate = new Date(r.date);
  }

  saveReschedule(r: Report) {
    if (this.tempDate) {
      this.svc.update(r.id, { date: this.tempDate.toISOString() });
      this.editingId = undefined;
      this.refresh();
    }
  }

  cancelReschedule() { this.editingId = undefined; }
}
