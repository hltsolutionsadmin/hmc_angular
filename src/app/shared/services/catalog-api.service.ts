import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environment/environment';
import { ApiCategory, ApiPage, ApiProduct } from '../models/catalog-api';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  constructor(private http: HttpClient) {}

  getCategories(opts: {
    storeId: string;
    page?: number;
    size?: number;
  }) {
    const params = new HttpParams()
      .set('storeId', opts.storeId)
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 200));

    return this.http.get<ApiPage<ApiCategory>>(
      `${environment.apiBaseUrl}/api/categories/page`,
      { params }
    );
  }

  searchProducts(opts?: { page?: number; size?: number }) {
    const params = new HttpParams()
      .set('page', String(opts?.page ?? 0))
      .set('size', String(opts?.size ?? 50));

    return this.http.get<ApiPage<ApiProduct>>(
      `${environment.apiBaseUrl}/api/products/search`,
      { params }
    );
  }

  getProductsByCategoryId(opts: {
    categoryId: string;
    storeId: string;
    inventoryProducts?: boolean;
  }) {
    const params = new HttpParams()
      .set('storeId', opts.storeId)
      .set('inventoryProducts', String(opts.inventoryProducts ?? true));

    return this.http.get<ApiProduct[]>(
      `${environment.apiBaseUrl}/api/categories/${opts.categoryId}/products`,
      { params }
    );
  }

  getBundlesByStoreId(opts: { storeId: string; inventoryStock?: boolean }) {
    const params = new HttpParams().set(
      'inventoryStock',
      String(opts.inventoryStock ?? false)
    );

    return this.http.get<ApiProduct[]>(
      `${environment.apiBaseUrl}/api/products/stores/${opts.storeId}/bundles`,
      { params }
    );
  }
}
