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
    price_cents: number;
  }>;
}

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
      // TODO: Replace with actual API call
      setOrders([]);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white">My Orders</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "placed", "pending_payment", "confirmed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a3a2c]"
            }`}
          >
            {status === "all" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {statusFilter === "all" ? "You haven't placed any orders yet." : `No ${statusFilter} orders found.`}
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#111812] dark:text-white mb-1">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    order.status === "confirmed"
                      ? "bg-success/20 text-success"
                      : order.status === "pending_payment"
                      ? "bg-warning/20 text-warning"
                      : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#f0f4f0] dark:border-[#2a3a2c]">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-xl font-bold text-[#111812] dark:text-white">
                  ${(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

