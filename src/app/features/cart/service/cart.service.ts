import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { CartDto } from '../cart-page/cart.model';

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
  appointmentSlotId?: string;
  appointmentNotes?: string;
  gift: boolean;
  giftMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apicommereceUrl;
  private readonly storeId = environment.storeId;

  getActiveCart(storeId: string): Observable<CartDto> {
    const params = new HttpParams().set('storeId', this.storeId);
    return this.http.get<CartDto>(`${this.baseUrl}/api/carts`, { params });
  }

  addItem(cartId: string, payload: AddCartItemPayload): Observable<CartDto> {
    return this.http.post<CartDto>(`${this.baseUrl}/api/carts/${cartId}/items`, payload);
  }

  removeItemFromCart(cartId: string, itemId: string): Observable<CartDto> {
    return this.http.delete<CartDto>(`${this.baseUrl}/api/carts/${cartId}/items/${itemId}`);
  }

  clearCartItems(cartId: string, itemIds: string[]): Observable<void> {
    const ids = (itemIds ?? []).filter(Boolean);
    if (!cartId || ids.length === 0) return of(void 0);

    return forkJoin(ids.map((itemId) => this.removeItemFromCart(cartId, itemId))).pipe(
      map(() => void 0)
    );
  }
}
