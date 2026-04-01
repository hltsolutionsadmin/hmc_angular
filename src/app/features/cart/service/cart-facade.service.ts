import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap, catchError, EMPTY, finalize, switchMap, of } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { CartDto } from '../cart-page/cart.model';
import { AddCartItemPayload, CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartFacadeService {

  private readonly cartApi = inject(CartService);
  private readonly storeId = environment.storeId;

  private readonly cartSubject = new BehaviorSubject<CartDto | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string>('');

  readonly cart$ = this.cartSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  readonly items$ = this.cart$.pipe(
    map(cart => cart?.items ?? [])
  );

  readonly cartData$ = this.cart$.pipe(
    map(cart => cart ?? null)
  );

  readonly totalItemsCount$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  readonly totalUniqueItemsCount$ = this.items$.pipe(
    map(items => items.length)
  );

  readonly productIdsInCart$ = this.items$.pipe(
    map(items => new Set(items.map(i => i.productId)))
  );

  readonly grandTotal$ = this.cart$.pipe(
    map(cart => cart?.grandTotal ?? 0)
  );

  readonly subTotal$ = this.cart$.pipe(
    map(cart => cart?.subTotal ?? 0)
  );

  readonly totalDiscount$ = this.cart$.pipe(
    map(cart => cart?.totalDiscount ?? 0)
  );

  readonly totalTax$ = this.cart$.pipe(
    map(cart => cart?.totalTax ?? 0)
  );

  loadCart(storeId: string = this.storeId): void {
    this.loadingSubject.next(true);
    this.errorSubject.next('');

    this.cartApi.getActiveCart(storeId).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError((error) => {
        console.error('Failed to load cart', error);
        this.cartSubject.next(null);
        this.errorSubject.next('Unable to load cart');
        return EMPTY;
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.loadingSubject.next(true);
    this.errorSubject.next('');

    const payload: AddCartItemPayload = {
      productId,
      quantity,
      gift: false,
      giftMessage: null
    };

    const cartId$ = this.currentCart?.id
      ? of(this.currentCart.id)
      : this.cartApi.getActiveCart(this.storeId).pipe(
          tap(cart => this.cartSubject.next(cart)),
          map(cart => cart.id)
        );

    cartId$.pipe(
      switchMap(cartId => this.cartApi.addItem(cartId, payload)),
      tap(cart => this.cartSubject.next(cart)),
      catchError((error) => {
        console.error('Failed to add item to cart', error);
        this.errorSubject.next('Unable to add item to cart');
        return EMPTY;
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  clearCartState(): void {
    this.cartSubject.next(null);
    this.errorSubject.next('');
    this.loadingSubject.next(false);
  }

  get currentCart(): CartDto | null {
    return this.cartSubject.value;
  }
}
