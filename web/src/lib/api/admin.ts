/**
 * Admin-specific API functions
 */

import { api } from "../api";
import type {
  Nursery,
  NurseryInventory,
  CreateNurseryRequest,
  UpdateNurseryRequest,
  UpsertNurseryInventoryRequest,
  Order,
  OrderFulfillment,
  AllocationSuggestionsResponse,
  CreateAllocationRequest,
  DeliveryContactRequest,
  Product,
  ProductListResponse,
  UpdateOrderStatusRequest,
} from "./types";

// Nurseries
export const nurseriesApi = {
  list: (): Promise<Nursery[]> => api.get<Nursery[]>("/admin/nurseries"),

  get: (id: number): Promise<Nursery> => api.get<Nursery>(`/admin/nurseries/${id}`),

  create: (data: CreateNurseryRequest): Promise<Nursery> =>
    api.post<Nursery>("/admin/nurseries", data),

  update: (id: number, data: UpdateNurseryRequest): Promise<Nursery> =>
    api.patch<Nursery>(`/admin/nurseries/${id}`, data),

  delete: (id: number): Promise<void> => api.delete<void>(`/admin/nurseries/${id}`),

  // Inventory
  getInventory: (nurseryId: number): Promise<NurseryInventory[]> =>
    api.get<NurseryInventory[]>(`/admin/nurseries/${nurseryId}/inventory`),

  upsertInventory: (
    nurseryId: number,
    productId: number,
    data: UpsertNurseryInventoryRequest
  ): Promise<NurseryInventory> =>
    api.put<NurseryInventory>(`/admin/nurseries/${nurseryId}/inventory/${productId}`, data),
};

// Orders
export const ordersApi = {
  list: (): Promise<Order[]> => api.get<Order[]>("/orders/admin"),

  get: (id: number): Promise<Order> => api.get<Order>(`/orders/admin/${id}`),

  updateStatus: (id: number, data: UpdateOrderStatusRequest): Promise<Order> =>
    api.patch<Order>(`/orders/admin/${id}`, data),

  // Fulfillment
  getAllocationSuggestions: (orderId: number): Promise<AllocationSuggestionsResponse> =>
    api.get<AllocationSuggestionsResponse>(`/orders/admin/${orderId}/allocation-suggestions`),

  createAllocation: (orderId: number, data: CreateAllocationRequest): Promise<OrderFulfillment[]> =>
    api.post<OrderFulfillment[]>(`/orders/admin/${orderId}/allocate`, data),

  confirmAllocation: (orderId: number): Promise<Order> =>
    api.post<Order>(`/orders/admin/${orderId}/confirm`),

  setDeliveryContact: (fulfillmentId: number, data: DeliveryContactRequest): Promise<OrderFulfillment> =>
    api.post<OrderFulfillment>(`/orders/admin/fulfillments/${fulfillmentId}/delivery-contact`, data),
};

// Products
export const productsApi = {
  list: (params?: { page?: number; page_size?: number }): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    const query = searchParams.toString();
    return api.get<ProductListResponse>(`/admin/products${query ? `?${query}` : ""}`);
  },

  get: (id: number): Promise<Product> => api.get<Product>(`/catalog/products/${id}`),

  getBySlug: (slug: string): Promise<Product> => api.get<Product>(`/catalog/products/${slug}`),

  create: (data: Partial<Product>): Promise<Product> => api.post<Product>("/admin/products", data),

  update: (id: number, data: Partial<Product>): Promise<Product> =>
    api.patch<Product>(`/admin/products/${id}`, data),
};

// Auth (for login)
export const authApi = {
  login: async (email: string, password: string): Promise<{ access_token: string }> => {
    // This will be called directly without auth token
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Login failed");
    }

    return await response.json();
  },
};

