import { Component, HostListener } from '@angular/core';
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
  viewMode: 'table' | 'card' = 'table';
  isMobile: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalItems: number = 0;

  reportRows = [
    { id: '#4567', title: 'Reporte de ventas Q3', category: 'Ventas', date: '15/05/2023', statusClass: 'completed', statusLabel: 'Completado' },
    { id: '#4566', title: 'Análisis de mercado', category: 'Marketing', date: '14/05/2023', statusClass: 'pending', statusLabel: 'Pendiente' },
    { id: '#4565', title: 'Inventario mensual', category: 'Logística', date: '13/05/2023', statusClass: 'completed', statusLabel: 'Completado' },
    { id: '#4564', title: 'Rendimiento del personal', category: 'RRHH', date: '10/05/2023', statusClass: 'rejected', statusLabel: 'Rechazado' },
  ];

  constructor(private svc: ReportsService) {
    this.updateIsMobile();
    this.refresh();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.viewMode = 'card';
    }
  }

  refresh() {
    this.reports = this.svc.getAll();
    this.totalItems = this.reportRows.length;
    this.currentPage = 1;
  }

  setViewMode(mode: 'table' | 'card') {
    if (this.isMobile) {
      this.viewMode = 'card';
      return;
    }
    this.viewMode = mode;
  }

  trackByReportId(_index: number, r: Report) {
    return r.id;
  }

  trackByReportRowId(_index: number, r: any) {
    return r.id;
  }

  get paginatedReportRows(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.reportRows.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    if (totalPages <= 1) return [1];

    range.push(1);

    for (let i = current - delta; i <= current + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);
    range.sort((a, b) => a - b);

    for (let i of range) {
      if (l !== undefined) {
        if (i - l > 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

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
