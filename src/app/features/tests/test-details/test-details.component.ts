import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, of } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { StoreTest } from '../../../shared/models/storefront.model';
import { ApiProduct } from '../../../shared/models/catalog-api.model';
import { CatalogService } from '../../../shared/services/catalog/catalog.service';
import { BookingFlowStateService } from '../../booking/services/booking-flow-state.service';
import { environment } from '../../../../environment/environment';
import { CartFacadeService } from '../../../shared/services/cart/cart-facade.service';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductsService } from '../../../shared/services/products/products.service';
import { CatalogApiService } from '../../../shared/services/catalog/catalog-api.service';

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
  readonly helplineNumber = '8309948791';

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
    private sections: ProductsService,
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

  scrollToBundleItems(): void {
    try {
      if (typeof document === 'undefined') return;
      document.getElementById('bundle-items')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  }

  copyHelpline(): void {
    const value = this.helplineNumber;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(value)
          .then(() => this.snackBar.open('Helpline number copied', 'Close', { duration: 1500 }))
          .catch(() => this.fallbackCopy(value));
        return;
      }
    } catch {
      // ignore
    }

    this.fallbackCopy(value);
  }

  private fallbackCopy(value: string): void {
    try {
      const el = document.createElement('textarea');
      el.value = value;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.snackBar.open('Helpline number copied', 'Close', { duration: 1500 });
    } catch {
      this.snackBar.open('Unable to copy number', 'Close', { duration: 1500 });
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
    if (test.isBundle) {
      const count = (test.included ?? []).length;
      if (count > 0) return `${count} tests`;
    }

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
        .map((i) => {
          const name = i?.product?.name;
          const qty = Number(i?.quantity ?? 1);
          if (!name) return null;
          if (Number.isFinite(qty) && qty > 1) return `${name} x${qty}`;
          return name;
        })
        .filter((x): x is string => Boolean(x && String(x).trim()));

    return {
      id: product.id,
      name: product.name,
      categoryId: '__packages__',
      categoryTitle: 'Packages',
      productYpe: product.productType,
      isBundle: product.bundle != null,
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
