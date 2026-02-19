"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { nurseriesApi, productsApi } from "@/lib/api/admin";
import type { Nursery, NurseryInventory, Product } from "@/lib/api/types";

export default function NurseryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const nurseryId = parseInt(params.id);

  const [nursery, setNursery] = useState<Nursery | null>(null);
  const [inventory, setInventory] = useState<NurseryInventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(isEdit);
  const [formData, setFormData] = useState({
    internal_name: "",
    city: "",
    commune: "",
    latitude: "",
    longitude: "",
  });
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({ product_id: "", quantity: "" });

  useEffect(() => {
    loadData();
  }, [nurseryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [nurseryData, inventoryData, productsData] = await Promise.all([
        nurseriesApi.get(nurseryId),
        nurseriesApi.getInventory(nurseryId),
        productsApi.list({ page_size: 1000 }),
      ]);

      setNursery(nurseryData);
      setInventory(inventoryData);
      setProducts(productsData.items);
      setFormData({
        internal_name: nurseryData.internal_name,
        city: nurseryData.city,
        commune: nurseryData.commune || "",
        latitude: nurseryData.latitude || "",
        longitude: nurseryData.longitude || "",
      });
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load nursery");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await nurseriesApi.update(nurseryId, {
        internal_name: formData.internal_name,
        city: formData.city,
        commune: formData.commune || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
      });
      setEditing(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to update nursery");
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await nurseriesApi.upsertInventory(nurseryId, parseInt(inventoryForm.product_id), {
        quantity: parseInt(inventoryForm.quantity),
      });
      setShowAddInventory(false);
      setInventoryForm({ product_id: "", quantity: "" });
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to add inventory");
    }
  };

  const handleUpdateInventory = async (item: NurseryInventory, newQuantity: number) => {
    try {
      await nurseriesApi.upsertInventory(nurseryId, item.product_id, { quantity: newQuantity });
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update inventory");
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!nursery) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-red-600">Nursery not found</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <Link
          href="/admin/nurseries"
          className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-4 inline-block"
        >
          ← Back to nurseries
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-[#111812] dark:text-white">{nursery.internal_name}</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-info text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Nursery Details */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8 mb-8">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Internal Name *
              </label>
              <input
                type="text"
                required
                value={formData.internal_name}
                onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commune</label>
                <input
                  type="text"
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    internal_name: nursery.internal_name,
                    city: nursery.city,
                    commune: nursery.commune || "",
                    latitude: nursery.latitude || "",
                    longitude: nursery.longitude || "",
                  });
                }}
                className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">City</p>
              <p className="text-lg font-medium text-[#111812] dark:text-white">{nursery.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Commune</p>
              <p className="text-lg font-medium text-[#111812] dark:text-white">{nursery.commune || "—"}</p>
            </div>
            {nursery.latitude && nursery.longitude && (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Latitude</p>
                  <p className="text-lg font-medium text-[#111812] dark:text-white">
                    {parseFloat(nursery.latitude).toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Longitude</p>
                  <p className="text-lg font-medium text-[#111812] dark:text-white">
                    {parseFloat(nursery.longitude).toFixed(6)}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Inventory Section */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111812] dark:text-white">Inventory</h2>
          <button
            onClick={() => setShowAddInventory(true)}
            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition-colors text-sm"
          >
            Add Inventory
          </button>
        </div>

        {showAddInventory && (
          <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c] bg-gray-50 dark:bg-[#102212]">
            <form onSubmit={handleAddInventory} className="flex gap-4">
              <select
                required
                value={inventoryForm.product_id}
                onChange={(e) => setInventoryForm({ ...inventoryForm, product_id: e.target.value })}
                className="flex-1 px-4 py-2 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                required
                min="0"
                value={inventoryForm.quantity}
                onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
                placeholder="Quantity"
                className="w-32 px-4 py-2 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddInventory(false);
                  setInventoryForm({ product_id: "", quantity: "" });
                }}
                className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No inventory items. Add one to get started.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    onUpdate={(qty) => handleUpdateInventory(item, qty)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function InventoryRow({
  item,
  onUpdate,
}: {
  item: NurseryInventory;
  onUpdate: (quantity: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity.toString());

  const handleSave = () => {
    const qty = parseInt(quantity);
    if (!isNaN(qty) && qty >= 0) {
      onUpdate(qty);
      setEditing(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111812] dark:text-white">
        {item.product_name || `Product #${item.product_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {editing ? (
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24 px-3 py-1 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
            autoFocus
          />
        ) : (
          <span className="text-sm text-gray-700 dark:text-gray-300">{item.quantity}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setQuantity(item.quantity.toString());
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}


