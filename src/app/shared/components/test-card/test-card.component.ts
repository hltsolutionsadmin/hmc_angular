import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { StoreTest } from '../../models/storefront';
import { CartFacadeService } from '../../../features/cart/service/cart-facade.service';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrl: './test-card.component.css'
})
export class TestCardComponent {
  private readonly cartFacade = inject(CartFacadeService);
  readonly productIdsInCart$ = this.cartFacade.productIdsInCart$;
  readonly cartLoading$ = this.cartFacade.loading$;

  @Input() test!: StoreTest;
  @Input() compact = false;
  @Output() add = new EventEmitter<StoreTest>();
  @Output() view = new EventEmitter<StoreTest>();

  onAdd(): void {
    this.cartFacade.addToCart(this.test.id, 1);
    this.add.emit(this.test);
  }

  onView(): void {
    this.view.emit(this.test);
  }

  priceToShow(): number {
    return this.test.discountPrice ?? this.test.price;
  }

  discountPercent(): number | null {
    if (!this.test.discountPrice) return null;
    const pct = Math.round(((this.test.price - this.test.discountPrice) / this.test.price) * 100);
    return pct > 0 ? pct : null;
  }
}

