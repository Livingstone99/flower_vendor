"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminOrders } from "@/lib/dummy-admin-data";
import { dummyProducts } from "@/lib/dummy-data";
import type { Order } from "@/lib/api/types";
import SkeletonStats from "@/components/SkeletonStats";
import SkeletonTable from "@/components/SkeletonTable";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const ordersData = await getAdminOrders();

      setOrders(ordersData);

      const totalRevenue = ordersData.reduce((sum, o) => sum + o.total_cents, 0);
      const pendingOrders = ordersData.filter(
        (o) => o.status === "pending_payment" || o.status === "placed"
      ).length;

      setStats({
        totalOrders: ordersData.length,
        pendingOrders,
        totalRevenue: totalRevenue / 100,
        totalProducts: dummyProducts.length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <SkeletonStats count={4} />
        <div className="mt-8">
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            </div>
            <SkeletonTable rows={5} columns={5} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <h1 className="text-4xl font-semibold text-[#111812] dark:text-white mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Orders</h3>
          <p className="text-3xl font-semibold text-primary">{stats.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pending Orders</h3>
          <p className="text-3xl font-semibold text-warning">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-3xl font-semibold text-success">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Products</h3>
          <p className="text-3xl font-semibold text-info">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#111812] dark:text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/admin/nurseries"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            Manage Nurseries
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
          <h2 className="text-xl font-semibold text-[#111812] dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111812] dark:text-white">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {order.shipping_address?.full_name || "N/A"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === "confirmed"
                          ? "bg-success/20 text-success"
                          : order.status === "pending_payment"
                            ? "bg-warning/20 text-warning"
                            : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111812] dark:text-white">
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
        <div className="p-6 border-t border-[#f0f4f0] dark:border-[#2a3a2c]">
          <Link
            href="/admin/orders"
            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
          >
            View all orders →
          </Link>
        </div>
      </div>
    </main>
  );
}
