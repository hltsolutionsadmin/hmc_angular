export interface UserAddressResponse {
  content: UserAddressItem[];
  pageable: PageableDto;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: unknown[];
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface UserAddressItem {
  userId: string;
  userName: string;
  address: AddressDto;
}

export interface AddressDto {
  id: string;
  name?: string | null;
  addressType?: 'HOME' | 'WORK' | 'OTHERS' | string | null;
  mobileNumber?: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullText: string;
}

export interface PageableDto {
  pageNumber: number;
  pageSize: number;
  sort: unknown[];
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

// localtion model
export interface StateDto {
  id: string;
  name: string;
  code: string;
  active: boolean;
  countryCode: string | null;
}

export interface CityDto {
  id: string;
  name: string;
  code: string;
  active: boolean;
  stateCode: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageable?: unknown;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  sort?: unknown[];
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface CreateUserAddressRequest {
  name?: string;
  addressType?: 'HOME' | 'WORK' | 'OTHERS' | string;
  mobileNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  stateId: string;
  cityId: string;
  postalCode: string;
  country: string;
  fullText: string;
  firstName?: string;
  lastName?: string;
}