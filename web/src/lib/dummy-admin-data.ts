/**
 * Dummy data for admin and super admin dashboards
 */

import type { Order, Product } from "./api/types";

// Extended dummy orders for admin
export const dummyAdminOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    status: "confirmed",
    subtotal_cents: 8998,
    shipping_cents: 500,
    tax_cents: 760,
    total_cents: 10258,
    currency: "USD",
    created_at: "2024-01-15T10:30:00Z",
    items: [
      {
        id: 1,
        product_id: 1,
        quantity: 2,
        unit_price_cents: 2999,
        product_name: "Peace Lily",
      },
      {
        id: 2,
        product_id: 4,
        quantity: 1,
        unit_price_cents: 3499,
        product_name: "Modern Ceramic Vase",
      },
    ],
    shipping_address: {
      full_name: "John Doe",
      street_address: "123 Main St",
      city: "New York",
      state: "NY",
      postal_code: "10001",
      country: "USA",
      phone: "+1-555-0123",
    },
  },
  {
    id: 2,
    user_id: 2,
    status: "pending_payment",
    subtotal_cents: 5999,
    shipping_cents: 500,
    tax_cents: 520,
    total_cents: 7019,
    currency: "USD",
    created_at: "2024-01-16T14:20:00Z",
    items: [
      {
        id: 3,
        product_id: 5,
        quantity: 1,
        unit_price_cents: 5999,
        product_name: "Red Rose Bouquet",
      },
    ],
    shipping_address: {
      full_name: "Jane Smith",
      street_address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postal_code: "90001",
      country: "USA",
      phone: "+1-555-0456",
    },
  },
  {
    id: 3,
    user_id: 3,
    status: "placed",
    subtotal_cents: 4998,
    shipping_cents: 500,
    tax_cents: 440,
    total_cents: 5938,
    currency: "USD",
    created_at: "2024-01-17T09:15:00Z",
    items: [
      {
        id: 4,
        product_id: 3,
        quantity: 2,
        unit_price_cents: 1999,
        product_name: "Lavender Plant",
      },
      {
        id: 5,
        product_id: 9,
        quantity: 1,
        unit_price_cents: 3499,
        product_name: "Outdoor Herb Garden Set",
      },
    ],
    shipping_address: {
      full_name: "Bob Johnson",
      street_address: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      postal_code: "60601",
      country: "USA",
      phone: "+1-555-0789",
    },
  },
  {
    id: 4,
    user_id: 4,
    status: "confirmed",
    subtotal_cents: 12998,
    shipping_cents: 750,
    tax_cents: 1100,
    total_cents: 14848,
    currency: "USD",
    created_at: "2024-01-18T11:45:00Z",
    items: [
      {
        id: 6,
        product_id: 5,
        quantity: 2,
        unit_price_cents: 5999,
        product_name: "Red Rose Bouquet",
      },
    ],
    shipping_address: {
      full_name: "Alice Williams",
      street_address: "321 Elm St",
      city: "Miami",
      state: "FL",
      postal_code: "33101",
      country: "USA",
      phone: "+1-555-0321",
    },
  },
  {
    id: 5,
    user_id: 5,
    status: "pending_payment",
    subtotal_cents: 3499,
    shipping_cents: 500,
    tax_cents: 320,
    total_cents: 4319,
    currency: "USD",
    created_at: "2024-01-19T16:30:00Z",
    items: [
      {
        id: 7,
        product_id: 4,
        quantity: 1,
        unit_price_cents: 3499,
        product_name: "Modern Ceramic Vase",
      },
    ],
    shipping_address: {
      full_name: "Charlie Brown",
      street_address: "654 Maple Dr",
      city: "Seattle",
      state: "WA",
      postal_code: "98101",
      country: "USA",
      phone: "+1-555-0654",
    },
  },
  {
    id: 6,
    user_id: 6,
    status: "placed",
    subtotal_cents: 7998,
    shipping_cents: 600,
    tax_cents: 690,
    total_cents: 9288,
    currency: "USD",
    created_at: "2024-01-20T08:20:00Z",
    items: [
      {
        id: 8,
        product_id: 1,
        quantity: 1,
        unit_price_cents: 2999,
        product_name: "Peace Lily",
      },
      {
        id: 9,
        product_id: 6,
        quantity: 1,
        unit_price_cents: 2499,
        product_name: "Snake Plant",
      },
      {
        id: 10,
        product_id: 10,
        quantity: 1,
        unit_price_cents: 2799,
        product_name: "Elegant Glass Vase",
      },
    ],
    shipping_address: {
      full_name: "Diana Prince",
      street_address: "987 Cedar Ln",
      city: "Boston",
      state: "MA",
      postal_code: "02101",
      country: "USA",
      phone: "+1-555-0987",
    },
  },
];

// Dummy nurseries
export interface Nursery {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  active: boolean;
  created_at: string;
}

export const dummyNurseries: Nursery[] = [
  {
    id: 1,
    name: "Green Valley Nursery",
    address: "123 Garden Way",
    city: "Portland",
    state: "OR",
    postal_code: "97201",
    country: "USA",
    phone: "+1-555-0100",
    email: "info@greenvalley.com",
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Bloom & Grow Nursery",
    address: "456 Flower St",
    city: "San Francisco",
    state: "CA",
    postal_code: "94101",
    country: "USA",
    phone: "+1-555-0200",
    email: "contact@bloomgrow.com",
    active: true,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "Urban Plant Co",
    address: "789 Urban Ave",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "USA",
    phone: "+1-555-0300",
    email: "hello@urbanplant.com",
    active: true,
    created_at: "2024-01-03T00:00:00Z",
  },
];

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions for admin
export const getAdminOrders = async (): Promise<Order[]> => {
  await delay(300);
  return [...dummyAdminOrders];
};

export const getAdminOrderById = async (id: number): Promise<Order | null> => {
  await delay(200);
  return dummyAdminOrders.find((o) => o.id === id) || null;
};

export const getNurseries = async (): Promise<Nursery[]> => {
  await delay(300);
  return [...dummyNurseries];
};

export const getNurseryById = async (id: number): Promise<Nursery | null> => {
  await delay(200);
  return dummyNurseries.find((n) => n.id === id) || null;
};

