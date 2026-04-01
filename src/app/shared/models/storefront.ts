export type TrustBadge = 'NABL' | 'ISO' | 'Trusted' | 'FastReports' | 'HomeCollection';

export interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaLink?: string;
  theme: 'mint' | 'blue' | 'violet' | 'sunset';
}


export interface StoreCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  thumbnail?: string;
  icon: string; // material icon name
}

export interface StoreTest {
  id: string;
  name: string;
  categoryId: string;
  categoryTitle: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating?: number; // 0..5
  trustBadges?: TrustBadge[];
  reportTime: string;
  fastingRequired?: boolean;
  parametersCount?: string;
  preparation?: string;
  included?: string[];
  faqs?: { q: string; a: string }[];
}

export interface StorePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  includesCount: number;
  reportTime: string;
  highlight?: string;
}

export interface StoreOffer {
  id: string;
  title: string;
  description: string;
  code?: string;
  ctaLabel?: string;
  theme: 'green' | 'blue' | 'amber' | 'violet';
}

export interface CartItem {
  id: string;
  kind: 'test' | 'package';
  title: string;
  subtitle?: string;
  price: number;
  discountPrice?: number;
  meta?: {
    reportTime?: string;
    fastingRequired?: boolean;
  };
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Sample Collected'
  | 'Processing'
  | 'Report Ready'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  placedOn: string;
  patientName: string;
  items: { title: string; kind: 'test' | 'package' }[];
  amountPaid: number;
  status: BookingStatus;
  etaText?: string;
}
