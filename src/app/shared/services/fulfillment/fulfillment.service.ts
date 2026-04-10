import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

export interface FulfillmentTrackingEventDto {
  status: string;
  location: string | null;
  description: string;
  eventTimestamp: string; // ISO
}

export interface FulfillmentOrderDto {
  id: string;
  orderId: string;
  warehouseId: string;
  warehouseName: string;
  status: string;
  shippingMethod: string;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  shippingLabelUrl: string | null;
  shippingCost: number;
  expectedDeliveryDate: string | null; // yyyy-MM-dd
  actualDeliveryDate: string | null; // yyyy-MM-dd
  aiEtaDays: number | null;
  trackingEvents: FulfillmentTrackingEventDto[];
}

@Injectable({ providedIn: 'root' })
export class FulfillmentService {
  private readonly http = inject(HttpClient);

  getOrderFulfillment(orderId: string): Observable<FulfillmentOrderDto[]> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'X-Skillrat-Tenant': 'default'
    });

    return this.http.get<FulfillmentOrderDto[]>(`${environment.apiBaseUrl}/api/fulfillment/order/${orderId}`, { headers });
  }
}

