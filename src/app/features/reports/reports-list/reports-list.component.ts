import { Component, HostListener } from '@angular/core';
import { ReportsService } from '../../../shared/services/reports.service';
import { Report } from '../../../shared/models/report';

import { TableAction, TableColumn } from '../../../shared/components/table/table.component';

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

  searchText: string = '';
  statusFilter: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalItems: number = 0;

  reportRows = [
    { id: '#4567', title: 'Reporte de ventas Q3', category: 'Ventas', date: '15/05/2023', statusClass: 'completed', statusLabel: 'completed' },
    { id: '#4566', title: 'Análisis de mercado', category: 'Marketing', date: '14/05/2023', statusClass: 'pending', statusLabel: 'pending' },
    { id: '#4565', title: 'Inventario mensual', category: 'Logística', date: '13/05/2023', statusClass: 'completed', statusLabel: 'completed' },
    { id: '#4564', title: 'Rendimiento del personal', category: 'RRHH', date: '10/05/2023', statusClass: 'rejected', statusLabel: 'rejected' },
  ];

  get filteredReportRows(): any[] {
    const q = (this.searchText ?? '').trim().toLowerCase();
    const status = (this.statusFilter ?? '').trim().toLowerCase();

    return this.reportRows.filter((r) => {
      const matchesSearch =
        !q ||
        String(r.id ?? '').toLowerCase().includes(q) ||
        String(r.title ?? '').toLowerCase().includes(q) ||
        String(r.category ?? '').toLowerCase().includes(q) ||
        String(r.date ?? '').toLowerCase().includes(q);

      const matchesStatus = !status || String(r.statusClass ?? '').toLowerCase() === status;
      return matchesSearch && matchesStatus;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', align: 'left', type: 'text' },
    { key: 'title', label: 'title', align: 'left', type: 'text' },
    { key: 'category', label: 'category', align: 'left', type: 'text' },
    { key: 'date', label: 'date', align: 'left', type: 'text' },
    { key: 'statusClass', label: 'statusClass', align: 'left', type: 'status' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      action: 'view',
      colorClass: 'text-blue-600 hover:text-blue-900 hover:bg-blue-100',
      tooltip: 'View'
    },
    {
      label: 'Download',
      icon: 'download',
      action: 'download',
      colorClass: 'btn-action',
      tooltip: 'Download'
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: 'delete',
      colorClass: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      tooltip: 'Delete'
    }
  ];

  reportStatusClass(value: any): string {
    switch (value) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // reportStatusLabel(_value: any, row?: any): string {
  //   return row?.statusLabel ?? '';
  // }

  onTableAction(e: { action: string; row: any }): void {
    switch (e.action) {
      case 'download':
        this.download(e.row);
        return;
      default:
        return;
    }
  }

  constructor(private svc: ReportsService) {
  }

  add(): void {
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
    }
  }

  cancelReschedule() { this.editingId = undefined; }
}
