import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit {
   displayedColumns: string[] = ['index', 'name', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  searchText: string = '';
  viewMode: 'table' | 'card' = 'table';
  isMobile: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  statuses: string[] = ['Pending', 'Confirmed', 'Sample Collected', 'Cancelled'];
  
  // Dummy data
  categories: Category[] = [
    { id: 1, name: 'Blood Tests', description: 'Various blood related tests', isActive: true },
    { id: 2, name: 'X-Ray', description: 'X-Ray imaging tests', isActive: true },
    { id: 3, name: 'MRI', description: 'Magnetic Resonance Imaging', isActive: false },
    { id: 4, name: 'Ultrasound', description: 'Ultrasound imaging tests', isActive: true },
    { id: 5, name: 'ECG', description: 'Electrocardiogram tests', isActive: true },
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateIsMobile();
    this.dataSource.data = this.categories;
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

  trackByCategoryId(_index: number, c: Category) {
    return c.id;
  }

  applyFilter(): void {
    if (!this.searchText) {
      this.dataSource.data = this.categories;
      return;
    }
    const filterValue = this.searchText.toLowerCase();
    this.dataSource.data = this.categories.filter(category => 
      category.name.toLowerCase().includes(filterValue) || 
      category.description.toLowerCase().includes(filterValue)
    );
    this.currentPage = 1;
  }

  get totalItems(): number {
    return this.dataSource.data.length;
  }

  get filteredCards(): any[] {
    return this.dataSource.data;
  }

  get pagedItems(): any[] {
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

  add(): void {
    // Implement add functionality
    console.log('Add new category');
  }

  edit(category: Category): void {
    // Implement edit functionality
    console.log('Edit category:', category);
  }

  delete(category: Category): void {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      // Implement delete functionality
      console.log('Delete category:', category);
    }
  }

  toggleStatus(category: Category): void {
    category.isActive = !category.isActive;
    // Here you would typically call a service to update the status
  }

  
}
