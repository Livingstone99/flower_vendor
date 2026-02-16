"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderDetail {
  id: number;
  status: string;
  total_cents: number;
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price_cents: number;
  }>;
  shipping_address: {
    full_name: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/checkout");
    } else if (status === "authenticated") {
      loadOrder();
    }
  }, [status, router]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setError("Order not found. Please try again later.");
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <Link
          href="/dashboard/orders"
          className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <Link
        href="/dashboard/orders"
        className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
      >
        ← Back to Orders
      </Link>

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-bold rounded-full ${
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
              <h2 className="text-xl font-bold text-[#111812] dark:text-white">Order Items</h2>
            </div>
            <div className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[#111812] dark:text-white mb-1">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-[#111812] dark:text-white">
                    ${(item.price_cents / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#111812] dark:text-white mb-4">
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p className="font-semibold">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.street_address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#111812] dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-[#111812] dark:text-white">
                  ${(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#f0f4f0] dark:border-[#2a3a2c]">
                <span className="font-bold text-[#111812] dark:text-white">Total</span>
                <span className="font-bold text-[#111812] dark:text-white text-xl">
                  ${(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

