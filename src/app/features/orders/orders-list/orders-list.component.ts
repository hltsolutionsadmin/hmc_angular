import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrdersService } from '../../../shared/services/orders.service';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrdersListComponent implements OnInit {
  // Table data and configuration
  displayedColumns = ['patientName', 'testType', 'bookingId', 'date', 'status', 'actions'];
  data: Order[] = [];
  filteredCards: any[] = [];

  viewMode: 'table' | 'card' = 'table';
  isMobile: boolean = false;
  
  // Search and filter properties
  searchText: string = '';
  statusFilter: string = '';
  statuses: string[] = ['Pending', 'Confirmed', 'Sample Collected', 'Cancelled'];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  cards = [
    { name: 'John Doe', test: 'Blood Test', status: 'Pending', date: '20 Oct 2025', bookingId: '#123456789' },
    { name: 'Maria Silva', test: 'Full Body Checkup', status: 'Confirmed', date: '18 Oct 2025', bookingId: '#987654321' },
    { name: 'Arjun Mehta', test: 'Covid RTPCR', status: 'Sample Collected', date: '19 Oct 2025', bookingId: '#456123789' },
    { name: 'Sarah Lee', test: 'Lipid Profile', status: 'Cancelled', date: '17 Oct 2025', bookingId: '#741852963' },
    { name: 'Michael Johnson', test: 'Thyroid Test', status: 'Pending', date: '21 Oct 2025', bookingId: '#159357486' },
    { name: 'Emily Chen', test: 'Diabetes Panel', status: 'Confirmed', date: '16 Oct 2025', bookingId: '#753159486' },
    { name: 'David Kim', test: 'Liver Function Test', status: 'Sample Collected', date: '15 Oct 2025', bookingId: '#357951456' },
    { name: 'Priya Patel', test: 'Kidney Function Test', status: 'Pending', date: '22 Oct 2025', bookingId: '#852147963' }
  ];

  constructor(
    private svc: OrdersService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateIsMobile();
    this.refresh();
    this.applyFilter();
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

  setViewMode(mode: 'table' | 'card') {
    if (this.isMobile) {
      this.viewMode = 'card';
      return;
    }
    this.viewMode = mode;
  }

  trackByBookingId(_index: number, card: any) {
    return card?.bookingId;
  }

  refresh() { 
    this.data = this.svc.getAll();
    this.filteredCards = [...this.cards];
    this.totalItems = this.filteredCards.length;
  }

  add() {
    
  }

  edit(row: Order) {
    
  }

  remove(row: Order) { 
    this.svc.remove(row.id); 
    this.refresh(); 
  }

  // Apply search and filter
  applyFilter(): void {
    this.filteredCards = this.cards.filter(card => {
      // Apply search text filter
      const matchesSearch = !this.searchText || 
        card.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        card.test.toLowerCase().includes(this.searchText.toLowerCase()) ||
        card.bookingId.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Apply status filter
      const matchesStatus = !this.statusFilter || 
        card.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.totalItems = this.filteredCards.length;
    this.currentPage = 1; // Reset to first page when filters change
  }

  // Get CSS class for status badge
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Sample Collected':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Navigate to order details
  viewDetails(card: any): void {
    this.router.navigate(['/layout/orders/details'], { 
      queryParams: { 
        id: card.bookingId.replace('#', '')
      } 
    });
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedCards(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCards.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Generate page numbers for pagination with ellipsis
  getPageNumbers(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const current = this.currentPage;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    
    for (let i = current - delta; i <= current + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    range.sort((a, b) => a - b);
    
    for (let i of range) {
      if (l) {
        if (i - l > 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots;
  }
}
