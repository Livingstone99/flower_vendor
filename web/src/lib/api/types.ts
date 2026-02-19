/**
 * TypeScript types matching backend schemas
 */

export type ProductKind = "plant" | "bouquet" | "vase" | "digital_service";
export type PlantEnvironment = "indoor" | "outdoor" | "both";
export type OrderStatus = "draft" | "placed" | "pending_payment" | "confirmed" | "cancelled";
export type FulfillmentStatus = "proposed" | "confirmed" | "cancelled";

// Product types
export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  kind: ProductKind;
  active: boolean;
  attributes?: {
    plant_environment?: PlantEnvironment;
    size?: string;
    color?: string;
    care_instructions?: string;
  };
  inventory?: {
    quantity: number;
  };
  image_url?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

// Order types
export interface Address {
  full_name: string;
  street_address: string;
  city: string;
  commune?: string | null;
  state?: string | null;
  postal_code: string;
  country: string;
  phone?: string | null;
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  quantity: number;
  unit_price_cents: number;
  product_name: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: Address | null;
  fulfillments?: OrderFulfillment[];
}

// Nursery types
export interface Nursery {
  id: number;
  internal_name: string;
  city: string;
  commune: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
  updated_at: string;
}

export interface NurseryInventory {
  id: number;
  nursery_id: number;
  product_id: number;
  quantity: number;
  updated_at: string;
  product_name?: string;
}

// Fulfillment types
export interface OrderFulfillmentItem {
  id: number;
  fulfillment_id: number;
  order_item_id: number;
  quantity: number;
  order_item_product_name?: string | null;
}

export interface OrderFulfillment {
  id: number;
  order_id: number;
  nursery_id: number | null;
  nursery_name?: string | null;
  status: FulfillmentStatus;
  delivery_name: string | null;
  delivery_phone: string | null;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderFulfillmentItem[];
}

// Allocation types
export interface NurseryAllocationSuggestion {
  nursery_id: number;
  nursery_name: string;
  city: string;
  commune: string | null;
  match_tier: number; // 1=same commune, 2=same city, 3=other
  available_items: Array<{
    order_item_id: number;
    product_name: string;
    requested_qty: number;
    available_qty: number;
  }>;
}

export interface AllocationSuggestionsResponse {
  order_id: number;
  suggestions: NurseryAllocationSuggestion[];
}

export interface AllocationItemRequest {
  order_item_id: number;
  quantity: number;
}

export interface AllocationRequest {
  nursery_id: number;
  items: AllocationItemRequest[];
}

export interface CreateAllocationRequest {
  allocations: AllocationRequest[];
}

export interface DeliveryContactRequest {
  delivery_name: string;
  delivery_phone: string;
  delivery_notes?: string | null;
}

// Request types
export interface CreateNurseryRequest {
  internal_name: string;
  city: string;
  commune?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface UpdateNurseryRequest {
  internal_name?: string;
  city?: string;
  commune?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface UpsertNurseryInventoryRequest {
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}


