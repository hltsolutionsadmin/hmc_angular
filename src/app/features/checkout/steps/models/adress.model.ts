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
  id?: string;
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
