import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ProductSearchResponse, ProductDto } from '../../models/product.model';
import { StoreTest } from '../../models/storefront.model';
import { CatalogService } from '../catalog/catalog.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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
      const included =
        (product.bundle?.items ?? [])
          .map((i) => {
            const name = i?.product?.name;
            const qty = Number(i?.quantity ?? 1);
            if (!name) return null;
            if (Number.isFinite(qty) && qty > 1) return `${name} x${qty}`;
            return name;
          })
          .filter((x): x is string => Boolean(x && String(x).trim()));

      return {
        id: product.id,
        name: product.name + ' ' + `(${product.code})`,
        categoryId: primaryCategory?.id ?? '',
        categoryTitle: primaryCategory?.name ?? 'General',
        productYpe: product.productType,
        isBundle: product.bundle != null,
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
        parametersCount: included.length ? String(included.length) : (product.active ? 'Available' : 'Unavailable'),
        included: included.length ? included : [],
      };
    }
}
