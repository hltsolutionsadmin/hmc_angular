import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCategory, StoreTest } from '../../../shared/models/storefront';
import { CatalogService } from '../../../shared/services/catalog.service';
import { BookingFlowStateService } from '../../booking/services/booking-flow-state.service';

export type SortOption = 'popular' | 'price_low' | 'price_high';

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
  sortBy: SortOption = 'popular';
  loading = true;

  /** Mobile — sidebar drawer open */
  mobileSidebarOpen = false;

  /** Close sidebar when screen grows to desktop */
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 768) this.mobileSidebarOpen = false;
  }

  constructor(
    private catalog: CatalogService,
    private router: Router,
    private bookingState: BookingFlowStateService,
  ) {}

  ngOnInit(): void {
    // Simulate brief loading skeleton
    setTimeout(() => {
      this.categories = this.catalog.getCategories();
      this.allTests   = this.catalog.getAllTests();
      this.applyFilters();
      this.loading = false;
    }, 600);
  }

  /* ─── Filtering & sorting ─── */
  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.mobileSidebarOpen = false;
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

  onSort(opt: SortOption): void {
    this.sortBy = opt;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.allTests];

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

    if (this.sortBy === 'price_low') {
      result.sort((a, b) => this.priceToShow(a) - this.priceToShow(b));
    } else if (this.sortBy === 'price_high') {
      result.sort((a, b) => this.priceToShow(b) - this.priceToShow(a));
    }
    // 'popular' — natural order

    this.filteredTests = result;
  }

  /* ─── Helpers ─── */
  onBookNow(test: StoreTest): void {
    this.bookingState.setTest(test);
    this.router.navigate(['/layout/booking/slots', test.id]);
  }

  countForCategory(id: string): number {
    if (!id) return this.allTests.length;
    return this.allTests.filter(t => t.categoryId === id).length;
  }

  selectedCategoryName(): string {
    if (!this.selectedCategoryId) return 'All Tests';
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name ?? '';
  }

  categoryIcon(id: string): string {
    const icons: Record<string, string> = {
      blood: 'bloodtype', fullbody: 'health_and_safety', diabetes: 'vaccines',
      thyroid: 'monitor_heart', heart: 'favorite', liver: 'science',
      kidney: 'water_drop', vitamin: 'sunny',
    };
    return icons[id] ?? 'biotech';
  }

  getCategoryBg(id: string): string {
    const map: Record<string, string> = {
      blood: 'bg-red-50',     fullbody: 'bg-emerald-50', diabetes: 'bg-orange-50',
      thyroid: 'bg-purple-50', heart: 'bg-pink-50',       liver: 'bg-amber-50',
      kidney: 'bg-cyan-50',   vitamin: 'bg-yellow-50',
    };
    return map[id] ?? 'bg-blue-50';
  }

  getCategoryColor(id: string): string {
    const map: Record<string, string> = {
      blood: 'text-red-600',     fullbody: 'text-emerald-600', diabetes: 'text-orange-600',
      thyroid: 'text-purple-600', heart: 'text-pink-600',       liver: 'text-amber-600',
      kidney: 'text-cyan-600',   vitamin: 'text-yellow-600',
    };
    return map[id] ?? 'text-blue-600';
  }

  getCategoryBadge(id: string): string {
    const map: Record<string, string> = {
      blood: 'bg-red-100 text-red-700',         fullbody: 'bg-emerald-100 text-emerald-700',
      diabetes: 'bg-orange-100 text-orange-700', thyroid: 'bg-purple-100 text-purple-700',
      heart: 'bg-pink-100 text-pink-700',        liver: 'bg-amber-100 text-amber-700',
      kidney: 'bg-cyan-100 text-cyan-700',       vitamin: 'bg-yellow-100 text-yellow-700',
    };
    return map[id] ?? 'bg-blue-100 text-blue-700';
  }

  priceToShow(test: StoreTest): number { return test.discountPrice ?? test.price; }

  discountPct(test: StoreTest): number | null {
    if (!test.discountPrice || test.discountPrice >= test.price) return null;
    return Math.round(((test.price - test.discountPrice) / test.price) * 100);
  }

  /** Skeleton placeholder rows */
  skeletonItems = Array(6).fill(0);

  trackById(_: number, item: StoreTest): string { return item.id; }
  trackByCat(_: number, item: StoreCategory): string { return item.id; }
  trackByIdx(i: number): number { return i; }
}
