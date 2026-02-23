import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface TestItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  sampleRequired: boolean;
  tat: string;
  isActive: boolean;
}

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrl: './tests-list.component.css'
})
export class TestsListComponent implements OnInit {
   searchText: string = '';
  selectedCategory: string = '';
  tests: TestItem[] = [];
  statuses: string[] = ['Blood Tests', 'X-Ray', 'MRI', 'Ultrasound', 'ECG'];

  viewMode: 'table' | 'card' = 'table';
  isMobile: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateIsMobile();

    // Dummy test data
    this.tests = [
      { id: 1, name: 'CBC', category: 'Blood Test', description: 'Complete Blood Count', price: 450, sampleRequired: true, tat: '24 hrs', isActive: true },
      { id: 2, name: 'LFT', category: 'Blood Test', description: 'Liver Function Test', price: 650, sampleRequired: true, tat: '24 hrs', isActive: true },
      { id: 3, name: 'MRI Brain', category: 'MRI', description: 'Brain MRI scan', price: 3500, sampleRequired: false, tat: 'Same day', isActive: false },
      { id: 4, name: 'Chest X-Ray', category: 'X-Ray', description: 'Chest imaging', price: 500, sampleRequired: false, tat: '2 hrs', isActive: true },
      { id: 5, name: 'ECG', category: 'Cardiology', description: 'Heart electrical activity test', price: 300, sampleRequired: false, tat: '30 min', isActive: true },
    ];
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

  trackByTestId(_index: number, test: TestItem) {
    return test.id;
  }

  // Generate unique categories for dropdown
  get uniqueCategories(): string[] {
    return [...new Set(this.tests.map(t => t.category))];
  }

  // Apply search + filter
  applyFilter(): void {
    this.currentPage = 1;
  }

  // Filtered results
  get filteredTests(): TestItem[] {
    return this.tests.filter(test => {
      const matchesText =
        test.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        test.description.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || test.category === this.selectedCategory;

      return matchesText && matchesCategory;
    });
  }

  get totalItems(): number {
    return this.filteredTests.length;
  }

  get pagedItems(): TestItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTests.slice(start, start + this.itemsPerPage);
  }

  add() {
    console.log("Add Test");
  }

  edit(test: TestItem) {
    console.log("Edit Test:", test);
  }

  delete(test: TestItem) {
    if (confirm("Are you sure you want to delete this test?")) {
      this.tests = this.tests.filter(t => t.id !== test.id);
    }
  }

  toggleStatus(test: TestItem) {
    test.isActive = !test.isActive;
  }

  viewTestDetails(test: TestItem): void {
    this.router.navigate(['/layout/tests/test', test.id]);
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const maxVisiblePages = 5; // Maximum number of page numbers to show
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    // If there are 5 or fewer pages, show all pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of the middle section
      let start = Math.max(2, current - 1);
      let end = Math.min(totalPages - 1, current + 1);

      // Adjust if we're at the start or end
      if (current <= 3) {
        end = 3;
      } else if (current >= totalPages - 2) {
        start = totalPages - 2;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }
}
