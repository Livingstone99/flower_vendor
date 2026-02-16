/**
 * Customer-specific API functions
 */

import { api } from "../api";
import type { Order } from "./types";

export const customerApi = {
  // Get orders for the current user
  getMyOrders: (): Promise<Order[]> => api.get<Order[]>("/orders"),

  // Get a specific order by ID
  getOrderById: (orderId: number): Promise<Order> =>
    api.get<Order>(`/orders/${orderId}`),

  // Update profile information
  updateProfile: (data: { name?: string }): Promise<{ id: number; email: string; name: string }> =>
    api.patch("/auth/me", data),

  // Get current user profile
  getProfile: (): Promise<{ id: number; email: string; name: string; role: string }> =>
    api.get("/auth/me"),
};

