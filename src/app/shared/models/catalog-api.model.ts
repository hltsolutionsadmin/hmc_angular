export interface ApiPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  storeId: string;
  level: number;
  sequence: number | null;
  status: boolean;
  active: boolean;
  path: string | null;
  catalogVersionId: string | null;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  children: ApiCategory[] | null;
}

export interface ApiProductPrice {
  id: string;
  price: number;
}

export interface ApiBundleItemProductRef {
  id: string;
  code: string;
  name: string;
  slug: string | null;
  thumbnail: string | null;
  storeId: string | null;
}

export interface ApiBundleItem {
  id: string;
  quantity: number;
  product: ApiBundleItemProductRef;
}

export interface ApiBundle {
  id: string;
  name: string;
  type: string;
  items: ApiBundleItem[];
}

export interface ApiProduct {
  id: string;
  code: string;
  name: string;
  shortDescription: string | null;
  slug?: string | null;
  description: string | null;
  thumbnail: string | null;
  productType: string;
  approvalStatus: string;
  active: boolean;
  featured: boolean;
  configurable: boolean;
  vertical: string;
  catalogVersionId: string | null;
  catalogVersionName: string | null;
  storeId: string | null;
  price: ApiProductPrice | null;
  categories: ApiCategory[] | null;
  bundle?: ApiBundle | null;
  createdDate: string | null;
  updatedDate: string | null;
}

