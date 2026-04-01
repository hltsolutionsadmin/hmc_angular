import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { CartDto } from '../cart-page/cart.model';

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
  gift: boolean;
  giftMessage: string | null;
}

export interface UpdateCartItemPayload {
  quantity: number;
  appointmentSlotId: string;
  appointmentNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {}

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

  updateItem(cartId: string, itemId: string, payload: UpdateCartItemPayload): Observable<CartDto> {
    return this.http.put<CartDto>(`${this.baseUrl}/api/carts/${cartId}/items/${itemId}`, payload);
  }

  removeItemFromCart(cartId: string, itemId: string): Observable<CartDto> {
    return this.http.delete<CartDto>(`${this.baseUrl}/api/carts/${cartId}/items/${itemId}`);
  }
}
