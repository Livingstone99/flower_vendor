/**
 * Base API client with NextAuth session integration
 */

import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    // First check localStorage for admin token
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("admin_token");
      if (adminToken) {
        return adminToken;
      }
    }

    // Fall back to NextAuth session for customer users
    const session = await getSession();
    return (session as any)?.accessToken || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }

    // Handle 401 - redirect to login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    throw new ApiError(response.status, response.statusText, errorData);
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};


