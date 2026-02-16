/**
 * Dummy data for development - used by storefront and dashboard
 * until backend APIs are fully connected.
 */

export type ProductKind = "plant" | "bouquet" | "vase" | "digital_service";
export type PlantEnvironment = "indoor" | "outdoor" | "both";
export type OrderStatus = "draft" | "placed" | "pending_payment" | "confirmed" | "cancelled";

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
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

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: Address;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  product_name: string;
}

export interface Address {
  full_name: string;
  street_address: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
}

// Dummy products
export const dummyProducts: Product[] = [
  {
    id: 1,
    slug: "peace-lily-indoor",
    name: "Peace Lily",
    description: "Beautiful indoor plant that purifies the air. Perfect for low-light areas.",
    price_cents: 2999,
    currency: "USD",
    kind: "plant",
    active: true,
    attributes: {
      plant_environment: "indoor",
      size: "medium",
      color: "green, white",
      care_instructions: "Water weekly, keep in indirect light",
    },
    inventory: { quantity: 15 },
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
  },
  {
    id: 2,
    slug: "sunflower-bouquet",
    name: "Sunflower Bouquet",
    description: "Bright and cheerful sunflower arrangement. Perfect for any occasion.",
    price_cents: 4599,
    currency: "USD",
    kind: "bouquet",
    active: true,
    attributes: {
      color: "yellow",
      size: "large",
    },
    inventory: { quantity: 8 },
    image_url: "https://images.unsplash.com/photo-1597848212624-e593b98b8c2b?w=400",
  },
  {
    id: 3,
    slug: "lavender-outdoor",
    name: "Lavender Plant",
    description: "Fragrant outdoor lavender perfect for gardens. Attracts pollinators.",
    price_cents: 1999,
    currency: "USD",
    kind: "plant",
    active: true,
    attributes: {
      plant_environment: "outdoor",
      size: "small",
      color: "purple",
      care_instructions: "Full sun, well-drained soil, water sparingly",
    },
    inventory: { quantity: 25 },
    image_url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400",
  },
  {
    id: 4,
    slug: "ceramic-vase-modern",
    name: "Modern Ceramic Vase",
    description: "Elegant ceramic vase in contemporary design. Perfect for any arrangement.",
    price_cents: 3499,
    currency: "USD",
    kind: "vase",
    active: true,
    attributes: {
      color: "white",
      size: "medium",
    },
    inventory: { quantity: 12 },
    image_url: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400",
  },
  {
    id: 5,
    slug: "rose-bouquet-red",
    name: "Red Rose Bouquet",
    description: "Classic red roses arranged beautifully. Express your love and passion.",
    price_cents: 5999,
    currency: "USD",
    kind: "bouquet",
    active: true,
    attributes: {
      color: "red",
      size: "large",
    },
    inventory: { quantity: 10 },
    image_url: "https://images.unsplash.com/photo-1518895949257-8f5a0dc52c3c?w=400",
  },
  {
    id: 6,
    slug: "snake-plant-indoor",
    name: "Snake Plant",
    description: "Hardy indoor plant that requires minimal care. Great for beginners.",
    price_cents: 2499,
    currency: "USD",
    kind: "plant",
    active: true,
    attributes: {
      plant_environment: "indoor",
      size: "medium",
      color: "green",
      care_instructions: "Water every 2-3 weeks, low light tolerant",
    },
    inventory: { quantity: 20 },
    image_url: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
  },
  {
    id: 7,
    slug: "digital-flower-arrangement",
    name: "Custom Digital Flower Arrangement Service",
    description: "Professional digital design service for your flower arrangements. Perfect for events and special occasions.",
    price_cents: 9999,
    currency: "USD",
    kind: "digital_service",
    active: true,
    inventory: { quantity: 999 },
    image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
  },
  {
    id: 8,
    slug: "tulip-bouquet-mixed",
    name: "Mixed Tulip Bouquet",
    description: "Colorful mix of tulips in various shades. Brings spring indoors.",
    price_cents: 3999,
    currency: "USD",
    kind: "bouquet",
    active: true,
    attributes: {
      color: "mixed",
      size: "medium",
    },
    inventory: { quantity: 14 },
    image_url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400",
  },
  {
    id: 9,
    slug: "herb-garden-outdoor",
    name: "Outdoor Herb Garden Set",
    description: "Collection of culinary herbs perfect for outdoor gardens. Includes basil, mint, and rosemary.",
    price_cents: 3499,
    currency: "USD",
    kind: "plant",
    active: true,
    attributes: {
      plant_environment: "outdoor",
      size: "small",
      color: "green",
      care_instructions: "Full sun, regular watering, harvest regularly",
    },
    inventory: { quantity: 18 },
    image_url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
  },
  {
    id: 10,
    slug: "glass-vase-elegant",
    name: "Elegant Glass Vase",
    description: "Crystal-clear glass vase with elegant design. Showcases your flowers beautifully.",
    price_cents: 2799,
    currency: "USD",
    kind: "vase",
    active: true,
    attributes: {
      color: "clear",
      size: "large",
    },
    inventory: { quantity: 16 },
    image_url: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=400",
  },
];

// Dummy orders for dashboard
export const dummyOrders: Order[] = [
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
];

// Helper functions to simulate API delays
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const getProducts = async (filters?: {
  kind?: ProductKind;
  plant_environment?: PlantEnvironment;
  q?: string;
}): Promise<Product[]> => {
  await delay(300);
  let products = [...dummyProducts];

  if (filters?.kind) {
    products = products.filter((p) => p.kind === filters.kind);
  }

  if (filters?.plant_environment) {
    products = products.filter(
      (p) => p.attributes?.plant_environment === filters.plant_environment || p.attributes?.plant_environment === "both"
    );
  }

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }

  return products;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  await delay(200);
  return dummyProducts.find((p) => p.slug === slug) || null;
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(400);
  return [...dummyOrders];
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  await delay(200);
  return dummyOrders.find((o) => o.id === id) || null;
};



