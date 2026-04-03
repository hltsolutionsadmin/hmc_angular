import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StoreTest } from '../../../shared/models/storefront';
import { CatalogService } from '../../../shared/services/catalog.service';
import { ProductSearchResponse, ProductDto } from './featured-tests-section/featured-test.model';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private readonly http = inject(HttpClient);
  private readonly catalog = inject(CatalogService);
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  getStoreTests(page: number, size: number): Observable<StoreTest[]> {
    const params = new HttpParams()
      .set('storeId', environment.storeId)
      .set('page', page)
      .set('size', size);

    return this.http
      .get<ProductSearchResponse>(`${this.baseUrl}/api/inventory/store`, { params })
      .pipe(
        map((response) => response.content),
        map((items) =>
          items
            .filter((item) => item.product)
            .map((item) => this.mapProductToStoreTest(item.product!))
        ),
        catchError(() => of(this.catalog.getAllTests()))
      );
  }

  getFeaturedTests(page: number, size: number): Observable<StoreTest[]> {
    const params = new HttpParams()
      .set('storeId', environment.storeId)
      .set('page', page)
      .set('size', size);

    return this.http
      .get<ProductSearchResponse>(`${this.baseUrl}/api/inventory/store`, { params })
      .pipe(
        map((response) => response.content),
        map((items) =>
          items
            .filter((item) => item.product)
            .map((item) => this.mapProductToStoreTest(item.product!))
        ),
        catchError(() => of(this.catalog.getFeaturedTests()))
      );
  }

  private mapProductToStoreTest(product: ProductDto): StoreTest {
    const primaryCategory = product.categories?.[0];
    const actualPrice = product.price?.price ?? 0;
    return {
      id: product.id,
      name: product.name + ' ' + `(${product.code})`,
      categoryId: primaryCategory?.id ?? '',
      categoryTitle: primaryCategory?.name ?? 'General',
      description:
        product.shortDescription ??
        product.description ??
        'Trusted diagnostic test with fast processing.',
      price: actualPrice,
      discountPrice: actualPrice,
      rating: 4.5,
      trustBadges: ['NABL', 'FastReports'],
      reportTime: primaryCategory?.name ?? '24 hrs',
      fastingRequired: false,
      parametersCount: product.active ? 'Available' : 'Unavailable',
      included: [],
    };
  }
}
