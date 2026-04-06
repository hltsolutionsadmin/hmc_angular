import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, of } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { StoreTest } from '../../../shared/models/storefront';
import { ApiProduct } from '../../../shared/models/catalog-api';
import { CatalogApiService } from '../../../shared/services/catalog-api.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import { BookingFlowStateService } from '../../booking/services/booking-flow-state.service';
import { CartFacadeService } from '../../cart/service/cart-facade.service';
import { SectionService } from '../../home/sections/section.service';
import { CartService } from '../../cart/service/cart.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit, OnDestroy {
  loading = true;
  test: StoreTest | null = null;
  related: StoreTest[] = [];
  testId: string = '';
  reportHoursText = '24 hours';
  containsText = '';
  bookingNow = false;

  private readonly destroy$ = new Subject<void>();

  private readonly cartFacade = inject(CartFacadeService);

  readonly productIdsInCart$ = this.cartFacade.productIdsInCart$;
  readonly cartLoading$ = this.cartFacade.loading$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private catalogApi: CatalogApiService,
    private catalog: CatalogService,
    private sections: SectionService,
    private bookingState: BookingFlowStateService,
    private cartApi: CartService,
  ) { }

  ngOnInit(): void {
    this.cartFacade.loadCart();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.testId = String(params['id'] ?? '');
      this.loadTestDetails(this.testId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTestDetails(id: string): void {
    this.loading = true;
    this.test = null;
    this.related = [];

    this.sections
      .getStoreTests(0, 500)
      .pipe(
        catchError(() => of(this.catalog.getAllTests())),
        switchMap((tests) => {
          const all = tests ?? [];
          const foundTest = all.find((t) => t.id === id) ?? null;
          if (foundTest) {
            return of({ item: foundTest as StoreTest, all, kind: 'test' as const });
          }

          return this.catalogApi
            .getBundlesByStoreId({ storeId: environment.storeId, inventoryStock: false })
            .pipe(
              catchError(() => of([] as ApiProduct[])),
              switchMap((bundles) => {
                const foundBundle = (bundles ?? []).find((b) => b.id === id) ?? null;
                return of({
                  item: foundBundle ? this.mapApiBundleProductToStoreTest(foundBundle) : null,
                  all,
                  kind: 'bundle' as const,
                });
              }),
            );
        }),
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$),
      )
      .subscribe(({ item, all, kind }) => {
        if (!item) {
          this.snackBar.open('Test not found', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/layout/tests']);
          return;
        }

        this.test = item;
        this.related =
          kind === 'test'
            ? all.filter((t) => t.categoryId === item.categoryId && t.id !== item.id).slice(0, 3)
            : [];

        this.reportHoursText = this.computeReportHours(item.reportTime);
        this.containsText = this.computeContains(item);
      });
  }

  addToCart(): void {
    if (!this.test) return;
    this.cartFacade.addToCart(this.test.id, 1);
    this.snackBar.open('Added to cart', 'Close', { duration: 1500 });
  }

  bookNow(): void {
    if (!this.test) return;
    if (this.bookingNow) return;
    this.bookingNow = true;

    this.cartApi
      .getActiveCart(environment.storeId)
      .pipe(
        switchMap((cart) =>
          this.cartApi.clearCartItems(cart?.id, (cart?.items ?? []).map((i) => i.id))
        ),
        finalize(() => (this.bookingNow = false)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.bookingState.setTest(this.test!);
          this.router.navigate(['/layout/booking/slots', this.test!.id]);
        },
        error: () => {
          this.snackBar.open('Unable to clear cart. Please try again.', 'Close', { duration: 2500 });
        }
      });
  }

  addRelatedToCart(test: StoreTest): void {
    this.cartFacade.addToCart(test.id, 1);
    this.snackBar.open('Added to cart', 'Close', { duration: 1500 });
  }

  viewRelated(test: StoreTest): void {
    this.router.navigate(['/layout/tests/test', test.id]);
  }

  goBack(): void {
    this.router.navigate(['/layout/tests']);
  }

  scrollToIncludes(): void {
    try {
      if (typeof document === 'undefined') return;
      document.getElementById('includes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  }

  discountPercent(test: StoreTest): number | null {
    const price = Number(test.price ?? 0);
    const discounted = Number(test.discountPrice ?? test.price ?? 0);
    if (!Number.isFinite(price) || price <= 0) return null;
    if (!Number.isFinite(discounted) || discounted >= price) return null;
    return Math.round((1 - discounted / price) * 100);
  }

  private computeReportHours(reportTime: string): string {
    const raw = String(reportTime ?? '').toLowerCase();
    const match = raw.match(/(\d+)\s*(h|hr|hrs|hour|hours)/);
    if (match?.[1]) {
      const n = Number(match[1]);
      if (!Number.isFinite(n) || n <= 0) return '24 hours';
      return `${n} ${n === 1 ? 'hour' : 'hours'}`;
    }
    const digits = raw.match(/(\d+)/)?.[1];
    if (digits) {
      const n = Number(digits);
      if (Number.isFinite(n) && n > 0) return `${n} ${n === 1 ? 'hour' : 'hours'}`;
    }
    return '24 hours';
  }

  private computeContains(test: StoreTest): string {
    const fromIncluded = (test.included ?? []).length;
    if (fromIncluded > 0) return `${fromIncluded} tests`;

    const raw = String(test.parametersCount ?? '');
    const digits = raw.match(/(\d+)/)?.[1];
    if (digits) return `${digits} tests`;

    return 'Multiple tests';
  }

  private mapApiBundleProductToStoreTest(product: ApiProduct): StoreTest {
    const included =
      (product.bundle?.items ?? [])
        .map((i) => i?.product?.name)
        .filter((x): x is string => Boolean(x && String(x).trim()));

    return {
      id: product.id,
      name: product.name,
      categoryId: '__packages__',
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
