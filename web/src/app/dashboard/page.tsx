"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: number;
  status: string;
  total_cents: number;
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
  }>;
}

export default function CustomerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/checkout");
    } else if (status === "authenticated") {
      loadOrders();
    }
  }, [status, router]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when customer order endpoint is ready
      // For now, using empty array
      setOrders([]);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-2">My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {session?.user?.name || "Customer"}!
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Active Orders</h3>
          <p className="text-3xl font-bold text-warning">
            {orders.filter((o) => o.status === "placed" || o.status === "pending_payment").length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-success">
            {orders.filter((o) => o.status === "confirmed").length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/shop"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/dashboard/orders"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/dashboard/profile"
            className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              Start Shopping
            </Link>
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
                    Items
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
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#111812] dark:text-white">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.items.map((item) => item.product_name).join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === "confirmed"
                            ? "bg-success/20 text-success"
                            : order.status === "pending_payment"
                            ? "bg-warning/20 text-warning"
                            : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {order.status}
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
        {orders.length > 5 && (
          <div className="p-6 border-t border-[#f0f4f0] dark:border-[#2a3a2c]">
            <Link
              href="/dashboard/orders"
              className="text-primary hover:text-primary-dark font-semibold text-sm transition-colors"
            >
              View all orders →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

