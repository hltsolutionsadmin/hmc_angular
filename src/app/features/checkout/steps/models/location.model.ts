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
  addressLine1: string;
  addressLine2?: string;
  stateId: string;
  cityId: string;
  postalCode: string;
  country: string;
  fullText: string;
  firstName: string;
  lastName: string;
}
