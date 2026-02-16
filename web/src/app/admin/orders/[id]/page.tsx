"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi } from "@/lib/api/admin";
import type {
  Order,
  OrderFulfillment,
  AllocationSuggestionsResponse,
  CreateAllocationRequest,
  DeliveryContactRequest,
} from "@/lib/api/types";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = parseInt(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [suggestions, setSuggestions] = useState<AllocationSuggestionsResponse | null>(null);
  const [fulfillments, setFulfillments] = useState<OrderFulfillment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState<number | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const { getAdminOrderById } = await import("@/lib/dummy-admin-data");
      const data = await getAdminOrderById(orderId);
      if (data) {
        setOrder(data);
        // Load fulfillments if they exist
        if ((data as any).fulfillments) {
          setFulfillments((data as any).fulfillments);
        }
      } else {
        setError("Order not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const data = await ordersApi.getAllocationSuggestions(orderId);
      setSuggestions(data);
    } catch (err: any) {
      alert(err.message || "Failed to load suggestions");
    }
  };

  const handleConfirmAllocation = async () => {
    if (!confirm("Are you sure you want to confirm this allocation? This will decrement inventory.")) {
      return;
    }

    try {
      const updatedOrder = await ordersApi.confirmAllocation(orderId);
      setOrder(updatedOrder);
      await loadOrder();
      alert("Allocation confirmed successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to confirm allocation");
    }
  };

  const handleDeliveryContact = async (fulfillmentId: number, data: DeliveryContactRequest) => {
    try {
      await ordersApi.setDeliveryContact(fulfillmentId, data);
      await loadOrder();
      setShowDeliveryForm(null);
      alert("Delivery contact added successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to set delivery contact");
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600">Loading order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-red-600">Order not found</p>
      </main>
    );
  }

  const proposedFulfillments = fulfillments.filter((f) => f.status === "proposed");
  const confirmedFulfillments = fulfillments.filter((f) => f.status === "confirmed");

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-4 inline-block"
        >
          ← Back to orders
        </Link>
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white">Order #{order.id}</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Order Info */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
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
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-lg font-bold text-[#111812] dark:text-white">
              ${(order.total_cents / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#111812] dark:text-white mb-4">Items</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-3 bg-gray-50 dark:bg-[#102212] rounded-xl"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="text-sm font-semibold text-[#111812] dark:text-white">
                  ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {order.shipping_address && (
          <div>
            <h3 className="text-lg font-bold text-[#111812] dark:text-white mb-4">Shipping Address</h3>
            <div className="p-4 bg-gray-50 dark:bg-[#102212] rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {order.shipping_address.full_name}
                <br />
                {order.shipping_address.street_address}
                <br />
                {order.shipping_address.city}
                {order.shipping_address.commune && `, ${order.shipping_address.commune}`}
                {order.shipping_address.state && `, ${order.shipping_address.state}`}
                <br />
                {order.shipping_address.postal_code} {order.shipping_address.country}
                {order.shipping_address.phone && (
                  <>
                    <br />
                    {order.shipping_address.phone}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Allocation Suggestions */}
      {order.status === "placed" && !proposedFulfillments.length && (
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white">Allocation Suggestions</h2>
            <button
              onClick={loadSuggestions}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              Get Suggestions
            </button>
          </div>

          {suggestions && (
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion) => (
                <div
                  key={suggestion.nursery_id}
                  className="p-4 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#111812] dark:text-white">{suggestion.nursery_name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.city}
                        {suggestion.commune && `, ${suggestion.commune}`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        suggestion.match_tier === 1
                          ? "bg-success/20 text-success"
                          : suggestion.match_tier === 2
                          ? "bg-info/20 text-info"
                          : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {suggestion.match_tier === 1
                        ? "Same Commune"
                        : suggestion.match_tier === 2
                        ? "Same City"
                        : "Other"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {suggestion.available_items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                        {item.product_name}: {item.available_qty} / {item.requested_qty} available
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {suggestions.suggestions.length > 0 && (
                <button
                  onClick={() => setShowAllocationModal(true)}
                  className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                >
                  Allocate Order
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Proposed Fulfillments */}
      {proposedFulfillments.length > 0 && (
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Proposed Fulfillments</h2>
          <div className="space-y-4 mb-4">
            {proposedFulfillments.map((fulfillment) => (
              <div
                key={fulfillment.id}
                className="p-4 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl"
              >
                <div className="font-semibold text-[#111812] dark:text-white mb-2">
                  {fulfillment.nursery_name || `Nursery #${fulfillment.nursery_id}`}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {fulfillment.items.map((item) => (
                    <div key={item.id}>
                      {item.order_item_product_name || `Item #${item.order_item_id}`}: {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleConfirmAllocation}
            className="bg-success text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Confirm Allocation
          </button>
        </div>
      )}

      {/* Confirmed Fulfillments */}
      {confirmedFulfillments.length > 0 && (
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Confirmed Fulfillments</h2>
          <div className="space-y-4">
            {confirmedFulfillments.map((fulfillment) => (
              <div
                key={fulfillment.id}
                className="p-4 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-[#111812] dark:text-white">
                      {fulfillment.nursery_name || `Nursery #${fulfillment.nursery_id}`}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                      {fulfillment.items.map((item) => (
                        <div key={item.id}>
                          {item.order_item_product_name || `Item #${item.order_item_id}`}: {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-success/20 text-success">
                    Confirmed
                  </span>
                </div>

                {fulfillment.delivery_name ? (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-[#102212] rounded-xl">
                    <p className="text-sm font-semibold text-[#111812] dark:text-white">
                      Delivery: {fulfillment.delivery_name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{fulfillment.delivery_phone}</p>
                    {fulfillment.delivery_notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{fulfillment.delivery_notes}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeliveryForm(fulfillment.id)}
                    className="mt-4 text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                  >
                    Add Delivery Contact
                  </button>
                )}

                {showDeliveryForm === fulfillment.id && (
                  <DeliveryContactForm
                    fulfillmentId={fulfillment.id}
                    onSubmit={(data) => handleDeliveryContact(fulfillment.id, data)}
                    onCancel={() => setShowDeliveryForm(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAllocationModal && suggestions && (
        <AllocationModal
          order={order}
          suggestions={suggestions}
          onClose={() => setShowAllocationModal(false)}
          onAllocate={async (allocation) => {
            try {
              await ordersApi.createAllocation(orderId, allocation);
              await loadOrder();
              setShowAllocationModal(false);
              setSuggestions(null);
              alert("Allocation created successfully!");
            } catch (err: any) {
              alert(err.message || "Failed to create allocation");
            }
          }}
        />
      )}
    </main>
  );
}

function DeliveryContactForm({
  fulfillmentId,
  onSubmit,
  onCancel,
}: {
  fulfillmentId: number;
  onSubmit: (data: DeliveryContactRequest) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<DeliveryContactRequest>({
    delivery_name: "",
    delivery_phone: "",
    delivery_notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-[#102212] rounded-xl space-y-3">
      <input
        type="text"
        required
        placeholder="Delivery Name"
        value={formData.delivery_name}
        onChange={(e) => setFormData({ ...formData, delivery_name: e.target.value })}
        className="w-full px-4 py-2 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
      />
      <input
        type="tel"
        required
        placeholder="Delivery Phone"
        value={formData.delivery_phone}
        onChange={(e) => setFormData({ ...formData, delivery_phone: e.target.value })}
        className="w-full px-4 py-2 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
      />
      <textarea
        placeholder="Notes (optional)"
        value={formData.delivery_notes || ""}
        onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value || null })}
        rows={2}
        className="w-full px-4 py-2 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors text-sm"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AllocationModal({
  order,
  suggestions,
  onClose,
  onAllocate,
}: {
  order: Order;
  suggestions: AllocationSuggestionsResponse;
  onClose: () => void;
  onAllocate: (allocation: CreateAllocationRequest) => void;
}) {
  const [allocations, setAllocations] = useState<{ [nurseryId: number]: { [itemId: number]: number } }>({});

  const handleQuantityChange = (nurseryId: number, itemId: number, quantity: number) => {
    setAllocations((prev) => ({
      ...prev,
      [nurseryId]: {
        ...(prev[nurseryId] || {}),
        [itemId]: quantity,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allocationList: CreateAllocationRequest = {
      allocations: Object.entries(allocations)
        .filter(([_, items]) => Object.values(items).some((qty) => qty > 0))
        .map(([nurseryId, items]) => ({
          nursery_id: parseInt(nurseryId),
          items: Object.entries(items)
            .filter(([_, qty]) => qty > 0)
            .map(([itemId, qty]) => ({
              order_item_id: parseInt(itemId),
              quantity: qty,
            })),
        })),
    };

    if (allocationList.allocations.length === 0) {
      alert("Please allocate at least one item");
      return;
    }

    onAllocate(allocationList);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#111812] dark:text-white">Allocate Order</h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {suggestions.suggestions.map((suggestion) => (
            <div
              key={suggestion.nursery_id}
              className="p-4 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl"
            >
              <h3 className="font-semibold text-[#111812] dark:text-white mb-3">{suggestion.nursery_name}</h3>
              <div className="space-y-2">
                {suggestion.available_items.map((item) => {
                  const currentQty = allocations[suggestion.nursery_id]?.[item.order_item_id] || 0;
                  const maxQty = Math.min(item.available_qty, item.requested_qty);
                  return (
                    <div key={item.order_item_id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.product_name} (max: {maxQty})
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={maxQty}
                        value={currentQty}
                        onChange={(e) =>
                          handleQuantityChange(suggestion.nursery_id, item.order_item_id, parseInt(e.target.value) || 0)
                        }
                        className="w-24 px-3 py-1 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              Create Allocation
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

