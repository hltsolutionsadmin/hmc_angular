import type { ApiBundle } from './catalog-api.model';

export interface InventoryProductDto {
  id: string;
  skuId: string;
  productId: string;
  product: ProductDto | null;
  storeId: string;
  warehouseId: string;
  warehouseName: string | null;
  forceInStock: boolean;
  availableQty: number;
  reservedQty: number;
  damagedQty: number;
  reorderLevel: number;
  inStock: boolean;
}

export interface ProductSearchResponse {
  content: InventoryProductDto[];
  pageable?: PageableDto;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ProductPriceDto {
  id: string;
  storeId: string | null;
  price: number;
  currency: string | null;
  minQty: number;
  net: boolean;
  unitFactor: number;
  validFrom: string | null;
  validTo: string | null;
  product: unknown | null;
}

export interface ProductDto {
  id: string;
  code: string;
  name: string;
  shortDescription: string | null;
  slug: string | null;
  description: string | null;
  hsnCode: string | null;
  barCode: string | null;
  thumbnail: string | null;
  productType: string;
  approvalStatus: string;
  active: boolean;
  featured: boolean;
  configurable: boolean;
  vertical: string;
  catalogVersionId: string;
  catalogVersionName: string;
  storeId: string;
  brandId: string | null;
  brandName: string | null;
  productGroupId: string | null;
  productGroupCode: string | null;
  price: ProductPriceDto | null;
  categories: CategoryDto[];
  attributeValues: unknown[];
  imageUrls: string[] | null;
  variantOptions: unknown[];
  variants: unknown[];
  bundle?: ApiBundle | null;
  createdDate: string;
  updatedDate: string;
}

export interface CategoryDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  level: number;
  status: boolean;
  active: boolean;
  path: string;
}

export interface PageableDto {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: unknown[];
}
