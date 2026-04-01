import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCategory, StoreTest } from '../../../shared/models/storefront';
import { CatalogService } from '../../../shared/services/catalog.service';
import { BookingFlowStateService } from '../../booking/services/booking-flow-state.service';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrl: './tests-list.component.css',
})
export class TestsListComponent implements OnInit {
  categories: StoreCategory[] = [];
  allTests: StoreTest[] = [];
  filteredTests: StoreTest[] = [];
  selectedCategoryId = '';
  search = '';

  constructor(
    private catalog: CatalogService,
    private router: Router,
    private bookingState: BookingFlowStateService,
  ) {}

  ngOnInit(): void {
    this.categories = this.catalog.getCategories();
    this.allTests   = this.catalog.getAllTests();
    this.applyFilters();
  }

  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  onSearch(value: string): void {
    this.search = value;
    this.applyFilters();
  }

  clearSearch(): void {
    this.search = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.allTests;
    if (this.selectedCategoryId) {
      result = result.filter(t => t.categoryId === this.selectedCategoryId);
    }
    const q = this.search.trim().toLowerCase();
    if (q) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryTitle.toLowerCase().includes(q)
      );
    }
    this.filteredTests = result;
  }

  onBookNow(test: StoreTest): void {
    this.bookingState.setTest(test);
    this.router.navigate(['/layout/booking/slots', test.id]);
  }

  categoryIcon(id: string): string {
    const icons: Record<string, string> = {
      blood: 'bloodtype', fullbody: 'health_and_safety', diabetes: 'vaccines',
      thyroid: 'monitor_heart', heart: 'favorite', liver: 'science',
      kidney: 'water_drop', vitamin: 'sunny',
    };
    return icons[id] ?? 'biotech';
  }

  priceToShow(test: StoreTest): number { return test.discountPrice ?? test.price; }

  discountPct(test: StoreTest): number | null {
    if (!test.discountPrice || test.discountPrice >= test.price) return null;
    return Math.round(((test.price - test.discountPrice) / test.price) * 100);
  }

  trackById(_: number, item: StoreTest): string { return item.id; }
  trackByCat(_: number, item: StoreCategory): string { return item.id; }
}
