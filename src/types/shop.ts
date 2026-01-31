/**
 * NESA-Africa Merchandise Shop Types
 */

export type ProductCategory = 'APPAREL' | 'ACCESSORIES' | 'LIMITED' | 'BUNDLES';

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'FULFILLED';

export type ImpactDestination = 
  | 'REBUILD_MY_SCHOOL'
  | 'EDUAID_AFRICA'
  | 'SPONSOR_STUDENT'
  | 'TVET_GRANT';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_usd: number;
  image_url: string | null;
  category: ProductCategory;
  is_limited: boolean;
  is_active: boolean;
  impact_default: ImpactDestination;
  stock_qty: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price_usd: number;
  created_at: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string | null;
  anon_id: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface Order {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  phone: string | null;
  status: OrderStatus;
  subtotal_usd: number;
  shipping_usd: number;
  total_usd: number;
  pay_currency: string;
  pay_amount_total: number | null;
  fx_rate: number;
  fx_markup_amount: number;
  provider: string | null;
  provider_ref: string | null;
  impact_destination: ImpactDestination;
  referral_code: string | null;
  referrer_user_id: string | null;
  receipt_number: string | null;
  receipt_payload_json: Record<string, unknown>;
  agc_bonus_amount: number;
  created_at: string;
  paid_at: string | null;
  refunded_at: string | null;
  fulfilled_at: string | null;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price_usd: number;
  created_at: string;
}

export interface BulkOrderLead {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  country: string | null;
  estimated_quantity: number | null;
  products_interested: string[];
  branding_request: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Constants
export const IMPACT_DESTINATIONS: { value: ImpactDestination; label: string }[] = [
  { value: 'REBUILD_MY_SCHOOL', label: 'Rebuild My School (2026–2027)' },
  { value: 'EDUAID_AFRICA', label: 'EduAid-Africa (General Support)' },
  { value: 'SPONSOR_STUDENT', label: 'Sponsor a Student' },
  { value: 'TVET_GRANT', label: 'TVET Sponsorship / Grant' },
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  APPAREL: 'Apparel',
  ACCESSORIES: 'Accessories',
  LIMITED: 'Limited Edition',
  BUNDLES: 'Bundles',
};

// AGC bonus rate: $1 = 5 AGC
export const AGC_BONUS_RATE = 5;
