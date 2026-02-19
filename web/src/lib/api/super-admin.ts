/**
 * Super admin-specific API functions
 */

import { api } from "../api";

export interface SystemMetrics {
  users: {
    total: number;
    by_role: {
      customer?: number;
      admin?: number;
      super_admin?: number;
    };
  };
  orders: {
    total: number;
    total_revenue_cents: number;
  };
  products: {
    total: number;
  };
  nurseries: {
    total: number;
  };
  recent_activity: {
    orders: Array<{
      id: number;
      status: string;
      total_cents: number;
      created_at: string;
    }>;
  };
}

export interface UserDetail {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export const superAdminApi = {
  // Get system-wide metrics
  getMetrics: (): Promise<SystemMetrics> => api.get<SystemMetrics>("/super-admin/metrics"),

  // User management
  getAllUsers: (skip?: number, limit?: number): Promise<UserDetail[]> => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    const query = params.toString();
    return api.get<UserDetail[]>(`/super-admin/users${query ? `?${query}` : ""}`);
  },

  getUserById: (userId: number): Promise<UserDetail> =>
    api.get<UserDetail>(`/super-admin/users/${userId}`),

  updateUserRole: (userId: number, role: string): Promise<UserDetail> =>
    api.patch<UserDetail>(`/super-admin/users/${userId}/role`, { role }),

  deleteUser: (userId: number): Promise<{ message: string }> =>
    api.delete<{ message: string }>(`/super-admin/users/${userId}`),

  createUser: (data: {
    email: string;
    name: string;
    role: string;
    password?: string;
  }): Promise<UserDetail> => api.post<UserDetail>("/super-admin/users", data),
};

