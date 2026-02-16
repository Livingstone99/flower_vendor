"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { SystemMetrics } from "@/lib/dummy-super-admin-data";

export default function SuperAdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      // Check if user is super admin
      const userRole = (session as any)?.role;
      if (userRole !== "super_admin") {
        router.push("/dashboard");
      } else {
        loadMetrics();
      }
    } else if (status === "unauthenticated") {
      router.push("/checkout");
    }
  }, [status, session, router]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const { getSystemMetrics } = await import("@/lib/dummy-super-admin-data");
      const data = await getSystemMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load system metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading system metrics...</p>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
          {error || "Failed to load metrics"}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">System-wide overview and management</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* System Stats - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Users</h3>
            <span className="material-symbols-outlined text-primary text-xl">people</span>
          </div>
          <p className="text-3xl font-bold text-[#111812] dark:text-white mb-2">{metrics.users.total}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success font-semibold">+{metrics.users.growth_this_month}</span>
            <span className="text-gray-500 dark:text-gray-400">this month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f0] dark:border-[#2a3a2c] text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Customers:</span>
              <span className="font-semibold">{metrics.users.by_role.customer || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Admins:</span>
              <span className="font-semibold">{metrics.users.by_role.admin || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Super Admins:</span>
              <span className="font-semibold">{metrics.users.by_role.super_admin || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Orders</h3>
            <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
          </div>
          <p className="text-3xl font-bold text-[#111812] dark:text-white mb-2">{metrics.orders.total}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-primary font-semibold">{metrics.orders.this_month}</span>
            <span className="text-gray-500 dark:text-gray-400">this month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f0] dark:border-[#2a3a2c] text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between mb-1">
              <span>Confirmed:</span>
              <span className="font-semibold text-success">{metrics.orders.by_status.confirmed || 0}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Pending:</span>
              <span className="font-semibold text-warning">
                {(metrics.orders.by_status.placed || 0) + (metrics.orders.by_status.pending_payment || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled:</span>
              <span className="font-semibold text-error">{metrics.orders.by_status.cancelled || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Revenue</h3>
            <span className="material-symbols-outlined text-success text-xl">attach_money</span>
          </div>
          <p className="text-3xl font-bold text-success mb-2">
            ${(metrics.orders.total_revenue_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success font-semibold">+{metrics.revenue.growth_percentage}%</span>
            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f0] dark:border-[#2a3a2c] text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-semibold">${(metrics.revenue.this_month_cents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>This Week:</span>
              <span className="font-semibold">${(metrics.revenue.this_week_cents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Today:</span>
              <span className="font-semibold">${(metrics.revenue.today_cents / 100).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Products</h3>
            <span className="material-symbols-outlined text-primary text-xl">inventory</span>
          </div>
          <p className="text-3xl font-bold text-[#111812] dark:text-white mb-2">{metrics.products.total}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success font-semibold">{metrics.products.active}</span>
            <span className="text-gray-500 dark:text-gray-400">active</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f0] dark:border-[#2a3a2c] text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between mb-1">
              <span>Low Stock:</span>
              <span className="font-semibold text-warning">{metrics.products.low_stock}</span>
            </div>
            <div className="flex justify-between">
              <span>Nurseries:</span>
              <span className="font-semibold">{metrics.nurseries.active}/{metrics.nurseries.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/super-admin/users"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/products"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/super-admin/analytics"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            Analytics
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white">Top Products</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Best sellers this month</p>
          </div>
          {metrics.top_products && metrics.top_products.length > 0 ? (
            <div className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {metrics.top_products.map((product, index) => (
                <div key={product.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111812] dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales_count} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#111812] dark:text-white">
                      ${(product.revenue_cents / 100).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No product data available</p>
            </div>
          )}
        </div>

        {/* Order Status Overview */}
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white">Order Status</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current order distribution</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed</span>
              </div>
              <span className="font-bold text-[#111812] dark:text-white">
                {metrics.orders.by_status.confirmed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Pending Payment</span>
              </div>
              <span className="font-bold text-[#111812] dark:text-white">
                {metrics.orders.by_status.pending_payment || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-info"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Placed</span>
              </div>
              <span className="font-bold text-[#111812] dark:text-white">
                {metrics.orders.by_status.placed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
              </div>
              <span className="font-bold text-[#111812] dark:text-white">
                {metrics.orders.by_status.cancelled || 0}
              </span>
            </div>
            <div className="pt-4 border-t border-[#f0f4f0] dark:border-[#2a3a2c]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                <span className="text-lg font-bold text-primary">{metrics.orders.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white">Recent Activity</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest orders across the system</p>
        </div>
        {metrics.recent_activity.orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
                {metrics.recent_activity.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#111812] dark:text-white">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {order.customer_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === "confirmed"
                            ? "bg-success/20 text-success"
                            : order.status === "pending_payment"
                            ? "bg-warning/20 text-warning"
                            : order.status === "placed"
                            ? "bg-info/20 text-info"
                            : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#111812] dark:text-white">
                      ${(order.total_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

