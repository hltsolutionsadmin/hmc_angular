import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreCategory, StoreTest } from '../../../shared/models/storefront';
import { ApiCategory, ApiProduct } from '../../../shared/models/catalog-api';
import { CatalogApiService } from '../../../shared/services/catalog-api.service';
import { BookingFlowStateService } from '../../booking/services/booking-flow-state.service';
import { SectionService } from '../../home/sections/section.service';
import { environment } from '../../../../environment/environment';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, map } from 'rxjs/operators';
import { CartService } from '../../cart/service/cart.service';

export type SortOption = 'popular' | 'price_low' | 'price_high';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrl: './tests-list.component.css',
})
export class TestsListComponent implements OnInit, OnDestroy {
  readonly packagesCategoryId = '__packages__';

  categories: StoreCategory[] = [];
  allTests: StoreTest[] = [];
  /** Products/tests loaded from backend for selected category */
  categoryApiTests: StoreTest[] | null = null;
  packagesApiTests: StoreTest[] | null = null;
  filteredTests: StoreTest[] = [];

  selectedCategoryId = '';
  search = '';
  sortBy: SortOption = 'popular';
  loading = true;
  loadError = '';

  /** Mobile — sidebar drawer open */
  mobileSidebarOpen = false;

  bookingNow = false;
  private categoryLoadSub?: Subscription;
  private packagesLoadSub?: Subscription;

  /** Close sidebar when screen grows to desktop */
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 768) this.mobileSidebarOpen = false;
  }

  constructor(
    private catalogApi: CatalogApiService,
    private sections: SectionService,
    private router: Router,
    private bookingState: BookingFlowStateService,
    private cartApi: CartService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadError = '';

    forkJoin({
      categories: this.catalogApi.getCategories({ storeId: environment.storeId, page: 0, size: 200 }).pipe(
        map((res) => (res?.content ?? []).filter((c: ApiCategory) => c.active)),
        map((items) => items.map((c: ApiCategory) => this.mapApiCategoryToStoreCategory(c))),
        catchError(() => {
          this.loadError = 'No tests available right now.';
          return of([] as StoreCategory[]);
        })
      ),
      tests: this.sections.getStoreTests(0, 500).pipe(
        catchError(() => {
          this.loadError = 'No tests available right now.';
          return of([] as StoreTest[]);
        })
      )
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ categories, tests }) => {
        this.categories = categories ?? [];
        this.allTests = tests ?? [];
        this.applyFilters();
        this.loadPackages(false);
      });
  }

  /* ─── Filtering & sorting ─── */
  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.mobileSidebarOpen = false;

    this.categoryLoadSub?.unsubscribe();

    if (!id) {
      this.categoryApiTests = null;
      this.applyFilters();
      return;
    }

    if (id === this.packagesCategoryId) {
      if (this.packagesApiTests) {
        this.applyFilters();
        return;
      }
      this.loading = true;
      this.loadError = '';
      this.filteredTests = [];
      this.loadPackages(true);
      return;
    }

    this.loading = true;
    this.loadError = '';
    this.categoryApiTests = null;
    this.filteredTests = [];

    this.categoryLoadSub = this.catalogApi
      .getProductsByCategoryId({
        categoryId: id,
        storeId: environment.storeId,
        inventoryProducts: true,
      })
      .pipe(
        map((products) => (products ?? []).map((p) => this.mapApiProductToStoreTest(p, id))),
        catchError(() => {
          this.loadError = 'No tests available right now.';
          return of([] as StoreTest[]);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((tests) => {
        this.categoryApiTests = tests;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.categoryLoadSub?.unsubscribe();
    this.packagesLoadSub?.unsubscribe();
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
    const source = this.selectedCategoryId
      ? (this.selectedCategoryId === this.packagesCategoryId
          ? (this.packagesApiTests ?? [])
          : (this.categoryApiTests ?? []))
      : this.allTests;
    let result = [...source];

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
    if (this.bookingNow) return;
    this.bookingNow = true;

    this.cartApi
      .getActiveCart(environment.storeId)
      .pipe(
        switchMap((cart) =>
          this.cartApi.clearCartItems(cart?.id, (cart?.items ?? []).map((i) => i.id))
        ),
        finalize(() => (this.bookingNow = false)),
      )
      .subscribe({
        next: () => {
          this.bookingState.setTest(test);
          this.router.navigate(['/layout/booking/slots', test.id]);
        },
        error: () => {
          this.snackBar.open('Unable to clear cart. Please try again.', 'Close', { duration: 2500 });
        }
      });
  }

  viewTest(test: StoreTest): void {
    this.router.navigate(['/layout/tests/test', test.id]);
  }

  countForCategory(id: string): number {
    if (!id) return this.allTests.length;
    if (id === this.packagesCategoryId) return this.packagesApiTests?.length ?? 0;
    if (this.selectedCategoryId === id && this.categoryApiTests) return this.categoryApiTests.length;
    return this.allTests.filter(t => t.categoryId === id).length;
  }

  selectedCategoryName(): string {
    if (!this.selectedCategoryId) return 'All Tests';
    if (this.selectedCategoryId === this.packagesCategoryId) return 'Packages';
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name ?? '';
  }

  activeSourceCount(): number {
    if (!this.selectedCategoryId) return this.allTests.length;
    if (this.selectedCategoryId === this.packagesCategoryId) return this.packagesApiTests?.length ?? 0;
    return this.categoryApiTests?.length ?? 0;
  }

  categoryIcon(id: string): string {
    if (id === this.packagesCategoryId) return 'inventory_2';
    const key = this.categoryKeyFromId(id).toLowerCase();
    if (key.includes('blood')) return 'bloodtype';
    if (key.includes('full')) return 'health_and_safety';
    if (key.includes('diab')) return 'vaccines';
    if (key.includes('thy')) return 'monitor_heart';
    if (key.includes('heart') || key.includes('card')) return 'favorite';
    if (key.includes('liver')) return 'science';
    if (key.includes('kidney') || key.includes('renal')) return 'water_drop';
    if (key.includes('vit')) return 'sunny';
    return 'biotech';
  }

  getCategoryBg(id: string): string {
    if (id === this.packagesCategoryId) return 'bg-indigo-50';
    const key = this.categoryKeyFromId(id).toLowerCase();
    if (key.includes('blood')) return 'bg-red-50';
    if (key.includes('full')) return 'bg-emerald-50';
    if (key.includes('diab')) return 'bg-orange-50';
    if (key.includes('thy')) return 'bg-purple-50';
    if (key.includes('heart') || key.includes('card')) return 'bg-pink-50';
    if (key.includes('liver')) return 'bg-amber-50';
    if (key.includes('kidney') || key.includes('renal')) return 'bg-cyan-50';
    if (key.includes('vit')) return 'bg-yellow-50';
    return 'bg-blue-50';
  }

  getCategoryColor(id: string): string {
    if (id === this.packagesCategoryId) return 'text-indigo-600';
    const key = this.categoryKeyFromId(id).toLowerCase();
    if (key.includes('blood')) return 'text-red-600';
    if (key.includes('full')) return 'text-emerald-600';
    if (key.includes('diab')) return 'text-orange-600';
    if (key.includes('thy')) return 'text-purple-600';
    if (key.includes('heart') || key.includes('card')) return 'text-pink-600';
    if (key.includes('liver')) return 'text-amber-600';
    if (key.includes('kidney') || key.includes('renal')) return 'text-cyan-600';
    if (key.includes('vit')) return 'text-yellow-600';
    return 'text-blue-600';
  }

  getCategoryBadge(id: string): string {
    if (id === this.packagesCategoryId) return 'bg-indigo-100 text-indigo-700';
    const key = this.categoryKeyFromId(id).toLowerCase();
    if (key.includes('blood')) return 'bg-red-100 text-red-700';
    if (key.includes('full')) return 'bg-emerald-100 text-emerald-700';
    if (key.includes('diab')) return 'bg-orange-100 text-orange-700';
    if (key.includes('thy')) return 'bg-purple-100 text-purple-700';
    if (key.includes('heart') || key.includes('card')) return 'bg-pink-100 text-pink-700';
    if (key.includes('liver')) return 'bg-amber-100 text-amber-700';
    if (key.includes('kidney') || key.includes('renal')) return 'bg-cyan-100 text-cyan-700';
    if (key.includes('vit')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
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

  private mapApiCategoryToStoreCategory(category: ApiCategory): StoreCategory {
    const code = (category.code ?? '').trim();
    return {
      id: category.id,
      code,
      name: category.name,
      description: category.description ?? '',
      thumbnail: category.thumbnail ?? undefined,
      icon: this.categoryIcon(code || category.id)
    };
  }

  private mapApiProductToStoreTest(product: ApiProduct, selectedCategoryId: string): StoreTest {
    const matchingCategory =
      (product.categories ?? []).find((c) => c.id === selectedCategoryId) ??
      (product.categories ?? [])[0] ??
      null;

    const categoryId = matchingCategory?.id ?? selectedCategoryId;
    const categoryTitle =
      this.categories.find((c) => c.id === categoryId)?.name ??
      matchingCategory?.name ??
      '';

    return {
      id: product.id,
      name: product.name,
      categoryId,
      categoryTitle,
      productYpe: product.productType,
      description: product.description ?? product.shortDescription ?? '',
      price: product.price?.price ?? 0,
      discountPrice: undefined,
      rating: undefined,
      trustBadges: undefined,
      reportTime: '—',
      fastingRequired: false,
      parametersCount: undefined,
    };
  }

  private categoryKeyFromId(categoryId: string): string {
    if (categoryId === this.packagesCategoryId) return 'packages';
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat?.code || categoryId;
  }

  private loadPackages(showLoader: boolean): void {
    this.packagesLoadSub?.unsubscribe();

    if (showLoader) {
      this.loading = true;
      this.loadError = '';
    }

    this.packagesLoadSub = this.catalogApi
      .getBundlesByStoreId({ storeId: environment.storeId, inventoryStock: false })
      .pipe(
        map((items) => (items ?? []).filter((p) => p.active)),
        map((items) => items.map((p) => this.mapApiBundleProductToStoreTest(p))),
        catchError(() => {
          if (showLoader) this.loadError = 'No packages available right now.';
          return of([] as StoreTest[]);
        }),
        finalize(() => {
          if (showLoader) this.loading = false;
        }),
      )
      .subscribe((packages) => {
        this.packagesApiTests = packages;
        if (this.selectedCategoryId === this.packagesCategoryId) {
          this.applyFilters();
        }
      });
  }

  private mapApiBundleProductToStoreTest(product: ApiProduct): StoreTest {
    const included =
      (product.bundle?.items ?? [])
        .map((i) => i?.product?.name)
        .filter((x): x is string => Boolean(x && String(x).trim()));

    return {
      id: product.id,
      name: product.name,
      categoryId: this.packagesCategoryId,
      categoryTitle: 'Packages',
      productYpe: product.productType,
      description: product.description ?? product.shortDescription ?? '',
      price: product.price?.price ?? 0,
      discountPrice: undefined,
      rating: undefined,
      trustBadges: undefined,
      reportTime: '—',
      fastingRequired: false,
      parametersCount: included.length ? String(included.length) : undefined,
      included: included.length ? included : undefined,
    };
  }
}
