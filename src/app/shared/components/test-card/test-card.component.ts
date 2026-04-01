import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreTest } from '../../models/storefront';
import { CartFacadeService } from '../../../features/cart/service/cart-facade.service';
import { BookingFlowStateService } from '../../../features/booking/services/booking-flow-state.service';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrl: './test-card.component.css'
})
export class TestCardComponent {
  private readonly cartFacade = inject(CartFacadeService);
  private readonly router = inject(Router);
  private readonly bookingFlowState = inject(BookingFlowStateService);

  readonly productIdsInCart$ = this.cartFacade.productIdsInCart$;
  readonly cartLoading$ = this.cartFacade.loading$;

  @Input() test!: StoreTest;
  @Input() compact = false;
  /** Show "Book Now" CTA instead of add-to-cart */
  @Input() bookingMode = true;
  @Output() add = new EventEmitter<StoreTest>();
  @Output() view = new EventEmitter<StoreTest>();

  onAdd(): void {
    this.cartFacade.addToCart(this.test.id, 1);
    this.add.emit(this.test);
  }

  onView(): void {
    this.view.emit(this.test);
  }

  onBookNow(): void {
    this.bookingFlowState.setTest(this.test);
    this.router.navigate(['/layout/booking/slots', this.test.id]);
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
