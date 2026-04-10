import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

export interface CheckoutOrderRequest {
  cartId: string;
  shippingAddressId: string | null;
  shippingMethod: string;
  paymentMethod: string;
  paymentMethodId: string | null;
  couponCode: string;
}

export interface OrdersLineItemDto {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  skuId: string | null;
  quantity: number;
  unitPrice: number;
  discountPrice: number;
  taxAmount: number;
  totalPrice: number;
  status: string;
  fulfillmentStatus: string;
  gift: boolean;
  giftMessage: string | null;
}

export interface OrderAppointmentDto {
  id: string;
  slotId: string;
  slotDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  maxCapacity: number;
  userId: string;
  notes: string;
}

export interface OrderDto {
  id: string;
  userId: string;
  storeId: string;
  status: string;
  orderType: string;
  paymentStatus: string;
  totalPrice: number;
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  couponCode: string | null;
  cartId: string;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  lineItems: OrdersLineItemDto[];
  fulfillmentOrders: unknown;
  appointments?: OrderAppointmentDto[];
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedOrdersResponse {
  content: OrderDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apicommereceUrl;

  checkout(payload: CheckoutOrderRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/orders/checkout`, payload);
  }

  getMyOrders(page: number = 0, size: number = 20): Observable<PagedOrdersResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedOrdersResponse>(`${this.baseUrl}/api/orders/me`, { params });
  }
}
