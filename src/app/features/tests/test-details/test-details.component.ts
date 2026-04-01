import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreTest } from '../../../shared/models/storefront';
import { CatalogService } from '../../../shared/services/catalog.service';
import { CartFacadeService } from '../../cart/service/cart-facade.service';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit {
  test: StoreTest | undefined;
  related: StoreTest[] = [];
  testId: string = '';

  private readonly cartFacade = inject(CartFacadeService);

  readonly productIdsInCart$ = this.cartFacade.productIdsInCart$;
  readonly cartLoading$ = this.cartFacade.loading$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private catalog: CatalogService
  ) { }

  ngOnInit(): void {
    this.cartFacade.loadCart();
    this.route.params.subscribe(params => {
      this.testId = String(params['id'] ?? '');
      this.loadTestDetails();
    });
  }

  private loadTestDetails(): void {
    const all = this.catalog.getAllTests();
    const foundTest = all.find(test => test.id === this.testId);
    
    if (foundTest) {
      this.test = foundTest;
      this.related = all
        .filter((t) => t.categoryId === foundTest.categoryId && t.id !== foundTest.id)
        .slice(0, 3);
    } else {
      this.snackBar.open('Test not found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/layout/tests']);
    }
  }

  addToCart(): void {
    if (!this.test) return;
    this.cartFacade.addToCart(this.test.id, 1);
    this.snackBar.open('Added to cart', 'Close', { duration: 1500 });
  }

  bookNow(): void {
    this.addToCart();
    this.router.navigate(['/layout/cart']);
  }

  addRelatedToCart(test: StoreTest): void {
    this.cartFacade.addToCart(test.id, 1);
    this.snackBar.open('Added to cart', 'Close', { duration: 1500 });
  }

  viewRelated(test: StoreTest): void {
    this.router.navigate(['/layout/tests/test', test.id]);
  }
}
