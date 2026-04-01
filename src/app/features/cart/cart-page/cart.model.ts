export interface CartItemDto {
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
  gift: boolean;
  giftMessage: string | null;
  recommendedProductIds: string[] | null;

  appointmentSlotId?: string | null;
  appointmentNotes?: string | null;
}

export interface CartDto {
  id: string;
  userId: string;
  storeId: string;
  status: 'ACTIVE' | 'CHECKED_OUT' | 'EXPIRED' | string;
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  couponCode: string | null;
  notes: string | null;
  expiresAt: string;
  items: CartItemDto[];
  recommendedProductIds: string[];
  version: number;
}
